// ============================================================
//  logic.js — Lógica PURA (sin DOM) · Auditorías
//  Mapa de Riesgos (IPR, prioridad, avisos, pegar desde Excel), modelo de
//  auditoría (origen, datos generales, criterios), progreso por fases PDCA,
//  saneado por esquema de lo guardado/importado, fusión y hojas de Excel.
//  window.Logica en navegador y module.exports en Node (tests).
// ============================================================
(function (raiz) {
  "use strict";

  const VERSION_DATOS = 1;
  const URL_TM = "https://cjgaland.github.io/tamano-muestral/";
  const URL_IND = "https://cjgaland.github.io/indicadores-calidad/";

  // ---------- Utilidades ----------
  const lleno = v => v != null && String(v).trim() !== "";
  const sinTildes = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  const num = v => { if (typeof v === "number") return v; const s = String(v == null ? "" : v).trim().replace(/\s/g, "").replace(",", "."); return s === "" || isNaN(s) ? NaN : Number(s); };
  const nfmt = (x, d = 0) => Number.isFinite(x) ? x.toLocaleString("es-ES", { maximumFractionDigits: d }) : "—";
  const entero1a10 = v => { const n = num(v); return Number.isInteger(n) && n >= 1 && n <= 10 ? n : null; };

  // ---------- Mapa de Riesgos (AMFE) ----------
  // IPR = Gravedad × Ocurrencia × Detección, cada una de 1 a 10 (máximo 1.000)
  function ipr(g, o, d) {
    const a = entero1a10(g), b = entero1a10(o), c = entero1a10(d);
    return a && b && c ? a * b * c : null;
  }
  // Niveles orientativos para colorear; la prioridad real es el orden dentro del propio mapa
  const NIVELES_IPR = [
    { k: "muyalto", min: 300, nom: "Muy alto" },
    { k: "alto", min: 200, nom: "Alto" },
    { k: "medio", min: 100, nom: "Medio" },
    { k: "bajo", min: 1, nom: "Bajo" }
  ];
  const nivelIPR = v => Number.isFinite(v) && v > 0 ? NIVELES_IPR.find(n => v >= n.min) : null;
  const iprDe = r => ipr(r.g, r.o, r.d);

  // Orden: IPR descendente; a igual IPR, más gravedad primero; sin IPR al final (orden de alta)
  function ordenarRiesgos(riesgos, por = "ipr") {
    const lista = riesgos.map((r, i) => ({ r, i, v: iprDe(r), g: entero1a10(r.g) || 0 }));
    if (por === "ipr") lista.sort((a, b) => (b.v || 0) - (a.v || 0) || b.g - a.g || a.i - b.i);
    else if (por === "sub") lista.sort((a, b) => sinTildes(a.r.subproceso).localeCompare(sinTildes(b.r.subproceso), "es") || (b.v || 0) - (a.v || 0) || a.i - b.i);
    return lista.map(x => x.r);
  }
  // Puesto de cada riesgo por IPR (1 = el más prioritario); empates comparten puesto
  function puestos(riesgos) {
    const vals = riesgos.map(iprDe).filter(v => v).sort((a, b) => b - a), m = {};
    riesgos.forEach(r => { const v = iprDe(r); m[r.id] = v ? vals.indexOf(v) + 1 : null; });
    return m;
  }

  function resumenMapa(mapa) {
    const rs = mapa.riesgos, vals = rs.map(iprDe);
    const porNivel = { muyalto: 0, alto: 0, medio: 0, bajo: 0 };
    vals.forEach(v => { const n = nivelIPR(v); if (n) porNivel[n.k]++; });
    const subs = {};
    rs.forEach(r => { const s = lleno(r.subproceso) ? r.subproceso.trim() : "Sin subproceso"; subs[s] = (subs[s] || 0) + 1; });
    return {
      n: rs.length, conIPR: vals.filter(v => v).length, claves: rs.filter(r => r.clave).length,
      maxIPR: vals.reduce((a, v) => Math.max(a, v || 0), 0), porNivel, subprocesos: subs
    };
  }

  // Avisos didácticos del mapa (no bloquean nada)
  function avisosMapa(mapa) {
    const A = [], rs = mapa.riesgos, P = puestos(rs);
    const res = resumenMapa(mapa);
    const malos = rs.filter(r => [r.g, r.o, r.d].some(lleno) && !iprDe(r));
    if (malos.length) A.push({ nivel: "error", texto: `${malos.length === 1 ? "Un riesgo tiene" : malos.length + " riesgos tienen"} G, O o D fuera de rango: deben ser números enteros del 1 al 10.` });
    const sinPunt = rs.filter(r => lleno(r.fallo) && ![r.g, r.o, r.d].some(lleno)).length;
    if (sinPunt) A.push({ nivel: "nota", texto: `${sinPunt === 1 ? "Hay un riesgo" : "Hay " + sinPunt + " riesgos"} sin puntuar. Sin G, O y D no se puede calcular el IPR ni priorizar.` });
    if (res.conIPR >= 3 && !res.claves) A.push({ nivel: "nota", texto: "Marca con ★ los hallazgos clave que quieres auditar. Lo habitual es empezar por 3 a 5, los de IPR más alto." });
    if (res.claves > 8) A.push({ nivel: "nota", texto: `Has marcado ${res.claves} hallazgos clave. Es asumible si el equipo auditor es amplio o se reparte en grupos; si no, prioriza: no se trata de auditarlo todo, sino lo que de verdad puedas auditar este año con tus recursos.` });
    // Gravedad máxima con IPR bajo: el IPR puede esconder un riesgo grave pero raro
    rs.filter(r => !r.clave && entero1a10(r.g) >= 9 && iprDe(r) && iprDe(r) < 200).forEach(r =>
      A.push({ nivel: "nota", riesgo: r.id, texto: `«${corto(r.fallo)}» tiene gravedad ${r.g} aunque su IPR (${iprDe(r)}) no sea de los primeros. Un fallo muy grave merece atención aunque sea raro o fácil de detectar.` }));
    // Se ha elegido un riesgo y se ha dejado fuera otro claramente más prioritario
    const fueraAlto = rs.filter(r => !r.clave && iprDe(r)).sort((a, b) => iprDe(b) - iprDe(a))[0];
    const elegidoBajo = rs.filter(r => r.clave && iprDe(r)).sort((a, b) => iprDe(a) - iprDe(b))[0];
    if (fueraAlto && elegidoBajo && iprDe(fueraAlto) > iprDe(elegidoBajo) && !lleno(elegidoBajo.motivo))
      A.push({ nivel: "warn", riesgo: elegidoBajo.id, texto: `Has elegido «${corto(elegidoBajo.fallo)}» (IPR ${iprDe(elegidoBajo)}, puesto ${P[elegidoBajo.id]}) y dejas fuera «${corto(fueraAlto.fallo)}» (IPR ${iprDe(fueraAlto)}). Puede estar justificado, pero escribe el motivo de elección.` });
    const incompletos = rs.filter(r => r.clave && (!lleno(r.accion) || !lleno(r.evidencia) || !lleno(r.motivo))).length;
    if (incompletos) A.push({ nivel: "nota", texto: `${incompletos === 1 ? "Un hallazgo clave no tiene" : incompletos + " hallazgos clave no tienen"} completas la acción de mejora, la evidencia esperada o el motivo de elección.` });
    const vistos = new Map();
    rs.forEach(r => { const k = sinTildes(r.fallo); if (!k) return; if (vistos.has(k)) A.push({ nivel: "warn", riesgo: r.id, texto: `El fallo «${corto(r.fallo)}» aparece repetido. Si son subprocesos distintos, concreta en cada uno qué falla.` }); else vistos.set(k, r); });
    return A;
  }
  const corto = (s, n = 60) => { s = String(s || "").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s || "sin nombre"; };

  // Propone un motivo de elección a partir del IPR, el puesto y la gravedad
  function sugerirMotivo(mapa, r) {
    const v = iprDe(r), P = puestos(mapa.riesgos), g = entero1a10(r.g), partes = [];
    if (v) partes.push(`IPR ${v} (puesto ${P[r.id]} de ${mapa.riesgos.filter(iprDe).length} en el mapa)`);
    if (g >= 8) partes.push("gravedad alta: un fallo puede causar daño importante al paciente");
    else if (g >= 6) partes.push("gravedad moderada-alta");
    if (entero1a10(r.d) >= 7) partes.push("difícil de detectar antes de que cause efecto");
    if (entero1a10(r.o) >= 7) partes.push("ocurre con frecuencia");
    if (lleno(r.efecto)) partes.push("efecto: " + corto(r.efecto, 80).toLowerCase());
    return partes.length ? partes.join("; ") + "." : "";
  }

  // Pegar una tabla copiada de Excel/Calc/Word: columnas Subproceso, Fallo, Efecto, Causa, G, O, D (IPR se ignora)
  const CAB_PEGAR = {
    subproceso: ["subproceso", "fase", "etapa", "proceso"],
    fallo: ["fallo", "modo de fallo", "riesgo", "hallazgo", "riesgo detectado"],
    efecto: ["efecto", "efectos", "consecuencia"],
    causa: ["causa", "causas"],
    g: ["g", "gravedad", "severidad", "s"],
    o: ["o", "ocurrencia", "frecuencia", "probabilidad"],
    d: ["d", "deteccion", "detectabilidad"]
  };
  const ORDEN_PEGAR = ["subproceso", "fallo", "efecto", "causa", "g", "o", "d"];
  function parsearTabla(texto) {
    const lineas = String(texto || "").replace(/\r\n?/g, "\n").split("\n").filter(l => l.trim());
    if (!lineas.length) return { riesgos: [], errores: ["No hay nada que importar."], cabecera: false };
    const sep = lineas.some(l => l.includes("\t")) ? "\t" : lineas.some(l => l.includes(";")) ? ";" : null;
    if (!sep) return { riesgos: [], errores: ["No se reconocen columnas. Copia la tabla directamente desde Excel, Calc o Word (columnas separadas por tabuladores) o usa «;» entre columnas."], cabecera: false };
    const filas = lineas.map(l => l.split(sep).map(c => c.trim().replace(/^"(.*)"$/, "$1")));
    let mapa = ORDEN_PEGAR.slice(), cabecera = false;
    const primera = filas[0].map(sinTildes);
    const reconocidas = primera.map(c => Object.keys(CAB_PEGAR).find(k => CAB_PEGAR[k].includes(c)) || null);
    // Es cabecera si reconoce al menos dos nombres de columna y no trae números (una fila de datos sí los trae)
    if (reconocidas.filter(Boolean).length >= 2 && !filas[0].some(c => Number.isFinite(num(c)))) {
      cabecera = true; mapa = reconocidas; filas.shift();
    }
    const riesgos = [], errores = [];
    filas.forEach((f, i) => {
      const r = { subproceso: "", fallo: "", efecto: "", causa: "", g: "", o: "", d: "" };
      f.forEach((c, j) => { const k = mapa[j]; if (k && r[k] === "") r[k] = c.slice(0, 1000); });
      if (!lleno(r.fallo) && !lleno(r.subproceso)) return;
      if ([r.g, r.o, r.d].some(lleno) && !ipr(r.g, r.o, r.d)) errores.push(`Fila ${i + 1 + (cabecera ? 1 : 0)}: G, O o D no son enteros del 1 al 10 (se importa igualmente para que lo corrijas).`);
      riesgos.push(r);
    });
    if (!riesgos.length) errores.push("No se ha encontrado ninguna fila con fallo o subproceso.");
    return { riesgos, errores, cabecera };
  }

  // ---------- Auditoría ----------
  // De dónde nace una auditoría: no todas empiezan en un AMFE
  const ORIGENES = {
    riesgos: { nom: "Mapa de Riesgos", icono: "⚠", q: "Has analizado un proceso (AMFE) y tienes riesgos priorizados por IPR.", por: "verificar si las medidas de control de los riesgos más prioritarios se aplican de verdad" },
    estandar: { nom: "Estándar o norma", icono: "★", q: "Un estándar de acreditación (p. ej. ACSA), una norma ISO o un protocolo obliga a comprobar su cumplimiento.", por: "comprobar el cumplimiento de un estándar o protocolo de referencia" },
    incidente: { nom: "Incidente o notificación", icono: "!", q: "Un incidente, una notificación o una reclamación ha puesto el foco en un proceso.", por: "comprobar si el fallo detectado en un incidente es puntual o se repite en el proceso" },
    indicador: { nom: "Indicador fuera de objetivo", icono: "▼", q: "Un indicador de tu cuadro de mando no alcanza el estándar o empeora.", por: "averiguar qué está fallando detrás de un indicador que no alcanza su estándar" },
    seguimiento: { nom: "Auditoría anterior", icono: "↻", q: "Quieres comprobar si las mejoras de una auditoría previa han funcionado (auditoría de seguimiento).", por: "verificar la eficacia de las acciones de mejora de una auditoría anterior" },
    encargo: { nom: "Encargo u objetivo", icono: "◎", q: "La Dirección, un acuerdo de gestión o un objetivo de la unidad lo pide.", por: "dar respuesta a un objetivo de la unidad o a un encargo de la Dirección" }
  };
  const TIPOS_AUD = { interna: "Interna", externa: "Externa" };
  const OBJETOS_AUD = {
    proceso: { nom: "De proceso", def: "Revisa procedimientos concretos (conciliación, higiene de manos, triaje…). Es la más habitual." },
    sistema: { nom: "De sistema", def: "Evalúa el sistema de gestión de la calidad en su conjunto." },
    producto: { nom: "De producto o servicio", def: "Verifica la calidad final de un servicio o producto (p. ej. un informe quirúrgico)." }
  };

  function nuevoMapa(id, fecha) {
    return { id, nombre: "", unidad: "", proceso: "", fecha: "", equipo: "", notas: "", subprocesos: [], riesgos: [], creado: fecha, modificado: fecha };
  }
  function nuevoRiesgo(id) {
    return { id, subproceso: "", fallo: "", efecto: "", causa: "", g: "", o: "", d: "", medidas: "", clave: false, accion: "", evidencia: "", motivo: "" };
  }
  function nuevoCriterio(id) {
    return { id, subproceso: "", riesgoId: "", hallazgo: "", criterio: "", origenId: "", ind: nuevoInd(), evid: nuevaEvid(), muestra: nuevaMuestra(), piloto: nuevoPiloto(), recogida: nuevaRecogida(), analisis: nuevoAnalisis() };
  }
  function nuevaAuditoria(id, fecha) {
    return {
      id, titulo: "", unidad: "", proceso: "", centro: "",
      origen: { tipo: "", mapaId: "", riesgoIds: [], detalle: "" },
      tipo: "interna", objeto: "proceso", introduccion: "", objetivoGeneral: "", objetivosEsp: "", alcance: "",
      planId: "", entradaId: "", hitos: nuevosHitos(), diseno: nuevoDiseno(), control: nuevoControl(), ejecucion: nuevaEjecucion(), informe: nuevoInforme(), mejora: nuevaMejora(), seguimientoDe: "",
      criterios: [], creado: fecha, modificado: fecha
    };
  }

  // Crea los criterios de una auditoría a partir de los hallazgos clave elegidos en un mapa
  function criteriosDesdeRiesgos(mapa, ids, genId) {
    return ordenarRiesgos(mapa.riesgos.filter(r => ids.includes(r.id))).map(r =>
      Object.assign(nuevoCriterio(genId()), { subproceso: r.subproceso, riesgoId: r.id, hallazgo: r.fallo }));
  }

  // «de» + texto, con la contracción correcta: «de el proceso» → «del proceso»
  function deArt(s) {
    s = String(s || "").trim();
    const m = /^(el|la|los|las)\s+/i.exec(s);
    if (!m) return "de " + s;
    return (m[1].toLowerCase() === "el" ? "del " : "de " + m[1].toLowerCase() + " ") + s.slice(m[0].length);
  }
  const procesoDe = (aud, mapa) => lleno(aud.proceso) ? aud.proceso.trim() : mapa && lleno(mapa.proceso) ? mapa.proceso.trim() : mapa && lleno(mapa.nombre) ? mapa.nombre.trim() : "";
  // «… en el Servicio de Urgencias», salvo que el proceso ya lo diga
  const enUnidad = (aud, proc) => lleno(aud.unidad) && !sinTildes(proc).includes(sinTildes(aud.unidad).replace(/^(el|la) /, "")) ? ` en ${aud.unidad.trim()}` : "";

  function sugerirTitulo(aud, mapa) {
    const proc = procesoDe(aud, mapa);
    if (!proc) return "";
    return `Auditoría ${aud.tipo === "externa" ? "externa" : "interna"} ${deArt(proc)}${enUnidad(aud, proc)}`;
  }

  // Objetivo general propuesto según el origen y lo que se sabe de la auditoría
  function sugerirObjetivo(aud, mapa) {
    const o = ORIGENES[aud.origen.tipo];
    const proc = procesoDe(aud, mapa) || "el proceso auditado";
    const subs = [...new Set(aud.criterios.map(c => c.subproceso).filter(lleno))];
    let t = `Evaluar el grado de cumplimiento y la eficacia de las medidas de seguridad implantadas en ${proc}${enUnidad(aud, proc)}`;
    if (subs.length) t += `, centrándose en ${subs.length === 1 ? "el subproceso de " + subs[0].toLowerCase() : subs.length + " subprocesos críticos (" + subs.join(", ").toLowerCase() + ")"}`;
    if (o) t += `, para ${o.por}`;
    return t + ".";
  }

  // Fases del ciclo (la línea PDCA que se ve en toda la app). «entrega» = cuándo estará disponible
  const FASES = [
    { k: "riesgos", n: 0, pdca: "P", corto: "Riesgos", titulo: "Punto de partida", que: "Qué puede fallar y qué es prioritario auditar.", doc: "Mapa de Riesgos priorizado", entrega: 1 },
    { k: "plan", n: 1, pdca: "P", corto: "Plan anual", titulo: "Plan anual de auditorías", que: "Qué se audita este año, con qué alcance y criterios, cuándo y con quién.", doc: "Plan Anual de Auditorías", entrega: 2 },
    { k: "diseno", n: 2, pdca: "P", corto: "Diseño", titulo: "Diseño de la auditoría", que: "Criterios, indicadores, evidencias, instrumentos y muestra.", doc: "Plan específico y hoja de recogida", entrega: 3 },
    { k: "hacer", n: 3, pdca: "H", corto: "Recogida", titulo: "Recogida de datos", que: "Revisar los casos, recoger las evidencias y calcular resultados.", doc: "Matriz de resultados", entrega: 4 },
    { k: "verificar", n: 4, pdca: "V", corto: "Informe", titulo: "Informe de resultados", que: "Interpretar, redactar hallazgos y recomendaciones.", doc: "Informe de auditoría y resumen ejecutivo", entrega: 5 },
    { k: "actuar", n: 5, pdca: "A", corto: "Mejora", titulo: "Mejora y seguimiento", que: "Plan de acción, responsables, plazos y auditoría de seguimiento.", doc: "Plan de mejora e informe de seguimiento", entrega: 6 }
  ];
  const PDCA = { P: "Planificar", H: "Hacer", V: "Verificar", A: "Actuar" };

  // Progreso de una auditoría en la fase de inicio (lo demás llegará en las siguientes entregas)
  function progresoInicio(aud) {
    const items = [
      ["Origen", lleno(aud.origen.tipo)],
      ["Título", lleno(aud.titulo)],
      ["Unidad", lleno(aud.unidad)],
      ["Objetivo general", lleno(aud.objetivoGeneral)],
      ["Subprocesos y hallazgos", aud.criterios.some(c => lleno(c.hallazgo))]
    ];
    return { items, hechos: items.filter(x => x[1]).length, total: items.length };
  }

  // Qué hacer ahora: el siguiente paso recomendado según lo que ya hay
  function siguientePaso(d) {
    const mapas = d.mapas, auds = d.auditorias;
    if (!mapas.length && !auds.length) return { k: "empezar", texto: "Empieza por tu Mapa de Riesgos: escribe qué puede fallar en el proceso y puntúalo. Si ya sabes qué quieres auditar, crea directamente una auditoría.", href: "#/riesgos/nuevo", btn: "Crear mi Mapa de Riesgos" };
    const sinPunt = mapas.find(m => m.riesgos.length && !m.riesgos.some(iprDe));
    if (sinPunt) return { k: "puntuar", texto: `Puntúa los riesgos de «${corto(sinPunt.nombre || "tu mapa", 50)}» (gravedad, ocurrencia y detección) para saber cuáles son prioritarios.`, href: "#/riesgos/" + sinPunt.id, btn: "Puntuar riesgos" };
    const sinClave = mapas.find(m => m.riesgos.filter(iprDe).length >= 3 && !m.riesgos.some(r => r.clave));
    if (sinClave) return { k: "elegir", texto: `Elige en «${corto(sinClave.nombre || "tu mapa", 50)}» los hallazgos clave que vas a auditar (★). Empieza por los de IPR más alto.`, href: "#/riesgos/" + sinClave.id, btn: "Elegir hallazgos clave" };
    const planes = d.planes || [];
    const conClaveSinPlan = mapas.find(m => m.riesgos.some(r => r.clave) && !planes.some(p => p.entradas.some(e => e.mapaId === m.id)) && !auds.some(a => a.origen.mapaId === m.id));
    if (conClaveSinPlan) return { k: "planificar", texto: `Ya tienes hallazgos clave en «${corto(conClaveSinPlan.nombre || "tu mapa", 50)}». Llévalos al Plan Anual: alcance, criterios, frecuencia y en qué meses se auditan. (Si solo quieres hacer una auditoría suelta, puedes crearla directamente.)`, href: "#/plan/nuevo?mapa=" + conClaveSinPlan.id, btn: "Preparar el Plan Anual" };
    const planIncompleto = planes.find(p => { const g = progresoPlan(p); return ![1, 2, 3, 4, 5].every(k => g[k]); });
    if (planIncompleto) { const g = progresoPlan(planIncompleto), paso = [1, 2, 3, 4, 5].find(k => !g[k]); return { k: "plan", texto: `Sigue con el Plan Anual «${corto(planIncompleto.anio ? "Plan " + planIncompleto.anio : "sin año", 40)}»: te falta el paso ${paso} (${["", "qué se audita", "alcance y criterios", "frecuencia y responsables", "cronograma", "roles y aprobación"][paso]}).`, href: `#/plan/${planIncompleto.id}/${paso}`, btn: "Seguir con el plan" }; }
    const entradaSinAud = planes.flatMap(p => p.entradas.map(e => ({ p, e }))).find(x => !x.e.auditoriaId);
    if (entradaSinAud && !auds.length) return { k: "auditar", texto: `Tu plan está listo. Crea la primera auditoría: «${corto(entradaSinAud.e.titulo, 50)}».`, href: `#/plan/${entradaSinAud.p.id}/6`, btn: "Crear las auditorías del plan" };
    const conClaveSinAud = mapas.find(m => m.riesgos.some(r => r.clave) && !auds.some(a => a.origen.mapaId === m.id) && !planes.some(p => p.entradas.some(e => e.mapaId === m.id)));
    if (conClaveSinAud) return { k: "auditar", texto: `Ya tienes hallazgos clave en «${corto(conClaveSinAud.nombre || "tu mapa", 50)}». Crea la auditoría que los va a comprobar.`, href: "#/auditoria/nueva?mapa=" + conClaveSinAud.id, btn: "Crear la auditoría" };
    const incompleta = auds.find(a => { const p = progresoInicio(a); return p.hechos < p.total; });
    if (incompleta) return { k: "completar", texto: `Completa los datos de inicio de «${corto(incompleta.titulo || "tu auditoría", 50)}»: origen, unidad, objetivo y subprocesos.`, href: "#/auditoria/" + incompleta.id, btn: "Seguir con la auditoría" };
    const sinDiseno = auds.find(a => { const g = progresoDiseno(a); return ![1, 2, 3, 4].every(k => g[k]); });
    if (sinDiseno) { const g = progresoDiseno(sinDiseno), paso = [1, 2, 3, 4].find(k => !g[k]); return { k: "disenar", texto: `Diseña «${corto(sinDiseno.titulo || "tu auditoría", 50)}»: te falta ${["", "un indicador por criterio", "elegir evidencias e instrumentos", "calcular la muestra", "la metodología y el equipo"][paso]}.`, href: `#/auditoria/${sinDiseno.id}/diseno/${paso}`, btn: "Seguir con el diseño" }; }
    const sinPiloto = auds.find(a => !progresoDiseno(a)[5]);
    if (sinPiloto) return { k: "pilotar", texto: `Antes de recoger datos en «${corto(sinPiloto.titulo || "tu auditoría", 50)}», pilota la hoja de recogida con dos auditores en 5–10 casos.`, href: `#/auditoria/${sinPiloto.id}/diseno/5`, btn: "Hacer el pilotaje" };
    const sinDatos = auds.find(a => { const p = progresoRecogida(a); return p.completos < p.total; });
    if (sinDatos) { const p = progresoRecogida(sinDatos); return { k: "recoger", texto: `Recoge los datos de «${corto(sinDatos.titulo || "tu auditoría", 50)}»: ${p.completos} de ${p.total} criterios tienen ya resultado.`, href: `#/auditoria/${sinDatos.id}/recogida`, btn: "Seguir con la recogida" }; }
    const sinInforme = auds.find(a => { const g = progresoInforme(a); return ![1, 2, 3, 4, 5].every(k => g[k]); });
    if (sinInforme) { const g = progresoInforme(sinInforme), paso = [1, 2, 3, 4, 5].find(k => !g[k]); return { k: "informe", texto: `Redacta el informe de «${corto(sinInforme.titulo || "tu auditoría", 50)}»: te falta ${["", "interpretar y clasificar los hallazgos", "analizar las causas de las no conformidades", "proponer recomendaciones con responsable y prioridad", "las conclusiones y el resumen ejecutivo", "validar el borrador con los responsables"][paso]}.`, href: `#/auditoria/${sinInforme.id}/informe/${paso}`, btn: "Seguir con el informe" }; }
    const sinPlanMejora = auds.find(a => { const g = progresoMejora(a); return !g[1] || !g[2]; });
    if (sinPlanMejora) { const g = progresoMejora(sinPlanMejora); return { k: "mejora", texto: `Convierte las recomendaciones de «${corto(sinPlanMejora.titulo || "tu auditoría", 50)}» en un plan de acción: ${!g[1] ? "acciones con responsable y plazo" : "priorízalas con la matriz criticidad × viabilidad"}.`, href: `#/auditoria/${sinPlanMejora.id}/mejora/${!g[1] ? 1 : 2}`, btn: "Seguir con el plan de mejora" }; }
    const sinSeg = auds.find(a => !progresoMejora(a)[3]);
    if (sinSeg) return { k: "seguimiento", texto: `Programa la auditoría de seguimiento de «${corto(sinSeg.titulo || "tu auditoría", 50)}»: es lo que demuestra si las mejoras han funcionado.`, href: `#/auditoria/${sinSeg.id}/mejora/3`, btn: "Programar el seguimiento" };
    return { k: "ciclo", texto: "Has recorrido el ciclo completo: riesgos, plan, diseño, recogida, informe y mejora. Revisa el estado de las acciones, actualiza el Mapa de Riesgos con lo aprendido y ponte a prueba con la autoevaluación.", href: "#/prueba", btn: "Ponte a prueba" };
  }

  // ---------- Diseño de la auditoría (entrega 3) ----------
  const TIPOS_IND = {
    estructura: { nom: "Estructura", que: "Lo que se tiene (recursos, medios)" },
    proceso: { nom: "Proceso", que: "Lo que se hace (si se aplica el protocolo)" },
    resultado: { nom: "Resultado", que: "Lo que se logra (efecto en el paciente)" }
  };
  const EVIDENCIAS = {
    documental: { nom: "Documental", que: "Historias clínicas, protocolos, hojas de verificación, informes." },
    observacion: { nom: "Observación directa", que: "Ver la práctica real in situ (higiene de manos, identificación…)." },
    entrevista: { nom: "Entrevistas", que: "Profesionales, pacientes o familiares: aportan el porqué." },
    registros: { nom: "Registros electrónicos", que: "Sistemas de información, bases de datos, aplicaciones corporativas." }
  };
  const PRINCIPIOS = {
    veracidad: "Veracidad y pertinencia", trazabilidad: "Trazabilidad", relevancia: "Relevancia",
    fiabilidad: "Fiabilidad de las fuentes", imparcialidad: "Imparcialidad", confidencialidad: "Confidencialidad"
  };
  const INSTRUMENTOS = {
    checklist: { nom: "Lista de verificación", que: "Puntos a revisar uno a uno (Sí / No / No aplica)." },
    observacion: { nom: "Observación estructurada", que: "Guion u hoja para anotar de forma objetiva lo que se ve." },
    entrevista: { nom: "Guía de entrevista", que: "Preguntas preparadas de antemano." },
    matriz: { nom: "Matriz de hallazgos", que: "Tabla con cada hallazgo, su evidencia y su gravedad." },
    registroNC: { nom: "Registro de no conformidades", que: "Desviaciones con su evidencia y, si se conoce, su causa." }
  };
  const OBJETIVOS_MUESTRA = {
    decidir: { nom: "Decidir (LQAS)", que: "¿Se alcanza el estándar o hay que investigar? Pocos casos (15–35). Un semáforo, no una báscula." },
    estimar: { nom: "Estimar el %", que: "Conocer el porcentaje de cumplimiento con un margen de error. Más casos (97 con ±10 %)." },
    practica: { nom: "Regla práctica", que: "Unas 50 historias (mínimo 30) al azar, sin cálculo. Solo detecta cambios grandes." },
    todos: { nom: "Todos los casos", que: "Cuando son pocos o un solo caso ya es grave (indicadores centinela)." }
  };
  const METODOS_SEL = {
    aleatorio: { nom: "Aleatorio simple", que: "Se numera el listado y se sortean números." },
    sistematico: { nom: "Sistemático", que: "Un caso cada k = N ÷ n, tras un arranque al azar. Cuidado si el listado tiene patrones." },
    estratificado: { nom: "Estratificado", que: "Se sortea dentro de cada grupo (turno, unidad) para que todos estén representados." }
  };

  const nuevoInd = () => ({ nombre: "", tipo: "", numerador: "", denominador: "", sentido: "mas", estandar: "", fuente: "", exclusiones: "", cumpleSi: "", noAplicaSi: "" });
  const nuevaEvid = () => ({ tipos: [], triangulacion: "", principios: [], instrumentos: [], justificacion: "" });
  const nuevaMuestra = () => ({ objetivo: "", N: "", e: "10", p: "50", beta: "20", umbral: "", n: "", metodo: "", unidad: "", sorteo: [] });
  const nuevoPiloto = () => ({ pares: [], nota: "" });
  const nuevoDiseno = () => ({ poblacion: "", periodo: "", fuentes: "", equipo: "", recursos: "", metodologia: "" });

  const pctNum = v => { const n = num(String(v || "").replace("%", "")); return Number.isFinite(n) ? n : NaN; };
  function formulaInd(ind) {
    if (!lleno(ind.numerador) && !lleno(ind.denominador)) return "";
    return `(${lleno(ind.numerador) ? ind.numerador.trim() : "numerador"} ÷ ${lleno(ind.denominador) ? ind.denominador.trim() : "denominador"}) × 100`;
  }
  function textoEstandar(ind) {
    const v = pctNum(ind.estandar); if (!Number.isFinite(v)) return "";
    return `${ind.sentido === "menos" ? "≤" : "≥"} ${nfmt(v, 1)} %`;
  }
  // El estándar expresado siempre en cumplimientos (las tablas LQAS cuentan cumplimientos)
  function estandarCumplimiento(ind) {
    const v = pctNum(ind.estandar); if (!Number.isFinite(v)) return NaN;
    return ind.sentido === "menos" ? 100 - v : v;
  }

  // Tamaño para estimar un porcentaje: n = z² p (1 − p) / e², con corrección por universo finito
  function tamEstimar(e, p, N) {
    const ee = pctNum(e) / 100, pp = Number.isFinite(pctNum(p)) ? pctNum(p) / 100 : 0.5, NN = num(N);
    if (!(ee > 0 && ee < 1) || !(pp > 0 && pp < 1)) return null;
    const n0 = 1.96 * 1.96 * pp * (1 - pp) / (ee * ee);
    const n = Number.isFinite(NN) && NN > 0 ? n0 / (1 + (n0 - 1) / NN) : n0;
    return { n0, n: Math.ceil(n - 1e-9), corregida: Number.isFinite(NN) && NN > 0 };
  }
  const margenError = (p, n) => n > 0 ? 1.96 * Math.sqrt(p * (1 - p) / n) : NaN;

  // Tablas de Lemeshow (adaptadas por Saturno). Filas: umbral 10–85 %; columnas: estándar 50–95 %. «n/c»; «-» = no aplicable
  const LQ_COLS = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
  const LQ = {
    "20": {
      10: "8/1 6/1 5/1", 15: "11/2 8/2 7/2 5/1", 20: "15/4 11/3 9/2 7/2 5/1", 25: "23/7 16/5 12/4 9/3 7/2 5/2",
      30: "37/13 24/9 16/6 12/5 9/4 6/2 5/2", 35: "67/26 38/15 24/10 16/7 11/5 8/3 6/3",
      40: "153/66 68/30 38/17 23/11 16/8 11/5 8/4 5/2", 45: "617/288 154/74 67/33 37/19 22/11 15/8 10/5 7/4 5/3",
      50: "- 615/317 151/80 65/35 35/20 21/12 13/8 9/5 6/4", 55: "- - 600/340 145/84 62/37 32/19 19/12 12/8 7/4",
      60: "- - - 573/353 136/86 57/37 29/19 16/11 10/7 5/3", 65: "- - - - 534/356 125/85 50/35 25/18 13/9 7/5",
      70: "- - - - - 483/346 109/80 43/32 20/15 9/7", 75: "- - - - - - 419/321 91/71 33/26 14/11",
      80: "- - - - - - - 342/279 69/58 22/19", 85: "- - - - - - - - 253/219 44/39"
    },
    "10": {
      10: "10/2 8/2 6/1 5/1", 15: "14/3 11/3 8/2 7/2 5/1", 20: "20/6 15/5 11/3 9/3 7/2 5/2", 25: "31/10 21/7 16/6 12/5 9/4 7/3 5/2",
      30: "50/19 32/12 22/9 16/7 12/5 9/4 7/3 5/2", 35: "92/38 52/22 33/15 22/10 16/8 11/5 8/4 6/3 5/3",
      40: "211/93 93/43 52/25 32/16 22/11 15/8 11/6 8/5 6/4", 45: "853/402 212/104 93/48 51/27 31/17 21/12 14/8 10/6 7/4",
      50: "- 852/444 210/114 91/51 49/29 30/18 19/12 13/8 9/6 5/3", 55: "- - 834/477 203/120 87/53 46/29 27/18 17/12 11/8 7/5",
      60: "- - - 798/496 191/123 80/53 42/29 24/17 14/10 8/6", 65: "- - - - 746/501 176/122 72/52 36/27 20/15 11/9",
      70: "- - - - - 676/488 156/116 62/48 30/24 15/12", 75: "- - - - - - 589/455 131/104 49/40 21/18",
      80: "- - - - - - - 484/398 102/86 34/30", 85: "- - - - - - - - 362/316 67/60"
    }
  };
  function lqas(estandar, umbral, beta) {
    const t = LQ[String(beta) === "10" ? "10" : "20"], ci = LQ_COLS.indexOf(estandar), fila = t[umbral];
    if (ci < 0 || !fila) return null;
    const celda = fila.split(" ")[ci];
    if (!celda || celda === "-") return null;
    const [n, c] = celda.split("/").map(Number);
    return { n, c };
  }
  // Para un estándar: todas las líneas rojas posibles con su n y su c (la «chuleta»)
  function opcionesLqas(estandar, beta) {
    return Object.keys(LQ["20"]).map(Number).filter(u => u < estandar).map(u => Object.assign({ umbral: u }, lqas(estandar, u, beta) || {})).filter(x => x.n).sort((a, b) => b.umbral - a.umbral);
  }
  // Estado de la muestra de un criterio: n, c y avisos
  function calcMuestra(c) {
    const m = c.muestra, ind = c.ind, N = num(m.N), avisos = [];
    const res = { n: NaN, c: NaN, texto: "", avisos };
    if (m.objetivo === "todos") { res.n = Number.isFinite(N) ? N : NaN; res.texto = Number.isFinite(N) ? `Todos los casos (${N})` : "Todos los casos"; return res; }
    if (m.objetivo === "practica") {
      res.n = Number.isFinite(N) && N < 50 ? N : 50; res.texto = `${res.n} casos al azar (regla práctica)`;
      if (Number.isFinite(N) && N <= 50) avisos.push({ nivel: "nota", texto: "El universo es pequeño: revisa todos los casos." });
      avisos.push({ nivel: "nota", texto: "Con la regla práctica no hay cálculo: el resultado tendrá un margen de error de unos ±14 puntos con 50 casos. Sirve para detectar cambios grandes." });
      return res;
    }
    if (m.objetivo === "estimar") {
      const t = tamEstimar(m.e, m.p, m.N);
      if (!t) { avisos.push({ nivel: "error", texto: "El margen de error y el porcentaje esperado deben estar entre 1 y 99." }); return res; }
      res.n = t.n; res.texto = `${t.n} casos para estimar con ±${nfmt(pctNum(m.e), 1)} % (95 % de confianza)${t.corregida ? `, universo de ${nfmt(N)}` : ""}`;
      if (Number.isFinite(N) && t.n >= N) avisos.push({ nivel: "nota", texto: "La muestra sale igual o mayor que el universo: revisa todos los casos." });
      return res;
    }
    if (m.objetivo === "decidir") {
      const est = estandarCumplimiento(ind);
      if (!Number.isFinite(est)) { avisos.push({ nivel: "nota", texto: "Escribe el estándar del indicador (paso de indicadores) para buscar el plan LQAS." }); return res; }
      if (est >= 100) { avisos.push({ nivel: "warn", texto: "Con un estándar del 100 % (o 0 % de fallos) no hay plan LQAS: un solo fallo ya incumple. Revisa todos los casos, o fija un estándar realista (p. ej. 95 %) y vigila los fallos uno a uno." }); return res; }
      if (LQ_COLS.indexOf(est) < 0) { avisos.push({ nivel: "warn", texto: `Las tablas LQAS van de 5 en 5 (50 %, 55 %… 95 %, en cumplimiento). Tu estándar equivale a ${nfmt(est, 1)} % de cumplimiento: usa el valor de la tabla más próximo.` }); return res; }
      const u = pctNum(m.umbral);
      if (!Number.isFinite(u)) { avisos.push({ nivel: "nota", texto: "Elige la línea roja (umbral): el nivel por debajo del cual la situación es claramente mala." }); return res; }
      const r = lqas(est, u, m.beta);
      if (!r) { avisos.push({ nivel: "warn", texto: "Esa combinación de estándar y umbral no está en la tabla. El umbral debe estar por debajo del estándar." }); return res; }
      res.n = r.n; res.c = r.c; res.texto = `Revisar ${r.n} casos: si cumplen ${r.c} o más, se acepta; si cumplen ${r.c - 1} o menos, hay que investigar`;
      if (Number.isFinite(N) && r.n > N * 0.1) avisos.push({ nivel: N < r.n ? "warn" : "nota", texto: N < r.n ? `El plan pide ${r.n} casos y el universo solo tiene ${N}: revisa todos o sube la línea roja… o mejor, baja la exigencia del umbral.` : `La muestra (${r.n}) supera el 10 % del lote (${N}). El LQAS funciona mejor con lotes grandes; con lotes pequeños, el resultado es aproximado.` });
      return res;
    }
    return res;
  }

  // Sorteo de los casos: devuelve los números del listado (1…N) que hay que revisar
  function sortear(N, n, metodo, rnd = Math.random) {
    N = Math.floor(num(N)); n = Math.floor(num(n));
    if (!(N > 0) || !(n > 0)) return [];
    if (n >= N) return Array.from({ length: N }, (_, i) => i + 1);
    if (metodo === "sistematico") {
      const k = Math.floor(N / n), ini = 1 + Math.floor(rnd() * k);
      return Array.from({ length: n }, (_, i) => ini + i * k);
    }
    const a = Array.from({ length: N }, (_, i) => i + 1);
    for (let i = 0; i < n; i++) { const j = i + Math.floor(rnd() * (N - i)); [a[i], a[j]] = [a[j], a[i]]; }
    return a.slice(0, n).sort((x, y) => x - y);
  }

  // Pilotaje: concordancia entre dos auditores con los mismos casos (Sí / No / No aplica)
  function concordancia(pares) {
    const v = pares.filter(p => lleno(p.a) && lleno(p.b));
    const n = v.length;
    if (!n) return { n: 0 };
    const cats = ["si", "no", "na"], acuerdos = v.filter(p => p.a === p.b).length, po = acuerdos / n;
    const pe = cats.reduce((s, k) => s + (v.filter(p => p.a === k).length / n) * (v.filter(p => p.b === k).length / n), 0);
    const kappa = pe >= 1 ? (po === 1 ? 1 : 0) : (po - pe) / (1 - pe);
    const nivel = po >= 0.9 && kappa >= 0.6 ? "bueno" : po >= 0.8 && kappa >= 0.4 ? "aceptable" : "bajo";
    const texto = n < 5 ? "Con menos de 5 casos el pilotaje dice poco: revisa al menos 5–10." :
      nivel === "bueno" ? "Buena concordancia: el criterio está bien definido. Se puede empezar." :
      nivel === "aceptable" ? "Concordancia aceptable. Revisad juntos los casos en que no coincidís y aclarad la definición de «cumple»." :
      "Concordancia baja: el criterio no está claro. Antes de recoger datos, reescribid «cumple si…» y «no aplica si…» y repetid el pilotaje.";
    return { n, acuerdos, pct: po * 100, kappa, nivel, texto, pocos: n < 5 };
  }

  function avisosDiseno(aud) {
    const A = [], C = aud.criterios, nom = (c, i) => `Criterio ${i + 1}`;
    if (!C.length) { A.push({ nivel: "nota", paso: 1, texto: "La auditoría no tiene criterios todavía: añádelos en el paso de Inicio." }); return A; }
    C.forEach((c, i) => {
      const ind = c.ind;
      if (!lleno(ind.nombre)) A.push({ nivel: "nota", paso: 1, texto: `${nom(c, i)}: falta el nombre del indicador.` });
      if (lleno(ind.nombre) && (!lleno(ind.numerador) || !lleno(ind.denominador))) A.push({ nivel: "nota", paso: 1, texto: `${nom(c, i)}: define numerador y denominador; si no, cada auditor contará distinto.` });
      if (lleno(ind.nombre) && !lleno(ind.estandar)) A.push({ nivel: "warn", paso: 1, texto: `${nom(c, i)}: sin estándar no se puede decir si cumple o no.` });
      const est = pctNum(ind.estandar);
      if (Number.isFinite(est) && (est < 0 || est > 100)) A.push({ nivel: "error", paso: 1, texto: `${nom(c, i)}: el estándar es un porcentaje entre 0 y 100.` });
      if (Number.isFinite(est) && ind.sentido === "mas" && est < 50) A.push({ nivel: "warn", paso: 1, texto: `${nom(c, i)}: estándar ≥ ${est} %. ¿Seguro que no cuentas fallos? Si el indicador cuenta errores, el sentido es «menos es mejor» (≤).` });
      if (Number.isFinite(est) && ind.sentido === "menos" && est > 50) A.push({ nivel: "warn", paso: 1, texto: `${nom(c, i)}: estándar ≤ ${est} %. ¿Seguro que cuentas fallos? Si cuentas aciertos, el sentido es «más es mejor» (≥).` });
      if (lleno(ind.nombre) && !lleno(ind.cumpleSi)) A.push({ nivel: "nota", paso: 1, texto: `${nom(c, i)}: escribe «cumple si…». Es lo que hace que dos auditores lleguen al mismo resultado.` });
      const ev = c.evid;
      if (!ev.tipos.length) A.push({ nivel: "nota", paso: 2, texto: `${nom(c, i)}: elige al menos un tipo de evidencia.` });
      else if (ev.tipos.length === 1) A.push({ nivel: "nota", paso: 2, texto: `${nom(c, i)}: una sola fuente de evidencia. Si puedes, triangula con otra (lo registrado frente a lo observado o lo que cuentan los profesionales).` });
      if (ev.tipos.length && !ev.instrumentos.length) A.push({ nivel: "nota", paso: 2, texto: `${nom(c, i)}: elige el instrumento de recogida.` });
      if (ev.tipos.includes("observacion") && !ev.instrumentos.includes("observacion") && !ev.instrumentos.includes("checklist")) A.push({ nivel: "nota", paso: 2, texto: `${nom(c, i)}: para la observación directa conviene una observación estructurada o una lista de verificación.` });
      if (ev.tipos.includes("entrevista") && !ev.instrumentos.includes("entrevista")) A.push({ nivel: "nota", paso: 2, texto: `${nom(c, i)}: para las entrevistas conviene una guía de entrevista.` });
      if (!lleno(c.muestra.objetivo)) A.push({ nivel: "nota", paso: 3, texto: `${nom(c, i)}: elige cómo se calcula la muestra (decidir, estimar, regla práctica o todos).` });
      else calcMuestra(c).avisos.filter(a => a.nivel !== "nota").forEach(a => A.push({ nivel: a.nivel, paso: 3, texto: `${nom(c, i)}: ${a.texto}` }));
      if (lleno(c.muestra.objetivo) && c.muestra.objetivo !== "todos" && !lleno(c.muestra.metodo)) A.push({ nivel: "nota", paso: 3, texto: `${nom(c, i)}: elige cómo se seleccionan los casos al azar.` });
      const k = concordancia(c.piloto.pares);
      if (k.n && !k.pocos && k.nivel === "bajo") A.push({ nivel: "warn", paso: 5, texto: `${nom(c, i)}: concordancia baja en el pilotaje (${nfmt(k.pct, 0)} %). Aclara la definición antes de recoger datos.` });
    });
    if (!lleno(aud.diseno.periodo)) A.push({ nivel: "nota", paso: 4, texto: "Indica el periodo auditado (de qué fechas son los casos)." });
    if (!lleno(aud.diseno.equipo)) A.push({ nivel: "nota", paso: 4, texto: "Indica quién forma el equipo auditor." });
    if (!C.some(c => c.piloto.pares.some(p => lleno(p.a) && lleno(p.b)))) A.push({ nivel: "nota", paso: 5, texto: "Aún no has hecho ningún pilotaje. Prueba la hoja con dos auditores en 5–10 casos antes de empezar." });
    return A;
  }
  function progresoDiseno(aud) {
    const C = aud.criterios, todos = f => C.length > 0 && C.every(f);
    return {
      1: todos(c => lleno(c.ind.nombre) && lleno(c.ind.numerador) && lleno(c.ind.denominador) && lleno(c.ind.estandar)),
      2: todos(c => c.evid.tipos.length > 0 && c.evid.instrumentos.length > 0),
      3: todos(c => lleno(c.muestra.objetivo) && Number.isFinite(calcMuestra(c).n)),
      4: lleno(aud.diseno.periodo) && lleno(aud.diseno.equipo),
      5: C.some(c => concordancia(c.piloto.pares).n >= 5)
    };
  }

  // Importar indicadores desde una copia de la app Indicadores
  function indicadoresDeCopia(o) {
    if (!o || typeof o !== "object" || !Array.isArray(o.indicadores)) return null;
    const t = v => (typeof v === "string" || typeof v === "number") ? String(v).slice(0, 1000) : "";
    return o.indicadores.slice(0, 300).filter(x => x && typeof x === "object" && lleno(x.nombre)).map(x => ({
      nombre: t(x.nombre), tipo: TIPOS_IND[x.tipo] ? x.tipo : "", numerador: t(x.numerador), denominador: t(x.denominador),
      sentido: x.sentido === "menos" ? "menos" : "mas", estandar: t(x.estandar).replace(/[^\d.,]/g, ""),
      fuente: [...(Array.isArray(x.fuentes) ? x.fuentes.map(t) : []), t(x.fuenteOtra)].filter(lleno).join(", "),
      exclusiones: [t(x.poblacion), lleno(x.exclusiones) ? "Excluye: " + t(x.exclusiones) : ""].filter(lleno).join(". "),
      cumpleSi: t(x.terminos), noAplicaSi: "", _sub: t(x.subproceso), _hallazgo: t(x.hallazgo)
    }));
  }

  // ---------- Hitos de la auditoría (mejora A) ----------
  // La teoría los exige y suelen olvidarse: aprobar, comunicar antes, validar el borrador y devolver resultados
  const HITOS = [
    { k: "aprobacion", pdca: "P", nom: "Aprobación por la Dirección", cuando: "Antes de empezar", help: "La Dirección o el mando responsable aprueba la auditoría y garantiza los recursos (tiempo, personas, acceso a la información)." },
    { k: "comunicacion", pdca: "P", nom: "Comunicación a los auditados", cuando: "Antes de recoger datos", help: "Los profesionales del área conocen con antelación qué se va a auditar, con qué criterios y cuándo. Reduce la percepción punitiva y mejora la colaboración." },
    { k: "validacion", pdca: "V", nom: "Validación del borrador del informe", cuando: "Antes de cerrar el informe", help: "Se revisa el borrador con los responsables del área auditada para confirmar los hechos y aclarar malentendidos antes de la versión definitiva." },
    { k: "devolucion", pdca: "V", nom: "Reunión de devolución de resultados", cuando: "Al entregar el informe", help: "Se presentan los resultados al equipo y a la Dirección, se resuelven dudas y se acuerda el plan de mejora." }
  ];
  const nuevoHito = () => ({ hecho: false, fecha: "", nota: "" });
  const nuevosHitos = () => HITOS.reduce((o, h) => (o[h.k] = nuevoHito(), o), {});

  // ---------- Control documental (mejora F) ----------
  const nuevaPersona = () => ({ nombre: "", cargo: "" });
  const nuevoControl = () => ({ elaborado: [nuevaPersona()], revisado: [nuevaPersona()], aprobado: [nuevaPersona()], historial: [{ edicion: "00", fecha: "", cambio: "Documento inicial" }] });

  // ---------- Plan Anual de Auditorías ----------
  const FRECUENCIAS = {
    trimestral: { nom: "Trimestral", rondas: 4, cada: 3 },
    semestral: { nom: "Semestral", rondas: 2, cada: 6 },
    anual: { nom: "Anual", rondas: 1, cada: 12 },
    puntual: { nom: "Puntual (una vez)", rondas: 1, cada: 12 }
  };
  const TIPOS_ENTRADA = {
    interna: { nom: "Auditoría interna" },
    externa: { nom: "Auditoría externa" },
    seguimiento: { nom: "Auditoría de seguimiento" }
  };
  const TIPOS_CRITERIO = { procedimental: "Procedimental (protocolos, POE)", regulatorio: "Regulatorio (acreditación, ISO)", normativo: "Normativo (leyes)", contractual: "Contractual (acuerdos)" };
  const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const MESES_LARGO = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

  function nuevoPlan(id, fecha) {
    return {
      id, anio: "", ambito: "", responsable: "", objetivo: "", introduccion: "", notas: "",
      capacidad: "2", bloqueados: [], entradas: [],
      roles: { coordinacion: "", equipo: "", revision: "", direccion: "", auditados: "" },
      aprobacion: { fecha: "", comunicado: false, fechaComunicacion: "", via: "" },
      control: nuevoControl(), creado: fecha, modificado: fecha
    };
  }
  function nuevaEntrada(id) {
    return { id, titulo: "", mapaId: "", riesgoIds: [], hallazgos: "", alcance: "", criterios: "", tiposCriterio: [], documentos: "", frecuencia: "", responsables: "", recursos: "", horas: "", meses: [], tipo: "interna", observaciones: "", auditoriaId: "" };
  }

  const riesgosDeEntrada = (e, mapas) => { const m = mapas.find(x => x.id === e.mapaId); return m ? m.riesgos.filter(r => e.riesgoIds.includes(r.id)) : []; };
  // Lista de hallazgos de una entrada: los del mapa y los escritos a mano (uno por línea)
  const hallazgosDeEntrada = (e, mapas) => [...riesgosDeEntrada(e, mapas).map(r => r.fallo), ...String(e.hallazgos || "").split("\n").map(s => s.trim()).filter(Boolean)];
  function prioridadEntrada(e, mapas) {
    const rs = riesgosDeEntrada(e, mapas);
    return { ipr: rs.reduce((a, r) => Math.max(a, iprDe(r) || 0), 0), g: rs.reduce((a, r) => Math.max(a, entero1a10(r.g) || 0), 0) };
  }
  // Más riesgo, más frecuencia: IPR ≥ 250 trimestral; ≥ 150 semestral; si no, anual (gravedad 9–10: al menos semestral)
  function frecuenciaSugerida(e, mapas) {
    const { ipr: v, g } = prioridadEntrada(e, mapas);
    if (!v) return null;
    let k = v >= 250 ? "trimestral" : v >= 150 ? "semestral" : "anual";
    let motivo = `IPR máximo ${v}`;
    if (k === "anual" && g >= 9) { k = "semestral"; motivo += `, gravedad ${g}`; }
    return { k, motivo };
  }
  const ORDEN_FREC = ["puntual", "anual", "semestral", "trimestral"];

  // Una ronda = meses seguidos con actividad (Ene–Feb cuenta como una sola ronda)
  function rondas(meses) {
    const s = [...new Set(meses)].filter(m => m >= 1 && m <= 12).sort((a, b) => a - b);
    return s.filter((m, i) => i === 0 || s[i - 1] !== m - 1).length;
  }
  function cargaMensual(plan) {
    const c = Array(12).fill(0), h = Array(12).fill(0);
    plan.entradas.forEach(e => e.meses.forEach(m => { if (m >= 1 && m <= 12) { c[m - 1]++; const n = num(e.horas); if (Number.isFinite(n)) h[m - 1] += n; } }));
    return { n: c, horas: h };
  }
  const capacidadDe = plan => { const n = num(plan.capacidad); return Number.isInteger(n) && n > 0 ? n : 2; };
  const textoMeses = meses => {
    const s = [...new Set(meses)].sort((a, b) => a - b), tramos = [];
    s.forEach(m => { const t = tramos[tramos.length - 1]; if (t && t[1] === m - 1) t[1] = m; else tramos.push([m, m]); });
    return tramos.map(([a, b]) => a === b ? MESES_LARGO[a - 1] : `${MESES_LARGO[a - 1]}–${MESES_LARGO[b - 1]}`).join(", ").replace(/^./, c => c.toUpperCase());
  };

  // Reparto automático: de más a menos prioritaria, cada auditoría se coloca donde menos carga el calendario,
  // respetando los meses de alta presión. Solo toca las que no tienen meses (o todas, con «todas»).
  function repartir(plan, mapas, todas) {
    const bloq = new Set(plan.bloqueados), carga = Array(13).fill(0), res = {};
    const fijas = plan.entradas.filter(e => !todas && e.meses.length);
    fijas.forEach(e => e.meses.forEach(m => { carga[m]++; }));
    const pendientes = plan.entradas.filter(e => todas || !e.meses.length)
      .map(e => ({ e, p: prioridadEntrada(e, mapas).ipr }))
      .sort((a, b) => b.p - a.p);
    const libre = m => { for (let k = 0; k < 12; k++) { const x = ((m - 1 + k) % 12) + 1; if (!bloq.has(x)) return x; } return m; };
    pendientes.forEach(({ e }) => {
      const f = FRECUENCIAS[e.frecuencia] || FRECUENCIAS.anual;
      let mejor = null;
      for (let s = 1; s <= f.cada; s++) {
        const meses = [...new Set(Array.from({ length: f.rondas }, (_, i) => libre(s + i * f.cada)))];
        const max = Math.max(...meses.map(m => carga[m] + 1)), suma = meses.reduce((a, m) => a + carga[m], 0);
        const coste = max * 100 + suma;
        if (!mejor || coste < mejor.coste) mejor = { coste, meses };
      }
      mejor.meses.forEach(m => { carga[m]++; });
      res[e.id] = mejor.meses.sort((a, b) => a - b);
    });
    return res;
  }

  function avisosPlan(plan, mapas) {
    const A = [], E = plan.entradas, nombre = e => `«${corto(e.titulo || "auditoría sin nombre", 50)}»`;
    if (!E.length) { A.push({ nivel: "nota", paso: 1, texto: "Añade las auditorías del año: importa los hallazgos clave de un Mapa de Riesgos o escríbelas a mano." }); return A; }
    E.filter(e => !lleno(e.titulo)).length && A.push({ nivel: "nota", paso: 1, texto: "Hay auditorías sin nombre: pon a cada una el proceso o subproceso que revisa." });
    E.filter(e => !hallazgosDeEntrada(e, mapas).length && e.tipo !== "externa").forEach(e => A.push({ nivel: "nota", paso: 1, texto: `${nombre(e)} no tiene hallazgos: ¿qué riesgo o qué problema la justifica?` }));
    const sinAlc = E.filter(e => !lleno(e.alcance)).length, sinCri = E.filter(e => !lleno(e.criterios)).length;
    if (sinAlc) A.push({ nivel: "nota", paso: 2, texto: `${sinAlc === 1 ? "Una auditoría no tiene" : sinAlc + " auditorías no tienen"} alcance: qué se revisa, de qué periodo y hasta dónde.` });
    if (sinCri) A.push({ nivel: "nota", paso: 2, texto: `${sinCri === 1 ? "Una auditoría no tiene" : sinCri + " auditorías no tienen"} criterios de referencia: sin criterios no se puede decir si algo cumple.` });
    E.forEach(e => {
      if (!lleno(e.frecuencia)) return;
      const s = frecuenciaSugerida(e, mapas);
      if (s && ORDEN_FREC.indexOf(s.k) - ORDEN_FREC.indexOf(e.frecuencia) >= 2) A.push({ nivel: "warn", paso: 3, texto: `${nombre(e)} tiene ${s.motivo} y se audita con frecuencia ${FRECUENCIAS[e.frecuencia].nom.toLowerCase()}. Lo proporcional al riesgo sería ${FRECUENCIAS[s.k].nom.toLowerCase()}.` });
    });
    const sinFrec = E.filter(e => !lleno(e.frecuencia)).length, sinResp = E.filter(e => !lleno(e.responsables)).length;
    if (sinFrec) A.push({ nivel: "nota", paso: 3, texto: `${sinFrec === 1 ? "Una auditoría no tiene" : sinFrec + " auditorías no tienen"} frecuencia.` });
    if (sinResp) A.push({ nivel: "nota", paso: 3, texto: `${sinResp === 1 ? "Una auditoría no tiene" : sinResp + " auditorías no tienen"} responsable. Si no hay un responsable con nombre o cargo, nadie la hará.` });
    const sinMes = E.filter(e => !e.meses.length);
    if (sinMes.length) A.push({ nivel: "warn", paso: 4, texto: `${sinMes.length === 1 ? nombre(sinMes[0]) + " no tiene" : sinMes.length + " auditorías no tienen"} meses en el cronograma. Pulsa «Repartir automáticamente» o marca los meses a mano.` });
    E.filter(e => e.meses.length && FRECUENCIAS[e.frecuencia]).forEach(e => {
      const r = rondas(e.meses), f = FRECUENCIAS[e.frecuencia];
      if (r < f.rondas) A.push({ nivel: "warn", paso: 4, texto: `${nombre(e)} es ${f.nom.toLowerCase()} (${f.rondas} ${f.rondas === 1 ? "vez" : "veces"} al año) y en el cronograma sale ${r === 1 ? "una vez" : r + " veces"}.` });
      else if (r > f.rondas && e.frecuencia !== "puntual") A.push({ nivel: "nota", paso: 4, texto: `${nombre(e)} sale ${r} veces en el cronograma, más de lo que pide su frecuencia (${f.nom.toLowerCase()}).` });
    });
    const bloq = new Set(plan.bloqueados);
    E.forEach(e => { const m = e.meses.filter(x => bloq.has(x)); if (m.length) A.push({ nivel: "warn", paso: 4, texto: `${nombre(e)} cae en ${m.length === 1 ? "un mes" : "meses"} de alta presión (${m.map(x => MESES_LARGO[x - 1]).join(", ")}).` }); });
    const cap = capacidadDe(plan), car = cargaMensual(plan).n;
    const altos = car.map((n, i) => [n, i]).filter(([n]) => n > cap);
    if (altos.length) A.push({ nivel: "warn", paso: 4, texto: `Más de ${cap} ${cap === 1 ? "auditoría" : "auditorías"} a la vez en ${altos.map(([n, i]) => `${MESES_LARGO[i]} (${n})`).join(", ")}. Escalona para no saturar al equipo auditor.` });
    const trim = [0, 1, 2, 3].map(t => car.slice(t * 3, t * 3 + 3).reduce((a, b) => a + b, 0)), tot = trim.reduce((a, b) => a + b, 0);
    if (tot >= 4 && trim.some(x => x === 0) && Math.max(...trim) > tot / 2) A.push({ nivel: "nota", paso: 4, texto: "La carga está concentrada en una parte del año. Repartirla mantiene la dinámica de mejora todo el año." });
    // Mejora E: dejar hueco para comprobar que las mejoras funcionan
    if (!E.some(e => e.tipo === "seguimiento") && E.every(e => rondas(e.meses) <= 1) && E.some(e => prioridadEntrada(e, mapas).ipr >= 200))
      A.push({ nivel: "nota", paso: 4, texto: "Ninguna auditoría se repite ni hay auditorías de seguimiento. Reserva algún hueco para comprobar si las mejoras de los riesgos más altos han funcionado." });
    return A;
  }

  // Avance del plan por pasos (para el asistente)
  function progresoPlan(plan) {
    const E = plan.entradas, todas = f => E.length > 0 && E.every(f);
    return {
      1: E.length > 0 && lleno(plan.anio) && lleno(plan.ambito),
      2: todas(e => lleno(e.alcance) && lleno(e.criterios)),
      3: todas(e => lleno(e.frecuencia) && lleno(e.responsables)),
      4: todas(e => e.meses.length > 0),
      5: lleno(plan.responsable) && plan.control.aprobado.some(p => lleno(p.nombre) || lleno(p.cargo)) && lleno(plan.aprobacion.fecha)
    };
  }

  // Entradas a partir de los hallazgos clave de un mapa: una por subproceso (como un cronograma real) o una por hallazgo
  function entradasDesdeMapa(mapa, modo, genId) {
    const claves = ordenarRiesgos(mapa.riesgos.filter(r => r.clave));
    const grupos = [];
    if (modo === "hallazgo") claves.forEach(r => grupos.push({ titulo: (lleno(r.subproceso) ? r.subproceso + " · " : "") + r.fallo, rs: [r] }));
    else claves.forEach(r => { const k = lleno(r.subproceso) ? r.subproceso.trim() : "Sin subproceso"; let g = grupos.find(x => x.titulo === k); if (!g) grupos.push(g = { titulo: k, rs: [] }); g.rs.push(r); });
    return grupos.map(g => {
      const e = Object.assign(nuevaEntrada(genId()), { titulo: g.titulo, mapaId: mapa.id, riesgoIds: g.rs.map(r => r.id) });
      const s = frecuenciaSugerida(e, [mapa]); if (s) e.frecuencia = s.k;
      return e;
    });
  }

  // «el Servicio de Urgencias» → «Servicio de Urgencias» (para títulos y cabeceras)
  const sinArticulo = v => { const t = String(v || "").trim().replace(/^(el|la|los|las)\s+/i, ""); return t.charAt(0).toUpperCase() + t.slice(1); };
  // «2026-01-12» → «12/01/2026» (los campos de fecha guardan el formato del calendario del navegador)
  const fmtFecha = v => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(v || "").trim()); return m ? `${m[3]}/${m[2]}/${m[1]}` : String(v || ""); };
  // ---------- Documentos (bloques que se convierten en Word con docx.js y en HTML para imprimir/PDF) ----------
  // Bloques: {t:"portada"}, {t:"h1"|"h2", texto}, {t:"p", texto|runs}, {t:"lista", items}, {t:"tabla", cab, filas, anchos, fuente}, {t:"salto"}
  const celdaPersona = ps => ps.filter(p => lleno(p.nombre) || lleno(p.cargo));
  function bloquesControl(control) {
    const B = [], filas = [];
    [["Elaborado", control.elaborado], ["Revisado", control.revisado], ["Aprobado", control.aprobado]].forEach(([k, ps]) => {
      const v = celdaPersona(ps);
      (v.length ? v : [nuevaPersona()]).forEach((p, i) => filas.push([{ texto: i === 0 ? k : "", negrita: true, fondo: "E6F3F7" }, p.nombre || " ", p.cargo || " "]));
    });
    B.push({ t: "tabla", cab: ["", "Nombre", "Cargo"], filas, anchos: [18, 41, 41] });
    B.push({ t: "h2", texto: "Histórico de revisiones" });
    B.push({ t: "tabla", cab: ["Edición", "Fecha", "Cambio"], filas: control.historial.filter(h => lleno(h.edicion) || lleno(h.cambio)).map(h => [h.edicion, fmtFecha(h.fecha), h.cambio]), anchos: [14, 22, 64] });
    return B;
  }
  const FONDO_TIPO = { interna: "99F6E4", externa: "BFDBFE", seguimiento: "FED7AA" };
  function documentoPlan(plan, mapas, fecha) {
    const anio = lleno(plan.anio) ? plan.anio : "", amb = lleno(plan.ambito) ? plan.ambito : "";
    const usados = mapas.filter(m => plan.entradas.some(e => e.mapaId === m.id));
    const B = [{ t: "portada", titulo: "Plan Anual de Auditorías" + (anio ? " " + anio : ""), sub: sinArticulo(amb), extra: [lleno(plan.responsable) ? "Responsable del plan: " + plan.responsable : "", "Fecha: " + fecha].filter(Boolean) }];
    B.push(...bloquesControl(plan.control), { t: "salto" });
    B.push({ t: "h1", texto: "1. Introducción" });
    B.push({ t: "p", texto: lleno(plan.introduccion) ? plan.introduccion : `Este Plan Anual de Auditorías recoge, de forma ordenada, las auditorías que se realizarán${amb ? " en " + amb : ""}${anio ? " durante " + anio : ""}: qué procesos se auditan, con qué alcance y criterios, con qué frecuencia, quién es responsable y en qué meses. ${usados.length ? `Se ha elaborado a partir ${usados.length === 1 ? "del Mapa de Riesgos «" + usados[0].nombre + "»" : "de los Mapas de Riesgos " + usados.map(m => "«" + m.nombre + "»").join(", ")}, priorizando los procesos con mayor Índice de Prioridad de Riesgo (IPR). ` : ""}El plan se integra en el ciclo de mejora continua (Planificar, Hacer, Verificar, Actuar): los resultados de cada auditoría alimentarán los planes de mejora, las auditorías de seguimiento y la actualización del propio Mapa de Riesgos.` });
    B.push({ t: "h1", texto: "2. Objetivo" });
    B.push({ t: "p", texto: lleno(plan.objetivo) ? plan.objetivo : `Garantizar que los procesos más críticos para la seguridad del paciente${amb ? " " + deArt(amb) : ""} se revisan de forma sistemática, con criterios claros y en el momento oportuno, para detectar desviaciones y orientar la mejora continua.` });
    B.push({ t: "h1", texto: "3. Criterios de priorización" });
    B.push({ t: "lista", items: ["Nivel de riesgo: Índice de Prioridad de Riesgo (IPR = gravedad × ocurrencia × detección) del Mapa de Riesgos.", "Impacto en la seguridad del paciente: los fallos muy graves se atienden aunque su IPR no sea de los primeros.", "Resultados de auditorías previas y necesidad de auditorías de seguimiento.", "Exigencias de los estándares de acreditación y de la normativa aplicable.", "Recursos disponibles: tiempo, personas y medios del equipo auditor."] });
    const conIpr = plan.entradas.map(e => ({ e, p: prioridadEntrada(e, mapas) })).filter(x => x.p.ipr);
    if (conIpr.length) B.push({ t: "tabla", cab: ["Auditoría", "IPR máximo", "Frecuencia"], filas: conIpr.sort((a, b) => b.p.ipr - a.p.ipr).map(({ e, p }) => [e.titulo, { texto: String(p.ipr), centro: true }, FRECUENCIAS[e.frecuencia] ? FRECUENCIAS[e.frecuencia].nom : ""]), anchos: [60, 18, 22] });
    B.push({ t: "h1", texto: "4. Auditorías programadas" });
    B.push({ t: "tabla", cab: ["Nº", "Auditoría", "Frecuencia", "Responsables", "Meses"], filas: plan.entradas.map((e, i) => [{ texto: String(i + 1), centro: true }, e.titulo, FRECUENCIAS[e.frecuencia] ? FRECUENCIAS[e.frecuencia].nom : "", e.responsables, textoMeses(e.meses)]), anchos: [6, 34, 14, 26, 20] });
    plan.entradas.forEach((e, i) => {
      B.push({ t: "h2", texto: `4.${i + 1}. ${e.titulo || "Auditoría sin nombre"}` });
      const tc = e.tiposCriterio.map(k => TIPOS_CRITERIO[k]).filter(Boolean).join("; ");
      const fila = (k, v) => lleno(v) ? [[{ texto: k, negrita: true, fondo: "F1F5F9" }, v]] : [];
      B.push({ t: "tabla", sinCab: true, anchos: [26, 74], filas: [
        ...fila("Tipo", TIPOS_ENTRADA[e.tipo].nom),
        ...fila("Hallazgos o riesgos", hallazgosDeEntrada(e, mapas).map(h => "• " + h).join("\n")),
        ...fila("Alcance", e.alcance),
        ...fila("Criterios de referencia", [e.criterios, tc ? "Tipo: " + tc : ""].filter(lleno).join("\n")),
        ...fila("Documentos y fuentes", e.documentos),
        ...fila("Frecuencia", FRECUENCIAS[e.frecuencia] ? FRECUENCIAS[e.frecuencia].nom : ""),
        ...fila("Responsables", e.responsables),
        ...fila("Recursos", e.recursos),
        ...fila("Horas estimadas por ronda", e.horas),
        ...fila("Meses", textoMeses(e.meses)),
        ...fila("Observaciones", e.observaciones)
      ] });
    });
    B.push({ t: "h1", texto: "5. Cronograma" });
    const car = cargaMensual(plan).n, bloq = new Set(plan.bloqueados);
    B.push({ t: "tabla", fuente: 8, cab: ["Auditoría", ...MESES], anchos: [28, ...Array(12).fill(6)], filas: [
      ...plan.entradas.map(e => [e.titulo, ...MESES.map((_, m) => e.meses.includes(m + 1) ? { texto: "■", centro: true, fondo: FONDO_TIPO[e.tipo] } : { texto: "", fondo: bloq.has(m + 1) ? "E5E7EB" : "" })]),
      [{ texto: "Auditorías en el mes", negrita: true }, ...car.map(n => ({ texto: n ? String(n) : "", centro: true, negrita: true, fondo: n > capacidadDe(plan) ? "FECDD3" : "" }))]
    ] });
    B.push({ t: "p", texto: `Leyenda: verde, auditoría interna; azul, externa; naranja, seguimiento${plan.bloqueados.length ? "; gris, meses de alta presión asistencial (" + plan.bloqueados.slice().sort((a, b) => a - b).map(m => MESES_LARGO[m - 1]).join(", ") + ")" : ""}. Capacidad prevista del equipo auditor: ${capacidadDe(plan)} ${capacidadDe(plan) === 1 ? "auditoría" : "auditorías"} al mes.`, estilo: "nota" });
    B.push({ t: "h1", texto: "6. Roles y responsabilidades" });
    const R = plan.roles;
    B.push({ t: "tabla", cab: ["Rol", "Quién y qué hace"], anchos: [30, 70], filas: [
      ["Coordinación del plan", R.coordinacion || plan.responsable], ["Equipo auditor", R.equipo], ["Revisión de las acciones de mejora", R.revision], ["Dirección", R.direccion], ["Profesionales auditados", R.auditados]
    ].filter(f => lleno(f[1])).map(([a, b]) => [{ texto: a, negrita: true }, b]) });
    B.push({ t: "h1", texto: "7. Aprobación y difusión" });
    const ap = plan.aprobacion, quien = celdaPersona(plan.control.aprobado).map(p => [p.nombre, p.cargo].filter(lleno).join(", ")).join("; ");
    B.push({ t: "p", texto: `${lleno(ap.fecha) ? `Plan aprobado el ${fmtFecha(ap.fecha)}` : "Plan pendiente de aprobación"}${quien ? " por " + quien : ""}. ${ap.comunicado ? `Comunicado a los profesionales implicados${lleno(ap.fechaComunicacion) ? " el " + fmtFecha(ap.fechaComunicacion) : ""}${lleno(ap.via) ? " (" + ap.via + ")" : ""}.` : "Pendiente de comunicar a los profesionales implicados antes de iniciar las auditorías."} El plan es un documento vivo: se revisará si cambian los riesgos, los recursos o los resultados de las auditorías.` });
    if (lleno(plan.notas)) { B.push({ t: "h2", texto: "Notas" }); B.push({ t: "p", texto: plan.notas }); }
    return { titulo: "Plan Anual de Auditorías" + (anio ? " " + anio : ""), bloques: B };
  }
  function documentoMapa(mapa, fecha) {
    const P = puestos(mapa.riesgos), res = resumenMapa(mapa);
    const B = [{ t: "portada", titulo: "Mapa de Riesgos", sub: mapa.nombre, extra: [mapa.unidad, mapa.proceso, lleno(mapa.fecha) ? "Fecha del análisis: " + mapa.fecha : "", "Fecha: " + fecha].filter(lleno) }];
    if (lleno(mapa.equipo)) B.push({ t: "p", texto: "Equipo: " + mapa.equipo });
    if (lleno(mapa.notas)) B.push({ t: "p", texto: mapa.notas });
    B.push({ t: "p", texto: `${res.n} riesgos · IPR máximo ${res.maxIPR || "—"} · ${res.claves} hallazgos clave. IPR = gravedad × ocurrencia × detección (de 1 a 1.000).`, estilo: "nota" });
    B.push({ t: "h1", texto: "Riesgos priorizados" });
    const fondo = { muyalto: "FFE4E6", alto: "FFEDD5", medio: "FEF3C7", bajo: "DCFCE7" };
    B.push({ t: "tabla", fuente: 8, cab: ["#", "Subproceso", "Fallo", "Efecto", "Causa", "G", "O", "D", "IPR", "★"], anchos: [5, 14, 22, 19, 19, 4, 4, 4, 6, 3], filas: ordenarRiesgos(mapa.riesgos).map(r => { const v = iprDe(r), n = nivelIPR(v); return [{ texto: String(P[r.id] || ""), centro: true }, r.subproceso, { texto: r.fallo, negrita: true }, r.efecto, r.causa, { texto: r.g, centro: true }, { texto: r.o, centro: true }, { texto: r.d, centro: true }, { texto: v ? String(v) : "", centro: true, negrita: true, fondo: n ? fondo[n.k] : "" }, { texto: r.clave ? "★" : "", centro: true }]; }) });
    const claves = ordenarRiesgos(mapa.riesgos.filter(r => r.clave));
    if (claves.length) {
      B.push({ t: "h1", texto: "Hallazgos clave para auditar" });
      B.push({ t: "tabla", fuente: 8, cab: ["Subproceso", "Riesgo detectado", "IPR", "Acción de mejora propuesta", "Evidencia esperada", "Motivo de elección"], anchos: [14, 20, 6, 20, 20, 20], filas: claves.map(r => [r.subproceso, { texto: r.fallo, negrita: true }, { texto: String(iprDe(r) || ""), centro: true }, r.accion, r.evidencia, r.motivo]) });
    }
    return { titulo: "Mapa de Riesgos" + (lleno(mapa.nombre) ? " · " + mapa.nombre : ""), bloques: B };
  }

  // Plan específico de una auditoría (estructura del modelo de auditoría interna)
  const lineas = t => String(t || "").split("\n").map(x => x.trim()).filter(Boolean);
  const textoMuestraCorto = c => { const m = c.muestra, r = calcMuestra(c); if (!lleno(m.objetivo)) return ""; if (m.objetivo === "decidir" && Number.isFinite(r.c)) return `LQAS: n = ${r.n}, c = ${r.c} (umbral ${m.umbral} %, β ${m.beta} %)`; return r.texto; };
  function documentoPlanEspecifico(aud, mapa, plan, fecha) {
    const C = aud.criterios, D = aud.diseno, subs = [...new Set(C.map(c => c.subproceso).filter(lleno))];
    const B = [{ t: "portada", titulo: aud.titulo || "Plan de auditoría", sub: "Plan específico de auditoría", extra: [aud.unidad, aud.centro, lleno(D.periodo) ? "Periodo auditado: " + D.periodo : "", "Fecha: " + fecha].filter(lleno) }];
    B.push(...bloquesControl(aud.control), { t: "salto" });
    B.push({ t: "h1", texto: "1. Introducción" });
    const o = ORIGENES[aud.origen.tipo];
    B.push({ t: "p", texto: lleno(aud.introduccion) ? aud.introduccion : `Este documento recoge el diseño de la auditoría ${aud.tipo === "externa" ? "externa" : "interna"} ${lleno(aud.proceso) ? deArt(aud.proceso) : ""}${lleno(aud.unidad) ? " en " + aud.unidad : ""}.${o ? " Su origen: " + o.nom.toLowerCase() + "." : ""}` });
    if (lleno(aud.origen.detalle)) B.push({ t: "p", texto: aud.origen.detalle });
    if (plan) { const en = plan.entradas.find(e => e.id === aud.entradaId); B.push({ t: "p", texto: `Forma parte del Plan Anual de Auditorías ${plan.anio}${en && en.meses.length ? " (" + textoMeses(en.meses).toLowerCase() + ")" : ""}.` }); }
    B.push({ t: "h1", texto: "2. Objetivos" });
    B.push({ t: "p", runs: [{ texto: "Objetivo general. ", negrita: true }, { texto: aud.objetivoGeneral || "—" }] });
    if (lineas(aud.objetivosEsp).length) { B.push({ t: "p", runs: [{ texto: "Objetivos específicos:", negrita: true }] }); B.push({ t: "lista", items: lineas(aud.objetivosEsp) }); }
    B.push({ t: "h1", texto: "3. Alcance" });
    if (lleno(aud.alcance)) B.push({ t: "p", texto: aud.alcance });
    if (subs.length) { B.push({ t: "p", texto: `Subprocesos auditados (${subs.length}):` }); B.push({ t: "lista", items: subs }); }
    B.push({ t: "h1", texto: "4. Criterios e indicadores" });
    B.push({ t: "h2", texto: "4.1. Criterios de auditoría" });
    B.push({ t: "tabla", cab: ["Nº", "Subproceso", "Criterio de auditoría"], anchos: [6, 28, 66], filas: C.map((c, i) => [{ texto: String(i + 1), centro: true }, c.subproceso, c.criterio]) });
    B.push({ t: "h2", texto: "4.2. Indicadores de evaluación" });
    B.push({ t: "tabla", fuente: 8, cab: ["Nº", "Hallazgo", "Indicador", "Tipo", "Fórmula", "Estándar", "Fuente de datos"], anchos: [4, 16, 22, 9, 22, 9, 18], filas: C.map((c, i) => [{ texto: String(i + 1), centro: true }, c.hallazgo, { texto: c.ind.nombre, negrita: true }, TIPOS_IND[c.ind.tipo] ? TIPOS_IND[c.ind.tipo].nom : "", formulaInd(c.ind), { texto: textoEstandar(c.ind), centro: true }, c.ind.fuente]) });
    B.push({ t: "h2", texto: "4.3. Cuándo se considera que cumple" });
    B.push({ t: "tabla", fuente: 8, cab: ["Nº", "Cumple si…", "No aplica si…", "Población y exclusiones"], anchos: [4, 42, 27, 27], filas: C.map((c, i) => [{ texto: String(i + 1), centro: true }, c.ind.cumpleSi, c.ind.noAplicaSi, c.ind.exclusiones]) });
    B.push({ t: "h1", texto: "5. Metodología" });
    const instr = [...new Set(C.flatMap(c => c.evid.instrumentos))].map(k => INSTRUMENTOS[k].nom).join(", ");
    const fila = (k, v) => lleno(v) ? [[{ texto: k, negrita: true, fondo: "F1F5F9" }, v]] : [];
    B.push({ t: "tabla", sinCab: true, anchos: [28, 72], filas: [...fila("Tipo de auditoría", `${TIPOS_AUD[aud.tipo]}, ${OBJETOS_AUD[aud.objeto].nom.toLowerCase()}`), ...fila("Población", D.poblacion), ...fila("Periodo auditado", D.periodo), ...fila("Fuentes de información", D.fuentes), ...fila("Instrumentos de recogida", instr ? instr + ". Respuesta cerrada: Sí / No / No aplica." : ""), ...fila("Método", D.metodologia)] });
    B.push({ t: "h2", texto: "5.1. Muestra y selección de casos" });
    B.push({ t: "tabla", fuente: 8, cab: ["Nº", "Unidad de estudio", "Universo (N)", "Cómo se calcula", "Casos y regla", "Selección"], anchos: [4, 20, 10, 14, 32, 20], filas: C.map((c, i) => [{ texto: String(i + 1), centro: true }, c.muestra.unidad, { texto: c.muestra.N, centro: true }, OBJETIVOS_MUESTRA[c.muestra.objetivo] ? OBJETIVOS_MUESTRA[c.muestra.objetivo].nom : "", calcMuestra(c).texto, METODOS_SEL[c.muestra.metodo] ? METODOS_SEL[c.muestra.metodo].nom : c.muestra.objetivo === "todos" ? "Todos" : ""]) });
    if (C.some(c => c.muestra.objetivo === "decidir")) B.push({ t: "p", estilo: "nota", texto: "LQAS (muestreo para la aceptación de lotes): con n casos elegidos al azar, si al menos c cumplen el criterio, no hay evidencia de problema; si cumplen menos, hay que investigar. Decide, no estima el porcentaje. Tablas de Lemeshow, α = 5 %." });
    B.push({ t: "h2", texto: "5.2. Evidencias e instrumentos" });
    B.push({ t: "tabla", fuente: 8, cab: ["Nº", "Tipos de evidencia", "Triangulación", "Principios", "Instrumentos"], anchos: [4, 18, 38, 20, 20], filas: C.map((c, i) => [{ texto: String(i + 1), centro: true }, c.evid.tipos.map(k => EVIDENCIAS[k].nom).join(" + "), c.evid.triangulacion, c.evid.principios.map(k => PRINCIPIOS[k]).join(", "), c.evid.instrumentos.map(k => INSTRUMENTOS[k].nom).join(" + ")]) });
    B.push({ t: "h1", texto: "6. Equipo auditor" });
    if (lineas(D.equipo).length) B.push({ t: "lista", items: lineas(D.equipo) });
    B.push({ t: "h1", texto: "7. Recursos" });
    if (lineas(D.recursos).length) B.push({ t: "lista", items: lineas(D.recursos) });
    B.push({ t: "h1", texto: "8. Hitos" });
    B.push({ t: "tabla", cab: ["Hito", "Cuándo", "Fecha", "Estado"], anchos: [36, 26, 16, 22], filas: HITOS.map(h => { const v = aud.hitos[h.k]; return [h.nom, h.cuando, fmtFecha(v.fecha), { texto: v.hecho ? "Hecho" : "Pendiente", fondo: v.hecho ? "DCFCE7" : "" }]; }) });
    const pil = C.map((c, i) => ({ i, k: concordancia(c.piloto.pares) })).filter(x => x.k.n);
    if (pil.length) {
      B.push({ t: "h1", texto: "9. Pilotaje de la hoja de recogida" });
      B.push({ t: "p", texto: "Dos auditores aplicaron la hoja de recogida a los mismos casos antes de la recogida real, para comprobar que los criterios están bien definidos." });
      B.push({ t: "tabla", cab: ["Criterio", "Casos", "Acuerdo", "Kappa", "Valoración"], anchos: [12, 12, 14, 12, 50], filas: pil.map(({ i, k }) => [{ texto: String(i + 1), centro: true }, { texto: String(k.n), centro: true }, { texto: nfmt(k.pct, 0) + " %", centro: true }, { texto: nfmt(k.kappa, 2), centro: true }, k.texto]) });
    }
    return { titulo: "Plan de auditoría · " + (aud.titulo || ""), bloques: B };
  }

  // Hoja de recogida imprimible: una tabla por criterio con tantas filas como casos
  function documentoHoja(aud, fecha) {
    const D = aud.diseno, B = [{ t: "portada", titulo: "Hoja de recogida de datos", sub: aud.titulo, extra: [lleno(D.periodo) ? "Periodo auditado: " + D.periodo : "", "Auditor/a: ______________________________     Fecha: ____ / ____ / ______"].filter(Boolean) }];
    B.push({ t: "p", estilo: "nota", texto: "Protección de datos: anota solo el código del caso (HC-01, HC-02…), nunca nombres ni números de historia. Guarda la correspondencia, si hace falta, en un lugar autorizado. Marca Sí si cumple el criterio, No si no lo cumple y NA si no aplica." });
    aud.criterios.forEach((c, i) => {
      if (i) B.push({ t: "salto" });
      B.push({ t: "h1", texto: `Criterio ${i + 1}${lleno(c.subproceso) ? " · " + c.subproceso : ""}` });
      const r = calcMuestra(c), f = (k, v) => lleno(v) ? [[{ texto: k, negrita: true, fondo: "F1F5F9" }, v]] : [];
      B.push({ t: "tabla", sinCab: true, fuente: 9, anchos: [22, 78], filas: [...f("Criterio", c.criterio), ...f("Indicador", c.ind.nombre + (textoEstandar(c.ind) ? " · estándar " + textoEstandar(c.ind) : "")), ...f("Cumple si…", c.ind.cumpleSi), ...f("No aplica si…", c.ind.noAplicaSi), ...f("Dónde mirar", c.ind.fuente), ...f("Muestra", r.texto + (METODOS_SEL[c.muestra.metodo] ? ". Selección: " + METODOS_SEL[c.muestra.metodo].nom.toLowerCase() : ""))] });
      const n = Number.isFinite(r.n) && r.n > 0 ? Math.min(r.n, 120) : 20, sorteo = c.muestra.sorteo;
      B.push({ t: "tabla", fuente: 9, cab: ["Nº", "Nº listado", "Código del caso", "Sí", "No", "NA", "Observaciones"], anchos: [6, 10, 18, 6, 6, 6, 48], filas: [
        ...Array.from({ length: n }, (_, k) => [{ texto: String(k + 1), centro: true }, { texto: sorteo[k] ? String(sorteo[k]) : "", centro: true }, "", "", "", "", ""]),
        [{ texto: "Total", negrita: true }, "", "", "", "", "", ""]
      ] });
      if (Number.isFinite(r.c)) B.push({ t: "p", runs: [{ texto: "Decisión LQAS: ", negrita: true }, { texto: `si hay ${r.c} o más «Sí» entre los ${r.n} casos, se acepta (no hay evidencia de problema); si hay ${r.c - 1} o menos, hay que investigar.` }] });
      else if (lleno(c.ind.numerador)) B.push({ t: "p", runs: [{ texto: "Resultado: ", negrita: true }, { texto: `${formulaInd(c.ind)} = ______ %   frente al estándar ${textoEstandar(c.ind)}` }] });
    });
    return { titulo: "Hoja de recogida · " + (aud.titulo || ""), bloques: B };
  }

  // ---------- Recogida de datos y resultados (entrega 4) ----------
  const nuevaRecogida = () => ({ casos: [], evidencia: "", comentario: "", observaciones: "" });
  const nuevoCaso = (codigo = "", listado = "") => ({ codigo, listado, valor: "", obs: "" });
  const nuevaEjecucion = () => ({ inicio: "", fin: "", auditores: "", incidencias: "" });
  // Protección de datos: un código no debería parecer un nombre ni un número de historia
  const pareceIdentificador = s => { s = String(s || "").trim(); return /\d{6,}/.test(s.replace(/\s/g, "")) || /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+/.test(s); };
  // Filas preparadas según la muestra (con el código HC-01… y el número sorteado del listado)
  function prepararCasos(c, n) {
    const pref = /observ/i.test(c.muestra.unidad) ? "OB" : "HC";
    return Array.from({ length: n }, (_, i) => nuevoCaso(`${pref}-${String(i + 1).padStart(2, "0")}`, c.muestra.sorteo[i] ? String(c.muestra.sorteo[i]) : ""));
  }
  const pct = (a, b) => b > 0 ? a / b * 100 : NaN;
  // Margen de error al 95 % (como en la teoría): ±1,96·√(p(1−p)/n). Con p = 0 o 1, regla del 3 (3/n)
  function margen95(p, n) {
    if (!(n > 0)) return NaN;
    if (p <= 0 || p >= 1) return 3 / n;
    return 1.96 * Math.sqrt(p * (1 - p) / n);
  }

  // Resultado de un criterio: cuenta, valor del indicador, margen, decisión LQAS y conclusión
  function resultadoCriterio(c) {
    const casos = c.recogida.casos, val = casos.filter(x => x.valor === "si" || x.valor === "no");
    const si = casos.filter(x => x.valor === "si").length, no = casos.filter(x => x.valor === "no").length, na = casos.filter(x => x.valor === "na").length;
    const pend = casos.filter(x => !x.valor).length, n = si + no, ind = c.ind, menos = ind.sentido === "menos";
    const est = pctNum(ind.estandar), m = calcMuestra(c), obj = c.muestra.objetivo;
    const R = { si, no, na, pend, n, total: casos.length, planificados: m.n, avisos: [], estado: "gris", conclusion: "", detalle: "" };
    if (!n) { R.conclusion = casos.length ? "Aún no hay casos valorados." : "Sin datos todavía."; return R; }
    const pC = si / n;                               // proporción que cumple el criterio
    R.pctCumple = pC * 100;
    R.valor = menos ? (1 - pC) * 100 : pC * 100;     // valor del indicador en su propio sentido
    const mg = margen95(pC, n) * 100; R.margen = mg;
    R.ic = [Math.max(0, R.valor - mg), Math.min(100, R.valor + mg)];
    R.textoValor = `${menos ? no : si} de ${n} = ${nfmt(R.valor, 1)} %`;
    const cumpleObs = Number.isFinite(est) ? (menos ? R.valor <= est : R.valor >= est) : null;
    R.cumpleObservado = cumpleObs;
    if (obj === "decidir" && Number.isFinite(m.c)) {
      R.lqas = { n: m.n, c: m.c };
      if (n < m.n) { R.estado = "gris"; R.conclusion = `Faltan ${m.n - n} ${m.n - n === 1 ? "caso" : "casos"} para poder decidir (el plan LQAS pide ${m.n}).`; R.lqas.faltan = m.n - n; }
      else {
        const primeros = val.slice(0, m.n), cumplenN = primeros.filter(x => x.valor === "si").length;
        R.lqas.cumplenN = cumplenN; R.lqas.acepta = cumplenN >= m.c;
        if (R.lqas.acepta) { R.estado = "verde"; R.conclusion = `Se acepta: ${cumplenN} de ${m.n} cumplen (hacían falta ${m.c}). No hay evidencia de que el cumplimiento esté por debajo del estándar.`; }
        else { R.estado = "rojo"; R.conclusion = `Se rechaza: solo ${cumplenN} de ${m.n} cumplen (hacían falta ${m.c}). Hay evidencia de problema: hay que investigar las causas.`; }
        if (R.lqas.acepta && cumpleObs === false) R.detalle = `El ${nfmt(R.valor, 1)} % observado no alcanza el estándar (${textoEstandar(ind)}), pero con ${m.n} casos no permite afirmar el incumplimiento (margen ±${nfmt(mg, 0)} puntos).`;
        const uLq = pctNum(c.muestra.umbral), eLq = estandarCumplimiento(ind);
        if (R.lqas.acepta && eLq - uLq >= 35) R.detalle += `${R.detalle ? " " : ""}Ojo: la línea roja (${nfmt(uLq, 0)} %) está muy lejos del estándar (${nfmt(eLq, 0)} %): con tan pocos casos el plan solo detecta problemas muy graves. Para vigilar mejor hace falta una muestra mayor.`;
        if (n > m.n) R.avisos.push({ nivel: "nota", texto: `Has valorado ${n} casos; la decisión LQAS usa los ${m.n} primeros, como dice el plan.` });
      }
      return R;
    }
    if (!Number.isFinite(est)) { R.conclusion = `${R.textoValor}. Falta el estándar del indicador para valorarlo.`; return R; }
    if (obj === "todos") {
      R.estado = cumpleObs ? "verde" : "rojo";
      R.conclusion = `${cumpleObs ? "Cumple" : "No cumple"}: ${R.textoValor} frente a un estándar ${textoEstandar(ind)}. Se han revisado todos los casos: no hay margen de error de muestreo.`;
      return R;
    }
    // Estimación con muestra: solo se afirma si el intervalo queda entero a un lado del estándar
    const [lo, hi] = R.ic, dentro = menos ? (hi <= est ? "cumple" : lo > est ? "no" : "duda") : (lo >= est ? "cumple" : hi < est ? "no" : "duda");
    if (dentro === "cumple") { R.estado = "verde"; R.conclusion = `Cumple: ${R.textoValor} (±${nfmt(mg, 0)}: entre ${nfmt(lo, 0)} % y ${nfmt(hi, 0)} %), por encima del estándar incluso con el margen de error.`.replace("por encima", menos ? "por debajo del límite" : "por encima"); }
    else if (dentro === "no") { R.estado = "rojo"; R.conclusion = `No cumple: ${R.textoValor} (entre ${nfmt(lo, 0)} % y ${nfmt(hi, 0)} %). Incluso con el margen de error queda fuera del estándar ${textoEstandar(ind)}.`; }
    else { R.estado = "ambar"; R.conclusion = `No concluyente: ${R.textoValor}, pero con ${n} casos el valor real puede estar entre ${nfmt(lo, 0)} % y ${nfmt(hi, 0)} %, y el estándar (${textoEstandar(ind)}) cae dentro. Amplía la muestra o decide con LQAS.`; }
    if (Number.isFinite(m.n) && n < m.n) R.avisos.push({ nivel: "nota", texto: `Llevas ${n} de los ${m.n} casos previstos: el margen de error todavía es mayor del planificado.` });
    return R;
  }

  function avisosRecogida(aud) {
    const A = [];
    if (!aud.hitos.comunicacion.hecho) A.push({ nivel: "nota", texto: "El hito «Comunicación a los auditados» no está marcado. Lo ideal es que los profesionales conozcan la auditoría antes de recoger los datos." });
    aud.criterios.forEach((c, i) => {
      const cod = c.recogida.casos.map(x => String(x.codigo || "").trim()).filter(Boolean);
      if (cod.some(pareceIdentificador)) A.push({ nivel: "error", criterio: c.id, texto: `Criterio ${i + 1}: algún código parece un nombre o un número de historia. Usa solo códigos (HC-01…): no escribas datos que identifiquen al paciente.` });
      const rep = cod.filter((x, j) => cod.indexOf(x) !== j);
      if (rep.length) A.push({ nivel: "warn", criterio: c.id, texto: `Criterio ${i + 1}: el código ${rep[0]} está repetido. ¿Es el mismo caso revisado dos veces?` });
      resultadoCriterio(c).avisos.forEach(a => A.push(Object.assign({ criterio: c.id }, a, { texto: `Criterio ${i + 1}: ${a.texto}` })));
    });
    return A;
  }
  function progresoRecogida(aud) {
    const R = aud.criterios.map(resultadoCriterio);
    return { completos: R.filter(r => r.estado !== "gris").length, total: R.length, verdes: R.filter(r => r.estado === "verde").length, rojos: R.filter(r => r.estado === "rojo").length, ambar: R.filter(r => r.estado === "ambar").length };
  }
  // Texto de «evidencia analizada» propuesto a partir del diseño
  function sugerirEvidencia(c) {
    const r = resultadoCriterio(c), tipos = c.evid.tipos.map(k => EVIDENCIAS[k].nom.toLowerCase());
    const uni = lleno(c.muestra.unidad) ? c.muestra.unidad.toLowerCase() : "casos";
    return `${tipos.length ? tipos.join(", ").replace(/^./, x => x.toUpperCase()) + ": " : ""}${r.n || "n"} ${uni}${c.muestra.objetivo === "todos" ? " (todos los del periodo)" : c.muestra.metodo ? ` seleccionados por muestreo ${METODOS_SEL[c.muestra.metodo].nom.toLowerCase()}` : ""}.`;
  }

  const ESTADO_TXT = { verde: "Cumple / se acepta", rojo: "No cumple / se rechaza", ambar: "No concluyente", gris: "Sin datos suficientes" };
  const FONDO_ESTADO = { verde: "DCFCE7", rojo: "FFE4E6", ambar: "FEF3C7", gris: "F1F5F9" };
  function documentoResultados(aud, fecha) {
    const E = aud.ejecucion, B = [{ t: "portada", titulo: "Matriz de resultados", sub: aud.titulo, extra: [aud.unidad, lleno(aud.diseno.periodo) ? "Periodo auditado: " + aud.diseno.periodo : "", lleno(E.inicio) ? `Recogida de datos: ${fmtFecha(E.inicio)}${lleno(E.fin) ? " – " + fmtFecha(E.fin) : ""}` : "", "Fecha: " + fecha].filter(lleno) }];
    if (lleno(E.auditores)) B.push({ t: "p", runs: [{ texto: "Auditores: ", negrita: true }, { texto: E.auditores }] });
    B.push({ t: "h1", texto: "Resumen" });
    const R = aud.criterios.map(resultadoCriterio);
    B.push({ t: "tabla", fuente: 8, cab: ["Nº", "Subproceso", "Indicador", "Estándar", "Sí / No / NA", "Resultado", "Margen", "Decisión"], anchos: [4, 13, 25, 8, 10, 12, 8, 20], filas: aud.criterios.map((c, i) => { const r = R[i]; return [
      { texto: String(i + 1), centro: true }, c.subproceso, c.ind.nombre || c.criterio, { texto: textoEstandar(c.ind), centro: true }, { texto: `${r.si} / ${r.no} / ${r.na}`, centro: true },
      { texto: r.n ? (r.lqas ? `${r.lqas.cumplenN != null ? r.lqas.cumplenN : r.si} de ${r.lqas.n} cumplen` : r.textoValor) : "", centro: true }, { texto: Number.isFinite(r.margen) && c.muestra.objetivo !== "todos" ? "±" + nfmt(r.margen, 0) : "", centro: true },
      { texto: r.lqas && r.lqas.acepta != null ? (r.lqas.acepta ? "LQAS: se acepta" : "LQAS: se rechaza") : ESTADO_TXT[r.estado], negrita: true, fondo: FONDO_ESTADO[r.estado] }]; }) });
    B.push({ t: "p", estilo: "nota", texto: "Con LQAS no se estima el porcentaje: se decide si hay evidencia de problema. Con muestras pequeñas, un porcentaje por debajo del estándar no basta para afirmar el incumplimiento: se tiene en cuenta el margen de error (95 % de confianza)." });
    aud.criterios.forEach((c, i) => {
      const r = R[i], f = (k, v) => lleno(v) ? [[{ texto: k, negrita: true, fondo: "F1F5F9" }, v]] : [];
      B.push({ t: "h2", texto: `${i + 1}. ${c.subproceso || "Criterio " + (i + 1)}` });
      B.push({ t: "tabla", sinCab: true, anchos: [26, 74], filas: [...f("Hallazgo", c.hallazgo), ...f("Indicador", c.ind.nombre), ...f("Fórmula y estándar", [formulaInd(c.ind), textoEstandar(c.ind)].filter(lleno).join(" · ")), ...f("Evidencia analizada", c.recogida.evidencia), ...f("Resultado", r.n ? `${r.textoValor}${Number.isFinite(r.margen) && c.muestra.objetivo !== "todos" ? ` (±${nfmt(r.margen, 0)}: ${nfmt(r.ic[0], 0)} %–${nfmt(r.ic[1], 0)} %)` : ""}` : ""), ...f("Plan LQAS", r.lqas ? `n = ${r.lqas.n}, c = ${r.lqas.c}${r.lqas.cumplenN != null ? `; cumplen ${r.lqas.cumplenN} en los ${r.lqas.n} primeros` : ""}` : ""),
        [{ texto: "Conclusión", negrita: true, fondo: "F1F5F9" }, { texto: r.conclusion + (r.detalle ? " " + r.detalle : ""), fondo: FONDO_ESTADO[r.estado] }], ...f("Comentario técnico", c.recogida.comentario), ...f("Observaciones", c.recogida.observaciones)] });
    });
    if (lleno(E.incidencias)) { B.push({ t: "h1", texto: "Incidencias durante la recogida" }); B.push({ t: "p", texto: E.incidencias }); }
    B.push({ t: "salto" }, { t: "h1", texto: "Anexo. Casos revisados" });
    aud.criterios.forEach((c, i) => { if (!c.recogida.casos.length) return; B.push({ t: "h2", texto: `Criterio ${i + 1}` }); B.push({ t: "tabla", fuente: 8, cab: ["Nº", "Nº listado", "Código", "Cumple", "Observaciones"], anchos: [6, 10, 16, 12, 56], filas: c.recogida.casos.map((x, j) => [{ texto: String(j + 1), centro: true }, { texto: x.listado, centro: true }, x.codigo, { texto: { si: "Sí", no: "No", na: "NA" }[x.valor] || "", centro: true, fondo: x.valor === "no" ? "FFE4E6" : "" }, x.obs]) }); });
    return { titulo: "Matriz de resultados · " + (aud.titulo || ""), bloques: B };
  }
  function hojasExcelRecogida(aud, fecha) {
    const T = (texto, estilo = "celda") => ({ texto: texto == null ? "" : String(texto), estilo });
    const est = { verde: "bajo", rojo: "muyalto", ambar: "medio", gris: "centro" };
    const cab = ["Nº", "Subproceso", "Indicador", "Estándar", "Sí", "No", "NA", "Valor %", "Margen ±", "LQAS n", "LQAS c", "Cumplen en n", "Conclusión"];
    const f1 = [[T("Matriz de resultados · " + (aud.titulo || ""), "titulo")], [T("Exportado de la app Auditorías · " + fecha, "sub")], cab.map(x => T(x, "cab"))]; f1[0][0].combinar = cab.length;
    aud.criterios.forEach((c, i) => { const r = resultadoCriterio(c); f1.push([T(i + 1, "centro"), T(c.subproceso), T(c.ind.nombre), T(textoEstandar(c.ind), "centro"), { numero: r.si, estilo: "centro" }, { numero: r.no, estilo: "centro" }, { numero: r.na, estilo: "centro" }, Number.isFinite(r.valor) ? { numero: Math.round(r.valor * 10) / 10, estilo: "centro" } : T(""), Number.isFinite(r.margen) ? { numero: Math.round(r.margen), estilo: "centro" } : T(""), T(r.lqas ? r.lqas.n : "", "centro"), T(r.lqas ? r.lqas.c : "", "centro"), T(r.lqas && r.lqas.cumplenN != null ? r.lqas.cumplenN : "", "centro"), T(r.conclusion, est[r.estado])]); });
    const f2 = [[T("Casos revisados", "titulo")], [T("Solo códigos: sin datos que identifiquen a los pacientes", "sub")], ["Criterio", "Nº", "Nº listado", "Código", "Cumple", "Observaciones"].map(x => T(x, "cab"))]; f2[0][0].combinar = 6;
    aud.criterios.forEach((c, i) => c.recogida.casos.forEach((x, j) => f2.push([T(i + 1, "centro"), T(j + 1, "centro"), T(x.listado, "centro"), T(x.codigo), T({ si: "Sí", no: "No", na: "NA" }[x.valor] || "", x.valor === "no" ? "muyalto" : "centro"), T(x.obs)])));
    return { estilos: ESTILOS_XLSX, hojas: [
      { nombre: "Resultados", filas: f1, opciones: { anchoColumnas: [5, 22, 40, 10, 6, 6, 6, 9, 9, 8, 8, 11, 60], congelar: { filas: 3, columnas: 0 }, altoFilas: { 1: 24 } } },
      { nombre: "Casos", filas: f2, opciones: { anchoColumnas: [9, 6, 10, 14, 9, 50], congelar: { filas: 3, columnas: 0 }, altoFilas: { 1: 24 } } }
    ] };
  }

  // ---------- Informe: interpretación, causas, hallazgos y recomendaciones (entrega 5) ----------
  const CLASIF = {
    conformidad: { nom: "Conformidad", que: "Se cumple el criterio." },
    observacion: { nom: "Observación", que: "No hay evidencia de incumplimiento, pero conviene vigilarlo o mejorarlo." },
    noConformidad: { nom: "No conformidad", que: "No se cumple el criterio y hay evidencia que lo demuestra." }
  };
  const CATEGORIAS_CAUSA = {
    personas: { nom: "Personas", que: "Formación, conocimiento del protocolo, carga de trabajo, cansancio." },
    procedimiento: { nom: "Procedimiento", que: "Protocolo inexistente, ambiguo, desactualizado o poco práctico." },
    sistemas: { nom: "Equipos y sistemas", que: "Sistema de información, alertas, campos, material, equipos." },
    organizacion: { nom: "Organización", que: "Circuitos, recursos, turnos, coordinación entre unidades." },
    comunicacion: { nom: "Comunicación", que: "Transmisión de información entre profesionales, turnos o unidades." },
    entorno: { nom: "Paciente y entorno", que: "Complejidad del paciente, saturación, espacio físico." }
  };
  const PRIORIDADES = { alta: "Alta", media: "Media", baja: "Baja" };
  const ESTADOS_INFORME = { borrador: "Borrador", validado: "Validado con los responsables", aprobado: "Aprobado" };
  const nuevaRec = id => ({ id, texto: "", responsable: "", prioridad: "", motivo: "", plazo: "" });
  const nuevoAnalisis = () => ({ clasif: "", interpretacion: "", porques: ["", "", "", "", ""], categorias: [], causaRaiz: "", recs: [] });
  const nuevoInforme = () => ({ conclusiones: "", fortalezas: "", resumen: "", destinatarios: "", estado: "borrador" });

  function clasificacionSugerida(c) {
    const r = resultadoCriterio(c);
    if (r.estado === "rojo") return "noConformidad";
    if (r.estado === "ambar") return "observacion";
    if (r.estado === "verde") return r.cumpleObservado === false ? "observacion" : "conformidad";
    return "";
  }
  // Interpretación propuesta (como en el ejercicio de interpretación): qué significa frente al estándar y qué se puede afirmar
  function interpretacionSugerida(c) {
    const r = resultadoCriterio(c), ind = c.ind, est = pctNum(ind.estandar);
    if (!r.n) return "";
    const partes = [`Resultado: ${r.textoValor} frente a un estándar ${textoEstandar(ind)}.`];
    if (Number.isFinite(est)) {
      const dif = Math.abs(r.valor - est);
      partes.push(r.cumpleObservado ? `El valor observado alcanza el estándar.` : `El valor observado se desvía ${nfmt(dif, 1)} puntos del estándar.`);
    }
    if (r.lqas && r.lqas.acepta != null) partes.push(r.lqas.acepta ? `Con el plan LQAS (n = ${r.lqas.n}, c = ${r.lqas.c}) se acepta: no hay evidencia suficiente de incumplimiento${r.cumpleObservado === false ? `, aunque con un margen de ±${nfmt(r.margen, 0)} puntos conviene vigilarlo` : ""}.` : `Con el plan LQAS (n = ${r.lqas.n}, c = ${r.lqas.c}) se rechaza: hay evidencia de que no se alcanza el estándar.`);
    else if (r.estado === "ambar") partes.push(`Con ${r.n} casos el margen (±${nfmt(r.margen, 0)}) no permite afirmar ni descartar el incumplimiento.`);
    const obs = c.recogida.casos.filter(x => x.valor === "no" && lleno(x.obs)).map(x => x.obs.trim());
    if (obs.length) partes.push(`En los casos que no cumplen se anotó: ${[...new Set(obs)].slice(0, 4).join("; ").toLowerCase()}.`);
    return partes.join(" ");
  }

  // Fuerza de una medida (jerarquía de efectividad): las que cambian el sistema funcionan mejor que las que dependen de la memoria o la voluntad
  const FUERZAS = {
    fuerte: { nom: "Medida fuerte", que: "Cambia el sistema: obliga, automatiza o elimina el paso que falla." },
    intermedia: { nom: "Medida intermedia", que: "Apoya la práctica: listas de verificación, doble verificación, estandarizar." },
    debil: { nom: "Medida débil", que: "Depende de la memoria o la voluntad: formación, avisos, sensibilización." }
  };
  function fuerzaMedida(texto) {
    const t = sinTildes(texto);
    if (!t) return "";
    if (/campo obligatori|no permit|\bbloque(e|ar|a)\b|forzad|automat|alerta autom|integracion|interoperab|redisen|eliminar|simplific|panel de camas|en tiempo real|sistema de alerta/.test(t)) return "fuerte";
    if (/checklist|lista de verificacion|doble (verificacion|validacion|identificacion)|protocolo|procedimiento|estandariz|auditori|revision (cruzada|semanal|periodica|sistematica)|recordatorio visual|listado actualizado|circuito|reunion|etiquetado|designacion/.test(t)) return "intermedia";
    if (/formacion|\bformar\b|sesion|sensibiliz|concienci|charla|informar|difundir|recordar|insistir|cartel|cuidado|curso/.test(t)) return "debil";
    return "";
  }
  // Redacción neutral: palabras que culpabilizan o que son subjetivas
  const PALABRAS_NO_NEUTRAS = ["culpa", "negligen", "dejadez", "desidia", "vago", "incompeten", "irresponsab", "descuido", "pesim", "horrible", "lamentable", "vergonz", "desastr", "nunca", "siempre", "nadie", "todo el mundo", "obviamente", "evidentemente", "no se molesta", "pasan de"];
  function palabrasNoNeutras(texto) {
    const t = " " + sinTildes(texto).replace(/[^a-zñ ]/g, " ") + " ";
    return PALABRAS_NO_NEUTRAS.filter(p => p.includes(" ") ? t.includes(" " + p + " ") : new RegExp(`\\b${p}`).test(t));
  }
  const RESP_VAGO = /^(todos|el equipo|equipo|personal|todo el personal|la unidad|el servicio|profesionales|enfermeria|direccion)$/;

  const necesitaAnalisis = c => ["noConformidad", "observacion"].includes(c.analisis.clasif);
  function avisosInforme(aud) {
    const A = [], C = aud.criterios, nom = i => `Criterio ${i + 1}`;
    C.forEach((c, i) => {
      const an = c.analisis, r = resultadoCriterio(c), sug = clasificacionSugerida(c);
      if (!r.n) A.push({ nivel: "nota", paso: 1, texto: `${nom(i)}: sin resultados todavía. Recoge los datos antes de interpretarlos.` });
      if (!lleno(an.clasif) && r.n) A.push({ nivel: "nota", paso: 1, texto: `${nom(i)}: clasifica el hallazgo (conformidad, observación o no conformidad).` });
      if (an.clasif === "conformidad" && r.estado === "rojo") A.push({ nivel: "warn", paso: 1, texto: `${nom(i)}: lo has clasificado como conformidad, pero el resultado se rechaza. Revisa la clasificación.` });
      if (an.clasif === "noConformidad" && r.estado === "verde") A.push({ nivel: "warn", paso: 1, texto: `${nom(i)}: lo has clasificado como no conformidad, pero los datos no permiten afirmar el incumplimiento${r.cumpleObservado === false ? " (el porcentaje observado está por debajo, pero dentro del margen de error)" : ""}. Quizá sea una observación.` });
      if (an.clasif === "noConformidad" && r.estado === "ambar") A.push({ nivel: "warn", paso: 1, texto: `${nom(i)}: el resultado no es concluyente; una no conformidad necesita evidencia. Valora clasificarlo como observación o ampliar la muestra.` });
      if (lleno(an.clasif) && !lleno(an.interpretacion)) A.push({ nivel: "nota", paso: 1, texto: `${nom(i)}: escribe la interpretación (qué significa el resultado frente al estándar).` });
      if (an.clasif === "noConformidad" && !lleno(an.causaRaiz)) A.push({ nivel: "warn", paso: 2, texto: `${nom(i)}: una no conformidad necesita análisis de causas antes de recomendar. Si no, la mejora ataca el síntoma.` });
      if (an.clasif === "observacion" && !lleno(an.causaRaiz) && !an.categorias.length) A.push({ nivel: "nota", paso: 2, texto: `${nom(i)}: en las observaciones, una reflexión breve sobre las causas ayuda a orientar la mejora.` });
      if (necesitaAnalisis(c)) {
        const recs = an.recs.filter(x => lleno(x.texto));
        if (!recs.length) A.push({ nivel: an.clasif === "noConformidad" ? "warn" : "nota", paso: 3, texto: `${nom(i)}: falta al menos una recomendación (lo habitual: dos por hallazgo).` });
        recs.forEach((x, k) => {
          if (!lleno(x.responsable)) A.push({ nivel: "nota", paso: 3, texto: `${nom(i)}, recomendación ${k + 1}: falta el responsable.` });
          else if (RESP_VAGO.test(sinTildes(x.responsable))) A.push({ nivel: "warn", paso: 3, texto: `${nom(i)}, recomendación ${k + 1}: «${x.responsable}» no es un responsable concreto. Pon una persona o un cargo; si es de todos, no es de nadie.` });
          if (!lleno(x.prioridad)) A.push({ nivel: "nota", paso: 3, texto: `${nom(i)}, recomendación ${k + 1}: asigna una prioridad.` });
        });
        if (recs.length && recs.every(x => fuerzaMedida(x.texto) === "debil")) A.push({ nivel: "warn", paso: 3, texto: `${nom(i)}: todas las recomendaciones son medidas débiles (formación, sensibilización, avisos). Suelen funcionar poco solas: añade alguna que cambie el sistema (un campo obligatorio, una alerta, una lista de verificación).` });
      }
      [["interpretación", an.interpretacion, 1], ["causa raíz", an.causaRaiz, 2], ...an.recs.map((x, k) => [`recomendación ${k + 1}`, x.texto, 3])].forEach(([q, txt, paso]) => {
        const p = palabrasNoNeutras(txt); if (p.length) A.push({ nivel: "warn", paso, texto: `${nom(i)}, ${q}: revisa la redacción («${p.join("», «")}»). Describe hechos, sin juicios ni culpables.` });
      });
    });
    const I = aud.informe;
    [["conclusiones", I.conclusiones], ["resumen ejecutivo", I.resumen]].forEach(([q, txt]) => { const p = palabrasNoNeutras(txt); if (p.length) A.push({ nivel: "warn", paso: 4, texto: `En ${q}: revisa la redacción («${p.join("», «")}»).` }); });
    if (!lleno(I.resumen)) A.push({ nivel: "nota", paso: 4, texto: "Falta el resumen ejecutivo para la Dirección (puedes pedir una propuesta)." });
    if (!aud.hitos.validacion.hecho) A.push({ nivel: "nota", paso: 5, texto: "Valida el borrador con los responsables del área antes de cerrar el informe (hito de validación)." });
    if (I.estado === "aprobado" && !aud.hitos.validacion.hecho) A.push({ nivel: "warn", paso: 5, texto: "El informe figura como aprobado, pero el borrador no se ha validado con los responsables." });
    return A;
  }
  function progresoInforme(aud) {
    const C = aud.criterios, todos = f => C.length > 0 && C.every(f), I = aud.informe;
    return {
      1: todos(c => lleno(c.analisis.clasif) && lleno(c.analisis.interpretacion)),
      2: C.length > 0 && C.filter(c => c.analisis.clasif === "noConformidad").every(c => lleno(c.analisis.causaRaiz)) && todos(c => lleno(c.analisis.clasif)),
      3: C.length > 0 && C.filter(necesitaAnalisis).every(c => c.analisis.recs.some(x => lleno(x.texto) && lleno(x.responsable) && lleno(x.prioridad))) && todos(c => lleno(c.analisis.clasif)),
      4: lleno(I.resumen) && lleno(I.conclusiones),
      5: aud.hitos.validacion.hecho && I.estado !== "borrador"
    };
  }
  const cuentaClasif = aud => aud.criterios.reduce((o, c) => (c.analisis.clasif && (o[c.analisis.clasif] = (o[c.analisis.clasif] || 0) + 1), o), {});
  function resumenEjecutivoSugerido(aud) {
    const k = cuentaClasif(aud), C = aud.criterios, nc = C.filter(c => c.analisis.clasif === "noConformidad"), ob = C.filter(c => c.analisis.clasif === "observacion");
    const recsAltas = C.flatMap(c => c.analisis.recs.filter(x => x.prioridad === "alta" && lleno(x.texto)));
    const t = [];
    t.push(`Se ha auditado ${lleno(aud.proceso) ? aud.proceso : "el proceso"}${lleno(aud.unidad) ? " en " + aud.unidad : ""}${lleno(aud.diseno.periodo) ? " (periodo: " + aud.diseno.periodo.charAt(0).toLowerCase() + aud.diseno.periodo.slice(1) + ")" : ""}, con ${C.length} ${C.length === 1 ? "criterio" : "criterios"}.`);
    t.push(`Resultado: ${k.conformidad || 0} ${k.conformidad === 1 ? "conformidad" : "conformidades"}, ${k.observacion || 0} ${k.observacion === 1 ? "observación" : "observaciones"} y ${k.noConformidad || 0} ${k.noConformidad === 1 ? "no conformidad" : "no conformidades"}.`);
    if (nc.length) t.push(`No conformidades: ${nc.map(c => `${c.subproceso ? c.subproceso.toLowerCase() + " (" : ""}${c.hallazgo.charAt(0).toLowerCase() + c.hallazgo.slice(1)}${c.subproceso ? ")" : ""}`).join("; ")}.`);
    if (ob.length) t.push(`Además, ${ob.length} ${ob.length === 1 ? "criterio queda" : "criterios quedan"} por debajo del estándar sin evidencia suficiente para afirmar el incumplimiento: se recomienda vigilarlos.`);
    if (recsAltas.length) t.push(`Recomendaciones de prioridad alta (${recsAltas.length}): ${recsAltas.slice(0, 4).map(x => x.texto.replace(/\.$/, "").charAt(0).toLowerCase() + x.texto.replace(/\.$/, "").slice(1)).join("; ")}${recsAltas.length > 4 ? "…" : ""}.`);
    t.push("Se propone acordar el plan de mejora con responsables y plazos y programar una auditoría de seguimiento para comprobar su eficacia.");
    return t.join(" ");
  }

  // Informe completo (estructura del tema 5 y del modelo de auditoría interna)
  function documentoInforme(aud, mapa, plan, fecha, orig) {
    const C = aud.criterios, D = aud.diseno, I = aud.informe, k = cuentaClasif(aud), R = C.map(resultadoCriterio);
    const B = [{ t: "portada", titulo: aud.titulo || "Informe de auditoría", sub: "Informe de auditoría", extra: [aud.unidad, aud.centro, lleno(D.periodo) ? "Periodo auditado: " + D.periodo : "", `Estado: ${ESTADOS_INFORME[I.estado]}`, "Fecha: " + fecha].filter(lleno) }];
    B.push(...bloquesControl(aud.control), { t: "salto" });
    const pe = documentoPlanEspecifico(aud, mapa, plan, fecha).bloques;
    // Introducción, objetivos, alcance y criterios: los mismos del plan específico
    const corta = (desde, hasta) => { const i = pe.findIndex(b => b.t === "h1" && b.texto.startsWith(desde)), j = pe.findIndex(b => b.t === "h1" && b.texto.startsWith(hasta)); return i < 0 ? [] : pe.slice(i, j < 0 ? undefined : j); };
    B.push(...corta("1.", "4."));
    B.push({ t: "h1", texto: "4. Criterios e indicadores" }, ...corta("4.", "5.").slice(1).filter(b => !(b.t === "h2" && b.texto.startsWith("4.3")) && !(b.t === "tabla" && b.cab && b.cab[1] === "Cumple si…")));
    B.push({ t: "h1", texto: "5. Metodología" }, ...corta("5.", "6.").slice(1).filter(b => !(b.t === "h2" && b.texto.startsWith("5.2")) && !(b.t === "tabla" && b.cab && b.cab[1] === "Tipos de evidencia")));
    if (lleno(aud.ejecucion.inicio)) B.push({ t: "p", texto: `Recogida de datos: ${fmtFecha(aud.ejecucion.inicio)}${lleno(aud.ejecucion.fin) ? " – " + fmtFecha(aud.ejecucion.fin) : ""}${lleno(aud.ejecucion.auditores) ? ". " + aud.ejecucion.auditores : ""}` });
    if (lleno(aud.ejecucion.incidencias)) B.push({ t: "p", runs: [{ texto: "Incidencias del método: ", negrita: true }, { texto: aud.ejecucion.incidencias }] });
    B.push({ t: "h1", texto: "6. Equipo auditor" });
    if (lineas(D.equipo).length) B.push({ t: "lista", items: lineas(D.equipo) });
    B.push({ t: "h1", texto: "7. Resultados y hallazgos" });
    B.push({ t: "p", texto: `${C.length} criterios evaluados: ${k.conformidad || 0} conformidades, ${k.observacion || 0} observaciones y ${k.noConformidad || 0} no conformidades.` });
    B.push({ t: "tabla", fuente: 8, cab: ["Nº", "Subproceso", "Indicador", "Estándar", "Resultado", "Decisión", "Hallazgo"], anchos: [4, 14, 28, 9, 14, 13, 18], filas: C.map((c, i) => { const r = R[i]; return [{ texto: String(i + 1), centro: true }, c.subproceso, c.ind.nombre, { texto: textoEstandar(c.ind), centro: true }, { texto: r.n ? r.textoValor : "—", centro: true }, { texto: r.lqas && r.lqas.acepta != null ? (r.lqas.acepta ? "LQAS: acepta" : "LQAS: rechaza") : ESTADO_TXT[r.estado], centro: true, fondo: FONDO_ESTADO[r.estado] }, { texto: CLASIF[c.analisis.clasif] ? CLASIF[c.analisis.clasif].nom : "", negrita: true, fondo: c.analisis.clasif === "noConformidad" ? "FFE4E6" : c.analisis.clasif === "observacion" ? "FEF3C7" : c.analisis.clasif === "conformidad" ? "DCFCE7" : "" }]; }) });
    const orden = ["noConformidad", "observacion", "conformidad", ""];
    C.map((c, i) => ({ c, i })).sort((a, b) => orden.indexOf(a.c.analisis.clasif) - orden.indexOf(b.c.analisis.clasif) || a.i - b.i).forEach(({ c, i }) => {
      const an = c.analisis, r = R[i], f = (kk, v) => lleno(v) ? [[{ texto: kk, negrita: true, fondo: "F1F5F9" }, v]] : [];
      B.push({ t: "h2", texto: `Criterio ${i + 1} · ${c.subproceso || ""}${CLASIF[an.clasif] ? " — " + CLASIF[an.clasif].nom : ""}` });
      const porques = an.porques.filter(lleno);
      B.push({ t: "tabla", sinCab: true, anchos: [24, 76], filas: [...f("Hallazgo o riesgo", c.hallazgo), ...f("Criterio", c.criterio), ...f("Indicador", c.ind.nombre), ...f("Evidencia analizada", c.recogida.evidencia), ...f("Resultado", r.n ? `${r.textoValor}${Number.isFinite(r.margen) && c.muestra.objetivo !== "todos" ? ` (±${nfmt(r.margen, 0)})` : ""}${r.lqas && r.lqas.acepta != null ? `. LQAS (n = ${r.lqas.n}, c = ${r.lqas.c}): ${r.lqas.acepta ? "se acepta" : "se rechaza"}` : ""}` : ""), ...f("Interpretación", an.interpretacion), ...f("Por qué ocurre", porques.map((p, j) => `${j + 1}. ${p}`).join("\n")), ...f("Categorías de causa", an.categorias.map(x => CATEGORIAS_CAUSA[x].nom).join(", ")), ...f("Causa raíz", an.causaRaiz)] });
    });
    if (orig) B.push({ t: "h2", texto: "Comparación con la auditoría inicial" }, ...bloquesComparacion(orig, aud));
    B.push({ t: "h1", texto: "8. Recomendaciones" });
    const conRecs = C.map((c, i) => ({ c, i })).filter(x => x.c.analisis.recs.some(r => lleno(r.texto)));
    if (!conRecs.length) B.push({ t: "p", texto: "Sin recomendaciones registradas." });
    conRecs.forEach(({ c, i }) => {
      B.push({ t: "h2", texto: `Criterio ${i + 1} · ${c.hallazgo}` });
      B.push({ t: "tabla", fuente: 9, cab: ["Recomendación", "Responsable propuesto", "Prioridad", "Tipo de medida"], anchos: [50, 22, 14, 14], filas: c.analisis.recs.filter(r => lleno(r.texto)).map(r => [r.texto + (lleno(r.motivo) ? `\n(${r.motivo})` : ""), r.responsable, { texto: PRIORIDADES[r.prioridad] || "", centro: true, negrita: r.prioridad === "alta", fondo: r.prioridad === "alta" ? "FFE4E6" : r.prioridad === "media" ? "FEF3C7" : "" }, { texto: FUERZAS[fuerzaMedida(r.texto)] ? FUERZAS[fuerzaMedida(r.texto)].nom.replace("Medida ", "") : "", centro: true }]) });
    });
    B.push({ t: "h1", texto: "9. Conclusiones" });
    if (lleno(I.fortalezas)) { B.push({ t: "p", runs: [{ texto: "Fortalezas. ", negrita: true }, { texto: I.fortalezas }] }); }
    B.push({ t: "p", texto: lleno(I.conclusiones) ? I.conclusiones : resumenEjecutivoSugerido(aud) });
    B.push({ t: "h1", texto: "10. Próximos pasos" });
    B.push({ t: "p", texto: "Las recomendaciones se concretarán en un plan de acción de mejora con responsables, plazos, recursos e indicadores de seguimiento. Se programará una auditoría de seguimiento para comprobar la eficacia de las acciones y, si procede, se actualizará el Mapa de Riesgos." });
    B.push({ t: "h1", texto: "Anexo. Hitos de la auditoría" });
    B.push({ t: "tabla", cab: ["Hito", "Fecha", "Estado", "Nota"], anchos: [36, 14, 14, 36], filas: HITOS.map(h => { const v = aud.hitos[h.k]; return [h.nom, fmtFecha(v.fecha), { texto: v.hecho ? "Hecho" : "Pendiente", fondo: v.hecho ? "DCFCE7" : "" }, v.nota]; }) });
    return { titulo: "Informe de auditoría · " + (aud.titulo || ""), bloques: B };
  }
  // Resumen ejecutivo para la Dirección: una o dos páginas
  function documentoResumenEjecutivo(aud, fecha) {
    const C = aud.criterios, R = C.map(resultadoCriterio), I = aud.informe;
    const B = [{ t: "portada", titulo: "Resumen ejecutivo", sub: aud.titulo, extra: [aud.unidad, lleno(aud.diseno.periodo) ? "Periodo auditado: " + aud.diseno.periodo : "", lleno(I.destinatarios) ? "Para: " + I.destinatarios : "", "Fecha: " + fecha].filter(lleno) }];
    B.push({ t: "h1", texto: "En pocas palabras" }, { t: "p", texto: lleno(I.resumen) ? I.resumen : resumenEjecutivoSugerido(aud) });
    B.push({ t: "h1", texto: "Resultados de un vistazo" });
    B.push({ t: "tabla", fuente: 9, cab: ["Subproceso", "Qué se ha medido", "Resultado", "Valoración"], anchos: [20, 44, 16, 20], filas: C.map((c, i) => [c.subproceso, c.ind.nombre || c.criterio, { texto: R[i].n ? R[i].textoValor : "—", centro: true }, { texto: CLASIF[c.analisis.clasif] ? CLASIF[c.analisis.clasif].nom : ESTADO_TXT[R[i].estado], negrita: true, fondo: c.analisis.clasif === "noConformidad" ? "FFE4E6" : c.analisis.clasif === "observacion" ? "FEF3C7" : c.analisis.clasif === "conformidad" ? "DCFCE7" : FONDO_ESTADO[R[i].estado] }]) });
    const altas = C.flatMap(c => c.analisis.recs.filter(x => x.prioridad === "alta" && lleno(x.texto)).map(x => ({ c, x })));
    if (altas.length) { B.push({ t: "h1", texto: "Recomendaciones prioritarias" }); B.push({ t: "tabla", fuente: 9, cab: ["Recomendación", "Responsable"], anchos: [70, 30], filas: altas.map(({ x }) => [x.texto, x.responsable]) }); }
    if (lleno(I.fortalezas)) { B.push({ t: "h1", texto: "Fortalezas" }, { t: "p", texto: I.fortalezas }); }
    B.push({ t: "h1", texto: "Qué se pide a la Dirección" });
    B.push({ t: "lista", items: ["Respaldar el plan de mejora y los recursos necesarios para las recomendaciones de prioridad alta.", "Acordar los responsables y los plazos en la reunión de devolución de resultados.", "Programar la auditoría de seguimiento para comprobar si las mejoras funcionan."] });
    return { titulo: "Resumen ejecutivo · " + (aud.titulo || ""), bloques: B };
  }

  // ---------- Mejora y seguimiento (entrega 6) ----------
  const ESTADOS_ACCION = { pendiente: "Pendiente", curso: "En curso", hecha: "Hecha", verificada: "Verificada" };
  const NIVEL3 = { "3": "Alta", "2": "Media", "1": "Baja" };
  const nuevaAccion = id => ({ id, critId: "", recId: "", objetivo: "", accion: "", responsable: "", inicio: "", fin: "", recursos: "", indicador: "", criticidad: "", viabilidad: "", impacto: "", estado: "pendiente", nota: "" });
  const nuevaMejora = () => ({ acciones: [], fechaSeguimiento: "", seguimientoId: "", notas: "" });

  // Las recomendaciones del informe se convierten en acciones (sin duplicar las ya traídas)
  function accionesDesdeRecs(aud, genId) {
    const ya = new Set(aud.mejora.acciones.filter(x => x.recId).map(x => x.critId + "|" + x.recId)), out = [];
    aud.criterios.forEach(c => c.analisis.recs.filter(r => lleno(r.texto) && !ya.has(c.id + "|" + r.id)).forEach(r => {
      const est = textoEstandar(c.ind);
      out.push(Object.assign(nuevaAccion(genId()), {
        critId: c.id, recId: r.id, accion: r.texto, responsable: r.responsable,
        criticidad: { alta: "3", media: "2", baja: "1" }[r.prioridad] || "",
        objetivo: lleno(c.ind.nombre) ? `${c.ind.sentido === "menos" ? "Reducir" : "Aumentar"} el ${c.ind.nombre.charAt(0).toLowerCase() + c.ind.nombre.slice(1)}${est ? " hasta " + est : ""}` : "",
        indicador: lleno(c.ind.nombre) ? c.ind.nombre + (est ? ` (estándar ${est})` : "") : ""
      }));
    }));
    return out;
  }
  // Prioridad de una acción: criticidad × viabilidad (y el impacto para desempatar)
  const n3 = v => { const n = num(v); return n >= 1 && n <= 3 ? n : 0; };
  function zonaAccion(a) {
    const c = n3(a.criticidad), v = n3(a.viabilidad);
    if (!c || !v) return null;
    if (c + v >= 5) return { k: "ya", nom: "Hacer ya", orden: 1 };
    if (c === 3 && v === 1) return { k: "planificar", nom: "Crítica pero difícil: planificar recursos", orden: 2 };
    if (c + v === 4) return { k: "pronto", nom: "Siguiente en la cola", orden: 3 };
    if (c === 1 && v >= 2) return { k: "rapida", nom: "Fácil, poco crítica", orden: 4 };
    return { k: "reconsiderar", nom: "Reconsiderar", orden: 5 };
  }
  const ordenarAcciones = acs => acs.map((a, i) => ({ a, i, z: zonaAccion(a) })).sort((x, y) => (x.z ? x.z.orden : 9) - (y.z ? y.z.orden : 9) || n3(y.a.criticidad) - n3(x.a.criticidad) || n3(y.a.impacto) - n3(x.a.impacto) || x.i - y.i).map(x => x.a);
  const vencida = (a, hoyIso) => lleno(a.fin) && ["pendiente", "curso"].includes(a.estado) && a.fin < String(hoyIso).slice(0, 10);

  function avisosMejora(aud, hoyIso) {
    const A = [], AC = aud.mejora.acciones, C = aud.criterios;
    const recsTotales = C.reduce((n, c) => n + c.analisis.recs.filter(r => lleno(r.texto)).length, 0);
    if (!AC.length) A.push({ nivel: "nota", paso: 1, texto: recsTotales ? `Hay ${recsTotales} recomendaciones en el informe: tráelas al plan de acción con un clic.` : "El plan de acción parte de las recomendaciones del informe. Completa antes el informe o añade acciones a mano." });
    C.filter(c => c.analisis.clasif === "noConformidad" && !AC.some(a => a.critId === c.id)).forEach(c => A.push({ nivel: "warn", paso: 1, texto: `La no conformidad del criterio ${C.indexOf(c) + 1} (${corto(c.hallazgo, 50)}) no tiene ninguna acción.` }));
    const sinTraer = C.reduce((n, c) => n + c.analisis.recs.filter(r => r.prioridad === "alta" && lleno(r.texto) && !AC.some(a => a.critId === c.id && a.recId === r.id)).length, 0);
    if (AC.length && sinTraer) A.push({ nivel: "nota", paso: 1, texto: `${sinTraer === 1 ? "Una recomendación de prioridad alta no está" : sinTraer + " recomendaciones de prioridad alta no están"} en el plan de acción.` });
    AC.forEach((a, i) => {
      const n = `Acción ${i + 1}`;
      if (!lleno(a.accion)) A.push({ nivel: "nota", paso: 1, texto: `${n}: describe qué se va a hacer.` });
      if (!lleno(a.responsable)) A.push({ nivel: "warn", paso: 1, texto: `${n}: sin responsable. Una acción sin responsable no se hace.` });
      else if (RESP_VAGO.test(sinTildes(a.responsable))) A.push({ nivel: "warn", paso: 1, texto: `${n}: «${a.responsable}» no es un responsable concreto.` });
      if (!lleno(a.fin)) A.push({ nivel: "nota", paso: 1, texto: `${n}: pon una fecha de fin (plazo).` });
      if (lleno(a.inicio) && lleno(a.fin) && a.fin < a.inicio) A.push({ nivel: "error", paso: 1, texto: `${n}: la fecha de fin es anterior a la de inicio.` });
      if (!lleno(a.indicador)) A.push({ nivel: "nota", paso: 1, texto: `${n}: indica cómo se sabrá si funciona (indicador de seguimiento).` });
      if (!zonaAccion(a)) A.push({ nivel: "nota", paso: 2, texto: `${n}: valora su criticidad y su viabilidad para priorizarla.` });
      if (vencida(a, hoyIso)) A.push({ nivel: "warn", paso: 3, texto: `${n}: el plazo venció el ${fmtFecha(a.fin)} y sigue ${ESTADOS_ACCION[a.estado].toLowerCase()}.` });
    });
    if (AC.length && AC.every(a => fuerzaMedida(a.accion) === "debil")) A.push({ nivel: "warn", paso: 2, texto: "Todas las acciones son medidas débiles (formación, sensibilización). Añade alguna que cambie el sistema." });
    if (AC.length && !lleno(aud.mejora.fechaSeguimiento) && !aud.mejora.seguimientoId) A.push({ nivel: "nota", paso: 3, texto: "Fija cuándo se hará la auditoría de seguimiento: semanas para acciones sencillas, meses para cambios estructurales." });
    return A;
  }
  function progresoMejora(aud) {
    const AC = aud.mejora.acciones, NC = aud.criterios.filter(c => c.analisis.clasif === "noConformidad");
    return {
      1: AC.length > 0 && NC.every(c => AC.some(a => a.critId === c.id)) && AC.every(a => lleno(a.accion) && lleno(a.responsable) && lleno(a.fin)),
      2: AC.length > 0 && AC.every(a => zonaAccion(a)),
      3: AC.length > 0 && (lleno(aud.mejora.fechaSeguimiento) || !!aud.mejora.seguimientoId)
    };
  }
  const resumenAcciones = (aud, hoyIso) => { const AC = aud.mejora.acciones, o = { total: AC.length, vencidas: AC.filter(a => vencida(a, hoyIso)).length }; Object.keys(ESTADOS_ACCION).forEach(k => { o[k] = AC.filter(a => a.estado === k).length; }); return o; };

  // Auditoría de seguimiento con un clic: hereda el diseño (criterios, indicadores, evidencias, muestra) y empieza limpia
  function crearSeguimiento(orig, genId, fecha, soloMejoras) {
    const cl = JSON.parse(JSON.stringify(orig)), s = nuevaAuditoria(genId(), fecha);
    const crits = cl.criterios.filter(c => !soloMejoras || ["noConformidad", "observacion"].includes(c.analisis.clasif) || orig.mejora.acciones.some(a => a.critId === c.id));
    Object.assign(s, {
      titulo: `Seguimiento · ${orig.titulo || "auditoría"}`, unidad: orig.unidad, centro: orig.centro, proceso: orig.proceso, tipo: orig.tipo, objeto: orig.objeto,
      alcance: orig.alcance, planId: orig.planId, seguimientoDe: orig.id,
      introduccion: `Auditoría de seguimiento de «${orig.titulo || "la auditoría inicial"}», para comprobar si las acciones de mejora se han implantado y si han sido eficaces.`,
      objetivoGeneral: `Verificar la eficacia de las acciones de mejora implantadas tras la auditoría «${orig.titulo || "inicial"}», comparando los resultados con los de la auditoría inicial.`,
      objetivosEsp: "Comprobar que las acciones del plan de mejora se han implantado.\nMedir de nuevo los criterios con el mismo método que en la auditoría inicial.\nDecidir, para cada criterio, si se puede cerrar o si hay que ajustar las acciones y volver a medir.",
      diseno: Object.assign(cl.diseno, { periodo: "" }),
      origen: { tipo: "seguimiento", mapaId: cl.origen.mapaId, riesgoIds: cl.origen.riesgoIds.slice(), detalle: `Seguimiento de la auditoría «${orig.titulo || ""}»${lleno(orig.diseno.periodo) ? " (periodo inicial: " + orig.diseno.periodo + ")" : ""}.` }
    });
    s.criterios = crits.map(c => Object.assign(nuevoCriterio(genId()), { subproceso: c.subproceso, riesgoId: c.riesgoId, hallazgo: c.hallazgo, criterio: c.criterio, origenId: c.id, ind: c.ind, evid: c.evid, muestra: Object.assign(c.muestra, { sorteo: [] }) }));
    return s;
  }
  // Comparación antes / después y decisión: cerrar, mejora parcial (no cerrar) o acciones no eficaces
  function compararSeguimiento(orig, seg) {
    return seg.criterios.map((c, i) => {
      const o = orig.criterios.find(x => x.id === c.origenId) || orig.criterios.find(x => x.riesgoId && x.riesgoId === c.riesgoId);
      const ra = o ? resultadoCriterio(o) : null, rd = resultadoCriterio(c), menos = c.ind.sentido === "menos";
      const fila = { i, c, o, antes: ra, despues: rd, cambio: "", decision: "", texto: "" };
      if (!rd.n) { fila.decision = "pendiente"; fila.texto = "Faltan los datos del seguimiento."; return fila; }
      if (ra && ra.n) { const d = (rd.valor - ra.valor) * (menos ? -1 : 1); fila.dif = d; fila.cambio = d > 5 ? "mejora" : d < -5 ? "empeora" : "igual"; }
      const alcanza = rd.estado === "verde" && rd.cumpleObservado !== false;
      if (alcanza) { fila.decision = "cerrar"; fila.texto = "Se alcanza el estándar: las acciones han sido eficaces. Se puede cerrar y mantener la vigilancia habitual."; }
      else if (fila.cambio === "mejora") { fila.decision = "parcial"; fila.texto = "Mejora respecto a la auditoría inicial, pero sin alcanzar el estándar. No se cierra: analizar los casos que siguen sin cumplir, ajustar las acciones y volver a medir."; }
      else if (rd.estado === "verde") { fila.decision = "vigilar"; fila.texto = "No hay evidencia de incumplimiento, pero el valor observado sigue por debajo del estándar. Mantener la vigilancia y repetir con una muestra mayor."; }
      else { fila.decision = "ineficaz"; fila.texto = "Sin mejora suficiente: las acciones no han sido eficaces. Revisar las causas y reforzar las medidas (mejor si cambian el sistema)."; }
      return fila;
    });
  }
  const DECISION_TXT = { cerrar: "Cerrar", parcial: "Mejora parcial: no cerrar", vigilar: "Vigilar", ineficaz: "Acciones no eficaces", pendiente: "Pendiente" };
  const FONDO_DECISION = { cerrar: "DCFCE7", parcial: "FEF3C7", vigilar: "FEF3C7", ineficaz: "FFE4E6", pendiente: "F1F5F9" };

  function bloquesComparacion(orig, seg) {
    const F = compararSeguimiento(orig, seg), txtR = (r, c) => !r || !r.n ? "—" : r.lqas && r.lqas.acepta != null ? `${r.textoValor} · LQAS ${r.lqas.acepta ? "acepta" : "rechaza"}` : r.textoValor;
    return [
      { t: "p", texto: `Comparación con la auditoría inicial «${orig.titulo}»${lleno(orig.diseno.periodo) ? " (" + orig.diseno.periodo + ")" : ""}.` },
      { t: "tabla", fuente: 8, cab: ["Nº", "Subproceso", "Indicador", "Antes", "Después", "Cambio", "Decisión"], anchos: [4, 14, 26, 15, 15, 9, 17], filas: F.map(f => [{ texto: String(f.i + 1), centro: true }, f.c.subproceso, f.c.ind.nombre, txtR(f.antes), txtR(f.despues), { texto: { mejora: "▲ Mejora", empeora: "▼ Empeora", igual: "= Igual" }[f.cambio] || "", centro: true }, { texto: DECISION_TXT[f.decision], negrita: true, fondo: FONDO_DECISION[f.decision] }]) },
      { t: "lista", items: F.filter(f => f.decision !== "pendiente").map(f => `Criterio ${f.i + 1} (${f.c.subproceso}): ${f.texto}`) }
    ];
  }

  function documentoPlanMejora(aud, fecha, hoyIso) {
    const AC = ordenarAcciones(aud.mejora.acciones), C = aud.criterios, rs = resumenAcciones(aud, hoyIso);
    const B = [{ t: "portada", titulo: "Plan de acción de mejora", sub: aud.titulo, extra: [aud.unidad, lleno(aud.mejora.fechaSeguimiento) ? "Auditoría de seguimiento prevista: " + fmtFecha(aud.mejora.fechaSeguimiento) : "", "Fecha: " + fecha].filter(lleno) }];
    B.push(...bloquesControl(aud.control), { t: "salto" });
    B.push({ t: "h1", texto: "1. Acciones de mejora" });
    B.push({ t: "p", texto: `${AC.length} acciones: ${Object.keys(ESTADOS_ACCION).map(k => `${rs[k]} ${ESTADOS_ACCION[k].toLowerCase()}`).join(", ")}${rs.vencidas ? `; ${rs.vencidas} con el plazo vencido` : ""}. Ordenadas por prioridad (criticidad × viabilidad).` });
    B.push({ t: "tabla", fuente: 8, cab: ["Nº", "Hallazgo", "Acción", "Responsable", "Plazo", "Prioridad", "Estado"], anchos: [4, 18, 32, 16, 12, 10, 8], filas: AC.map((a, i) => { const c = C.find(x => x.id === a.critId), z = zonaAccion(a); return [{ texto: String(i + 1), centro: true }, c ? c.hallazgo : "", a.accion, a.responsable, [fmtFecha(a.inicio), fmtFecha(a.fin)].filter(lleno).join(" – "), { texto: z ? z.nom : "", fondo: z ? { ya: "FFE4E6", planificar: "FFEDD5", pronto: "FEF3C7", rapida: "DCFCE7", reconsiderar: "F1F5F9" }[z.k] : "" }, { texto: ESTADOS_ACCION[a.estado], fondo: vencida(a, hoyIso) ? "FECDD3" : a.estado === "verificada" || a.estado === "hecha" ? "DCFCE7" : "" }]; }) });
    B.push({ t: "h1", texto: "2. Ficha de cada acción" });
    AC.forEach((a, i) => {
      const f = (k, v) => lleno(v) ? [[{ texto: k, negrita: true, fondo: "F1F5F9" }, v]] : [], z = zonaAccion(a);
      B.push({ t: "h2", texto: `Acción ${i + 1}` });
      B.push({ t: "tabla", sinCab: true, anchos: [26, 74], filas: [...f("Objetivo", a.objetivo), ...f("Acción", a.accion), ...f("Tipo de medida", FUERZAS[fuerzaMedida(a.accion)] ? FUERZAS[fuerzaMedida(a.accion)].nom : ""), ...f("Responsable", a.responsable), ...f("Inicio y fin", [fmtFecha(a.inicio), fmtFecha(a.fin)].filter(lleno).join(" – ")), ...f("Recursos", a.recursos), ...f("Indicador de seguimiento", a.indicador), ...f("Criticidad / viabilidad / impacto", [a.criticidad, a.viabilidad, a.impacto].some(lleno) ? `${NIVEL3[a.criticidad] || "—"} / ${NIVEL3[a.viabilidad] || "—"} / ${NIVEL3[a.impacto] || "—"}${z ? " → " + z.nom : ""}` : ""), ...f("Estado", ESTADOS_ACCION[a.estado] + (lleno(a.nota) ? ". " + a.nota : ""))] });
    });
    B.push({ t: "h1", texto: "3. Matriz criticidad × viabilidad" });
    const celda = (c, v) => AC.map((a, i) => n3(a.criticidad) === c && n3(a.viabilidad) === v ? String(i + 1) : null).filter(Boolean).join(", ");
    const fz = (c, v) => c + v >= 5 ? "FECDD3" : c === 3 && v === 1 ? "FFEDD5" : c + v === 4 ? "FEF3C7" : "F1F5F9";
    B.push({ t: "tabla", cab: ["Criticidad ↓ / Viabilidad →", "Baja", "Media", "Alta"], anchos: [28, 24, 24, 24], filas: [3, 2, 1].map(c => [{ texto: NIVEL3[c], negrita: true }, ...[1, 2, 3].map(v => ({ texto: celda(c, v), centro: true, negrita: true, fondo: fz(c, v) }))]) });
    B.push({ t: "p", estilo: "nota", texto: "Números = nº de acción. Rojo: hacer ya (muy crítica y viable). Naranja: crítica pero difícil (planificar recursos). Amarillo: siguiente en la cola. Gris: poco crítica." });
    B.push({ t: "h1", texto: "4. Seguimiento" });
    B.push({ t: "p", texto: `${lleno(aud.mejora.fechaSeguimiento) ? `La auditoría de seguimiento está prevista para el ${fmtFecha(aud.mejora.fechaSeguimiento)}.` : "Fecha de la auditoría de seguimiento pendiente de fijar."} Se repetirán los criterios con el mismo método para comprobar la eficacia de las acciones. Si la mejora es parcial, no se cerrará: se ajustarán las acciones y se volverá a medir.` });
    if (lleno(aud.mejora.notas)) B.push({ t: "p", texto: aud.mejora.notas });
    return { titulo: "Plan de acción de mejora · " + (aud.titulo || ""), bloques: B };
  }
  function hojasExcelMejora(aud, fecha, hoyIso) {
    const T = (texto, estilo = "celda") => ({ texto: texto == null ? "" : String(texto), estilo }), AC = ordenarAcciones(aud.mejora.acciones);
    const cab = ["Nº", "Criterio", "Objetivo", "Acción", "Tipo de medida", "Responsable", "Inicio", "Fin", "Recursos", "Indicador de seguimiento", "Criticidad", "Viabilidad", "Impacto", "Prioridad", "Estado", "Nota"];
    const f = [[T("Plan de acción de mejora · " + (aud.titulo || ""), "titulo")], [T("Exportado de la app Auditorías · " + fecha, "sub")], cab.map(x => T(x, "cab"))]; f[0][0].combinar = cab.length;
    AC.forEach((a, i) => { const c = aud.criterios.find(x => x.id === a.critId), z = zonaAccion(a); f.push([T(i + 1, "centro"), T(c ? (aud.criterios.indexOf(c) + 1) + ". " + c.subproceso : ""), T(a.objetivo), T(a.accion), T(FUERZAS[fuerzaMedida(a.accion)] ? FUERZAS[fuerzaMedida(a.accion)].nom : ""), T(a.responsable), T(fmtFecha(a.inicio), "centro"), T(fmtFecha(a.fin), vencida(a, hoyIso) ? "muyalto" : "centro"), T(a.recursos), T(a.indicador), T(NIVEL3[a.criticidad] || "", "centro"), T(NIVEL3[a.viabilidad] || "", "centro"), T(NIVEL3[a.impacto] || "", "centro"), T(z ? z.nom : ""), T(ESTADOS_ACCION[a.estado], "centro"), T(a.nota)]); });
    return { estilos: ESTILOS_XLSX, hojas: [{ nombre: "Plan de mejora", filas: f, opciones: { anchoColumnas: [5, 22, 30, 40, 16, 22, 11, 11, 24, 30, 10, 10, 10, 22, 11, 30], congelar: { filas: 3, columnas: 0 }, altoFilas: { 1: 24 } } }] };
  }

  // Excel del plan: hoja con el plan y hoja con el cronograma
  function hojasExcelPlan(plan, mapas, fecha) {
    const T = (texto, estilo = "celda") => ({ texto: texto == null ? "" : String(texto), estilo });
    const titulo = "Plan Anual de Auditorías" + (lleno(plan.anio) ? " " + plan.anio : "");
    const cab = ["Nº", "Auditoría", "Tipo", "Hallazgos", "IPR máx.", "Alcance", "Criterios de referencia", "Documentos y fuentes", "Frecuencia", "Responsables", "Recursos", "Horas/ronda", "Meses", "Observaciones"];
    const f1 = [[T(titulo, "titulo")], [T([plan.ambito, "Exportado de la app Auditorías · " + fecha].filter(lleno).join(" · "), "sub")], cab.map(x => T(x, "cab"))];
    f1[0][0].combinar = cab.length;
    plan.entradas.forEach((e, i) => { const p = prioridadEntrada(e, mapas); f1.push([T(i + 1, "centro"), T(e.titulo), T(TIPOS_ENTRADA[e.tipo].nom), T(hallazgosDeEntrada(e, mapas).join("\n")), p.ipr ? { numero: p.ipr, estilo: nivelIPR(p.ipr).k } : T(""), T(e.alcance), T(e.criterios), T(e.documentos), T(FRECUENCIAS[e.frecuencia] ? FRECUENCIAS[e.frecuencia].nom : ""), T(e.responsables), T(e.recursos), T(e.horas, "centro"), T(textoMeses(e.meses)), T(e.observaciones)]); });
    const f2 = [[T("Cronograma " + (plan.anio || ""), "titulo")], [T("■ = mes con auditoría", "sub")], ["Auditoría", ...MESES].map(x => T(x, "cab"))];
    f2[0][0].combinar = 13;
    plan.entradas.forEach(e => f2.push([T(e.titulo), ...MESES.map((_, m) => T(e.meses.includes(m + 1) ? "■" : "", e.meses.includes(m + 1) ? "clave" : "centro"))]));
    f2.push([T("Auditorías en el mes", "cab"), ...cargaMensual(plan).n.map(n => n ? { numero: n, estilo: n > capacidadDe(plan) ? "muyalto" : "centro" } : T("", "centro"))]);
    return { estilos: ESTILOS_XLSX, hojas: [
      { nombre: "Plan", filas: f1, opciones: { anchoColumnas: [5, 28, 16, 40, 8, 34, 34, 28, 12, 26, 28, 9, 20, 30], congelar: { filas: 3, columnas: 0 }, altoFilas: { 1: 24 } } },
      { nombre: "Cronograma", filas: f2, opciones: { anchoColumnas: [36, ...Array(12).fill(6)], congelar: { filas: 3, columnas: 1 }, altoFilas: { 1: 24 } } }
    ] };
  }

  // ---------- Saneado por esquema (lo que se carga o se importa nunca se usa sin pasar por aquí) ----------
  // [max] = texto; "b" = sí/no; "id" = id propio; "ref" = id de otro objeto; {en} = enumerado;
  // {lista: max, max} = lista de textos; {de: esquema, max} = lista de objetos; {obj: esquema} = objeto anidado
  const idValido = v => typeof v === "string" && /^[a-z0-9-]{1,40}$/i.test(v);
  const txt = (v, max) => (typeof v === "string" || typeof v === "number") ? String(v).slice(0, max) : "";
  const ESQ = {
    riesgo: { id: "id", subproceso: [200], fallo: [1000], efecto: [1000], causa: [1000], g: [3], o: [3], d: [3], medidas: [1000], clave: "b", accion: [1000], evidencia: [1000], motivo: [1000] },
    mapa: { id: "id", nombre: [200], unidad: [200], proceso: [300], fecha: [40], equipo: [1000], notas: [3000], subprocesos: { lista: 200, max: 60 }, riesgos: { de: "riesgo", max: 400 }, creado: [40], modificado: [40] },
    origen: { tipo: { en: ["", ...Object.keys(ORIGENES)] }, mapaId: "ref", riesgoIds: { lista: "ref", max: 200 }, detalle: [2000] },
    ind: { nombre: [500], tipo: { en: ["", ...Object.keys(TIPOS_IND)] }, numerador: [1000], denominador: [1000], sentido: { en: ["mas", "menos"] }, estandar: [10], fuente: [1000], exclusiones: [1000], cumpleSi: [1500], noAplicaSi: [1000] },
    evid: { tipos: { lista: 20, max: 4, en: Object.keys(EVIDENCIAS) }, triangulacion: [2000], principios: { lista: 20, max: 6, en: Object.keys(PRINCIPIOS) }, instrumentos: { lista: 20, max: 5, en: Object.keys(INSTRUMENTOS) }, justificacion: [2000] },
    muestra: { objetivo: { en: ["", ...Object.keys(OBJETIVOS_MUESTRA)] }, N: [8], e: [5], p: [5], beta: { en: ["20", "10"] }, umbral: [5], n: [6], metodo: { en: ["", ...Object.keys(METODOS_SEL)] }, unidad: [300], sorteo: { nums: [1, 100000], max: 2000 } },
    par: { a: { en: ["", "si", "no", "na"] }, b: { en: ["", "si", "no", "na"] } },
    piloto: { pares: { de: "par", max: 50 }, nota: [1500] },
    diseno: { poblacion: [2000], periodo: [300], fuentes: [2000], equipo: [3000], recursos: [3000], metodologia: [3000] },
    caso: { codigo: [40], listado: [8], valor: { en: ["", "si", "no", "na"] }, obs: [500] },
    recogida: { casos: { de: "caso", max: 2000 }, evidencia: [2000], comentario: [3000], observaciones: [3000] },
    ejecucion: { inicio: [20], fin: [20], auditores: [1000], incidencias: [3000] },
    rec: { id: "id", texto: [1500], responsable: [300], prioridad: { en: ["", ...Object.keys(PRIORIDADES)] }, motivo: [1000], plazo: [100] },
    analisis: { clasif: { en: ["", ...Object.keys(CLASIF)] }, interpretacion: [3000], porques: { lista: 1000, max: 5, keepEmpty: 5 }, categorias: { lista: 20, max: 6, en: Object.keys(CATEGORIAS_CAUSA) }, causaRaiz: [2000], recs: { de: "rec", max: 20 } },
    informe: { conclusiones: [5000], fortalezas: [3000], resumen: [5000], destinatarios: [500], estado: { en: Object.keys(ESTADOS_INFORME) } },
    accion: { id: "id", critId: "ref", recId: "ref", objetivo: [1000], accion: [1500], responsable: [300], inicio: [20], fin: [20], recursos: [1000], indicador: [800], criticidad: { en: ["", "1", "2", "3"] }, viabilidad: { en: ["", "1", "2", "3"] }, impacto: { en: ["", "1", "2", "3"] }, estado: { en: Object.keys(ESTADOS_ACCION) }, nota: [1000] },
    mejora: { acciones: { de: "accion", max: 200 }, fechaSeguimiento: [20], seguimientoId: "ref", notas: [3000] },
    criterio: { id: "id", subproceso: [200], riesgoId: "ref", origenId: "ref", hallazgo: [1000], criterio: [1000], ind: { obj: "ind" }, evid: { obj: "evid" }, muestra: { obj: "muestra" }, piloto: { obj: "piloto" }, recogida: { obj: "recogida" }, analisis: { obj: "analisis" } },
    hito: { hecho: "b", fecha: [20], nota: [500] },
    hitos: { aprobacion: { obj: "hito" }, comunicacion: { obj: "hito" }, validacion: { obj: "hito" }, devolucion: { obj: "hito" } },
    auditoria: { id: "id", titulo: [300], unidad: [200], proceso: [300], centro: [200], origen: { obj: "origen" }, tipo: { en: Object.keys(TIPOS_AUD) }, objeto: { en: Object.keys(OBJETOS_AUD) }, introduccion: [4000], objetivoGeneral: [2000], objetivosEsp: [4000], alcance: [3000], planId: "ref", entradaId: "ref", hitos: { obj: "hitos" }, diseno: { obj: "diseno" }, control: { obj: "control" }, ejecucion: { obj: "ejecucion" }, informe: { obj: "informe" }, mejora: { obj: "mejora" }, seguimientoDe: "ref", criterios: { de: "criterio", max: 100 }, creado: [40], modificado: [40] },
    persona: { nombre: [200], cargo: [200] },
    revision: { edicion: [10], fecha: [40], cambio: [500] },
    control: { elaborado: { de: "persona", max: 10 }, revisado: { de: "persona", max: 10 }, aprobado: { de: "persona", max: 10 }, historial: { de: "revision", max: 50 } },
    roles: { coordinacion: [1000], equipo: [1000], revision: [1000], direccion: [1000], auditados: [1000] },
    aprobacion: { fecha: [20], comunicado: "b", fechaComunicacion: [20], via: [300] },
    entrada: { id: "id", titulo: [300], mapaId: "ref", riesgoIds: { lista: "ref", max: 100 }, hallazgos: [3000], alcance: [3000], criterios: [3000], tiposCriterio: { lista: 20, max: 4, en: Object.keys(TIPOS_CRITERIO) }, documentos: [2000], frecuencia: { en: ["", ...Object.keys(FRECUENCIAS)] }, responsables: [500], recursos: [1500], horas: [6], meses: { nums: [1, 12], max: 12 }, tipo: { en: Object.keys(TIPOS_ENTRADA) }, observaciones: [1500], auditoriaId: "ref" },
    plan: { id: "id", anio: [10], ambito: [300], responsable: [300], objetivo: [2000], introduccion: [4000], notas: [3000], capacidad: [3], bloqueados: { nums: [1, 12], max: 12 }, entradas: { de: "entrada", max: 100 }, roles: { obj: "roles" }, aprobacion: { obj: "aprobacion" }, control: { obj: "control" }, creado: [40], modificado: [40] }
  };
  const FABRICA = { riesgo: nuevoRiesgo, mapa: id => nuevoMapa(id, ""), origen: () => nuevaAuditoria("", "").origen, criterio: nuevoCriterio, auditoria: id => nuevaAuditoria(id, ""),
    hito: nuevoHito, hitos: nuevosHitos, ind: nuevoInd, evid: nuevaEvid, muestra: nuevaMuestra, piloto: nuevoPiloto, par: () => ({ a: "", b: "" }), diseno: nuevoDiseno, caso: () => nuevoCaso(), recogida: nuevaRecogida, ejecucion: nuevaEjecucion, rec: nuevaRec, analisis: nuevoAnalisis, informe: nuevoInforme, accion: nuevaAccion, mejora: nuevaMejora, persona: nuevaPersona, revision: () => ({ edicion: "", fecha: "", cambio: "" }),
    control: () => ({ elaborado: [], revisado: [], aprobado: [], historial: [] }), roles: () => nuevoPlan("", "").roles, aprobacion: () => nuevoPlan("", "").aprobacion,
    entrada: nuevaEntrada, plan: id => nuevoPlan(id, "") };

  function sanear(esq, o, genId) {
    if (!o || typeof o !== "object" || Array.isArray(o)) return null;
    const S = ESQ[esq], r = FABRICA[esq](genId());
    Object.keys(S).forEach(k => {
      const regla = S[k], v = o[k];
      if (regla === "id") r[k] = idValido(v) ? v : r[k];
      else if (regla === "ref") r[k] = idValido(v) ? v : "";
      else if (regla === "b") r[k] = v === true;
      else if (Array.isArray(regla)) { if (v !== undefined) r[k] = txt(v, regla[0]); }
      else if (regla.en && !regla.lista) r[k] = regla.en.includes(v) ? v : r[k];
      else if (regla.nums) r[k] = Array.isArray(v) ? [...new Set(v.filter(x => Number.isInteger(x) && x >= regla.nums[0] && x <= regla.nums[1]))].slice(0, regla.max).sort((a, b) => a - b) : [];
      else if (regla.keepEmpty) r[k] = Array.from({ length: regla.keepEmpty }, (_, j) => Array.isArray(v) ? txt(v[j], regla.lista) : "");
      else if (regla.lista) r[k] = Array.isArray(v) ? [...new Set(v.slice(0, regla.max * 2).map(x => regla.lista === "ref" ? (idValido(x) ? x : "") : txt(x, regla.lista)).filter(x => x && (!regla.en || regla.en.includes(x))))].slice(0, regla.max) : [];
      else if (regla.de) r[k] = Array.isArray(v) ? v.slice(0, regla.max).map(x => sanear(regla.de, x, genId)).filter(Boolean) : [];
      else if (regla.obj) r[k] = sanear(regla.obj, v, genId) || r[k];
    });
    return r;
  }
  function sanearDatos(o, genId, fecha) {
    if (!o || typeof o !== "object" || (!Array.isArray(o.mapas) && !Array.isArray(o.auditorias) && !Array.isArray(o.planes))) return null;
    const lista = (arr, esq, max) => Array.isArray(arr) ? arr.slice(0, max).map(x => sanear(esq, x, genId)).filter(Boolean) : [];
    const mapas = lista(o.mapas, "mapa", 200), auditorias = lista(o.auditorias, "auditoria", 500), planes = lista(o.planes, "plan", 100);
    [...mapas, ...auditorias, ...planes].forEach(x => { if (!x.creado) x.creado = fecha; if (!x.modificado) x.modificado = x.creado; });
    return { mapas, auditorias, planes };
  }
  // Fusiona sin duplicar: si un id ya existe se conserva el más reciente
  function fusionar(actual, nuevo) {
    const une = (a, b) => {
      const m = new Map(a.map(x => [x.id, x]));
      b.forEach(x => { const y = m.get(x.id); if (!y || String(x.modificado) > String(y.modificado)) m.set(x.id, x); });
      return Array.from(m.values());
    };
    return { mapas: une(actual.mapas, nuevo.mapas), auditorias: une(actual.auditorias, nuevo.auditorias), planes: une(actual.planes || [], nuevo.planes || []) };
  }

  // ---------- Excel ----------
  const ESTILOS_XLSX = {
    titulo: { negrita: true, tamano: 14, colorTexto: "FFFFFF", colorFondo: "0B6F66", borde: false },
    sub: { cursiva: true, colorTexto: "444444", borde: false },
    cab: { negrita: true, colorTexto: "FFFFFF", colorFondo: "0D1B2A", alineacion: "center", ajustarTexto: true },
    celda: { ajustarTexto: true, vertical: "top" },
    centro: { alineacion: "center", vertical: "top", ajustarTexto: true },
    muyalto: { negrita: true, alineacion: "center", vertical: "top", colorFondo: "FFE4E6", colorTexto: "881337" },
    alto: { negrita: true, alineacion: "center", vertical: "top", colorFondo: "FFEDD5", colorTexto: "9A3412" },
    medio: { alineacion: "center", vertical: "top", colorFondo: "FEF3C7", colorTexto: "92400E" },
    bajo: { alineacion: "center", vertical: "top", colorFondo: "DCFCE7", colorTexto: "14532D" },
    clave: { negrita: true, alineacion: "center", vertical: "top", colorTexto: "0B6F66" }
  };
  function hojasExcelMapa(mapa, fecha) {
    const T = (texto, estilo = "celda") => ({ texto: texto == null ? "" : String(texto), estilo });
    const P = puestos(mapa.riesgos), lista = ordenarRiesgos(mapa.riesgos);
    const cab = ["Puesto", "Subproceso", "Fallo", "Efecto", "Causa", "G", "O", "D", "IPR", "Nivel", "Medidas actuales", "Clave", "Acción de mejora propuesta", "Evidencia esperada", "Motivo de elección"];
    const titulo = "Mapa de Riesgos" + (lleno(mapa.nombre) ? " · " + mapa.nombre : "");
    const filas = [[T(titulo, "titulo")], [T([mapa.unidad, mapa.proceso, "Exportado de la app Auditorías · " + fecha].filter(lleno).join(" · "), "sub")], cab.map(x => T(x, "cab"))];
    filas[0][0].combinar = cab.length;
    lista.forEach(r => {
      const v = iprDe(r), n = nivelIPR(v);
      filas.push([T(P[r.id] || "", "centro"), T(r.subproceso), T(r.fallo), T(r.efecto), T(r.causa), T(r.g, "centro"), T(r.o, "centro"), T(r.d, "centro"),
        v ? { numero: v, estilo: n.k } : T("", "centro"), T(n ? n.nom : "", "centro"), T(r.medidas), T(r.clave ? "★" : "", "clave"), T(r.accion), T(r.evidencia), T(r.motivo)]);
    });
    return { estilos: ESTILOS_XLSX, hojas: [{ nombre: "Mapa de Riesgos", filas, opciones: { anchoColumnas: [8, 22, 34, 30, 30, 5, 5, 5, 7, 10, 28, 7, 34, 30, 30], congelar: { filas: 3, columnas: 0 }, altoFilas: { 1: 24 } } }] };
  }

  const API = {
    VERSION_DATOS, URL_TM, URL_IND, NIVELES_IPR, ORIGENES, TIPOS_AUD, OBJETOS_AUD, FASES, PDCA,
    lleno, sinTildes, num, nfmt, entero1a10, corto,
    ipr, iprDe, nivelIPR, ordenarRiesgos, puestos, resumenMapa, avisosMapa, sugerirMotivo, parsearTabla,
    nuevoMapa, nuevoRiesgo, nuevoCriterio, nuevaAuditoria, criteriosDesdeRiesgos, deArt, sugerirTitulo, sugerirObjetivo, progresoInicio, siguientePaso,
    ESTADOS_ACCION, NIVEL3, nuevaAccion, accionesDesdeRecs, zonaAccion, ordenarAcciones, vencida, avisosMejora, progresoMejora, resumenAcciones,
    crearSeguimiento, compararSeguimiento, DECISION_TXT, bloquesComparacion, documentoPlanMejora, hojasExcelMejora,
    CLASIF, CATEGORIAS_CAUSA, PRIORIDADES, ESTADOS_INFORME, FUERZAS, nuevaRec, clasificacionSugerida, interpretacionSugerida, fuerzaMedida, palabrasNoNeutras,
    avisosInforme, progresoInforme, resumenEjecutivoSugerido, documentoInforme, documentoResumenEjecutivo,
    nuevoCaso, pareceIdentificador, prepararCasos, margen95, resultadoCriterio, avisosRecogida, progresoRecogida, sugerirEvidencia, ESTADO_TXT, documentoResultados, hojasExcelRecogida,
    TIPOS_IND, EVIDENCIAS, PRINCIPIOS, INSTRUMENTOS, OBJETIVOS_MUESTRA, METODOS_SEL, LQ_COLS,
    formulaInd, textoEstandar, estandarCumplimiento, tamEstimar, margenError, lqas, opcionesLqas, calcMuestra, sortear, concordancia, avisosDiseno, progresoDiseno, indicadoresDeCopia,
    fmtFecha, sinArticulo, HITOS, nuevosHitos, nuevoControl, nuevaPersona, FRECUENCIAS, TIPOS_ENTRADA, TIPOS_CRITERIO, MESES, MESES_LARGO,
    nuevoPlan, nuevaEntrada, riesgosDeEntrada, hallazgosDeEntrada, prioridadEntrada, frecuenciaSugerida, rondas, cargaMensual, capacidadDe, textoMeses,
    repartir, avisosPlan, progresoPlan, entradasDesdeMapa, documentoPlan, documentoMapa, documentoPlanEspecifico, documentoHoja, hojasExcelPlan,
    sanear, sanearDatos, fusionar, hojasExcelMapa
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else raiz.Logica = API;
})(typeof window !== "undefined" ? window : globalThis);
