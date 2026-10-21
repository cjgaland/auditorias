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
    return { id, subproceso: "", riesgoId: "", hallazgo: "", criterio: "" };
  }
  function nuevaAuditoria(id, fecha) {
    return {
      id, titulo: "", unidad: "", proceso: "", centro: "",
      origen: { tipo: "", mapaId: "", riesgoIds: [], detalle: "" },
      tipo: "interna", objeto: "proceso", introduccion: "", objetivoGeneral: "", objetivosEsp: "", alcance: "",
      planId: "", entradaId: "", hitos: nuevosHitos(),
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
    return { k: "diseno", texto: "Tienes el punto de partida y la planificación listos. El siguiente paso será el diseño de cada auditoría (indicadores, evidencias, instrumentos y muestra), que llegará en la próxima versión. Mientras, repasa «Aprende».", href: "#/aprende/3", btn: "Repasar indicadores" };
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
    criterio: { id: "id", subproceso: [200], riesgoId: "ref", hallazgo: [1000], criterio: [1000] },
    hito: { hecho: "b", fecha: [20], nota: [500] },
    hitos: { aprobacion: { obj: "hito" }, comunicacion: { obj: "hito" }, validacion: { obj: "hito" }, devolucion: { obj: "hito" } },
    auditoria: { id: "id", titulo: [300], unidad: [200], proceso: [300], centro: [200], origen: { obj: "origen" }, tipo: { en: Object.keys(TIPOS_AUD) }, objeto: { en: Object.keys(OBJETOS_AUD) }, introduccion: [4000], objetivoGeneral: [2000], objetivosEsp: [4000], alcance: [3000], planId: "ref", entradaId: "ref", hitos: { obj: "hitos" }, criterios: { de: "criterio", max: 100 }, creado: [40], modificado: [40] },
    persona: { nombre: [200], cargo: [200] },
    revision: { edicion: [10], fecha: [40], cambio: [500] },
    control: { elaborado: { de: "persona", max: 10 }, revisado: { de: "persona", max: 10 }, aprobado: { de: "persona", max: 10 }, historial: { de: "revision", max: 50 } },
    roles: { coordinacion: [1000], equipo: [1000], revision: [1000], direccion: [1000], auditados: [1000] },
    aprobacion: { fecha: [20], comunicado: "b", fechaComunicacion: [20], via: [300] },
    entrada: { id: "id", titulo: [300], mapaId: "ref", riesgoIds: { lista: "ref", max: 100 }, hallazgos: [3000], alcance: [3000], criterios: [3000], tiposCriterio: { lista: 20, max: 4, en: Object.keys(TIPOS_CRITERIO) }, documentos: [2000], frecuencia: { en: ["", ...Object.keys(FRECUENCIAS)] }, responsables: [500], recursos: [1500], horas: [6], meses: { nums: [1, 12], max: 12 }, tipo: { en: Object.keys(TIPOS_ENTRADA) }, observaciones: [1500], auditoriaId: "ref" },
    plan: { id: "id", anio: [10], ambito: [300], responsable: [300], objetivo: [2000], introduccion: [4000], notas: [3000], capacidad: [3], bloqueados: { nums: [1, 12], max: 12 }, entradas: { de: "entrada", max: 100 }, roles: { obj: "roles" }, aprobacion: { obj: "aprobacion" }, control: { obj: "control" }, creado: [40], modificado: [40] }
  };
  const FABRICA = { riesgo: nuevoRiesgo, mapa: id => nuevoMapa(id, ""), origen: () => nuevaAuditoria("", "").origen, criterio: nuevoCriterio, auditoria: id => nuevaAuditoria(id, ""),
    hito: nuevoHito, hitos: nuevosHitos, persona: nuevaPersona, revision: () => ({ edicion: "", fecha: "", cambio: "" }),
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
    fmtFecha, sinArticulo, HITOS, nuevosHitos, nuevoControl, nuevaPersona, FRECUENCIAS, TIPOS_ENTRADA, TIPOS_CRITERIO, MESES, MESES_LARGO,
    nuevoPlan, nuevaEntrada, riesgosDeEntrada, hallazgosDeEntrada, prioridadEntrada, frecuenciaSugerida, rondas, cargaMensual, capacidadDe, textoMeses,
    repartir, avisosPlan, progresoPlan, entradasDesdeMapa, documentoPlan, documentoMapa, hojasExcelPlan,
    sanear, sanearDatos, fusionar, hojasExcelMapa
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else raiz.Logica = API;
})(typeof window !== "undefined" ? window : globalThis);
