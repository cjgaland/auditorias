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
      tipo: "interna", objeto: "proceso", introduccion: "", objetivoGeneral: "", objetivosEsp: "",
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
    const conClaveSinAud = mapas.find(m => m.riesgos.some(r => r.clave) && !auds.some(a => a.origen.mapaId === m.id));
    if (conClaveSinAud) return { k: "auditar", texto: `Ya tienes hallazgos clave en «${corto(conClaveSinAud.nombre || "tu mapa", 50)}». Crea la auditoría que los va a comprobar.`, href: "#/auditoria/nueva?mapa=" + conClaveSinAud.id, btn: "Crear la auditoría" };
    const incompleta = auds.find(a => { const p = progresoInicio(a); return p.hechos < p.total; });
    if (incompleta) return { k: "completar", texto: `Completa los datos de inicio de «${corto(incompleta.titulo || "tu auditoría", 50)}»: origen, unidad, objetivo y subprocesos.`, href: "#/auditoria/" + incompleta.id, btn: "Seguir con la auditoría" };
    return { k: "plan", texto: "Tienes el punto de partida listo. El siguiente paso será el Plan Anual (alcance, criterios, frecuencia y cronograma), que llegará en la próxima versión. Mientras, repasa «Aprende».", href: "#/aprende/2", btn: "Repasar la planificación" };
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
    auditoria: { id: "id", titulo: [300], unidad: [200], proceso: [300], centro: [200], origen: { obj: "origen" }, tipo: { en: Object.keys(TIPOS_AUD) }, objeto: { en: Object.keys(OBJETOS_AUD) }, introduccion: [4000], objetivoGeneral: [2000], objetivosEsp: [4000], criterios: { de: "criterio", max: 100 }, creado: [40], modificado: [40] }
  };
  const FABRICA = { riesgo: nuevoRiesgo, mapa: id => nuevoMapa(id, ""), origen: () => nuevaAuditoria("", "").origen, criterio: nuevoCriterio, auditoria: id => nuevaAuditoria(id, "") };

  function sanear(esq, o, genId) {
    if (!o || typeof o !== "object" || Array.isArray(o)) return null;
    const S = ESQ[esq], r = FABRICA[esq](genId());
    Object.keys(S).forEach(k => {
      const regla = S[k], v = o[k];
      if (regla === "id") r[k] = idValido(v) ? v : r[k];
      else if (regla === "ref") r[k] = idValido(v) ? v : "";
      else if (regla === "b") r[k] = v === true;
      else if (Array.isArray(regla)) { if (v !== undefined) r[k] = txt(v, regla[0]); }
      else if (regla.en) r[k] = regla.en.includes(v) ? v : r[k];
      else if (regla.lista) r[k] = Array.isArray(v) ? v.slice(0, regla.max).map(x => regla.lista === "ref" ? (idValido(x) ? x : "") : txt(x, regla.lista)).filter(Boolean) : [];
      else if (regla.de) r[k] = Array.isArray(v) ? v.slice(0, regla.max).map(x => sanear(regla.de, x, genId)).filter(Boolean) : [];
      else if (regla.obj) r[k] = sanear(regla.obj, v, genId) || r[k];
    });
    return r;
  }
  function sanearDatos(o, genId, fecha) {
    if (!o || typeof o !== "object" || (!Array.isArray(o.mapas) && !Array.isArray(o.auditorias))) return null;
    const lista = (arr, esq, max) => Array.isArray(arr) ? arr.slice(0, max).map(x => sanear(esq, x, genId)).filter(Boolean) : [];
    const mapas = lista(o.mapas, "mapa", 200), auditorias = lista(o.auditorias, "auditoria", 500);
    [...mapas, ...auditorias].forEach(x => { if (!x.creado) x.creado = fecha; if (!x.modificado) x.modificado = x.creado; });
    return { mapas, auditorias };
  }
  // Fusiona sin duplicar: si un id ya existe se conserva el más reciente
  function fusionar(actual, nuevo) {
    const une = (a, b) => {
      const m = new Map(a.map(x => [x.id, x]));
      b.forEach(x => { const y = m.get(x.id); if (!y || String(x.modificado) > String(y.modificado)) m.set(x.id, x); });
      return Array.from(m.values());
    };
    return { mapas: une(actual.mapas, nuevo.mapas), auditorias: une(actual.auditorias, nuevo.auditorias) };
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
    sanear, sanearDatos, fusionar, hojasExcelMapa
  };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else raiz.Logica = API;
})(typeof window !== "undefined" ? window : globalThis);
