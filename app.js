// ============================================================
//  app.js — UI y estado · Auditorías
//  Las reglas viven en logic.js (funciones puras), los textos didácticos y
//  ejemplos en contenido.js y el Excel en xlsx.js.
//  Aquí: datos en localStorage, enrutado por hash, panel de inicio, Mapa de
//  Riesgos, auditoría (inicio), ejemplos, Aprende, glosario, PDF, copias.
// ============================================================
(function () {
  "use strict";
  const L = window.Logica, C = window.Contenido;

  // ---------- Versión y novedades ----------
  // Al publicar cambios: añadir una entrada AL PRINCIPIO de NOVEDADES, poner su versión en los ?v= de index.html, en
  // APP_VERSION y subir CACHE_NAME en sw.js. Formato de versión: AAAA.NN.
  const APP_VERSION = "2026.19";
  const NOVEDADES = [
    // [eco]
    { version: "2026.19", fecha: "Octubre 2026", titulo: "Auditar las acciones de un análisis de causas", cambios: [
      "Nuevo botón «Traer de ACR · Ishikawa» en «Mis auditorías»: elige un análisis causa raíz o un diagrama de Ishikawa hecho con esa app y sus acciones de mejora, y se crea una auditoría nueva con un criterio por acción (su indicador, el del criterio) para comprobar con una muestra si se aplican. Funciona en este navegador o con la copia .json de ACR · Ishikawa.", "Nuevo origen de una auditoría: «Análisis de causas»."] },
    { version: "2026.18", fecha: "Octubre 2026", titulo: "Nueva app hermana: ACR · Ishikawa", cambios: [
      "Enlace a la nueva app hermana ACR · Ishikawa en la portada y en «Acerca de»: busca las causas de fondo de un problema o de un incidente con el diagrama de Ishikawa (espina de pescado) y el análisis causa raíz, sin buscar culpables; sus acciones de mejora llevan indicador."] },
    { version: "2026.17", fecha: "Octubre 2026", titulo: "Traer de Lectura Crítica", cambios: [
      "Nuevo origen «Evidencia científica»: con «Traer de Lectura Crítica» la evidencia de un artículo que hayas leído con esa app queda como origen de la auditoría, y su pregunta PICO se convierte en un criterio («En…, se aplica: …») que puedes ajustar. Avisa si la decisión fue esperar o descartar."] },
    { version: "2026.16", fecha: "Octubre 2026", titulo: "Nueva app hermana: Lectura Crítica", cambios: [
      "Enlace a la nueva app hermana Lectura Crítica en la portada y en «Acerca de»: lee críticamente un artículo paso a paso (plantillas de CASPe con preguntas propias, calculadoras y un veredicto con semáforo) antes de cambiar la práctica."] },
    { version: "2026.15", fecha: "Octubre 2026", titulo: "Nueva herramienta de apoyo: Legibilidad", cambios: [
      "En «Acerca de», el grupo «Herramientas de apoyo» suma Legibilidad: mide con el índice de Flesch-Szigriszt y la escala INFLESZ si un texto para pacientes se entiende y te dice qué cambiar."] },
    { version: "2026.14", fecha: "Octubre 2026", titulo: "La copia sin conexión de las otras apps ya no se borra", cambios: [
      "Arreglado un fallo: al actualizarse esta app se borraba la copia sin conexión de las demás apps del ecosistema (y al revés). Ahora cada app solo limpia la suya, así que todas siguen funcionando sin conexión."] },
    { version: "2026.13", fecha: "Octubre 2026", titulo: "Herramientas de apoyo y portal de las apps", cambios: [
      "En «Acerca de», nuevo grupo «Herramientas de apoyo»: el Anonimizador RGPD (seudonimiza o anonimiza una hoja de cálculo sin que los datos salgan de tu navegador) y el Normalizador Bibliográfico (pon tus referencias en Vancouver, APA y otros estilos).",
      "Y un enlace al portal cjgaland.github.io, la página que reúne todas las apps y explica cómo encajan."] },
    { version: "2026.12", fecha: "Octubre 2026", titulo: "Traer de Rondas de Seguridad", cambios: [
      "Nueva app hermana Rondas de Seguridad (las rondas de seguridad de una unidad, a pie de cama), enlazada en la portada y en «Acerca de».",
      "Nuevo botón «Traer de Rondas de Seguridad» en «Mis auditorías» y en el paso 1 del Plan Anual: trae los puntos calientes de tus rondas (lo que no se cumple en 2 de las 3 últimas rondas o en todas las de un turno) como criterios de una auditoría nueva o como una auditoría del plan, con su dato. Funciona en este navegador o con la copia .json de Rondas.",
      "Nuevo origen de una auditoría: «Rondas de seguridad».",
      "Los datos se copian: si las rondas cambian, se vuelven a traer."] },
    { version: "2026.11", fecha: "Octubre 2026", titulo: "Traer de Mapa de Riesgos", cambios: [
      "Nueva app hermana Mapa de Riesgos (del flujograma al mapa de riesgos de un proceso, con su AMFE), enlazada en la portada y en «Acerca de».",
      "Nuevo botón «Traer de Mapa de Riesgos» en el Mapa de Riesgos: crea un mapa con los fallos y los hallazgos clave de un mapa hecho en esa app (en este navegador o desde su copia .json), con la acción, el indicador y el motivo ya preparados para auditar.",
      "Los datos se copian: si el mapa cambia, se vuelve a traer."] },
    { version: "2026.10", fecha: "Octubre 2026", titulo: "Nuevas apps hermanas: Flujograma y DAFO · CAME", cambios: [
      "Enlaces a las nuevas apps hermanas Flujograma (dibuja el flujograma de un proceso con sus puntos críticos) y DAFO · CAME (análisis DAFO de una unidad y plan de acción) en la portada y en «Acerca de»."] },
    { version: "2026.09", fecha: "Octubre 2026", titulo: "Traer de AMFE", cambios: [
      "Nuevo botón «Traer de AMFE» en el Mapa de Riesgos: crea un mapa con los fallos, sus G·O·D y las medidas actuales de un AMFE hecho en la app AMFE de este navegador o en su copia .json.",
      "Los fallos prioritarios llegan como hallazgos clave, con la acción de mejora, el indicador como evidencia esperada y el motivo de elección.",
      "Los datos se copian: si el AMFE cambia, se vuelve a traer."] },
    { version: "2026.08", fecha: "Octubre 2026", titulo: "Nueva app hermana: AMFE", cambios: [
      "Enlace a la nueva app hermana AMFE (Análisis Modal de Fallos y Efectos) en la portada y en «Acerca de»: analiza los fallos de un proceso, puntúa G·O·D e IPR y decide cuáles priorizar."] },
    // [/eco]
    /* [ind]
    { version: "2026.19", fecha: "Octubre 2026", titulo: "Auditar las acciones de un análisis de causas", cambios: [
      "Nuevo botón «Cargar archivo de ACR · Ishikawa» en «Mis auditorías»: con la copia de seguridad (.json) de la app ACR · Ishikawa, elige un análisis y sus acciones de mejora y se crea una auditoría nueva con un criterio por acción (su indicador, el del criterio) para comprobar si se aplican.", "Nuevo origen de una auditoría: «Análisis de causas»."] },
    { version: "2026.17", fecha: "Octubre 2026", titulo: "Evidencia de Lectura Crítica", cambios: [
      "Nuevo origen «Evidencia científica»: con «Cargar archivo de Lectura Crítica» la evidencia de un artículo leído con la app Lectura Crítica (desde su copia de seguridad .json) queda como origen de la auditoría, y su pregunta PICO se convierte en un criterio («En…, se aplica: …») que puedes ajustar. Avisa si la decisión fue esperar o descartar."] },
    { version: "2026.12", fecha: "Octubre 2026", titulo: "Cargar archivo de Rondas de Seguridad", cambios: [
      "Nuevo botón «Cargar archivo de Rondas de Seguridad» en «Mis auditorías» y en el paso 1 del Plan Anual: con la copia de seguridad (.json) de la app Rondas de Seguridad, trae los puntos calientes (lo que no se cumple en 2 de las 3 últimas rondas o en todas las de un turno) como criterios de una auditoría nueva o como una auditoría del plan, con su dato.",
      "Nuevo origen de una auditoría: «Rondas de seguridad»."] },
    { version: "2026.11", fecha: "Octubre 2026", titulo: "Cargar archivo de Mapa de Riesgos", cambios: [
      "Nuevo botón «Cargar archivo de Mapa de Riesgos» en el Mapa de Riesgos: con la copia de seguridad (.json) de la app Mapa de Riesgos, crea un mapa con los fallos y los hallazgos clave, con la acción, el indicador y el motivo ya preparados para auditar."] },
    { version: "2026.09", fecha: "Octubre 2026", titulo: "Cargar archivo de AMFE", cambios: [
      "Nuevo botón «Cargar archivo de AMFE» en el Mapa de Riesgos: con la copia de seguridad (.json) de la app AMFE, crea un mapa con los fallos, sus G·O·D y las medidas actuales.",
      "Los fallos prioritarios llegan como hallazgos clave, con la acción de mejora, el indicador como evidencia esperada y el motivo de elección."] },
    [/ind] */
    { version: "2026.07", fecha: "Octubre 2026", titulo: "El método, lo primero del diseño", cambios: [
      "El diseño de cada auditoría empieza ahora por la metodología (población, periodo, fuentes, método, equipo y recursos), porque de ella dependen los indicadores, las evidencias y la muestra.",
      "Explicación fácil de cada elemento del método."] },
    { version: "2026.06", fecha: "Octubre 2026", titulo: "Ciclo completo: mejora, seguimiento y autoevaluación", cambios: [
      "Nueva fase de Mejora (Actuar): las recomendaciones del informe se convierten con un clic en acciones con objetivo, responsable, plazo, recursos e indicador de seguimiento.",
      "Matriz criticidad × viabilidad para priorizar: qué hacer ya, qué planificar buscando recursos y qué reconsiderar.",
      "Estado de cada acción (pendiente, en curso, hecha, verificada) con aviso de plazos vencidos.",
      "Auditoría de seguimiento con un clic: hereda el diseño de la inicial, se añade al Plan Anual y compara antes y después para decidir si se cierra, si la mejora es parcial o si las acciones no han funcionado.",
      "Plan de acción de mejora en Word, PDF y Excel; el informe de la auditoría de seguimiento incluye la comparación.",
      "«Ponte a prueba»: 30 preguntas de autoevaluación, cinco por tema, con su explicación.",
      "Cada auditoría muestra en qué fase va, y «Tu siguiente paso» acompaña hasta cerrar el ciclo.",
      "El ejemplo de Urgencias trae su plan de mejora y una auditoría de seguimiento."] },
    { version: "2026.05", fecha: "Octubre 2026", titulo: "Informe de resultados", cambios: [
      "Nueva fase de Informe (Verificar) en cinco pasos: interpretar, analizar causas, recomendar, conclusiones y resumen ejecutivo, y validar y entregar.",
      "Clasificación de cada hallazgo (conformidad, observación o no conformidad) propuesta según los datos, con aviso si no hay evidencia suficiente para una no conformidad.",
      "Análisis de causas con los 5 porqués y las categorías de causa (personas, procedimiento, sistemas, organización, comunicación, entorno).",
      "Recomendaciones con responsable y prioridad. La app distingue medidas fuertes, intermedias y débiles, y avisa si todas son débiles o si el responsable no es concreto.",
      "Aviso de redacción no neutral (palabras que culpabilizan o generalizan).",
      "Informe completo y resumen ejecutivo para la Dirección en Word y PDF, con estado del informe, hitos de validación y devolución, y control del documento.",
      "El ejemplo de Urgencias trae sus hallazgos, causas y recomendaciones."] },
    { version: "2026.04", fecha: "Octubre 2026", titulo: "Recogida de datos y resultados", cambios: [
      "Nueva fase de Recogida (Hacer): para cada criterio, filas preparadas según la muestra del diseño (con los números sorteados) y botones grandes Sí / No / NA, pensados para el móvil o la tablet.",
      "Resultado en vivo: cumplimientos, valor del indicador, margen de error al 95 % y decisión LQAS con los n primeros casos.",
      "La app dice qué se puede afirmar y qué no: con muestras pequeñas, un porcentaje por debajo del estándar no basta para el «no cumple». Con estimación, «no concluyente» si el estándar cae dentro del margen.",
      "Aviso si un código parece un nombre o un número de historia, y si hay códigos repetidos.",
      "Evidencia analizada, comentario técnico y observaciones de cada criterio, con propuestas automáticas, e incidencias del método.",
      "Matriz de resultados en Word, PDF y Excel (resumen, detalle por criterio y anexo con los casos).",
      "El ejemplo de Urgencias trae los casos y las decisiones LQAS del caso práctico."] },
    { version: "2026.03", fecha: "Octubre 2026", titulo: "Diseño de la auditoría y pilotaje", cambios: [
      "Nueva fase de Diseño en cada auditoría, en seis pasos: indicadores, evidencias e instrumentos, muestra, metodología y equipo, hoja de recogida y pilotaje, y plan específico.",
      "Un indicador por criterio con fórmula, sentido, estándar y la definición de «cumple si…» y «no aplica si…». Se pueden importar desde la app Indicadores.",
      "Evidencias (documental, observación, entrevistas, registros), triangulación, principios e instrumentos, con avisos si falta algo.",
      "Muestra: decidir con LQAS (eliges la línea roja y la app da n y c con las tablas de Lemeshow), estimar el porcentaje, regla práctica o todos los casos. Sorteo de los casos (aleatorio simple o sistemático).",
      "Pilotaje con dos auditores: % de acuerdo y kappa, con la interpretación.",
      "Hoja de recogida en Word o PDF, con una tabla por criterio, los casos sorteados y la regla de decisión, y plan específico de la auditoría en Word o PDF con control del documento.",
      "El ejemplo de Urgencias trae su diseño completo."] },
    { version: "2026.02", fecha: "Octubre 2026", titulo: "Plan Anual de Auditorías y documentos Word", cambios: [
      "Nuevo Plan Anual en seis pasos: qué se audita (trae los hallazgos clave del Mapa de Riesgos agrupados por subproceso), alcance y criterios, frecuencia propuesta según el IPR, responsables y recursos, cronograma de 12 meses, y roles y aprobación.",
      "Cronograma con reparto automático: respeta la frecuencia, evita los meses de alta presión que marques y la capacidad del equipo auditor, y avisa de solapamientos.",
      "Documentos en Word editable (Plan Anual y Mapa de Riesgos), además de PDF y Excel, con control del documento: elaborado, revisado, aprobado e histórico de revisiones.",
      "Cada auditoría del plan se convierte en auditoría concreta con un clic, con su alcance y sus hallazgos.",
      "Hitos de cada auditoría: aprobación por la Dirección, comunicación a los auditados, validación del borrador y reunión de devolución.",
      "Auditorías de seguimiento en el plan y aviso si no se reserva hueco para comprobar las mejoras.",
      "Ejemplo nuevo: el Plan Anual del Servicio de Urgencias."] },
    { version: "2026.01", fecha: "Octubre 2026", titulo: "Primera versión: el punto de partida", cambios: [
      "Panel de inicio con la línea del ciclo de mejora (Planificar, Hacer, Verificar, Actuar) y «Tu siguiente paso».",
      "Mapa de Riesgos: riesgos por subproceso con gravedad, ocurrencia y detección, IPR automático, prioridad por colores, gráfico y avisos de las trampas más habituales.",
      "Pegar riesgos desde Excel, Calc o Word, y exportar el mapa a Excel o PDF.",
      "Elección de los hallazgos clave a auditar, con su acción de mejora, evidencia esperada y motivo de elección.",
      "Nueva auditoría: de dónde nace (riesgos, estándar, incidente, indicador, auditoría anterior o encargo), datos generales, objetivos y criterios a auditar.",
      "Ejemplos: la auditoría del proceso de admisión en Urgencias y un minicaso de Hospitalización.",
      "Aprende (seis temas), glosario con buscador, copia de seguridad e importación."] }
  ];

  // ---------- Utilidades ----------
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const escMl = s => esc(s).replace(/\n/g, "<br>");
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const view = $("#view");
  const hoy = () => new Date().toISOString();
  const fechaCorta = iso => { const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString("es-ES"); };
  const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const lleno = L.lleno;
  const clon = o => JSON.parse(JSON.stringify(o));
  const leer = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const escribir = (k, v) => { try { localStorage.setItem(k, v); return true; } catch (e) { return false; } };
  const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

  // ---------- Datos (solo en este dispositivo) ----------
  const KEY_DATOS = "auditorias-datos";
  let datos = { mapas: [], auditorias: [], planes: [], ultimaCopia: null };
  (function cargar() {
    const crudo = leer(KEY_DATOS); if (!crudo) return;
    try {
      const o = JSON.parse(crudo), s = L.sanearDatos(o, genId, hoy());
      if (s) datos = { mapas: s.mapas, auditorias: s.auditorias, planes: s.planes, ultimaCopia: typeof o.ultimaCopia === "string" ? o.ultimaCopia : null };
    } catch (e) { /* datos dañados: se empieza de cero sin borrar lo guardado */ }
  })();
  // Los datos del usuario son los únicos que se guardan. Los ejemplos viven aparte, en memoria
  // (ids «ej-…»): se pueden tocar, pero ni se guardan ni se mezclan con los suyos.
  const datosUsuario = datos;
  let datosEjemplo = null, modoEjemplo = false;
  const esIdEjemplo = id => /^ej-/.test(id || "");
  function ejemplos() {
    if (!datosEjemplo) datosEjemplo = { mapas: clon(C.EJEMPLOS.mapas), auditorias: clon(C.EJEMPLOS.auditorias), planes: clon(C.EJEMPLOS.planes), ultimaCopia: null };
    return datosEjemplo;
  }
  let tGuardar = null, avisoSinEspacio = false;
  function guardar(inmediato) {
    clearTimeout(tGuardar);
    const fn = () => {
      const ok = escribir(KEY_DATOS, JSON.stringify({ app: "auditorias", v: L.VERSION_DATOS, ultimaCopia: datosUsuario.ultimaCopia, mapas: datosUsuario.mapas, auditorias: datosUsuario.auditorias, planes: datosUsuario.planes }));
      if (!ok && !avisoSinEspacio) { avisoSinEspacio = true; toast("No se ha podido guardar en este navegador (¿modo privado o sin espacio?). Haz una copia de seguridad.", 6000); }
    };
    if (inmediato) fn(); else tGuardar = setTimeout(fn, 250);
  }
  window.addEventListener("pagehide", () => guardar(true));
  const buscaMapa = id => datos.mapas.find(x => x.id === id);
  const buscaAud = id => datos.auditorias.find(x => x.id === id);
  // Un borrador (mapa o auditoría recién creados) no se guarda hasta que se escribe algo
  const borradores = new Map();
  const esVacioMapa = m => !m.riesgos.length && !["nombre", "unidad", "proceso", "fecha", "equipo", "notas"].some(k => lleno(m[k]));
  const esVacioAud = a => !a.criterios.length && !lleno(a.origen.tipo) && !["titulo", "unidad", "proceso", "objetivoGeneral", "introduccion"].some(k => lleno(a[k]));

  // ---------- Textos de ayuda reutilizables ----------
  const box = (tipo, tag, html) => `<div class="box box--${tipo}"><span class="box-tag">${tag}</span>${html}</div>`;
  const idea = html => box("idea", "Idea clave", `<p>${html}</p>`);
  const trampa = html => box("trampa", "Ojo, trampa", `<p>${html}</p>`);
  const practica = html => box("practica", "En la práctica", `<p>${html}</p>`);
  const ejemplo = (titulo, html) => box("ejemplo", "Ejemplo" + (titulo ? " · " + titulo : ""), html);
  const KEY_FACIL = "auditorias-facil-abierto";
  const facil = (html, titulo = "Explicado fácil") => `<details class="facil" data-recordar="1"${leer(KEY_FACIL) === "1" ? " open" : ""}><summary>${titulo}</summary><div class="facil-body">${html}</div></details>`;
  const avisoHtml = a => a.nivel === "nota" ? `<div class="note">ℹ ${esc(a.texto)}</div>` : a.nivel === "error" ? `<div class="aviso-error">✕ ${esc(a.texto)}</div>` : `<div class="warn">⚠ ${esc(a.texto)}</div>`;

  // ---------- Campos ----------
  // Por defecto se enlazan con data-k (ruta dentro del objeto en edición: «titulo», «origen.detalle»…).
  // Con o.bind se enlazan de otra forma (riesgos: data-r + data-f; criterios: data-c + data-f).
  function getPath(o, path) { return path.split(".").reduce((a, k) => (a == null ? undefined : a[k]), o); }
  function setPath(o, path, v) {
    const ks = path.split("."), ult = ks.pop();
    let a = o; ks.forEach(k => { if (a[k] == null || typeof a[k] !== "object") a[k] = {}; a = a[k]; });
    a[ult] = v;
  }
  let nAyuda = 0;
  function ayudaBtn(help) {
    if (!help) return { btn: "", box: "" };
    const id = "h" + (++nAyuda);
    return { btn: `<button type="button" class="info-btn" data-info="${id}" aria-expanded="false" aria-label="Ayuda">i</button>`, box: `<p class="help" id="help-${id}" hidden>${help}</p>` };
  }
  function campo(obj, path, label, o = {}) {
    const v = getPath(obj, path) || "", a = ayudaBtn(o.help);
    const bind = o.bind || `data-k="${path}"`;
    const ctrl = o.area
      ? `<textarea class="txt-in" ${bind} rows="${o.rows || 2}" placeholder="${esc(o.ph || "")}">${esc(v)}</textarea>`
      : `<div class="input-wrap"><input class="txt-in" ${bind} value="${esc(v)}" placeholder="${esc(o.ph || "")}"${o.list ? ` list="${o.list}"` : ""} autocomplete="off" /></div>`;
    return `<div class="field${o.destacado ? " field--destacado" : ""}"><div class="field-head"><label class="field-label">${label}</label>${o.opt ? '<span class="field-opt">(opcional)</span>' : ""}${a.btn}</div>${a.box}${o.sub ? `<p class="field-sub">${o.sub}</p>` : ""}${ctrl}${o.extra || ""}</div>`;
  }
  function seg(obj, path, opciones) {
    const v = getPath(obj, path) || "";
    return `<div class="seg" role="group">${opciones.map(([val, txt]) => `<button type="button" class="${v === val ? "active" : ""}" data-pick="${path}" data-v="${val}">${txt}</button>`).join("")}</div>`;
  }

  // ---------- Línea del ciclo PDCA (en toda la app) ----------
  const ENTREGA = 6;   // fases de la app ya construidas (ver L.FASES[].entrega)
  const FASE_HREF = { riesgos: "#/riesgos", plan: "#/plan", diseno: "#/auditorias", hacer: "#/auditorias", verificar: "#/auditorias", actuar: "#/auditorias" };
  const disponible = f => f.entrega <= ENTREGA;
  function lineaPDCA(actualK) {
    return `<ol class="pdca-linea no-print" aria-label="Fases del ciclo de mejora">${L.FASES.map(f => `<li><a href="${FASE_HREF[f.k]}" class="pdca-paso pdca--${f.pdca}${f.k === actualK ? " actual" : ""}${disponible(f) ? "" : " prox"}"${f.k === actualK ? ' aria-current="step"' : ""} title="${esc(L.PDCA[f.pdca] + " · " + f.titulo + (disponible(f) ? "" : " (próximamente)"))}"><span class="pdca-num">${f.n}</span><span class="pdca-lbl">${f.corto}</span></a></li>`).join("")}</ol>`;
  }
  const letraPDCA = p => `<span class="pdca-letra pdca--${p}" title="${L.PDCA[p]}">${p}</span>`;

  // ---------- Informe (cabecera y pie, solo al imprimir / Ver informe) ----------
  function informeBar() {
    return `<div class="informe-bar informe-only"><button class="btn" data-act="volver">← Volver</button><button class="btn btn--primary" data-act="imprimir">Guardar / imprimir</button></div>`;
  }
  function informeCab(titulo, sub) {
    return `<header class="print-head print-only"><h1>${esc(titulo)}</h1><p>${esc(sub ? sub + " · " : "")}Auditorías · Calidad y seguridad del paciente · ${new Date().toLocaleDateString("es-ES")}</p></header>`;
  }
  function informePie() {
    return `<footer class="print-foot print-only">
      <span class="autor-titulo">Aplicación desarrollada por</span>
      <span class="autor"><b>Carlos J. Galán Doval</b> · Médico de Familia · Técnico en Calidad y Seguridad del Paciente</span>
      <span class="autor"><b>Rafael J. Romero de Castilla Gil</b> · Médico de Familia · Responsable del Área de Calidad y Seguridad del Paciente</span>
      <span class="autor-area">Área de Gestión Sanitaria Sur de Córdoba · Andalucía</span>
      <span class="autor-uso">De libre uso con fines docentes y divulgativos. No sustituye el criterio profesional.</span>
      <span class="footer-version">Auditorías · versión ${APP_VERSION}</span>
    </footer>`;
  }

  // ---------- Inicio ----------
  function renderHome() {
    const d = datosUsuario, sig = L.siguientePaso(d), n = d.mapas.length + d.auditorias.length + d.planes.length;
    const diasCopia = d.ultimaCopia ? Math.floor((Date.now() - new Date(d.ultimaCopia)) / 864e5) : null;
    const avisoCopia = n && (diasCopia === null || diasCopia > 30)
      ? `<div class="warn">⚠ ${diasCopia === null ? "Aún no has hecho ninguna copia de seguridad." : `Tu última copia de seguridad es de hace ${diasCopia} días.`} Tus datos solo están en este dispositivo: guarda una copia.</div>` : "";
    view.innerHTML = `
      <section class="hero">
        <h1 class="hero-t"><span>Auditorías</span></h1>
        <p class="hero-p">Planifica, realiza, informa y haz el seguimiento de una auditoría de calidad y seguridad del paciente, <b>paso a paso</b> y aprendiendo mientras la haces: del riesgo detectado a la mejora comprobada.</p>
        <div class="hero-btns">
          <a class="btn btn--primary btn--grande" href="#/auditoria/nueva">+ Nueva auditoría</a>
          <a class="btn btn--grande" href="#/riesgos">Mapa de Riesgos${d.mapas.length ? ` <span class="contador">${d.mapas.length}</span>` : ""}</a>
        </div>
      </section>
      <div class="siguiente">
        <span class="siguiente-tag">Tu siguiente paso</span>
        <p>${esc(sig.texto)}</p>
        <a class="btn btn--primary" href="${sig.href}">${esc(sig.btn)} →</a>
      </div>
      <h2 class="sec-t">El camino completo</h2>
      <p class="page-lead">Seis estaciones siguiendo el ciclo de mejora continua: <b class="t-P">Planificar</b>, <b class="t-H">Hacer</b>, <b class="t-V">Verificar</b> y <b class="t-A">Actuar</b>. Cada una termina en un documento.</p>
      <ol class="fases">
        ${L.FASES.map(f => `<li><a class="fase pdca--${f.pdca}${disponible(f) ? "" : " prox"}" href="${FASE_HREF[f.k]}">
          <span class="fase-cab"><span class="pdca-num">${f.n}</span>${letraPDCA(f.pdca)}<b>${f.titulo}</b></span>
          <span class="fase-que">${f.que}</span>
          <span class="fase-doc">📄 ${f.doc}</span>
          ${disponible(f) ? "" : `<span class="fase-prox">Próximamente · mientras, repásalo en «Aprende»</span>`}
        </a></li>`).join("")}
      </ol>
      <h2 class="sec-t">Tus datos</h2>
      <div class="card datos-card">
        <div class="datos-cifras">
          <a href="#/riesgos"><b>${d.mapas.length}</b><span>${d.mapas.length === 1 ? "mapa de riesgos" : "mapas de riesgos"}</span></a>
          <a href="#/plan"><b>${d.planes.length}</b><span>${d.planes.length === 1 ? "plan anual" : "planes anuales"}</span></a>
          <a href="#/auditorias"><b>${d.auditorias.length}</b><span>${d.auditorias.length === 1 ? "auditoría" : "auditorías"}</span></a>
        </div>
        ${avisoCopia}
        <p class="field-sub">Se guardan <b>solo en este dispositivo</b>. Para trabajar en equipo, pasa tu copia a los demás: al importarla se junta con lo suyo sin duplicar.${d.ultimaCopia ? ` Última copia: ${fechaCorta(d.ultimaCopia)}.` : ""}</p>
        <div class="toolbar"><button class="btn" data-act="copia">⬇ Copia de seguridad</button><button class="btn" data-act="importar">⬆ Importar copia</button></div>
      </div>
      <div class="guide">
        <a class="guide-card" href="#/ejemplos"><span class="guide-num">Ej</span><div><div class="guide-q">Ejemplos</div><div class="guide-a">Una auditoría real del <b>proceso de admisión en Urgencias</b> y un minicaso de Hospitalización.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card" href="#/aprende"><span class="guide-num">?</span><div><div class="guide-q">Aprende</div><div class="guide-a">Seis temas <b>explicados fácil</b>: de qué es una auditoría al seguimiento de las mejoras.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card" href="#/prueba"><span class="guide-num">✓</span><div><div class="guide-q">Ponte a prueba</div><div class="guide-a">${C.TEST.length} preguntas con su <b>explicación</b>, cinco por tema.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card" href="#/glosario"><span class="guide-num">A–Z</span><div><div class="guide-q">Glosario</div><div class="guide-a">${C.GLOSARIO.length} términos <b>en lenguaje llano</b>, con buscador.</div></div><span class="guide-go">›</span></a>
        <!-- [eco] -->
        <a class="guide-card guide-card--hermana" href="${L.URL_IND}" target="_blank" rel="noopener"><span class="guide-num">%</span><div><div class="guide-q">Indicadores ↗</div><div class="guide-a">App hermana: <b>diseña y comprueba</b> los indicadores de tu auditoría.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_TM}" target="_blank" rel="noopener"><span class="guide-num">n</span><div><div class="guide-q">Tamaño Muestral ↗</div><div class="guide-a">App hermana: <b>cuántos casos revisar</b>, plan LQAS y concordancia entre auditores.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_AMFE}" target="_blank" rel="noopener"><span class="guide-num">IPR</span><div><div class="guide-q">AMFE ↗</div><div class="guide-a">App hermana: <b>analiza los fallos de un proceso</b> (G·O·D e IPR) y decide cuáles priorizar antes de auditar.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_MAPA}" target="_blank" rel="noopener"><span class="guide-num">⚠</span><div><div class="guide-q">Mapa de Riesgos ↗</div><div class="guide-a">App hermana: <b>del flujograma al mapa de riesgos</b> del proceso, con su AMFE; tráete aquí sus hallazgos clave.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_FLUJO}" target="_blank" rel="noopener"><span class="guide-num">→</span><div><div class="guide-q">Flujograma ↗</div><div class="guide-a">App hermana: <b>dibuja el flujograma del proceso</b> que vas a auditar, con sus puntos críticos.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_DAFO}" target="_blank" rel="noopener"><span class="guide-num">D</span><div><div class="guide-q">DAFO · CAME ↗</div><div class="guide-a">App hermana: <b>analiza tu unidad</b> con un DAFO; sus debilidades y amenazas te dicen qué conviene auditar.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_RONDAS}" target="_blank" rel="noopener"><span class="guide-num">✓</span><div><div class="guide-q">Rondas de Seguridad ↗</div><div class="guide-a">App hermana: <b>rondas de seguridad</b> en una unidad; tráete aquí lo que falla una y otra vez para auditarlo.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_LC}" target="_blank" rel="noopener"><span class="guide-num">LC</span><div><div class="guide-q">Lectura Crítica ↗</div><div class="guide-a">App hermana: <b>lee críticamente un artículo</b> para comprobar la evidencia del criterio o del estándar que vas a auditar.</div></div><span class="guide-go">›</span></a>
        <a class="guide-card guide-card--hermana" href="${L.URL_ACR}" target="_blank" rel="noopener"><span class="guide-num">ACR</span><div><div class="guide-q">ACR · Ishikawa ↗</div><div class="guide-a">App hermana: <b>busca las causas de fondo</b> de un problema o de un incidente (Ishikawa y causa raíz), sin buscar culpables; sus acciones de mejora llevan indicador.</div></div><span class="guide-go">›</span></a>
        <!-- [/eco] -->
        <!-- [ind]
        <a class="guide-card guide-card--hermana" href="${L.URL_TM}" target="_blank" rel="noopener"><span class="guide-num">n</span><div><div class="guide-q">Tamaño Muestral ↗</div><div class="guide-a">Calculadora incluida: <b>cuántos casos revisar</b>, plan LQAS y concordancia entre auditores.</div></div><span class="guide-go">›</span></a>
        [/ind] -->
      </div>
      ${practica("<b>Protección de datos:</b> nunca escribas en la app nombres de pacientes ni números de historia clínica. Usa códigos (HC-01, HC-02…) y guarda la correspondencia, si la necesitas, en un lugar autorizado de tu centro.")}`;
  }

  // ---------- Mapa de Riesgos: lista ----------
  const nivelTxt = v => { const n = L.nivelIPR(v); return n ? n.k : "sin"; };
  const iprBadge = (v, extra = "") => v ? `<span class="ipr-badge niv--${nivelTxt(v)}${extra}">IPR ${v}</span>` : `<span class="ipr-badge niv--sin${extra}">Sin IPR</span>`;
  const enEjemplo = () => modoEjemplo ? "#/ejemplos" : null;
  const volver = (href, txt) => `<a class="volver-cuadro" href="${href}">← ${txt}</a>`;

  function renderMapas() {
    const lista = datos.mapas.slice().sort((a, b) => String(b.modificado).localeCompare(String(a.modificado)));
    view.innerHTML = `
      <div class="wiz-top no-print">${lineaPDCA("riesgos")}</div>
      <h1 class="page-title">Mapa de Riesgos</h1>
      <p class="page-lead">El punto de partida: qué puede fallar en un proceso, con qué prioridad y qué merece la pena auditar.</p>
      ${facil(`
        <p>Un <b>Mapa de Riesgos</b> recoge lo que puede fallar en un proceso y lo ordena por prioridad. La forma más habitual en sanidad es el <b>AMFE</b> (Análisis Modal de Fallos y Efectos). Para cada <b>subproceso</b> se anota:</p>
        <ul><li><b>Fallo</b>: lo que puede salir mal.</li><li><b>Efecto</b>: qué le pasaría al paciente.</li><li><b>Causa</b>: por qué ocurre.</li>
        <li>Y tres puntuaciones de 1 a 10: <b>Gravedad</b> (G), <b>Ocurrencia</b> (O) y <b>Detección</b> (D).</li></ul>
        <div class="formula">IPR = G × O × D (de 1 a 1.000)</div>
        <p>Cuanto más alto el <b>Índice de Prioridad de Riesgo</b>, antes conviene actuar… y auditar. Los riesgos que eliges para auditar son tus <b>hallazgos clave</b>.</p>`)}
      <div class="toolbar no-print"><a class="btn btn--primary" href="#/riesgos/nuevo">+ Nuevo mapa</a><button class="btn" data-act="amfe-abrir">Traer de AMFE</button><button class="btn" data-act="amfe-abrir" data-fuente="mr">Traer de Mapa de Riesgos</button><a class="btn" href="#/riesgos/ej-mapa-urg">Ver un ejemplo</a></div>
      ${traerAbierto ? traerHtml() : ""}
      ${lista.length ? `<div class="cuadro-lista">${lista.map(tarjetaMapa).join("")}</div>`
        : `<div class="placeholder-box"><p><b>Todavía no tienes ningún mapa.</b></p><p>Crea uno nuevo y escribe los fallos de tu proceso, o pega la tabla de un AMFE que ya tengas en Excel. Si quieres ver antes cómo queda, abre el ejemplo de Urgencias.</p></div>`}`;
  }
  function tarjetaMapa(m) {
    const r = L.resumenMapa(m);
    return `<div class="item-card">
      <a class="item-main" href="#/riesgos/${m.id}">
        <b class="item-t">${lleno(m.nombre) ? esc(m.nombre) : '<span class="vacio">Mapa sin nombre</span>'}</b>
        <span class="item-s">${esc([m.unidad, m.proceso].filter(lleno).join(" · ")) || "&nbsp;"}</span>
        <span class="badges">${r.maxIPR ? iprBadge(r.maxIPR, " ipr-badge--max") : ""}<span class="badge">${plural(r.n, "riesgo", "riesgos")}</span>${r.claves ? `<span class="badge badge--clave">★ ${plural(r.claves, "hallazgo clave", "hallazgos clave")}</span>` : ""}</span>
      </a>
      <div class="item-pie"><span>Modificado: ${fechaCorta(m.modificado)}</span><span><button class="link-btn" data-act="mapa-dup" data-id="${m.id}">Duplicar</button> · <button class="link-btn link-btn--peligro" data-act="mapa-del" data-id="${m.id}">Borrar</button></span></div>
    </div>`;
  }

  // ---------- Mapa de Riesgos: edición ----------
  let actualMapa = null, ordenMapa = "ipr", filtroSub = "", pegarAbierto = false, traerAbierto = false, amfeCopia = null;
  const abiertos = new Set();
  const subprocesosDe = m => [...new Set([...m.subprocesos, ...m.riesgos.map(r => r.subproceso)].map(s => String(s || "").trim()).filter(Boolean))];

  function rgCabInner(r, P) {
    const v = L.iprDe(r);
    return `<span class="rg-puesto">${P[r.id] ? "#" + P[r.id] : "–"}</span>${iprBadge(v)}<span class="rg-txt"><b>${lleno(r.fallo) ? esc(r.fallo) : '<span class="vacio">Fallo sin describir</span>'}</b><span>${esc(r.subproceso) || "Sin subproceso"}${v ? ` · G ${esc(r.g)} · O ${esc(r.o)} · D ${esc(r.d)}` : ""}</span></span><span class="rg-flecha" aria-hidden="true">▾</span>`;
  }
  function iprMini(r) {
    const v = L.iprDe(r);
    if (v) { const n = L.nivelIPR(v); return `<span class="ipr-val">IPR <b>${v}</b> · ${n.nom}</span>`; }
    if ([r.g, r.o, r.d].some(lleno)) return `<span class="ipr-falta">G, O y D: enteros del 1 al 10</span>`;
    return `<span class="ipr-falta">IPR = G × O × D</span>`;
  }
  function rgCard(r, P) {
    const ab = abiertos.has(r.id), b = f => `data-r="${r.id}" data-f="${f}"`;
    return `<div class="rg niv-borde--${nivelTxt(L.iprDe(r))}${r.clave ? " rg--clave" : ""}" data-rid="${r.id}">
      <div class="rg-cab">
        <button type="button" class="rg-toggle" data-act="rg-toggle" data-id="${r.id}" aria-expanded="${ab}">${rgCabInner(r, P)}</button>
        <button type="button" class="rg-star${r.clave ? " on" : ""}" data-act="rg-clave" data-id="${r.id}" aria-pressed="${r.clave}" title="${r.clave ? "Quitar de los hallazgos clave" : "Marcar como hallazgo clave para auditar"}">★<span>${r.clave ? "Clave" : "Auditar"}</span></button>
      </div>
      <div class="rg-body"${ab ? "" : " hidden"}>
        ${campo(r, "subproceso", "Subproceso", { bind: b("subproceso"), list: "dl-sub", ph: "p. ej. Triaje de enfermería", help: "La fase del proceso donde está el riesgo. Escribe una nueva o elige una de las que ya has usado." })}
        ${campo(r, "fallo", "Fallo (lo que puede salir mal)", { bind: b("fallo"), area: true, ph: "p. ej. No se coloca la pulsera identificativa", help: "El modo de fallo del AMFE. Descríbelo como un hecho concreto y observable, no como una causa ni como un efecto." })}
        ${campo(r, "efecto", "Efecto (qué le pasaría al paciente)", { bind: b("efecto"), area: true, opt: true, ph: "p. ej. Error de identidad en pruebas o medicación" })}
        ${campo(r, "causa", "Causa (por qué ocurre)", { bind: b("causa"), area: true, opt: true, ph: "p. ej. Rutina interrumpida; recursos saturados" })}
        <div class="field">
          <div class="field-head"><label class="field-label">Puntuación (de 1 a 10)</label></div>
          <div class="god">
            ${["g", "o", "d"].map(k => `<label class="god-c"><span>${{ g: "Gravedad", o: "Ocurrencia", d: "Detección" }[k]}</span><input class="txt-in" ${b(k)} value="${esc(r[k])}" inputmode="numeric" placeholder="1–10" /></label>`).join("")}
            <div class="god-r" data-zr="ipr">${iprMini(r)}</div>
          </div>
        </div>
        ${campo(r, "medidas", "Medidas de control que ya existen", { bind: b("medidas"), area: true, opt: true, ph: "p. ej. Protocolo de identificación; pulsera en admisión", help: "Lo que ya se hace para evitar el fallo. La auditoría comprobará si se aplica de verdad." })}
        ${r.clave ? `<div class="rg-clavebox">
          <p class="rg-clavebox-t">★ Hallazgo clave: qué esperas encontrar</p>
          ${campo(r, "accion", "Acción de mejora propuesta", { bind: b("accion"), area: true, ph: "p. ej. Verificación de la pulsera en triaje con registro obligatorio", help: "La medida que debería estar funcionando para controlar el riesgo. La auditoría comprobará si se aplica." })}
          ${campo(r, "evidencia", "Evidencia esperada", { bind: b("evidencia"), area: true, ph: "p. ej. Registro de colocación de pulsera; observación directa", help: "Qué prueba tangible demostraría que la acción se cumple: un registro, una lista de verificación, una observación…" })}
          ${campo(r, "motivo", "Motivo de elección", { bind: b("motivo"), area: true, ph: "p. ej. IPR 294; riesgo de error de paciente equivocado", help: "Por qué este riesgo y no otro: su IPR, su gravedad, incidentes recientes, exigencia de un estándar…", extra: `<div class="quick"><button type="button" class="chip chip--accent" data-act="rg-motivo" data-id="${r.id}">✎ Proponer motivo</button></div>` })}
        </div>` : ""}
        <div class="rg-pie no-print"><button type="button" class="link-btn link-btn--peligro" data-act="rg-del" data-id="${r.id}">Quitar este riesgo</button><button type="button" class="link-btn" data-act="rg-toggle" data-id="${r.id}">Cerrar ▴</button></div>
      </div>
    </div>`;
  }

  // Gráfico de prioridad: barras de IPR de mayor a menor, coloreadas por nivel; ★ = hallazgo clave
  function graficoMapa(m) {
    const rs = L.ordenarRiesgos(m.riesgos).filter(r => L.iprDe(r));
    if (rs.length < 2) return `<p class="field-sub">Puntúa al menos dos riesgos para ver el gráfico de prioridad.</p>`;
    const W = 400, H = 190, x0 = 34, y0 = 12, alto = 140, ancho = W - x0 - 6;
    const max = Math.max(400, Math.ceil(Math.max(...rs.map(L.iprDe)) / 100) * 100);
    const paso = ancho / rs.length, bw = Math.max(2, Math.min(26, paso * 0.72));
    const y = v => y0 + alto - v / max * alto;
    const guias = []; for (let g = 0; g <= max; g += max > 600 ? 200 : 100) guias.push(g);
    const etiquetas = rs.length <= 25;
    return `<svg class="grafico pareto" viewBox="0 0 ${W} ${H}" role="img" aria-label="Riesgos ordenados por IPR">
      ${guias.map(g => `<line class="g-guia" x1="${x0}" x2="${W - 4}" y1="${y(g)}" y2="${y(g)}"/><text class="g-eje" x="${x0 - 4}" y="${y(g) + 3.5}" text-anchor="end">${g}</text>`).join("")}
      ${rs.map((r, i) => { const v = L.iprDe(r), cx = x0 + paso * i + paso / 2; return `<g><title>#${i + 1} · IPR ${v} · ${esc(r.fallo || "sin describir")}${r.clave ? " · ★ hallazgo clave" : ""}</title>
        <rect class="g-barra niv-fill--${nivelTxt(v)}" x="${cx - bw / 2}" y="${y(v)}" width="${bw}" height="${y0 + alto - y(v)}" rx="2"/>
        ${r.clave ? `<text class="g-star" x="${cx}" y="${y(v) - 3}" text-anchor="middle">★</text>` : ""}
        ${etiquetas ? `<text class="g-eje" x="${cx}" y="${y0 + alto + 13}" text-anchor="middle">${i + 1}</text>` : ""}</g>`; }).join("")}
      <text class="g-eje" x="${x0}" y="${H - 2}">Puesto de prioridad →</text>
    </svg>
    <div class="leyenda">${L.NIVELES_IPR.map(n => `<span><i class="niv-fill--${n.k}"></i>${n.nom} (${n.k === "muyalto" ? "≥ 300" : n.k === "alto" ? "200–299" : n.k === "medio" ? "100–199" : "< 100"})</span>`).join("")}<span><b class="g-star-l">★</b> Hallazgo clave</span></div>
    <p class="field-sub">Los cortes de color son orientativos. Lo que manda es el <b>orden</b> dentro de tu propio mapa… y la gravedad: un fallo muy grave merece atención aunque su IPR no sea de los primeros.</p>`;
  }

  function clavesHtml(m) {
    const claves = L.ordenarRiesgos(m.riesgos.filter(r => r.clave));
    if (!claves.length) return `<p class="placeholder-box">Aún no has marcado ningún hallazgo clave. Pulsa <b>★ Auditar</b> en los riesgos que quieras comprobar con la auditoría (lo habitual: de 3 a 5, empezando por los de IPR más alto).</p>`;
    const audEj = modoEjemplo ? datos.auditorias.find(a => a.origen.mapaId === m.id) : null;
    const yaAud = !modoEjemplo ? datos.auditorias.filter(a => a.origen.mapaId === m.id) : [];
    return `<div class="table-wrap"><table class="mini tabla-claves"><thead><tr><th>Subproceso</th><th>Riesgo detectado</th><th>IPR</th><th>Acción de mejora propuesta</th><th>Evidencia esperada</th><th>Motivo de elección</th></tr></thead><tbody>
      ${claves.map(r => `<tr><td>${esc(r.subproceso)}</td><td><b>${esc(r.fallo)}</b></td><td>${iprBadge(L.iprDe(r))}</td><td>${esc(r.accion) || '<span class="falta">Falta</span>'}</td><td>${esc(r.evidencia) || '<span class="falta">Falta</span>'}</td><td>${esc(r.motivo) || '<span class="falta">Falta</span>'}</td></tr>`).join("")}
    </tbody></table></div>
    <div class="toolbar no-print">${audEj ? `<a class="btn btn--primary" href="#/auditoria/${audEj.id}">Ver la auditoría de este ejemplo →</a>`
      : modoEjemplo ? "" : `${datos.planes.some(p => p.entradas.some(e => e.mapaId === m.id)) ? "" : `<a class="btn btn--primary" href="#/plan/nuevo?mapa=${m.id}">Llevarlos al Plan Anual →</a>`}<a class="btn" href="#/auditoria/nueva?mapa=${m.id}">Crear una auditoría con ${claves.length === 1 ? "este hallazgo" : "estos " + claves.length + " hallazgos"} →</a>${yaAud.map(a => `<a class="btn" href="#/auditoria/${a.id}">Abrir «${esc(L.corto(a.titulo || "auditoría sin título", 40))}»</a>`).join("")}`}</div>`;
  }

  function pegarHtml() {
    return `<div class="card pegar no-print">
      <h3 class="sub-h">Pegar riesgos desde Excel, Calc o Word</h3>
      <p class="field-sub">Selecciona las filas de tu tabla (con o sin la fila de títulos), cópialas y pégalas aquí. Si no hay títulos, las columnas deben ir en este orden: <b>Subproceso · Fallo · Efecto · Causa · G · O · D</b>. La columna del IPR se ignora: se recalcula.</p>
      <textarea class="txt-in" id="pegar-txt" rows="6" placeholder="Pega aquí la tabla…"></textarea>
      <div data-zona="pegar"></div>
      <div class="toolbar"><button class="btn btn--primary" data-act="pegar-ok" disabled>Añadir los riesgos</button><button class="btn" data-act="pegar-cerrar">Cancelar</button></div>
    </div>`;
  }

  // «Traer de AMFE» y «Traer de Mapa de Riesgos»: leen el paquete que deja cada app en este navegador (mismo dominio) o su
  // copia .json. Las dos acaban en L.mapaDesdeAmfe (el paquete de Mapa de Riesgos lleva dentro un AMFE con la forma de «amfe-fallos»).
  // traerAbierto = false | "amfe" | "mr"
  const FUENTES = {
    amfe: { nom: "AMFE", titulo: "Traer un AMFE", /*[eco]*/clave: "amfe-intercambio", /*[/eco]*/leer: o => L.leerAmfe(o), /*[eco]*/url: () => L.URL_AMFE, /*[/eco]*/cosa: "el AMFE", propio: "ningún AMFE propio" },
    mr: { nom: "Mapa de Riesgos", titulo: "Traer de Mapa de Riesgos", /*[eco]*/clave: "mapariesgos-intercambio", /*[/eco]*/leer: o => L.leerMapaRiesgos(o), /*[eco]*/url: () => L.URL_MAPA, /*[/eco]*/cosa: "el mapa", propio: "ningún mapa propio con AMFE" }
  };
  function amfeDisponible() {
    const F = FUENTES[traerAbierto] || FUENTES.amfe;
    if (amfeCopia) return Object.assign({ origen: "copia" }, amfeCopia);
    // [eco]
    const bruto = leer(F.clave);
    if (!bruto) return { origen: "nada" };
    let o = null; try { o = JSON.parse(bruto); } catch (e) { /* */ }
    return Object.assign({ origen: "navegador" }, F.leer(o));
    // [/eco]
    /* [ind]
    return { origen: "nada" };
    [/ind] */
  }
  function traerHtml() {
    const F = FUENTES[traerAbierto] || FUENTES.amfe, d = amfeDisponible(), lista = d.amfes || [];
    const cargar = `<button class="btn${d.origen === "nada" ? " btn--primary" : ""}" data-act="amfe-archivo">Cargar la copia .json de ${F.nom}</button>`;
    let cuerpo;
    // [eco]
    if (d.origen === "nada") cuerpo = `<div class="note">ℹ No hay datos de ${F.nom} en este navegador. Si has hecho ${F.cosa} en otro dispositivo o navegador, carga su copia de seguridad (.json). Si aún no lo tienes, hazlo en la app <a href="${F.url()}" target="_blank" rel="noopener">${F.nom} ↗</a>.</div>`;
    // [/eco]
    /* [ind]
    if (d.origen === "nada") cuerpo = `<div class="note">ℹ Elige la copia de seguridad (.json) de la app ${F.nom}.</div>`;
    [/ind] */
    else if (d.error) cuerpo = avisoHtml({ nivel: "error", texto: d.error });
    else if (!lista.length) cuerpo = `<div class="note">ℹ ${d.origen === "copia" ? "La copia cargada" : `La app ${F.nom} de este navegador`} no tiene ${F.propio} todavía (los ejemplos no se comparten).</div>`;
    else cuerpo = `<p class="field-sub">${d.origen === "copia" ? "De la copia cargada" : `Guardados en la app ${F.nom} de este navegador`}${d.generado ? ` · actualizados el ${esc(fechaCorta(d.generado))}` : ""}. Elige cuál traer:</p>
      <div class="amfe-lista">${lista.map((a, i) => { const r = L.resumenAmfe(a); return `<div class="amfe-op">
        <div class="amfe-op-txt"><b>${esc(r.titulo)}</b><span>${esc([r.unidad, r.fecha].filter(lleno).join(" · ")) || "&nbsp;"}</span>
        <span class="badges"><span class="badge">${plural(r.n, "fallo", "fallos")}</span>${r.prioritarios ? `<span class="badge badge--clave">★ ${plural(r.prioritarios, "prioritario", "prioritarios")}</span>` : ""}</span></div>
        <button class="btn btn--primary" data-act="amfe-traer" data-i="${i}">Traer este</button></div>`; }).join("")}</div>`;
    return `<div class="card pegar no-print" data-zona="traer">
      <h3 class="sub-h">${F.titulo}</h3>
      <p class="field-sub">Se crea un <b>mapa nuevo</b> con los fallos, sus G·O·D y las medidas actuales; los fallos prioritarios quedan como hallazgos clave. Los datos <b>se copian</b>: si después cambian en ${F.nom}, vuelve a traerlos.</p>
      ${cuerpo}
      <div class="toolbar">${cargar}<!--[eco]-->${d.origen === "copia" ? `<button class="btn" data-act="amfe-olvidar">Usar los de este navegador</button>` : ""}<!--[/eco]--><button class="btn" data-act="amfe-cerrar">Cancelar</button></div>
    </div>`;
  }
  function repintarTraer() {
    if (actualMapa && location.hash.startsWith("#/riesgos/")) repintarMapa(); else renderMapas();
    const z = $("[data-zona='traer']"); if (z) z.scrollIntoView({ block: "nearest" });
  }
  function traerAmfe(i) {
    const d = amfeDisponible(), a = d.amfes && d.amfes[i]; if (!a) return;
    const { mapa, avisos } = L.mapaDesdeAmfe(a, genId, hoy(), d.app || (FUENTES[traerAbierto] || FUENTES.amfe).nom);
    datosUsuario.mapas.push(mapa); traerAbierto = false; amfeCopia = null; guardar(true);
    location.hash = "#/riesgos/" + mapa.id;
    toast(`Mapa creado con ${plural(mapa.riesgos.length, "riesgo", "riesgos")}${avisos.length ? ". " + avisos.join(" ") : ". Revisa los hallazgos clave."}`, avisos.length ? 8000 : 4500);
  }

  // «Traer de Rondas de Seguridad»: lee el paquete «rondas-seguridad» v1 que deja esa app en este navegador o su copia .json.
  // rondasAbierto = false | "aud" (crea una auditoría) | "plan" (añade una entrada al plan). rondasFuera = puntos desmarcados.
  let rondasAbierto = false, rondasHash = "", rondasCopia = null;
  const rondasFuera = new Set();
  function rondasDisponible() {
    if (rondasCopia) return Object.assign({ origen: "copia" }, rondasCopia);
    // [eco]
    const bruto = leer("rondas-intercambio");
    if (!bruto) return { origen: "nada" };
    let o = null; try { o = JSON.parse(bruto); } catch (e) { /* */ }
    return Object.assign({ origen: "navegador" }, L.leerRondas(o));
    // [/eco]
    /* [ind]
    return { origen: "nada" };
    [/ind] */
  }
  const rondasIds = u => u.calientes.filter(p => !rondasFuera.has(u.id + "|" + p.itemId)).map(p => p.itemId);
  function rondasHtml() {
    const d = rondasDisponible(), lista = d.unidades || [], conPC = lista.filter(u => u.calientes.length), sinPC = lista.filter(u => !u.calientes.length);
    const aud = rondasAbierto === "aud";
    let cuerpo;
    // [eco]
    if (d.origen === "nada") cuerpo = `<div class="note">ℹ No hay datos de Rondas de Seguridad en este navegador. Si haces las rondas en otro dispositivo o navegador, carga su copia de seguridad (.json). Si aún no la usas, la tienes en <a href="${L.URL_RONDAS}" target="_blank" rel="noopener">Rondas de Seguridad ↗</a>.</div>`;
    // [/eco]
    /* [ind]
    if (d.origen === "nada") cuerpo = `<div class="note">ℹ Elige la copia de seguridad (.json) de la app Rondas de Seguridad.</div>`;
    [/ind] */
    else if (d.error) cuerpo = avisoHtml({ nivel: "error", texto: d.error });
    else if (!lista.length) cuerpo = `<div class="note">ℹ ${d.origen === "copia" ? "La copia cargada" : "La app Rondas de Seguridad de este navegador"} no tiene ninguna unidad propia todavía (los ejemplos no se comparten).</div>`;
    else if (!conPC.length) cuerpo = `<div class="note">ℹ Ninguna unidad tiene puntos calientes: ningún ítem falla en dos de las tres últimas rondas ni en todas las de un mismo turno. ¡Buena señal! (${esc(lista.map(u => u.unidad || "Unidad sin nombre").join(", "))}).</div>`;
    else cuerpo = `<p class="field-sub">${d.origen === "copia" ? "De la copia cargada" : "Guardados en la app Rondas de Seguridad de este navegador"}${d.generado ? ` · actualizados el ${esc(fechaCorta(d.generado))}` : ""}. Desmarca lo que no quieras traer:</p>
      <div class="amfe-lista">${conPC.map(u => { const i = lista.indexOf(u), n = rondasIds(u).length; return `<div class="amfe-op amfe-op--rondas">
        <div class="amfe-op-txt"><b>${esc(u.unidad || "Unidad sin nombre")}</b><span>${plural(u.rondas, "ronda hecha", "rondas hechas")}${u.ultima ? ` · la última el ${esc(L.fmtFecha(u.ultima))}` : ""}</span>
          <div class="aud-rgs">${u.calientes.map(p => { const on = !rondasFuera.has(u.id + "|" + p.itemId); return `<button type="button" class="aud-rg${on ? " on" : ""}" data-act="rondas-pt" data-k="${esc(u.id + "|" + p.itemId)}" aria-pressed="${on}"><span class="aud-check">${on ? "✓" : ""}</span><span class="aud-rg-t"><b>${esc(p.texto)}</b><span>${esc([p.bloque, L.datoCaliente(p)].filter(lleno).join(" · "))}</span></span></button>`; }).join("")}</div></div>
        <button class="btn btn--primary" data-act="rondas-traer" data-i="${i}"${n ? "" : " disabled"}>${aud ? "Crear la auditoría" : "Añadir al plan"}</button></div>`; }).join("")}</div>
      ${sinPC.length ? `<p class="field-sub">Sin puntos calientes: ${esc(sinPC.map(u => u.unidad || "Unidad sin nombre").join(", "))}.</p>` : ""}`;
    return `<div class="card pegar no-print" data-zona="rondas">
      <h3 class="sub-h">Traer de Rondas de Seguridad</h3>
      <p class="field-sub">Los <b>puntos calientes</b> son lo que falla una y otra vez en las rondas: lo que no se cumple en 2 de las 3 últimas rondas o en todas las de un mismo turno. ${aud ? "Se crea una <b>auditoría nueva</b> con un criterio por cada uno, para comprobar con una muestra si es un problema del proceso." : "Se añade <b>una auditoría al plan</b> por unidad, con sus puntos calientes como hallazgos."} Los datos <b>se copian</b>: si las rondas cambian, vuelve a traerlos.</p>
      ${cuerpo}
      <div class="toolbar"><button class="btn${d.origen === "nada" ? " btn--primary" : ""}" data-act="rondas-archivo">Cargar la copia .json de Rondas de Seguridad</button><!--[eco]-->${d.origen === "copia" ? `<button class="btn" data-act="rondas-olvidar">Usar los de este navegador</button>` : ""}<!--[/eco]--><button class="btn" data-act="rondas-cerrar">Cancelar</button></div>
    </div>`;
  }
  function repintarRondas() {
    if (rondasAbierto === "plan" && actualPlan) repintarPlan(); else if (location.hash.startsWith("#/auditorias")) renderAuditorias();
    const z = $("[data-zona='rondas']"); if (z) z.scrollIntoView({ block: "nearest" });
  }
  function traerRondas(i) {
    const d = rondasDisponible(), u = d.unidades && d.unidades[i]; if (!u) return;
    const ids = rondasIds(u); if (!ids.length) return;
    if (rondasAbierto === "plan" && actualPlan) {
      const e = L.entradaDesdeRondas(u, genId, hoy(), ids);
      actualPlan.entradas.push(e); if (!lleno(actualPlan.ambito) && lleno(u.unidad)) actualPlan.ambito = u.unidad;
      rondasAbierto = false; rondasCopia = null; rondasFuera.clear(); tocado(actualPlan); repintarPlan();
      toast(`Añadida al plan una auditoría con ${plural(ids.length, "punto caliente", "puntos calientes")} como hallazgos. Elige su frecuencia en el paso 3.`, 5000);
      return;
    }
    const a = L.auditoriaDesdeRondas(u, genId, hoy(), ids);
    datosUsuario.auditorias.push(a); rondasAbierto = false; rondasCopia = null; rondasFuera.clear(); guardar(true);
    location.hash = "#/auditoria/" + a.id;
    toast(`Auditoría creada con ${plural(a.criterios.length, "criterio", "criterios")}, uno por punto caliente. Completa el proceso y el objetivo.`, 5000);
  }

  // «Traer de ACR · Ishikawa»: lee el paquete «acrishikawa-analisis» v1 que deja esa app en este navegador o su copia .json.
  // Crea una auditoría nueva con un criterio por acción elegida (acrFuera = acciones desmarcadas «análisis|acción»).
  let acrAbierto = false, acrHash = "", acrCopia = null;
  const acrFuera = new Set();
  function acrDisponible() {
    if (acrCopia) return Object.assign({ origen: "copia" }, acrCopia);
    // [eco]
    const bruto = leer("acrishikawa-intercambio");
    if (!bruto) return { origen: "nada" };
    let o = null; try { o = JSON.parse(bruto); } catch (e) { /* */ }
    return Object.assign({ origen: "navegador" }, L.analisisDeAcr(o));
    // [/eco]
    /* [ind]
    return { origen: "nada" };
    [/ind] */
  }
  const acrIds = an => an.acciones.filter(x => !acrFuera.has(an.id + "|" + x.id)).map(x => x.id);
  const FZ_ACR = { fuerte: "Fuerte", intermedia: "Intermedia", debil: "Débil" };
  function acrHtml() {
    const d = acrDisponible(), lista = d.analisis || [];
    let cuerpo;
    // [eco]
    if (d.origen === "nada") cuerpo = `<div class="note">ℹ No hay análisis de ACR · Ishikawa en este navegador. Si los hiciste en otro dispositivo o navegador, carga su copia de seguridad (.json). Si aún no la usas, la tienes en <a href="${L.URL_ACR}" target="_blank" rel="noopener">ACR · Ishikawa ↗</a>.</div>`;
    // [/eco]
    /* [ind]
    if (d.origen === "nada") cuerpo = `<div class="note">ℹ Elige la copia de seguridad (.json) de la app ACR · Ishikawa.</div>`;
    [/ind] */
    else if (d.error) cuerpo = avisoHtml({ nivel: "error", texto: d.error === "version" ? "Estos datos de ACR · Ishikawa son de una versión que esta app aún no sabe leer. Actualiza las dos apps y vuelve a intentarlo. No se ha importado nada." : "No son datos de la app ACR · Ishikawa. Usa la copia de seguridad (.json) que descarga esa app. No se ha importado nada." });
    else if (!lista.length) cuerpo = `<div class="note">ℹ ${d.origen === "copia" ? "La copia cargada" : "La app ACR · Ishikawa de este navegador"} no tiene ningún análisis con acciones de mejora todavía (los ejemplos no se comparten).</div>`;
    else cuerpo = `<p class="field-sub">${d.origen === "copia" ? "De la copia cargada" : "Guardados en la app ACR · Ishikawa de este navegador"}${d.generado ? ` · actualizados el ${esc(fechaCorta(d.generado))}` : ""}. Desmarca las acciones que no quieras auditar:</p>
      <div class="amfe-lista">${lista.map((an, i) => { const n = acrIds(an).length; return `<div class="amfe-op amfe-op--rondas">
        <div class="amfe-op-txt"><b>${esc(L.nombreAnalisisAcr(an))}</b><span>${an.tipo === "acr" ? "Análisis causa raíz" : "Diagrama de Ishikawa"}${an.unidad ? " · " + esc(an.unidad) : ""}${an.sac ? ` · SAC ${an.sac}` : ""} · ${plural(an.acciones.length, "acción", "acciones")}</span>
          <div class="aud-rgs">${an.acciones.map(x => { const on = !acrFuera.has(an.id + "|" + x.id); return `<button type="button" class="aud-rg${on ? " on" : ""}" data-act="acr-pt" data-k="${esc(an.id + "|" + x.id)}" aria-pressed="${on}"><span class="aud-check">${on ? "✓" : ""}</span><span class="aud-rg-t"><b>${esc(x.que)}</b><span>${esc([x.fuerza ? "Acción " + FZ_ACR[x.fuerza].toLowerCase() : "", x.indicador ? "indicador: " + x.indicador.nombre : "sin indicador", x.responsable].filter(lleno).join(" · "))}</span></span></button>`; }).join("")}</div></div>
        <button class="btn btn--primary" data-act="acr-traer" data-i="${i}"${n ? "" : " disabled"}>Crear la auditoría</button></div>`; }).join("")}</div>`;
    return `<div class="card pegar no-print" data-zona="acr">
      <h3 class="sub-h">Traer de ACR · Ishikawa</h3>
      <p class="field-sub">Las <b>acciones de mejora</b> de un análisis causa raíz o de un diagrama de Ishikawa. Se crea una <b>auditoría nueva</b> con un criterio por acción, para comprobar con una muestra si se aplica; su indicador pasa a ser el del criterio. Los datos <b>se copian</b>: si el análisis cambia, vuelve a traerlo.</p>
      ${cuerpo}
      <div class="toolbar"><button class="btn${d.origen === "nada" ? " btn--primary" : ""}" data-act="acr-archivo">Cargar la copia .json de ACR · Ishikawa</button><!--[eco]-->${d.origen === "copia" ? `<button class="btn" data-act="acr-olvidar">Usar los de este navegador</button>` : ""}<!--[/eco]--><button class="btn" data-act="acr-cerrar">Cancelar</button></div>
    </div>`;
  }
  function repintarAcr() {
    if (location.hash.startsWith("#/auditorias")) renderAuditorias();
    const z = $("[data-zona='acr']"); if (z) z.scrollIntoView({ block: "nearest" });
  }
  function traerAcr(i) {
    const d = acrDisponible(), an = d.analisis && d.analisis[i]; if (!an) return;
    const ids = acrIds(an); if (!ids.length) return;
    const a = L.auditoriaDesdeAcr(an, genId, hoy(), ids);
    datosUsuario.auditorias.push(a); acrAbierto = false; acrCopia = null; acrFuera.clear(); guardar(true);
    location.hash = "#/auditoria/" + a.id;
    toast(`Auditoría creada con ${plural(a.criterios.length, "criterio", "criterios")}, uno por acción, con su indicador. Completa el proceso y el objetivo.`, 5000);
  }

  function renderMapa(m) {
    actualMapa = m; actualAud = null; nAyuda = 0;
    if (document.body.classList.contains("ver-informe")) { renderMapaInforme(m); return; }
    const P = L.puestos(m.riesgos), subs = subprocesosDe(m);
    if (filtroSub && !subs.includes(filtroSub)) filtroSub = "";
    let lista = ordenMapa === "alta" ? m.riesgos.slice() : L.ordenarRiesgos(m.riesgos, ordenMapa);
    if (filtroSub) lista = lista.filter(r => (r.subproceso || "").trim() === filtroSub);
    view.innerHTML = `
      <div class="wiz-top no-print">${volver(modoEjemplo ? "#/ejemplos" : "#/riesgos", modoEjemplo ? "Ejemplos" : "Mis mapas")}${lineaPDCA("riesgos")}</div>
      <div class="wiz-titulo"><span class="wiz-paso">Punto de partida · Planificar</span><h1 class="page-title">Mapa de Riesgos</h1></div>
      ${idea("No se audita todo: se audita <b>lo que más riesgo tiene</b>. El Mapa de Riesgos dice dónde mirar; la auditoría comprobará si las medidas de control se aplican de verdad.")}
      ${facil(`
        <p>Puntúa cada fallo de 1 a 10 en tres escalas. Usad siempre la misma escala en todo el mapa (y, si es posible, en toda la unidad):</p>
        <div class="table-wrap"><table class="mini facil-tabla"><tr><th></th><th>1–2</th><th>3–4</th><th>5–6</th><th>7–8</th><th>9–10</th></tr>
          <tr><td><b>Gravedad</b><br><small>¿cuánto daño?</small></td><td>Ninguno o mínimo</td><td>Leve, sin secuelas</td><td>Moderado, alarga la atención</td><td>Grave, daño importante</td><td>Muy grave o mortal</td></tr>
          <tr><td><b>Ocurrencia</b><br><small>¿cada cuánto?</small></td><td>Remoto</td><td>Raro</td><td>Ocasional</td><td>Frecuente</td><td>Casi seguro</td></tr>
          <tr><td><b>Detección</b><br><small>¿se descubre a tiempo?</small></td><td>Casi seguro que sí</td><td>Probablemente</td><td>Puede que sí</td><td>Difícilmente</td><td>Imposible</td></tr></table></div>
        <div class="formula">IPR = G × O × D</div>
        ${trampa("La <b>detección va al revés</b> que las otras dos: un 10 significa que el fallo <b>no se detecta</b> antes de causar daño. Es el error más frecuente al puntuar.")}
        <p>Después, marca con <b>★ Auditar</b> los hallazgos clave: los que vas a comprobar con la auditoría.</p>`)}
      <div class="card">
        <h2 class="sub-h">Datos del mapa</h2>
        ${campo(m, "nombre", "Nombre del mapa", { ph: "p. ej. Admisión en Urgencias", help: "Un nombre corto para reconocerlo: el proceso o la unidad." })}
        <div class="dos-col">
          ${campo(m, "unidad", "Unidad o servicio", { ph: "p. ej. Servicio de Urgencias" })}
          ${campo(m, "fecha", "Fecha del análisis", { opt: true, ph: "p. ej. Mayo 2026" })}
        </div>
        ${campo(m, "proceso", "Proceso analizado", { area: true, opt: true, ph: "p. ej. Proceso de admisión en Urgencias hasta el destino final del paciente", help: "Qué proceso se ha analizado y entre qué puntos (dónde empieza y dónde termina)." })}
        ${campo(m, "equipo", "Equipo que lo ha elaborado", { area: true, opt: true, ph: "p. ej. Supervisión de Enfermería, dos facultativos, TCAE y Calidad" })}
        ${campo(m, "notas", "Notas", { area: true, opt: true })}
      </div>
      <h2 class="sec-t">Riesgos <span class="contador" data-zona="nriesgos">${m.riesgos.length}</span></h2>
      <div class="toolbar no-print">
        <button class="btn btn--primary" data-act="rg-add">+ Añadir riesgo</button>
        <button class="btn" data-act="pegar-abrir">Pegar desde Excel</button>
        ${modoEjemplo ? "" : `<button class="btn" data-act="amfe-abrir">Traer de AMFE</button><button class="btn" data-act="amfe-abrir" data-fuente="mr">Traer de Mapa de Riesgos</button>`}
      </div>
      ${pegarAbierto ? pegarHtml() : ""}
      ${traerAbierto && !modoEjemplo ? traerHtml() : ""}
      ${m.riesgos.length > 1 ? `<div class="filtros no-print">
        <label>Ordenar por<select data-filtro="orden"><option value="ipr"${ordenMapa === "ipr" ? " selected" : ""}>Prioridad (IPR)</option><option value="sub"${ordenMapa === "sub" ? " selected" : ""}>Subproceso</option><option value="alta"${ordenMapa === "alta" ? " selected" : ""}>Orden de alta</option></select></label>
        ${subs.length > 1 ? `<label>Subproceso<select data-filtro="sub"><option value="">Todos</option>${subs.map(s => `<option${s === filtroSub ? " selected" : ""}>${esc(s)}</option>`).join("")}</select></label>` : ""}
      </div>` : ""}
      <div data-zona="avisos">${L.avisosMapa(m).map(avisoHtml).join("")}</div>
      <datalist id="dl-sub">${subs.map(s => `<option value="${esc(s)}">`).join("")}</datalist>
      <div class="rg-lista">${lista.map(r => rgCard(r, P)).join("") || (m.riesgos.length ? `<p class="placeholder-box">Ningún riesgo en este subproceso.</p>` : `<p class="placeholder-box">Añade el primer riesgo o pega la tabla de tu AMFE.</p>`)}</div>
      ${m.riesgos.length ? `<div class="toolbar no-print"><button class="btn" data-act="rg-add">+ Añadir otro riesgo</button></div>` : ""}
      <h2 class="sec-t">La prioridad de un vistazo</h2>
      <div class="card chart-card" data-zona="grafico">${graficoMapa(m)}</div>
      <h2 class="sec-t">Hallazgos clave para auditar</h2>
      <p class="page-lead">Lo que vas a comprobar, qué medida debería estar funcionando y qué prueba lo demostraría.</p>
      <div data-zona="claves">${clavesHtml(m)}</div>
      <div class="toolbar no-print sep-arriba">
        <button class="btn" data-act="informe">Ver informe / PDF</button>
        <button class="btn" data-act="mapa-word">⬇ Word</button>
        <button class="btn" data-act="mapa-excel">Exportar a Excel</button>
        ${modoEjemplo ? "" : `<button class="btn" data-act="mapa-dup" data-id="${m.id}">Duplicar</button><button class="btn btn--peligro-ghost" data-act="mapa-del" data-id="${m.id}">Borrar mapa</button>`}
      </div>`;
  }

  // Vista de informe (imprimir / PDF)
  function renderMapaInforme(m) {
    const P = L.puestos(m.riesgos), res = L.resumenMapa(m), lista = L.ordenarRiesgos(m.riesgos);
    const fila = (k, v) => lleno(v) ? `<tr><th>${k}</th><td>${escMl(v)}</td></tr>` : "";
    view.innerHTML = `${informeBar()}${informeCab("Mapa de Riesgos" + (lleno(m.nombre) ? " · " + m.nombre : ""), m.unidad)}
      <div class="ficha">
        <div class="ficha-cab"><span class="wiz-paso">Mapa de Riesgos (AMFE)</span><h2 class="ficha-nombre">${esc(m.nombre || "Sin nombre")}</h2></div>
        <table class="ficha-t">${fila("Unidad o servicio", m.unidad)}${fila("Proceso analizado", m.proceso)}${fila("Fecha del análisis", m.fecha)}${fila("Equipo", m.equipo)}${fila("Notas", m.notas)}
          <tr><th>Resumen</th><td>${plural(res.n, "riesgo", "riesgos")} · IPR máximo ${res.maxIPR || "—"} · ${plural(res.porNivel.muyalto, "muy alto", "muy altos")}, ${plural(res.porNivel.alto, "alto", "altos")}, ${plural(res.porNivel.medio, "medio", "medios")}, ${plural(res.porNivel.bajo, "bajo", "bajos")} · ${plural(res.claves, "hallazgo clave", "hallazgos clave")}</td></tr></table>
      </div>
      <div class="chart-card informe-graf">${graficoMapa(m)}</div>
      <h2 class="sec-t">Riesgos priorizados</h2>
      <div class="table-wrap"><table class="mini tabla-riesgos"><thead><tr><th>#</th><th>Subproceso</th><th>Fallo</th><th>Efecto</th><th>Causa</th><th>G</th><th>O</th><th>D</th><th>IPR</th><th>★</th></tr></thead><tbody>
        ${lista.map(r => `<tr><td>${P[r.id] || ""}</td><td>${esc(r.subproceso)}</td><td><b>${esc(r.fallo)}</b></td><td>${esc(r.efecto)}</td><td>${esc(r.causa)}</td><td>${esc(r.g)}</td><td>${esc(r.o)}</td><td>${esc(r.d)}</td><td>${iprBadge(L.iprDe(r))}</td><td>${r.clave ? "★" : ""}</td></tr>`).join("")}
      </tbody></table></div>
      <h2 class="sec-t">Hallazgos clave para auditar</h2>
      ${clavesHtml(m)}
      ${informePie()}`;
  }

  // Refresca lo que depende de lo escrito sin repintar los campos (no se pierde el foco)
  function refrescarMapa(rid) {
    const m = actualMapa; if (!m) return;
    const P = L.puestos(m.riesgos);
    $$(".rg[data-rid]").forEach(card => {
      const r = m.riesgos.find(x => x.id === card.dataset.rid); if (!r) return;
      $(".rg-toggle", card).innerHTML = rgCabInner(r, P);
      card.className = card.className.replace(/niv-borde--\S+/, "niv-borde--" + nivelTxt(L.iprDe(r)));
      if (r.id === rid) { const z = $("[data-zr='ipr']", card); if (z) z.innerHTML = iprMini(r); }
    });
    const Z = { avisos: () => L.avisosMapa(m).map(avisoHtml).join(""), grafico: () => graficoMapa(m), claves: () => clavesHtml(m), nriesgos: () => String(m.riesgos.length) };
    $$("[data-zona]").forEach(el => { const f = Z[el.dataset.zona]; if (f) el.innerHTML = f(); });
    const dl = $("#dl-sub"); if (dl) dl.innerHTML = subprocesosDe(m).map(s => `<option value="${esc(s)}">`).join("");
  }
  function repintarMapa() { const y = window.scrollY; renderMapa(actualMapa); window.scrollTo(0, y); }

  // ---------- Auditorías: lista ----------
  function renderAuditorias() {
    const lista = datos.auditorias.slice().sort((a, b) => String(b.modificado).localeCompare(String(a.modificado)));
    view.innerHTML = `
      <h1 class="page-title">Mis auditorías</h1>
      <p class="page-lead">Cada auditoría recorre el ciclo completo: inicio y diseño (Planificar), recogida de datos (Hacer), informe (Verificar) y mejora con seguimiento (Actuar).</p>
      <div class="toolbar no-print"><a class="btn btn--primary" href="#/auditoria/nueva">+ Nueva auditoría</a><button class="btn" data-act="rondas-abrir" data-modo="aud">Traer de Rondas de Seguridad</button><button class="btn" data-act="acr-abrir">Traer de ACR · Ishikawa</button><a class="btn" href="#/auditoria/ej-aud-urg">Ver un ejemplo</a></div>
      ${rondasAbierto === "aud" ? rondasHtml() : ""}
      ${acrAbierto ? acrHtml() : ""}
      ${lista.length ? `<div class="cuadro-lista">${lista.map(tarjetaAud).join("")}</div>`
        : `<div class="placeholder-box"><p><b>Todavía no tienes ninguna auditoría.</b></p><p>Puedes crearla desde los hallazgos clave de un Mapa de Riesgos, traer lo que falla una y otra vez en tus rondas de seguridad o las acciones de un análisis causa raíz, o empezar directamente si nace de un estándar, un incidente, un indicador o un encargo.</p></div>`}`;
  }
  // En qué fase va una auditoría (la primera que no está terminada)
  function faseDe(a) {
    const p = L.progresoInicio(a), gd = L.progresoDiseno(a), pr = L.progresoRecogida(a), gi = L.progresoInforme(a), gm = L.progresoMejora(a);
    if (p.hechos < p.total) return { nom: `Inicio ${p.hechos}/${p.total}`, pdca: "P" };
    if (![1, 2, 3, 4].every(k => gd[k])) return { nom: "Diseño", pdca: "P" };
    if (pr.completos < pr.total) return { nom: `Recogida ${pr.completos}/${pr.total}`, pdca: "H" };
    if (![1, 2, 3, 4, 5].every(k => gi[k])) return { nom: "Informe", pdca: "V" };
    if (![1, 2, 3].every(k => gm[k])) return { nom: "Mejora", pdca: "A" };
    return { nom: "Ciclo completo ✓", pdca: "A" };
  }
  function tarjetaAud(a) {
    const o = L.ORIGENES[a.origen.tipo], fase = faseDe(a);
    return `<div class="item-card">
      <a class="item-main" href="#/auditoria/${a.id}">
        <b class="item-t">${lleno(a.titulo) ? esc(a.titulo) : '<span class="vacio">Auditoría sin título</span>'}</b>
        <span class="item-s">${esc(a.unidad) || "&nbsp;"}</span>
        <span class="badges">${o ? `<span class="badge">${o.icono} ${o.nom}</span>` : ""}<span class="badge">${plural(a.criterios.length, "criterio", "criterios")}</span><span class="badge pdca-b pdca--${fase.pdca}">${fase.nom}</span>${a.seguimientoDe ? '<span class="badge">↻ Seguimiento</span>' : ""}</span>
      </a>
      <div class="item-pie"><span>Modificado: ${fechaCorta(a.modificado)}</span><span><button class="link-btn" data-act="aud-dup" data-id="${a.id}">Duplicar</button> · <button class="link-btn link-btn--peligro" data-act="aud-del" data-id="${a.id}">Borrar</button></span></div>
    </div>`;
  }

  // ---------- Auditoría: inicio ----------
  let actualAud = null;
  const PASOS_AUD = [
    { k: "inicio", corto: "Inicio", pdca: "P" }, { k: "diseno", corto: "Diseño", pdca: "P" }, { k: "hacer", corto: "Recogida", pdca: "H" },
    { k: "verificar", corto: "Informe", pdca: "V" }, { k: "actuar", corto: "Mejora", pdca: "A" }
  ];
  function pasosAud(a, actual = "inicio") {
    const p = L.progresoInicio(a), gd = L.progresoDiseno(a), pr = L.progresoRecogida(a), gi = L.progresoInforme(a), gm = L.progresoMejora(a);
    const hecho = { inicio: p.hechos === p.total, diseno: [1, 2, 3, 4, 5].every(k => gd[k]), hacer: pr.total > 0 && pr.completos === pr.total, verificar: [1, 2, 3, 4, 5].every(k => gi[k]), actuar: [1, 2, 3].every(k => gm[k]) };
    const href = { inicio: `#/auditoria/${a.id}`, diseno: `#/auditoria/${a.id}/diseno/1`, hacer: `#/auditoria/${a.id}/recogida`, verificar: `#/auditoria/${a.id}/informe/1`, actuar: `#/auditoria/${a.id}/mejora/1` };
    return `<ol class="wiz-steps" aria-label="Fases de la auditoría">${PASOS_AUD.map((s, i) => { const disp = !!href[s.k], act = s.k === actual, cls = `wiz-step pdca--${s.pdca}${act ? " actual" : ""}${disp ? "" : " prox"}${hecho[s.k] && !act ? " hecho" : ""}`, ins = `<span class="wiz-num">${hecho[s.k] && !act ? "✓" : i + 1}</span><span class="wiz-lbl">${s.corto}</span>`;
      return `<li>${disp ? `<a href="${href[s.k]}" class="${cls}"${act ? ' aria-current="step"' : ""}>${ins}</a>` : `<span class="${cls}" title="Próximamente">${ins}</span>`}</li>`; }).join("")}</ol>`;
  }
  const PH_ORIGEN = {
    estandar: "p. ej. Estándar ACSA sobre identificación inequívoca de pacientes; protocolo de identificación del hospital",
    incidente: "p. ej. Notificación de un error de identificación en Radiología (sin datos del paciente)",
    indicador: "p. ej. «% de pacientes con pulsera identificativa» bajó al 82 % (estándar ≥ 95 %) en el último trimestre",
    seguimiento: "p. ej. Auditoría de higiene de manos de marzo: plan de mejora con reubicación de dispensadores y formación",
    encargo: "p. ej. Objetivo del acuerdo de gestión de la unidad para este año",
    rondas: "p. ej. En las rondas de seguridad de la planta, la pulsera identificativa falla en 2 de las 3 últimas rondas",
    evidencia: "p. ej. Ensayo clínico que muestra que la lista de verificación digital reduce los triajes incompletos"
  };

  function origenHtml(a) {
    const t = a.origen.tipo;
    const cards = Object.keys(L.ORIGENES).map(k => { const o = L.ORIGENES[k]; return `<button type="button" class="opt-card origen-card${t === k ? " active" : ""}" data-pick="origen.tipo" data-v="${k}"><span class="opt-letra">${o.icono}</span><span class="opt-txt"><b>${o.nom}</b><span class="opt-q">${o.q}</span></span></button>`; }).join("");
    let dep = "";
    if (t === "riesgos") {
      const mapas = datos.mapas, m = buscaMapa(a.origen.mapaId);
      if (!mapas.length) dep = `<div class="note">ℹ Todavía no tienes ningún Mapa de Riesgos. <a href="#/riesgos/nuevo">Crea uno</a> y vuelve, o describe aquí de dónde salen los riesgos.</div>${campo(a, "origen.detalle", "De dónde salen los riesgos", { area: true, ph: "p. ej. AMFE del proceso de admisión realizado en mayo" })}`;
      else {
        dep = `<div class="field"><div class="field-head"><label class="field-label">¿Qué Mapa de Riesgos?</label></div>
          <div class="filtros filtros--solo"><label><select data-act-sel="aud-mapa"><option value="">Elige un mapa…</option>${mapas.map(x => `<option value="${x.id}"${x.id === a.origen.mapaId ? " selected" : ""}>${esc(x.nombre || "Mapa sin nombre")}${lleno(x.unidad) ? " · " + esc(x.unidad) : ""}</option>`).join("")}</select></label></div></div>`;
        if (m) {
          const rs = L.ordenarRiesgos(m.riesgos).filter(r => lleno(r.fallo));
          dep += `<p class="field-sub">Marca los riesgos que va a comprobar esta auditoría. Los ★ son los hallazgos clave que elegiste en el mapa. Cada riesgo marcado se añade abajo, en «Qué se va a auditar».</p>
            <div class="aud-rgs">${rs.map(r => { const on = a.origen.riesgoIds.includes(r.id); return `<button type="button" class="aud-rg${on ? " on" : ""}" data-act="aud-riesgo" data-id="${r.id}" aria-pressed="${on}"><span class="aud-check">${on ? "✓" : ""}</span>${iprBadge(L.iprDe(r))}<span class="aud-rg-t"><b>${r.clave ? "★ " : ""}${esc(r.fallo)}</b><span>${esc(r.subproceso)}</span></span></button>`; }).join("") || `<p class="placeholder-box">Este mapa no tiene riesgos todavía.</p>`}</div>
            <p class="field-sub"><a href="#/riesgos/${m.id}">Abrir el mapa «${esc(m.nombre || "sin nombre")}»</a></p>`;
        }
      }
    } else if (t === "evidencia") dep = `<div class="toolbar no-print"><button class="btn btn--primary" data-act="aud-lc">📄 Traer de Lectura Crítica</button></div>
      <p class="field-sub"><!--[eco]-->Trae un artículo que hayas leído con la app <a href="${L.URL_LC}" target="_blank" rel="noopener">Lectura Crítica</a><!--[/eco]--><!--[ind]Carga un artículo de la copia de seguridad (.json) de la app Lectura Crítica[/ind]-->: su evidencia queda aquí abajo y su pregunta PICO se convierte en un criterio que puedes ajustar.</p>`
      + campo(a, "origen.detalle", "Concreta el origen", { area: true, rows: 4, ph: PH_ORIGEN[t], help: "La evidencia que justifica la auditoría. Aparecerá en la introducción del informe." });
    else if (t) dep = campo(a, "origen.detalle", "Concreta el origen", { area: true, rows: 3, ph: PH_ORIGEN[t] || "", help: "Una o dos frases que expliquen por qué se hace esta auditoría. Aparecerá en la introducción del informe." });
    return `<div class="opt-grid opt-grid--3">${cards}</div>${dep}`;
  }

  function criteriosHtml(a) {
    const subs = a.origen.tipo === "riesgos" && buscaMapa(a.origen.mapaId) ? subprocesosDe(buscaMapa(a.origen.mapaId)) : [...new Set(a.criterios.map(c => c.subproceso).filter(lleno))];
    const sinCrit = a.criterios.filter(c => !lleno(c.criterio)).length;
    return `<datalist id="dl-sub-aud">${subs.map(s => `<option value="${esc(s)}">`).join("")}</datalist>
      ${a.criterios.map((c, i) => { const b = f => `data-c="${c.id}" data-f="${f}"`; return `<div class="crit">
        <div class="crit-cab"><span class="crit-n">${i + 1}</span><b>Criterio ${i + 1}</b><button type="button" class="link-btn link-btn--peligro no-print" data-act="crit-del" data-id="${c.id}">Quitar</button></div>
        <div class="dos-col">
          ${campo(c, "subproceso", "Subproceso", { bind: b("subproceso"), list: "dl-sub-aud", ph: "p. ej. Triaje de enfermería" })}
          ${campo(c, "hallazgo", "Hallazgo o riesgo", { bind: b("hallazgo"), area: true, ph: "p. ej. No colocación de pulsera identificativa", help: "Lo que puede fallar (o ha fallado) y motiva este criterio." })}
        </div>
        ${campo(c, "criterio", "Criterio de auditoría (la buena práctica que se comprobará)", { bind: b("criterio"), area: true, ph: "p. ej. Todos los pacientes están identificados con pulsera antes de pasar a box o a pruebas", help: "La regla con la que se compara la práctica real. Escríbela en positivo, concreta y verificable: alguien de fuera debería poder decir «cumple» o «no cumple» sin dudar." })}
      </div>`; }).join("") || `<p class="placeholder-box">${a.origen.tipo === "riesgos" ? "Marca arriba los riesgos del mapa o añade un criterio a mano." : "Añade el primer criterio: qué subproceso, qué puede fallar y qué buena práctica comprobarás."}</p>`}
      ${sinCrit && a.criterios.length ? `<div class="note">ℹ ${sinCrit === 1 ? "Un criterio no tiene" : sinCrit + " criterios no tienen"} escrita la buena práctica. Es lo que convertirás en indicador en la fase de Diseño.</div>` : ""}
      <div class="toolbar no-print"><button class="btn" data-act="crit-add">+ Añadir criterio</button></div>`;
  }

  function hitosHtml(a, solo) {
    return L.HITOS.filter(h => !solo || solo.includes(h.k)).map(h => { const v = a.hitos[h.k]; return `<div class="hito${v.hecho ? " hecho" : ""} pdca--${h.pdca}">
      <button type="button" class="hito-check" data-act="hito" data-k="${h.k}" aria-pressed="${v.hecho}" aria-label="${v.hecho ? "Desmarcar" : "Marcar como hecho"}">${v.hecho ? "✓" : ""}</button>
      <div class="hito-txt"><b>${h.nom}</b><span>${h.cuando} · ${h.help}</span>
        <div class="hito-campos"><input class="txt-in" type="date" data-k="hitos.${h.k}.fecha" value="${esc(v.fecha)}" aria-label="Fecha" /><input class="txt-in" data-k="hitos.${h.k}.nota" value="${esc(v.nota)}" placeholder="Nota (opcional)" autocomplete="off" /></div>
      </div></div>`; }).join("");
  }
  function resumenAud(a) {
    const p = L.progresoInicio(a), o = L.ORIGENES[a.origen.tipo];
    return `<div class="resumen">
      <div class="res-label">Así va tu auditoría</div>
      <h3 class="resumen-nombre">${lleno(a.titulo) ? esc(a.titulo) : '<span class="vacio">Sin título todavía</span>'}</h3>
      <div class="badges">${o ? `<span class="badge">${o.icono} ${o.nom}</span>` : ""}<span class="badge">${L.TIPOS_AUD[a.tipo]}</span><span class="badge">${L.OBJETOS_AUD[a.objeto].nom}</span></div>
      <ul class="check-lista">${p.items.map(([t, ok]) => `<li class="${ok ? "ok" : ""}">${ok ? "✓" : "○"} ${t}</li>`).join("")}</ul>
      <ul class="check-lista check-lista--hitos">${L.HITOS.map(h => `<li class="${a.hitos[h.k].hecho ? "ok" : ""}">${a.hitos[h.k].hecho ? "✓" : "○"} ${h.nom}</li>`).join("")}</ul>
      <p class="res-prox"><b>Después:</b> el <a href="#/auditoria/${a.id}/diseno/1">diseño</a> (método, indicadores, evidencias, muestra y pilotaje), la recogida de datos, el informe y el plan de mejora.</p>
    </div>`;
  }

  function renderAuditoria(a) {
    actualAud = a; actualMapa = null; faseAud = "inicio"; nAyuda = 0;
    view.innerHTML = `
      <div class="wiz-top no-print">${volver(modoEjemplo ? "#/ejemplos" : "#/auditorias", modoEjemplo ? "Ejemplos" : "Mis auditorías")}${pasosAud(a)}</div>
      <div class="wiz-grid">
        <div class="wiz-main">
          <div class="wiz-titulo"><span class="wiz-paso">Paso 1 de 5 · Planificar</span><h1 class="page-title">Inicio de la auditoría</h1></div>
          ${a.seguimientoDe ? (() => { const o = datos.auditorias.find(x => x.id === a.seguimientoDe); return `<div class="note">↻ Auditoría de <b>seguimiento</b>${o ? ` de <a href="#/auditoria/${o.id}">${esc(o.titulo)}</a>` : ""}. Al terminar la recogida verás el antes y después en <a href="#/auditoria/${a.id}/mejora/3">Mejora › Seguimiento</a>.</div>`; })() : ""}
          ${(() => { const pl = buscaPlan(a.planId), en = pl && pl.entradas.find(x => x.id === a.entradaId); return pl ? `<div class="note">📅 Programada en el <a href="#/plan/${pl.id}/1">Plan Anual ${esc(pl.anio)}</a>${en ? ` · «${esc(en.titulo)}» · ${esc(L.textoMeses(en.meses) || "sin meses")}` : ""}.</div>` : ""; })()}
          ${idea("Antes de mirar una sola historia, toda auditoría responde a tres preguntas: <b>¿por qué?</b> (su origen), <b>¿para qué?</b> (su objetivo) y <b>¿qué voy a comprobar?</b> (sus criterios).")}
          <h2 class="sec-t">1 · ¿De dónde nace esta auditoría?</h2>
          ${facil(`<p>No todas las auditorías nacen de un AMFE. Las más habituales en una unidad son:</p><ul>
            <li><b>Riesgos</b>: el Mapa de Riesgos señala qué es prioritario.</li>
            <li><b>Estándar o norma</b>: la acreditación o un protocolo obliga a comprobar su cumplimiento.</li>
            <li><b>Incidente</b>: un evento adverso o una notificación pone el foco en un proceso. La auditoría dirá si es algo puntual o se repite.</li>
            <li><b>Indicador</b>: un indicador no alcanza su estándar y hay que saber por qué.</li>
            <li><b>Auditoría anterior</b>: toca comprobar si las mejoras han funcionado (seguimiento).</li>
            <li><b>Encargo</b>: un objetivo de la unidad o una petición de la Dirección.</li></ul>
            <p>El origen se cuenta en la <b>introducción</b> del informe y ayuda a que los auditados entiendan por qué se les audita.</p>`)}
          <div class="card" data-zona-aud="origen">${origenHtml(a)}</div>
          <h2 class="sec-t">2 · Datos generales</h2>
          <div class="card">
            <div class="dos-col">
              ${campo(a, "unidad", "Unidad o servicio auditado", { ph: "p. ej. Servicio de Urgencias" })}
              ${campo(a, "centro", "Centro", { opt: true, ph: "p. ej. Hospital…" })}
            </div>
            ${campo(a, "proceso", "Proceso auditado", { area: true, ph: "p. ej. el proceso de admisión en Urgencias hasta la decisión de ingreso", help: "Qué proceso se audita y entre qué puntos. Escríbelo con artículo («el proceso de…», «la conciliación de…»): así se usa en los textos que propone la app." })}
            ${campo(a, "alcance", "Alcance", { area: true, opt: true, ph: "p. ej. Episodios con decisión de ingreso; de la llegada a la decisión de ingreso (sin el seguimiento en planta)", help: "Qué se audita y hasta dónde: procesos, subprocesos, periodo y pacientes; y qué queda fuera. Si viene del Plan Anual, ya está escrito." })}
            ${campo(a, "titulo", "Título de la auditoría", { ph: "p. ej. Auditoría interna del proceso de admisión en Urgencias", extra: `<div class="quick"><button type="button" class="chip chip--accent" data-act="aud-sug-tit">✎ Proponer título</button></div>` })}
            <div class="field"><div class="field-head"><label class="field-label">¿Quién audita?</label>${ayudaBtn("Interna: profesionales de la propia organización. Externa: una entidad independiente (acreditación, inspección, certificación). Si audita la propia unidad su trabajo (autoauditoría), se pierde algo de independencia: conviene incluir a alguien de fuera del área.").btn}</div><p class="help" id="help-h${nAyuda}" hidden>Interna: profesionales de la propia organización. Externa: una entidad independiente (acreditación, inspección, certificación). Si audita la propia unidad su trabajo (autoauditoría), se pierde algo de independencia: conviene incluir a alguien de fuera del área.</p>
              ${seg(a, "tipo", Object.entries(L.TIPOS_AUD))}</div>
            <div class="field"><div class="field-head"><label class="field-label">¿Qué se audita?</label></div>
              ${seg(a, "objeto", Object.keys(L.OBJETOS_AUD).map(k => [k, L.OBJETOS_AUD[k].nom]))}
              <p class="field-sub">${L.OBJETOS_AUD[a.objeto].def}</p></div>
          </div>
          <h2 class="sec-t">3 · Objetivos</h2>
          <div class="card">
            ${campo(a, "objetivoGeneral", "Objetivo general", { area: true, rows: 3, ph: "p. ej. Evaluar el grado de cumplimiento de las medidas de seguridad del proceso de admisión en Urgencias…", help: "Una frase que diga qué se quiere saber con esta auditoría. Empieza por un verbo (evaluar, comprobar, verificar) y nombra el proceso.", extra: `<div class="quick"><button type="button" class="chip chip--accent" data-act="aud-sug-obj">✎ Proponer objetivo</button></div>` })}
            ${campo(a, "objetivosEsp", "Objetivos específicos", { area: true, rows: 4, opt: true, sub: "Uno por línea.", ph: "p. ej. Comprobar si las acciones preventivas del AMFE se aplican en la práctica\nIdentificar los puntos críticos con más incumplimiento" })}
            ${campo(a, "introduccion", "Introducción o contexto", { area: true, rows: 3, opt: true, ph: "p. ej. Esta auditoría evalúa… Parte de los resultados del AMFE realizado en…", help: "El párrafo con el que empezará el informe: qué se audita, por qué y en qué marco." })}
            ${trampa("«Mejorar la seguridad del paciente» no es un objetivo de auditoría: es una intención. Un objetivo dice <b>qué se va a comprobar</b> y <b>dónde</b>.")}
          </div>
          <h2 class="sec-t">4 · Qué se va a auditar</h2>
          <p class="page-lead">Un criterio por cada hallazgo: la buena práctica que se comparará con la realidad. En la fase de Diseño, cada criterio tendrá su indicador.</p>
          ${facil(`<p>El <b>hallazgo</b> es lo que puede fallar; el <b>criterio</b> es cómo debería hacerse bien. Un buen criterio es:</p>
            <ul><li><b>Positivo</b>: describe lo correcto, no el error.</li><li><b>Concreto</b>: con un plazo, una población o una condición («antes de pasar a box», «en las primeras 24 h», «en mayores de 75 años»).</li><li><b>Verificable</b>: alguien de fuera puede decir «cumple» o «no cumple» sin dudar.</li></ul>
            <p>Se toma de un protocolo interno, de un estándar de acreditación o de una guía.</p>
            ${ejemplo("del hallazgo al criterio", "<p><b>Hallazgo</b>: «no conciliación de la medicación habitual». <b>Criterio</b>: «se documenta la conciliación de la medicación habitual antes de la prescripción en Urgencias».</p>")}`)}
          <div class="card" data-zona-aud="criterios">${criteriosHtml(a)}</div>
          <h2 class="sec-t">5 · Hitos de la auditoría</h2>
          <p class="page-lead">Cuatro momentos que la teoría exige y que se suelen olvidar. Marca cada uno cuando se cumpla.</p>
          <div class="card">${hitosHtml(a)}</div>
          <div class="wiz-nav no-print">
            <span></span>
            <a class="btn btn--primary" href="#/auditoria/${a.id}/diseno/1">Siguiente: Diseño →</a>
          </div>
        </div>
        <aside class="wiz-side no-print" data-zona="resumen-aud">${resumenAud(a)}</aside>
      </div>`;
  }
  function refrescarAud() {
    const a = actualAud; if (!a) return;
    if (faseAud === "diseno") { refrescarDis(); return; }
    if (faseAud === "recogida") { refrescarRec(); return; }
    if (faseAud === "informe") { refrescarInf(); return; }
    if (faseAud === "mejora") { refrescarMej(); return; }
    const z = $("[data-zona='resumen-aud']"); if (z) z.innerHTML = resumenAud(a);
    const st = $(".wiz-steps"); if (st) st.outerHTML = pasosAud(a);
  }
  function repintarAud() { const y = window.scrollY; if (faseAud === "diseno") renderDiseno(actualAud, subDiseno); else if (faseAud === "recogida") renderRecogida(actualAud, critRecogida); else if (faseAud === "informe") renderInforme(actualAud, subInforme); else if (faseAud === "mejora") renderMejora(actualAud, subMejora); else renderAuditoria(actualAud); window.scrollTo(0, y); }

  // ---------- Documentos: bloques → HTML (vista previa, imprimir y PDF) y → Word ----------
  function bloquesHtml(bloques) {
    const celda = (c, cab) => { const o = c !== null && typeof c === "object" ? c : { texto: c }; const st = o.fondo ? ` style="background:#${o.fondo}"` : ""; const cl = [o.centro ? "c" : "", o.negrita ? "b" : ""].filter(Boolean).join(" "); return `<${cab ? "th" : "td"}${cl ? ` class="${cl}"` : ""}${st}>${escMl(o.texto)}</${cab ? "th" : "td"}>`; };
    return bloques.map(b => {
      if (b.t === "portada") return `<div class="doc-portada"><h1>${esc(b.titulo)}</h1>${b.sub ? `<p class="doc-sub">${esc(b.sub)}</p>` : ""}${(b.extra || []).map(x => `<p>${esc(x)}</p>`).join("")}</div>`;
      if (b.t === "h1") return `<h2 class="doc-h1">${esc(b.texto)}</h2>`;
      if (b.t === "h2") return `<h3 class="doc-h2">${esc(b.texto)}</h3>`;
      if (b.t === "p") return `<p class="doc-p${b.estilo === "nota" ? " doc-nota" : ""}">${b.runs ? b.runs.map(r => r.negrita ? `<b>${escMl(r.texto)}</b>` : escMl(r.texto)).join("") : escMl(b.texto)}</p>`;
      if (b.t === "lista") return `<ul class="doc-ul">${b.items.map(i => `<li>${esc(typeof i === "string" ? i : i.texto)}</li>`).join("")}</ul>`;
      if (b.t === "salto") return `<div class="doc-salto"></div>`;
      if (b.t === "tabla") {
        const suma = (b.anchos || []).reduce((a, x) => a + x, 0);
        const cols = b.anchos ? `<colgroup>${b.anchos.map(w => `<col style="width:${(w / suma * 100).toFixed(1)}%">`).join("")}</colgroup>` : "";
        return `<div class="table-wrap"><table class="doc-t${b.fuente && b.fuente < 9 ? " doc-t--peq" : ""}">${cols}${b.cab && !b.sinCab ? `<thead><tr>${b.cab.map(c => celda(c, true)).join("")}</tr></thead>` : ""}<tbody>${b.filas.map(f => `<tr>${f.map(c => celda(c, false)).join("")}</tr>`).join("")}</tbody></table></div>`;
      }
      return "";
    }).join("");
  }
  function descargarWord(doc, nombre, o = {}) {
    try {
      const bytes = window.Docx.construirDocx(Object.assign({ pie: doc.titulo + " · Generado con la app Auditorías" }, doc, o));
      compartirOBajar(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), nombre, "Word descargado. Ábrelo con Word, Pages o LibreOffice y ajústalo a tu gusto.");
    } catch (e) { toast("No se ha podido crear el Word.", 4000); }
  }

  // ---------- Plan Anual: lista ----------
  function renderPlanes() {
    const lista = datos.planes.slice().sort((a, b) => String(b.anio).localeCompare(String(a.anio)) || String(b.modificado).localeCompare(String(a.modificado)));
    view.innerHTML = `
      <div class="wiz-top no-print">${lineaPDCA("plan")}</div>
      <h1 class="page-title">Plan anual de auditorías</h1>
      <p class="page-lead">La hoja de ruta del año: qué se audita, con qué alcance y criterios, con qué frecuencia, quién y en qué meses.</p>
      ${facil(`<p>El <b>Plan Anual</b> es un documento de trabajo, <b>aprobado por la Dirección y comunicado</b> a los implicados, que ordena todas las auditorías de un año. Sin él, se audita lo que ha salido en el último incidente y no lo que más riesgo tiene.</p>
        <p>Se construye en cinco pasos: <b>qué</b> se audita (los hallazgos clave del Mapa de Riesgos), <b>alcance y criterios</b>, <b>frecuencia, responsables y recursos</b>, <b>cronograma</b> y <b>roles y aprobación</b>. Al final, la app genera el documento en Word y en PDF.</p>
        <p>Cada auditoría del plan tendrá después su <b>plan específico</b>: la auditoría concreta, con sus criterios, indicadores y muestra.</p>`)}
      <div class="toolbar no-print"><a class="btn btn--primary" href="#/plan/nuevo">+ Nuevo plan anual</a><a class="btn" href="#/plan/ej-plan-urg">Ver un ejemplo</a></div>
      ${lista.length ? `<div class="cuadro-lista">${lista.map(tarjetaPlan).join("")}</div>`
        : `<div class="placeholder-box"><p><b>Todavía no tienes ningún plan.</b></p><p>Lo más cómodo es crearlo desde un Mapa de Riesgos con hallazgos clave: la app trae los hallazgos agrupados por subproceso y propone la frecuencia según su IPR.</p></div>`}`;
  }
  function tarjetaPlan(p) {
    const g = L.progresoPlan(p), hechos = [1, 2, 3, 4, 5].filter(k => g[k]).length;
    return `<div class="item-card">
      <a class="item-main" href="#/plan/${p.id}/1">
        <b class="item-t">Plan Anual ${esc(p.anio) || '<span class="vacio">sin año</span>'}</b>
        <span class="item-s">${esc(L.sinArticulo(p.ambito)) || "&nbsp;"}</span>
        <span class="badges"><span class="badge">${plural(p.entradas.length, "auditoría", "auditorías")}</span><span class="badge badge--prog">Pasos ${hechos}/5</span></span>
        ${miniCarga(p)}
      </a>
      <div class="item-pie"><span>Modificado: ${fechaCorta(p.modificado)}</span><span><button class="link-btn" data-act="plan-dup" data-id="${p.id}">Duplicar</button> · <button class="link-btn link-btn--peligro" data-act="plan-del" data-id="${p.id}">Borrar</button></span></div>
    </div>`;
  }
  function miniCarga(p) {
    const c = L.cargaMensual(p).n, cap = L.capacidadDe(p), max = Math.max(cap, ...c, 1), bloq = new Set(p.bloqueados);
    return `<span class="mini-carga" aria-label="Auditorías por mes">${c.map((n, i) => `<span class="mc${n > cap ? " mc--alta" : ""}${bloq.has(i + 1) ? " mc--bloq" : ""}" title="${L.MESES_LARGO[i]}: ${n}"><i style="height:${Math.round(n / max * 100)}%"></i><b>${L.MESES[i][0]}</b></span>`).join("")}</span>`;
  }

  // ---------- Plan Anual: asistente ----------
  let actualPlan = null, pasoPlan = 1, modoImport = "sub";
  const PASOS_PLAN = [
    { n: 1, corto: "Qué", titulo: "Qué se audita este año" },
    { n: 2, corto: "Alcance", titulo: "Alcance y criterios" },
    { n: 3, corto: "Frecuencia", titulo: "Frecuencia, responsables y recursos" },
    { n: 4, corto: "Calendario", titulo: "Cronograma" },
    { n: 5, corto: "Aprobación", titulo: "Roles, aprobación y control" },
    { n: 6, corto: "Documento", titulo: "Documento del plan" }
  ];
  const esVacioPlan = p => !p.entradas.length && !["ambito", "responsable", "objetivo", "introduccion", "notas"].some(k => lleno(p[k]));
  const buscaPlan = id => datos.planes.find(x => x.id === id);
  const buscaEnt = id => actualPlan && actualPlan.entradas.find(e => e.id === id);

  function pasosPlanHtml(p, paso) {
    const g = L.progresoPlan(p);
    return `<ol class="wiz-steps" aria-label="Pasos del plan">${PASOS_PLAN.map(s => `<li><a href="#/plan/${p.id}/${s.n}" class="wiz-step${s.n === paso ? " actual" : ""}${g[s.n] ? " hecho" : ""}"${s.n === paso ? ' aria-current="step"' : ""}><span class="wiz-num">${g[s.n] && s.n !== paso ? "✓" : s.n}</span><span class="wiz-lbl">${s.corto}</span></a></li>`).join("")}</ol>`;
  }
  const avisosPasoHtml = (p, paso) => L.avisosPlan(p, datos.mapas).filter(a => a.paso === paso).map(avisoHtml).join("");
  // Cabecera de cada auditoría del plan dentro de los pasos 2 y 3
  function entCab(e, i) {
    const pr = L.prioridadEntrada(e, datos.mapas);
    return `<div class="ent-cab"><span class="crit-n">${i + 1}</span><b>${lleno(e.titulo) ? esc(e.titulo) : '<span class="vacio">Sin nombre</span>'}</b>${pr.ipr ? iprBadge(pr.ipr) : ""}${e.tipo !== "interna" ? `<span class="badge tipo-b--${e.tipo}">${L.TIPOS_ENTRADA[e.tipo].nom}</span>` : ""}</div>`;
  }
  const eb = (e, f) => `data-e="${e.id}" data-f="${f}"`;

  function planPaso1(p) {
    const mapas = datos.mapas.filter(m => m.riesgos.some(r => r.clave));
    return `
      ${idea("No se trata de auditarlo todo cada año, sino de <b>priorizar</b>: los procesos con más riesgo (IPR alto), los que fallaron en auditorías previas y los que exige la acreditación.")}
      ${facil(`<p>Cada fila del plan es <b>una auditoría programada</b>. Lo práctico es agrupar los hallazgos clave <b>por subproceso</b> (triaje, sala de espera, ingreso…): el calendario queda más claro y una misma visita revisa varios riesgos.</p>
        <ul><li><b>Interna</b>: la hace la propia organización.</li><li><b>Externa</b>: acreditación, inspección o certificación (también conviene tenerla en el calendario).</li><li><b>Seguimiento</b>: comprueba si las mejoras de una auditoría anterior han funcionado.</li></ul>`)}
      <div class="card">
        <h2 class="sub-h">Datos del plan</h2>
        <div class="dos-col">
          ${campo(p, "anio", "Año", { ph: "p. ej. 2027" })}
          ${campo(p, "ambito", "Ámbito", { ph: "p. ej. el Servicio de Urgencias", help: "Unidad, servicio, centro o área que cubre el plan. Escríbelo con artículo («el Servicio de…», «la Unidad de…»): así queda bien en el documento." })}
        </div>
        ${campo(p, "responsable", "Responsable del plan", { ph: "p. ej. Coordinación de Calidad y Seguridad del Paciente", help: "Quien coordina, revisa y hace el seguimiento del plan. Habitualmente, Calidad y Seguridad del Paciente o la persona designada por la Dirección." })}
      </div>
      ${mapas.length ? `<div class="card importar">
        <h2 class="sub-h">Traer los hallazgos clave de un Mapa de Riesgos</h2>
        <div class="filtros filtros--solo"><label>Mapa<select id="plan-mapa">${mapas.map(m => `<option value="${m.id}">${esc(m.nombre || "Mapa sin nombre")} · ${plural(m.riesgos.filter(r => r.clave).length, "hallazgo clave", "hallazgos clave")}</option>`).join("")}</select></label></div>
        <div class="field"><div class="field-head"><label class="field-label">¿Cómo se agrupan?</label></div>
          <div class="seg" role="group"><button type="button" class="${modoImport === "sub" ? "active" : ""}" data-act="modo-import" data-v="sub">Una auditoría por subproceso</button><button type="button" class="${modoImport === "hallazgo" ? "active" : ""}" data-act="modo-import" data-v="hallazgo">Una por hallazgo</button></div></div>
        <div class="toolbar"><button class="btn btn--primary" data-act="plan-importar">Añadir al plan</button></div>
        <p class="field-sub">La frecuencia se propone según el IPR de cada grupo. Podrás cambiarla en el paso 3.</p>
      </div>` : `<div class="note">ℹ Si tienes un <a href="#/riesgos">Mapa de Riesgos</a> con hallazgos clave (★), podrás traerlos aquí con un clic.</div>`}
      ${modoEjemplo ? "" : rondasAbierto === "plan" ? rondasHtml() : `<div class="toolbar no-print"><button class="btn" data-act="rondas-abrir" data-modo="plan">Traer de Rondas de Seguridad</button></div>`}
      <h2 class="sec-t">Auditorías del plan <span class="contador">${p.entradas.length}</span></h2>
      <div data-zona="avisos-plan">${avisosPasoHtml(p, 1)}</div>
      ${p.entradas.map((e, i) => {
        const m = datos.mapas.find(x => x.id === e.mapaId), rs = L.riesgosDeEntrada(e, datos.mapas);
        const libres = m ? L.ordenarRiesgos(m.riesgos.filter(r => !e.riesgoIds.includes(r.id) && lleno(r.fallo))) : [];
        return `<div class="crit ent">
          <div class="crit-cab"><span class="crit-n">${i + 1}</span><b>Auditoría ${i + 1}</b><button type="button" class="link-btn link-btn--peligro no-print" data-act="ent-del" data-id="${e.id}">Quitar</button></div>
          ${campo(e, "titulo", "Proceso o subproceso que se audita", { bind: eb(e, "titulo"), ph: "p. ej. Triaje de enfermería" })}
          <div class="field"><div class="field-head"><label class="field-label">Tipo</label></div>
            <div class="seg" role="group">${Object.keys(L.TIPOS_ENTRADA).map(k => `<button type="button" class="${e.tipo === k ? "active" : ""}" data-epick="${e.id}" data-f="tipo" data-v="${k}">${L.TIPOS_ENTRADA[k].nom.replace("Auditoría ", "").replace(/^./, c => c.toUpperCase())}</button>`).join("")}</div></div>
          ${rs.length ? `<div class="field"><div class="field-head"><label class="field-label">Hallazgos del Mapa de Riesgos</label></div><div class="ent-rgs">${L.ordenarRiesgos(rs).map(r => `<span class="ent-rg">${iprBadge(L.iprDe(r))}<span>${esc(r.fallo)}</span><button type="button" class="ent-rg-x no-print" data-act="ent-quitar-rg" data-e="${e.id}" data-id="${r.id}" aria-label="Quitar este hallazgo">✕</button></span>`).join("")}</div></div>` : ""}
          ${libres.length ? `<div class="filtros filtros--solo no-print"><label>Añadir otro hallazgo del mapa<select data-act-sel="ent-add-rg" data-e="${e.id}"><option value="">Elige…</option>${libres.map(r => `<option value="${r.id}">${r.clave ? "★ " : ""}${esc(L.corto(r.fallo, 70))}${L.iprDe(r) ? " · IPR " + L.iprDe(r) : ""}</option>`).join("")}</select></label></div>` : ""}
          ${campo(e, "hallazgos", rs.length ? "Otros hallazgos o motivos" : "Hallazgos o motivos de esta auditoría", { bind: eb(e, "hallazgos"), area: true, opt: rs.length > 0, sub: "Uno por línea.", ph: "p. ej. Incidente notificado en Radiología\nEstándar de acreditación sobre identificación" })}
        </div>`; }).join("") || `<p class="placeholder-box">Aún no hay auditorías en el plan.</p>`}
      <div class="toolbar no-print"><button class="btn" data-act="ent-add">+ Añadir auditoría a mano</button></div>`;
  }

  function planPaso2(p) {
    return `
      ${idea("El <b>alcance</b> dice qué se audita y hasta dónde; los <b>criterios</b>, contra qué se compara. Sin criterios claros no se puede decir si algo cumple o no.")}
      ${facil(`<p><b>Alcance</b> acotado y realista: qué registros o actividades, de qué periodo, de qué pacientes y cuántos. Mejor «20 historias de pacientes mayores de 70 años de los últimos 30 días» que «el triaje».</p>
        <p><b>Criterios</b>: los protocolos internos, los estándares de acreditación (ACSA), normas ISO o guías. Deben ser claros, actualizados y <b>comunicados antes</b> de la auditoría. Tipos: normativos, procedimentales, contractuales y regulatorios.</p>
        <p><b>Documentos y fuentes</b>: dónde se mirará: historia clínica, hojas de registro, sistema de información, observación…</p>`)}
      ${ejemplo("triaje de enfermería", "<p><b>Alcance</b>: registros de triaje de los últimos 30 días; 20 historias de pacientes mayores de 70 años. <b>Criterios</b>: protocolo de triaje y estándar de acreditación sobre valoración inicial. <b>Fuentes</b>: historia clínica electrónica, hoja de triaje.</p>")}
      <div data-zona="avisos-plan">${avisosPasoHtml(p, 2)}</div>
      ${p.entradas.map((e, i) => `<div class="crit ent">${entCab(e, i)}
        ${L.hallazgosDeEntrada(e, datos.mapas).length ? `<p class="ent-hall">${L.hallazgosDeEntrada(e, datos.mapas).map(h => "• " + esc(h)).join("<br>")}</p>` : ""}
        ${campo(e, "alcance", "Alcance", { bind: eb(e, "alcance"), area: true, ph: "p. ej. Registros de triaje de los últimos 30 días; 20 historias de pacientes mayores de 70 años", help: "Qué se revisa (procesos, actividades, registros), de qué periodo, en qué pacientes y, si ya lo sabes, cuántos casos. Di también qué queda fuera." })}
        ${campo(e, "criterios", "Criterios de referencia", { bind: eb(e, "criterios"), area: true, ph: "p. ej. Protocolo de triaje del hospital; estándar ACSA de valoración inicial", help: "Con qué se comparará la práctica real: protocolos, procedimientos, estándares de acreditación, normas o guías." })}
        <div class="quick">${Object.keys(L.TIPOS_CRITERIO).map(k => `<button type="button" class="chip${e.tiposCriterio.includes(k) ? " active" : ""}" data-emulti="${e.id}" data-v="${k}">${L.TIPOS_CRITERIO[k]}</button>`).join("")}</div>
        ${campo(e, "documentos", "Documentos y fuentes", { bind: eb(e, "documentos"), area: true, ph: "p. ej. Historia clínica electrónica, hoja de triaje, observación directa" })}
      </div>`).join("") || `<p class="placeholder-box">Primero añade las auditorías del plan en el paso 1.</p>`}
      ${trampa("Un alcance demasiado amplio («toda la gestión de la medicación») hace la auditoría inviable. Si no cabe en unas pocas horas de trabajo, divídela.")}`;
  }

  const RECURSOS_RAPIDOS = ["Checklist validado", "Acceso a historias clínicas", "Observación directa", "Guía de entrevista", "Sistema de información (HIS)", "Formación previa del equipo auditor", "Hoja de cálculo para los resultados"];
  function planPaso3(p) {
    return `
      ${idea("Frecuencia <b>proporcional al riesgo</b>: lo de IPR alto y gran impacto en la seguridad, cada trimestre o, como mucho, cada semestre. Lo demás, una vez al año… o no todos los años.")}
      ${facil(`<p>La app propone una frecuencia según el IPR más alto de cada auditoría: <b>trimestral</b> desde 250, <b>semestral</b> desde 150 y <b>anual</b> por debajo (semestral si hay un fallo de gravedad 9–10). Es orientativo: pesan también los resultados previos y los recursos.</p>
        <p><b>Responsables</b>: personas o cargos concretos, mejor de distintos perfiles (supervisión, facultativo, calidad). Quien audita no debería auditar su propio trabajo.</p>
        <p><b>Recursos</b>: tiempo, acceso a la información, herramientas (listas de verificación, sistema de información) y formación previa si hace falta.</p>`)}
      <div data-zona="avisos-plan">${avisosPasoHtml(p, 3)}</div>
      ${p.entradas.map((e, i) => { const s = L.frecuenciaSugerida(e, datos.mapas); return `<div class="crit ent">${entCab(e, i)}
        <div class="field"><div class="field-head"><label class="field-label">Frecuencia</label>${s ? `<span class="sugerida">Sugerida: <b>${L.FRECUENCIAS[s.k].nom}</b> (${esc(s.motivo)})</span>` : ""}</div>
          <div class="seg seg--wrap" role="group">${Object.keys(L.FRECUENCIAS).map(k => `<button type="button" class="${e.frecuencia === k ? "active" : ""}" data-epick="${e.id}" data-f="frecuencia" data-v="${k}">${L.FRECUENCIAS[k].nom}</button>`).join("")}</div></div>
        ${campo(e, "responsables", "Responsables", { bind: eb(e, "responsables"), ph: "p. ej. Supervisora de Enfermería y Técnico de Calidad", help: "Quién realiza la auditoría. Cargos o nombres concretos; mejor un equipo de distintos perfiles e independiente del área si es posible." })}
        ${campo(e, "recursos", "Recursos necesarios", { bind: eb(e, "recursos"), area: true, ph: "p. ej. Checklist de triaje, acceso a historias clínicas, formación puntual", extra: `<div class="quick">${RECURSOS_RAPIDOS.map(r => `<button type="button" class="chip" data-eadd="${e.id}" data-v="${esc(r)}">+ ${esc(r)}</button>`).join("")}</div>` })}
        ${campo(e, "horas", "Horas de trabajo por ronda", { bind: eb(e, "horas"), opt: true, ph: "p. ej. 6", help: "Estimación del tiempo del equipo auditor cada vez que se hace (preparar, revisar casos, analizar). Sirve para ver la carga de cada mes." })}
      </div>`; }).join("") || `<p class="placeholder-box">Primero añade las auditorías del plan en el paso 1.</p>`}`;
  }

  function cronogramaHtml(p) {
    const bloq = new Set(p.bloqueados), car = L.cargaMensual(p), cap = L.capacidadDe(p), conHoras = car.horas.some(h => h > 0);
    return `<div class="table-wrap crono-wrap"><table class="crono">
      <thead><tr><th class="crono-nom">Auditoría</th>${L.MESES.map((m, i) => `<th class="${bloq.has(i + 1) ? "bloq" : ""}"><button type="button" class="crono-mes" data-act="bloq" data-m="${i + 1}" aria-pressed="${bloq.has(i + 1)}" title="${bloq.has(i + 1) ? "Quitar" : "Marcar"} ${L.MESES_LARGO[i]} como mes de alta presión">${m}</button></th>`).join("")}</tr></thead>
      <tbody>${p.entradas.map(e => { const f = L.FRECUENCIAS[e.frecuencia], r = L.rondas(e.meses), ok = f && r === f.rondas; return `<tr>
        <th class="crono-nom"><b>${esc(L.corto(e.titulo || "Sin nombre", 42))}</b><span class="${f ? (ok ? "ok" : "mal") : ""}">${f ? `${f.nom}: ${r}/${f.rondas} ${ok ? "✓" : ""}` : "Sin frecuencia"}</span></th>
        ${L.MESES.map((_, i) => { const on = e.meses.includes(i + 1); return `<td class="${bloq.has(i + 1) ? "bloq" : ""}"><button type="button" class="crono-c${on ? " on tipo--" + e.tipo : ""}" data-act="mes" data-e="${e.id}" data-m="${i + 1}" aria-pressed="${on}" aria-label="${esc(e.titulo)} en ${L.MESES_LARGO[i]}">${on ? "■" : ""}</button></td>`; }).join("")}
      </tr>`; }).join("")}</tbody>
      <tfoot><tr><th class="crono-nom">Auditorías en el mes</th>${car.n.map(n => `<td class="${n > cap ? "alta" : ""}">${n || ""}</td>`).join("")}</tr>
      ${conHoras ? `<tr><th class="crono-nom">Horas de trabajo</th>${car.horas.map(h => `<td>${h ? L.nfmt(h) : ""}</td>`).join("")}</tr>` : ""}</tfoot>
    </table></div>
    <div class="leyenda"><span><i class="tipo--interna"></i>Interna</span><span><i class="tipo--externa"></i>Externa</span><span><i class="tipo--seguimiento"></i>Seguimiento</span><span><i class="leg-bloq"></i>Mes de alta presión</span></div>`;
  }
  function planPaso4(p) {
    return `
      ${idea("Un calendario <b>escalonado</b> reparte el trabajo del equipo auditor, evita los meses de más presión asistencial y deja tiempo para mejorar y volver a medir.")}
      ${facil(`<p>Toca una casilla para poner o quitar una auditoría en ese mes. Una <b>ronda</b> son meses seguidos (enero–febrero cuenta como una sola vez). La columna de la izquierda te dice si las rondas cuadran con la frecuencia.</p>
        <p>Toca el nombre de un mes en la cabecera para marcarlo como <b>mes de alta presión</b> (vacaciones, campaña de gripe…): el reparto automático lo evitará.</p>
        <p><b>Repartir automáticamente</b> coloca las auditorías de más a menos prioritaria donde menos carga hay, respetando la frecuencia y los meses de alta presión. Después puedes retocarlo a mano.</p>`)}
      <div class="card">
        <div class="field"><div class="field-head"><label class="field-label">¿Cuántas auditorías puede hacer el equipo a la vez en un mes?</label></div>
          ${seg(p, "capacidad", [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"]])}</div>
        <div class="toolbar"><button class="btn btn--primary" data-act="repartir">⚙ Repartir automáticamente</button>${p.entradas.some(e => e.meses.length) ? `<button class="btn" data-act="vaciar-crono">Vaciar el calendario</button>` : ""}</div>
      </div>
      <div data-zona="avisos-plan">${avisosPasoHtml(p, 4)}</div>
      ${p.entradas.length ? `<div class="card chart-card" data-zona="crono">${cronogramaHtml(p)}</div>` : `<p class="placeholder-box">Primero añade las auditorías del plan en el paso 1.</p>`}
      ${p.entradas.length ? `<h2 class="sec-t">Observaciones para la ejecución</h2>
        <div class="card">${p.entradas.map(e => campo(e, "observaciones", esc(e.titulo || "Sin nombre"), { bind: eb(e, "observaciones"), area: true, opt: true, ph: "p. ej. Incluir sesiones formativas antes de empezar" })).join("")}</div>` : ""}
      ${practica("Reserva huecos para las <b>auditorías de seguimiento</b>: comprobar a los 3–6 meses si las mejoras han funcionado es lo que cierra el ciclo. Añádelas en el paso 1 con el tipo «Seguimiento».")}`;
  }

  const ROLES = [
    ["coordinacion", "Coordinación del plan", "Coordinación de Calidad y Seguridad del Paciente: planifica, coordina y consolida los resultados."],
    ["equipo", "Equipo auditor", "Equipo multidisciplinar formado (supervisión, facultativo, enfermería, técnico de calidad), independiente del área auditada cuando sea posible."],
    ["revision", "Revisión de las acciones de mejora", "Supervisión y jefatura de la unidad: revisan las acciones correctoras y su eficacia en las auditorías de seguimiento."],
    ["direccion", "Dirección", "Dirección: aprueba el plan, lo difunde y garantiza tiempo y recursos."],
    ["auditados", "Profesionales auditados", "Conocen el plan con antelación, resuelven dudas y participan en la definición de mejoras."]
  ];
  function personasHtml(p, k, titulo) {
    return `<div class="personas"><p class="personas-t">${titulo}</p>${p.control[k].map((x, i) => `<div class="persona">
      <input class="txt-in" data-cp="${k}" data-i="${i}" data-f="nombre" value="${esc(x.nombre)}" placeholder="Nombre" autocomplete="off" />
      <input class="txt-in" data-cp="${k}" data-i="${i}" data-f="cargo" value="${esc(x.cargo)}" placeholder="Cargo" autocomplete="off" />
      <button type="button" class="icon-btn no-print" data-act="cp-del" data-k="${k}" data-i="${i}" aria-label="Quitar">✕</button></div>`).join("")}
      <button type="button" class="link-btn no-print" data-act="cp-add" data-k="${k}">+ Añadir persona</button></div>`;
  }
  function planPaso5(p) {
    const ap = p.aprobacion;
    return `
      ${idea("Un plan que nadie ha aprobado ni comunicado se queda en papel. La Dirección lo <b>aprueba</b> y garantiza los recursos; los profesionales lo <b>conocen antes</b> de que empiecen las auditorías.")}
      <h2 class="sec-t">Roles y responsabilidades</h2>
      <div class="card">
        ${ROLES.map(([k, nom, ph]) => campo(p, "roles." + k, nom, { area: true, ph: "p. ej. " + ph })).join("")}
        <div class="quick"><button type="button" class="chip chip--accent" data-act="roles-sug">✎ Rellenar los vacíos con una propuesta</button></div>
      </div>
      ${trampa("Suponer que todos saben quién hace qué genera confusión y resistencias. Escríbelo, y deja claro que la auditoría es para aprender, no para fiscalizar.")}
      <h2 class="sec-t">Aprobación y difusión</h2>
      <div class="card">
        <div class="dos-col">
          <div class="field"><div class="field-head"><label class="field-label">Fecha de aprobación</label></div><div class="input-wrap"><input class="txt-in" type="date" data-k="aprobacion.fecha" value="${esc(ap.fecha)}" /></div></div>
          <div class="field"><div class="field-head"><label class="field-label">¿Comunicado a los implicados?</label></div>
            <div class="seg" role="group"><button type="button" class="${ap.comunicado ? "active" : ""}" data-act="comunicado" data-v="1">Sí</button><button type="button" class="${!ap.comunicado ? "active" : ""}" data-act="comunicado" data-v="0">Todavía no</button></div></div>
        </div>
        ${ap.comunicado ? `<div class="dos-col">
          <div class="field"><div class="field-head"><label class="field-label">Fecha de comunicación</label></div><div class="input-wrap"><input class="txt-in" type="date" data-k="aprobacion.fechaComunicacion" value="${esc(ap.fechaComunicacion)}" /></div></div>
          ${campo(p, "aprobacion.via", "Cómo se comunicó", { opt: true, ph: "p. ej. sesión de servicio y correo" })}</div>` : ""}
      </div>
      <h2 class="sec-t">Control del documento</h2>
      <p class="page-lead">Quién elabora, revisa y aprueba el plan, y el historial de cambios. Saldrá en la primera página del documento.</p>
      <div class="card">
        ${controlHtml(p)}

      </div>
      <h2 class="sec-t">Notas</h2>
      <div class="card">
        ${campo(p, "objetivo", "Objetivo del plan", { area: true, opt: true, ph: "Si lo dejas vacío, el documento usará un objetivo general." })}
        ${campo(p, "introduccion", "Introducción", { area: true, opt: true, rows: 3, ph: "Si la dejas vacía, el documento la redacta con los datos del plan." })}
        ${campo(p, "notas", "Notas", { area: true, opt: true })}
      </div>
      ${box("idea", "Barreras y facilitadores", "<p><b>Barreras</b>: falta de tiempo, resistencia al cambio, percepción punitiva. <b>Facilitadores</b>: compromiso directivo, recursos, formación e implicación de los mandos intermedios.</p>")}`;
  }

  function planPaso6(p) {
    const doc = L.documentoPlan(p, datos.mapas, new Date().toLocaleDateString("es-ES"));
    return `
      <div class="toolbar no-print">
        <button class="btn btn--primary" data-act="plan-word">⬇ Descargar Word</button>
        <button class="btn" data-act="informe">Ver para imprimir / PDF</button>
        <button class="btn" data-act="plan-excel">Exportar a Excel</button>
      </div>
      ${practica("El Word es <b>editable</b>: pásalo a la plantilla de tu centro, añade logotipos o cambia lo que necesites.")}
      ${p.entradas.length && !modoEjemplo ? `<h2 class="sec-t">Las auditorías del plan</h2>
        <p class="page-lead">Cada auditoría programada se convierte en una auditoría concreta cuando llega su momento: trae su alcance y sus hallazgos.</p>
        <div class="card ent-auds">${p.entradas.map(e => { const a = e.auditoriaId && datos.auditorias.find(x => x.id === e.auditoriaId); return `<div class="ent-aud"><span><b>${esc(e.titulo || "Sin nombre")}</b><span>${esc(L.textoMeses(e.meses)) || "Sin meses"}</span></span>${a ? `<a class="btn" href="#/auditoria/${a.id}">Abrir auditoría</a>` : `<button class="btn btn--primary" data-act="crear-aud" data-e="${e.id}">Crear auditoría</button>`}</div>`; }).join("")}</div>` : ""}
      <h2 class="sec-t">Vista previa</h2>
      <div class="doc-prev">${bloquesHtml(doc.bloques)}</div>`;
  }

  const RENDER_PLAN = { 1: planPaso1, 2: planPaso2, 3: planPaso3, 4: planPaso4, 5: planPaso5, 6: planPaso6 };
  function resumenPlan(p) {
    const g = L.progresoPlan(p), A = L.avisosPlan(p, datos.mapas), w = A.filter(a => a.nivel !== "nota").length;
    return `<div class="resumen">
      <div class="res-label">Así va tu plan</div>
      <h3 class="resumen-nombre">Plan Anual ${esc(p.anio) || "…"}</h3>
      <p class="res-sub">${esc(L.sinArticulo(p.ambito)) || "Sin ámbito todavía"}</p>
      <div class="badges"><span class="badge">${plural(p.entradas.length, "auditoría", "auditorías")}</span>${w ? `<span class="badge badge--aviso">⚠ ${plural(w, "aviso", "avisos")}</span>` : ""}</div>
      ${miniCarga(p)}
      <ul class="check-lista">${PASOS_PLAN.slice(0, 5).map(s => `<li class="${g[s.n] ? "ok" : ""}">${g[s.n] ? "✓" : "○"} ${s.titulo}</li>`).join("")}</ul>
    </div>`;
  }
  function renderPlan(p, paso) {
    actualPlan = p; pasoPlan = paso; actualMapa = null; actualAud = null; nAyuda = 0;
    if (document.body.classList.contains("ver-informe")) {
      const doc = L.documentoPlan(p, datos.mapas, new Date().toLocaleDateString("es-ES"));
      view.innerHTML = `${informeBar()}<div class="doc-prev doc-prev--informe">${bloquesHtml(doc.bloques)}</div>${informePie()}`;
      return;
    }
    const s = PASOS_PLAN[paso - 1];
    view.innerHTML = `
      <div class="wiz-top no-print">${volver(modoEjemplo ? "#/ejemplos" : "#/plan", modoEjemplo ? "Ejemplos" : "Mis planes")}${lineaPDCA("plan")}</div>
      <div class="wiz-top no-print">${pasosPlanHtml(p, paso)}</div>
      <div class="wiz-grid${paso === 6 ? " wiz-grid--ficha" : ""}">
        <div class="wiz-main">
          <div class="wiz-titulo"><span class="wiz-paso">Plan anual · paso ${paso} de 6 · Planificar</span><h1 class="page-title">${s.titulo}</h1></div>
          ${RENDER_PLAN[paso](p)}
          <div class="wiz-nav no-print">
            ${paso > 1 ? `<a class="btn" href="#/plan/${p.id}/${paso - 1}">← Anterior</a>` : "<span></span>"}
            ${paso < 6 ? `<a class="btn btn--primary" href="#/plan/${p.id}/${paso + 1}">Siguiente: ${PASOS_PLAN[paso].corto} →</a>` : modoEjemplo ? "<span></span>" : `<button class="btn btn--peligro-ghost" data-act="plan-del" data-id="${p.id}">Borrar plan</button>`}
          </div>
        </div>
        ${paso < 6 ? `<aside class="wiz-side no-print" data-zona="resumen-plan">${resumenPlan(p)}</aside>` : ""}
      </div>`;
  }
  function refrescarPlan() {
    const p = actualPlan; if (!p) return;
    const z = $("[data-zona='resumen-plan']"); if (z) z.innerHTML = resumenPlan(p);
    const av = $("[data-zona='avisos-plan']"); if (av) av.innerHTML = avisosPasoHtml(p, pasoPlan);
    const cr = $("[data-zona='crono']"); if (cr) cr.innerHTML = cronogramaHtml(p);
    const st = $(".wiz-steps"); if (st) st.outerHTML = pasosPlanHtml(p, pasoPlan);
  }
  function repintarPlan() { const y = window.scrollY; renderPlan(actualPlan, pasoPlan); window.scrollTo(0, y); }

  // Una auditoría programada del plan se convierte en auditoría concreta (con su alcance y sus hallazgos)
  function crearAudDesdeEntrada(p, e) {
    const a = L.nuevaAuditoria(genId(), hoy()), m = datos.mapas.find(x => x.id === e.mapaId);
    a.titulo = `Auditoría ${e.tipo === "externa" ? "externa" : e.tipo === "seguimiento" ? "de seguimiento" : "interna"} · ${e.titulo}`;
    a.tipo = e.tipo === "externa" ? "externa" : "interna";
    a.unidad = L.sinArticulo(p.ambito);
    a.alcance = e.alcance; a.planId = p.id; a.entradaId = e.id;
    if (e.tipo === "seguimiento") a.origen.tipo = "seguimiento";
    else if (m) a.origen.tipo = "riesgos";
    if (m) { a.origen.mapaId = m.id; a.origen.riesgoIds = e.riesgoIds.slice(); a.criterios = L.criteriosDesdeRiesgos(m, e.riesgoIds, genId); }
    String(e.hallazgos || "").split("\n").map(x => x.trim()).filter(Boolean).forEach(h => a.criterios.push(Object.assign(L.nuevoCriterio(genId()), { subproceso: e.titulo, hallazgo: h })));
    a.origen.detalle = `Programada en el Plan Anual ${p.anio || ""}${lleno(e.criterios) ? ". Criterios de referencia: " + e.criterios : ""}`.trim();
    if (m && !lleno(a.proceso) && lleno(m.proceso)) a.proceso = m.proceso.charAt(0).toLowerCase() + m.proceso.slice(1);
    datos.auditorias.push(a); e.auditoriaId = a.id; p.modificado = hoy(); guardar(true);
    location.hash = "#/auditoria/" + a.id;
    toast("Auditoría creada con el alcance y los hallazgos del plan.", 4000);
  }

  // ---------- Auditoría: diseño (entrega 3) ----------
  let faseAud = "inicio", subDiseno = 1, indImportados = [];
  const PASOS_DIS = [
    { n: 1, corto: "Método", titulo: "Metodología, equipo y recursos" },
    { n: 2, corto: "Indicadores", titulo: "Un indicador por criterio" },
    { n: 3, corto: "Evidencias", titulo: "Evidencias e instrumentos" },
    { n: 4, corto: "Muestra", titulo: "Muestra: cuántos casos y cuáles" },
    { n: 5, corto: "Pilotaje", titulo: "Hoja de recogida y pilotaje" },
    { n: 6, corto: "Documento", titulo: "Plan específico de la auditoría" }
  ];
  function pasosDisHtml(a, sub) {
    const g = L.progresoDiseno(a);
    return `<ol class="wiz-steps" aria-label="Pasos del diseño">${PASOS_DIS.map(s => `<li><a href="#/auditoria/${a.id}/diseno/${s.n}" class="wiz-step${s.n === sub ? " actual" : ""}${g[s.n] ? " hecho" : ""}"${s.n === sub ? ' aria-current="step"' : ""}><span class="wiz-num">${g[s.n] && s.n !== sub ? "✓" : s.n}</span><span class="wiz-lbl">${s.corto}</span></a></li>`).join("")}</ol>`;
  }
  const cb = (c, f) => `data-c="${c.id}" data-f="${f}"`;
  const critCab = (c, i) => `<div class="ent-cab"><span class="crit-n">${i + 1}</span><b>${esc(c.subproceso) || "Sin subproceso"}</b></div><p class="crit-txt">${lleno(c.criterio) ? esc(c.criterio) : `<span class="vacio">${esc(c.hallazgo) || "Criterio sin escribir"}</span>`}</p>`;
  const segC = (c, f, opciones) => { const v = getPath(c, f) || ""; return `<div class="seg seg--wrap" role="group">${opciones.map(([val, txt]) => `<button type="button" class="${v === val ? "active" : ""}" data-cpick="${c.id}" data-f="${f}" data-v="${val}">${txt}</button>`).join("")}</div>`; };
  const chipsC = (c, f, cat, nom = x => x) => { const v = getPath(c, f) || []; return `<div class="quick">${Object.keys(cat).map(k => `<button type="button" class="chip${v.includes(k) ? " active" : ""}" data-cmulti="${c.id}" data-f="${f}" data-v="${k}" title="${esc(cat[k].que || "")}">${esc(nom(cat[k]))}</button>`).join("")}</div>`; };
  const avisosDisHtml = (a, sub) => L.avisosDiseno(a).filter(x => x.paso === sub).map(avisoHtml).join("");
  function zonaIndHtml(c) {
    const f = L.formulaInd(c.ind), e = L.textoEstandar(c.ind);
    return f || e ? `<div class="formula">${esc(f || "Fórmula: escribe numerador y denominador")}${e ? `<br><b>Estándar: ${esc(e)}</b>` : ""}</div>` : "";
  }

  function disPaso2(a) {
    return `
      ${idea("Cada criterio se convierte en <b>un indicador</b>: algo que se cuenta y se compara con un estándar. Y para que dos auditores lleguen al mismo resultado, hay que escribir <b>cuándo cumple</b>.")}
      ${facil(`<ul><li><b>Nombre</b>: «% de [casos] en los que [se cumple el criterio]».</li>
        <li><b>Numerador</b>: los casos que cumplen (o los fallos, si el indicador cuenta errores). <b>Denominador</b>: los casos revisados en los que aplica.</li>
        <li><b>Sentido</b>: si cuentas aciertos, «más es mejor» (≥); si cuentas fallos, «menos es mejor» (≤).</li>
        <li><b>Cumple si…</b> y <b>No aplica si…</b>: la definición operativa. Sin ella, cada auditor interpreta a su manera.</li></ul>
        <p>En la hoja de recogida siempre se marca si el caso <b>cumple el criterio</b> (Sí / No / NA), aunque el indicador cuente fallos.</p>
        <!--[eco]--><p>Para trabajar un indicador a fondo (calidad SMART, pilotaje, compuestos) tienes la app <a href="${L.URL_IND}" target="_blank" rel="noopener">Indicadores ↗</a>; luego puedes importarlo aquí.</p><!--[/eco]-->`)}
      <div class="toolbar no-print"><button class="btn" data-act="importar-ind">⬆ Importar de la app Indicadores</button>${indImportados.length ? `<span class="field-sub">${plural(indImportados.length, "indicador cargado", "indicadores cargados")}: elígelo en cada criterio.</span>` : ""}</div>
      <div data-zona="avisos-dis">${avisosDisHtml(a, 2)}</div>
      ${a.criterios.map((c, i) => `<div class="crit">${critCab(c, i)}
        <div class="quick no-print"><button type="button" class="chip chip--accent" data-act="sug-ind" data-c="${c.id}">✎ Proponer a partir del criterio</button></div>
        ${indImportados.length ? `<div class="filtros filtros--solo no-print"><label>Usar un indicador importado<select data-act-sel="usar-ind" data-c="${c.id}"><option value="">Elige…</option>${indImportados.map((x, j) => `<option value="${j}">${esc(L.corto(x.nombre, 80))}</option>`).join("")}</select></label></div>` : ""}
        ${campo(c, "ind.nombre", "Nombre del indicador", { bind: cb(c, "ind.nombre"), area: true, ph: "p. ej. % de pacientes triados con la pulsera colocada antes del paso a box" })}
        <div class="field"><div class="field-head"><label class="field-label">Tipo</label></div>${segC(c, "ind.tipo", Object.keys(L.TIPOS_IND).map(k => [k, L.TIPOS_IND[k].nom]))}</div>
        <div class="dos-col">
          ${campo(c, "ind.numerador", "Numerador", { bind: cb(c, "ind.numerador"), area: true, ph: "p. ej. Pacientes con pulsera antes del paso a box" })}
          ${campo(c, "ind.denominador", "Denominador", { bind: cb(c, "ind.denominador"), area: true, ph: "p. ej. Pacientes triados observados" })}
        </div>
        <div class="dos-col">
          <div class="field"><div class="field-head"><label class="field-label">Sentido</label></div>${segC(c, "ind.sentido", [["mas", "Más es mejor (≥)"], ["menos", "Menos es mejor (≤)"]])}</div>
          <div class="field"><div class="field-head"><label class="field-label">Estándar</label></div><div class="input-wrap input-wrap--num"><input class="txt-in" ${cb(c, "ind.estandar")} value="${esc(c.ind.estandar)}" inputmode="decimal" placeholder="p. ej. 90" /><span class="input-unit">%</span></div></div>
        </div>
        <div data-zc="${c.id}:ind">${zonaIndHtml(c)}</div>
        ${campo(c, "ind.cumpleSi", "Cumple si…", { bind: cb(c, "ind.cumpleSi"), area: true, ph: "p. ej. El paciente lleva la pulsera con sus datos correctos al pasar a box", help: "La definición operativa: qué tiene que ver o encontrar el auditor para marcar «Sí». Concreta plazos, documentos y términos ambiguos." })}
        ${campo(c, "ind.noAplicaSi", "No aplica si…", { bind: cb(c, "ind.noAplicaSi"), area: true, opt: true, ph: "p. ej. Pacientes que pasan directamente a reanimación" })}
        <div class="dos-col">
          ${campo(c, "ind.fuente", "Fuente de datos", { bind: cb(c, "ind.fuente"), ph: "p. ej. Historia clínica, observación directa" })}
          ${campo(c, "ind.exclusiones", "Población y exclusiones", { bind: cb(c, "ind.exclusiones"), opt: true, ph: "p. ej. Mayores de 75 años; excluye reanimación" })}
        </div>
      </div>`).join("") || `<p class="placeholder-box">Esta auditoría aún no tiene criterios. <a href="#/auditoria/${a.id}">Añádelos en el Inicio</a>.</p>`}
      ${trampa("Mezclar el sentido es el error más frecuente: «% de errores» con un estándar «≥ 90 %» premia equivocarse. Si cuentas fallos, el estándar va con ≤.")}`;
  }

  function disPaso3(a) {
    return `
      ${idea("Sin evidencias no hay auditoría. Combinar varias fuentes —lo registrado, lo observado y lo que cuentan los profesionales— es <b>triangular</b>: la conclusión es más sólida.")}
      ${facil(`<table class="mini facil-tabla"><tr><th>Evidencia</th><th>Para qué</th></tr>${Object.values(L.EVIDENCIAS).map(e => `<tr><td><b>${e.nom}</b></td><td>${e.que}</td></tr>`).join("")}</table>
        <p><b>Instrumentos</b>: ${Object.values(L.INSTRUMENTOS).map(x => `<b>${x.nom.toLowerCase()}</b> (${x.que.charAt(0).toLowerCase() + x.que.slice(1, -1)})`).join("; ")}.</p>
        <p><b>Principios</b>: veracidad, trazabilidad (se puede volver a comprobar), relevancia, fiabilidad de las fuentes, imparcialidad y confidencialidad.</p>`)}
      <div data-zona="avisos-dis">${avisosDisHtml(a, 3)}</div>
      ${a.criterios.map((c, i) => `<div class="crit">${critCab(c, i)}
        ${lleno(c.ind.nombre) ? `<p class="field-sub">Indicador: ${esc(c.ind.nombre)}</p>` : ""}
        <div class="field"><div class="field-head"><label class="field-label">Tipos de evidencia</label></div>${chipsC(c, "evid.tipos", L.EVIDENCIAS, x => x.nom)}</div>
        ${campo(c, "evid.triangulacion", "Cómo se triangula (justificación)", { bind: cb(c, "evid.triangulacion"), area: true, ph: "p. ej. Se contrasta el registro de triaje con la observación directa y con entrevistas al personal", help: "Por qué esta combinación de evidencias y qué se compara con qué. Si solo hay una fuente, explica por qué basta." })}
        <div class="field"><div class="field-head"><label class="field-label">Instrumentos de recogida</label></div>${chipsC(c, "evid.instrumentos", L.INSTRUMENTOS, x => x.nom)}</div>
        <div class="field"><div class="field-head"><label class="field-label">Principios que se cuidan especialmente</label><span class="field-opt">(opcional)</span></div>${chipsC(c, "evid.principios", Object.fromEntries(Object.entries(L.PRINCIPIOS).map(([k, v]) => [k, { nom: v }])), x => x.nom)}</div>
        ${campo(c, "evid.justificacion", "Por qué este instrumento", { bind: cb(c, "evid.justificacion"), area: true, opt: true, ph: "p. ej. La lista de verificación unifica el criterio entre turnos y auditores" })}
      </div>`).join("")}
      ${ejemplo("triangular la pulsera identificativa", "<p>Observación directa al pasar a box + registro de triaje + entrevistas a enfermería y celadores: así se sabe si falla la <b>colocación</b> o si la pulsera <b>se pierde</b> después.</p>")}`;
  }

  function muestraHtml(c) {
    const m = c.muestra, r = L.calcMuestra(c), est = L.estandarCumplimiento(c.ind);
    let det = "";
    if (m.objetivo === "decidir") {
      const ops = Number.isFinite(est) && L.LQ_COLS.includes(est) ? L.opcionesLqas(est, m.beta) : [];
      det = `<div class="dos-col">
        <div class="field"><div class="field-head"><label class="field-label">Riesgo de dar por bueno un servicio malo (β)</label>${ayudaBtn("α (falsa alarma) se fija en el 5 %. β es la probabilidad de aceptar un servicio que en realidad está en la línea roja o peor: 20 % es lo habitual; 10 % es más seguro pero pide más casos.").btn}</div><p class="help" id="help-h${nAyuda}" hidden>α (falsa alarma) se fija en el 5 %. β es la probabilidad de aceptar un servicio que en realidad está en la línea roja o peor: 20 % es lo habitual; 10 % es más seguro pero pide más casos.</p>${segC(c, "muestra.beta", [["20", "20 % (habitual)"], ["10", "10 %"]])}</div>
        <div class="field"><div class="field-head"><label class="field-label">Estándar en cumplimientos</label></div><p class="lq-est">${Number.isFinite(est) ? `<b>${L.nfmt(est, 1)} %</b>${c.ind.sentido === "menos" ? ` <span>(≤ ${esc(c.ind.estandar)} % de fallos = ${L.nfmt(est, 1)} % de casos que cumplen)</span>` : ""}` : '<span class="vacio">Falta el estándar del indicador</span>'}</p></div>
      </div>
      ${ops.length ? `<div class="field"><div class="field-head"><label class="field-label">Línea roja (umbral): elige</label>${ayudaBtn("El nivel por debajo del cual la situación es claramente mala. Cuanto más cerca del estándar, más casos hacen falta. Truco práctico: la línea roja más exigente cuyo número de casos podáis revisar.").btn}</div><p class="help" id="help-h${nAyuda}" hidden>El nivel por debajo del cual la situación es claramente mala. Cuanto más cerca del estándar, más casos hacen falta. Truco práctico: la línea roja más exigente cuyo número de casos podáis revisar.</p>
        <div class="lq-ops">${ops.slice(0, 9).map(o => `<button type="button" class="lq-op${String(o.umbral) === String(m.umbral) ? " active" : ""}" data-cpick="${c.id}" data-f="muestra.umbral" data-v="${o.umbral}"><b>${o.umbral} %</b><span>${o.n} casos · c = ${o.c}</span></button>`).join("")}</div></div>` : ""}`;
    } else if (m.objetivo === "estimar") {
      det = `<div class="dos-col">
        <div class="field"><div class="field-head"><label class="field-label">Margen de error (±)</label></div>${segC(c, "muestra.e", [["5", "±5 %"], ["10", "±10 %"], ["15", "±15 %"], ["20", "±20 %"]])}</div>
        <div class="field"><div class="field-head"><label class="field-label">% que esperas encontrar</label>${ayudaBtn("Si no tienes idea, deja el 50 %: es lo más exigente y da la muestra más grande.").btn}</div><p class="help" id="help-h${nAyuda}" hidden>Si no tienes idea, deja el 50 %: es lo más exigente y da la muestra más grande.</p><div class="input-wrap input-wrap--num"><input class="txt-in" ${cb(c, "muestra.p")} value="${esc(m.p)}" inputmode="decimal" /><span class="input-unit">%</span></div></div>
      </div>`;
    }
    return `${det}
      <div data-zc="${c.id}:muestra">${muestraResHtml(c)}</div>`;
  }
  function muestraResHtml(c) {
    const r = L.calcMuestra(c), m = c.muestra;
    return `${r.texto ? `<div class="muestra-res"><b>${esc(r.texto)}</b>${Number.isFinite(r.n) && m.objetivo !== "decidir" && m.objetivo !== "todos" && Number.isFinite(L.num(m.N)) ? "" : ""}</div>` : ""}${r.avisos.map(avisoHtml).join("")}`;
  }
  function disPaso4(a) {
    return `
      ${idea("La pregunta que lo cambia todo: ¿quieres <b>estimar</b> cuánto se cumple (báscula: más casos) o <b>decidir</b> si hay un problema (arco del aeropuerto: LQAS, pocos casos)?")}
      ${facil(`<ul>${Object.values(L.OBJETIVOS_MUESTRA).map(o => `<li><b>${o.nom}</b>: ${o.que}</li>`).join("")}</ul>
        <p>Sea cual sea, los casos se eligen <b>al azar</b>: ${Object.values(L.METODOS_SEL).map(x => `<b>${x.nom.toLowerCase()}</b> (${x.que.charAt(0).toLowerCase() + x.que.slice(1, -1)})`).join("; ")}.</p>
        ${trampa("La muestra de conveniencia («las historias que hay sobre la mesa») no vale: lo más reciente y lo más a mano suele estar mejor cumplimentado.")}
        <p>Para más cálculos (medias, compuestos, concordancia) tienes <a href="${L.URL_TM}" target="_blank" rel="noopener">Tamaño Muestral ↗</a>.</p>`)}
      <div data-zona="avisos-dis">${avisosDisHtml(a, 4)}</div>
      ${a.criterios.map((c, i) => `<div class="crit">${critCab(c, i)}
        ${lleno(c.ind.nombre) ? `<p class="field-sub">Indicador: ${esc(c.ind.nombre)} · estándar ${esc(L.textoEstandar(c.ind)) || "sin definir"}</p>` : ""}
        <div class="dos-col">
          ${campo(c, "muestra.unidad", "Unidad de estudio", { bind: cb(c, "muestra.unidad"), ph: "p. ej. Historia clínica, episodio, paciente observado" })}
          <div class="field"><div class="field-head"><label class="field-label">Universo (N)</label>${ayudaBtn("Cuántos casos hay en total entre los que se puede elegir (p. ej. ingresos del periodo auditado). Sirve para el sorteo y para ajustar la muestra.").btn}</div><p class="help" id="help-h${nAyuda}" hidden>Cuántos casos hay en total entre los que se puede elegir (p. ej. ingresos del periodo auditado). Sirve para el sorteo y para ajustar la muestra.</p><div class="input-wrap"><input class="txt-in" ${cb(c, "muestra.N")} value="${esc(c.muestra.N)}" inputmode="numeric" placeholder="p. ej. 600" /></div></div>
        </div>
        <div class="field"><div class="field-head"><label class="field-label">¿Qué necesitas?</label></div>${segC(c, "muestra.objetivo", Object.keys(L.OBJETIVOS_MUESTRA).map(k => [k, L.OBJETIVOS_MUESTRA[k].nom]))}</div>
        ${lleno(c.muestra.objetivo) ? muestraHtml(c) : ""}
        ${lleno(c.muestra.objetivo) && c.muestra.objetivo !== "todos" ? `<div class="field"><div class="field-head"><label class="field-label">Cómo se eligen los casos</label></div>${segC(c, "muestra.metodo", Object.keys(L.METODOS_SEL).map(k => [k, L.METODOS_SEL[k].nom]))}</div>
          ${c.muestra.metodo && c.muestra.metodo !== "estratificado" ? `<div class="sorteo no-print"><button type="button" class="btn" data-act="sortear" data-c="${c.id}">🎲 Sortear los casos</button>${c.muestra.sorteo.length ? `<span class="field-sub">Revisa estos números del listado (ordenado, del 1 al ${esc(c.muestra.N)}):</span>` : Number.isFinite(L.num(c.muestra.N)) && Number.isFinite(L.calcMuestra(c).n) ? `<span class="field-sub">Se sortearán ${L.calcMuestra(c).n} números entre 1 y ${esc(c.muestra.N)}: numera tu listado de casos y revisa esos.</span>` : `<span class="field-sub">Para sortear hace falta el universo (N) y el número de casos.</span>`}</div>
            ${c.muestra.sorteo.length ? `<p class="sorteo-num">${c.muestra.sorteo.join(" · ")}</p>` : ""}` : c.muestra.metodo === "estratificado" ? `<p class="field-sub">En el estratificado se sortea dentro de cada grupo (turno, unidad…) en proporción a su tamaño. Usa el sorteo simple dentro de cada grupo.</p>` : ""}` : ""}
      </div>`).join("")}
      ${trampa("Con pocas historias, un porcentaje por debajo del estándar <b>no basta</b> para afirmar el «no cumple»: con 16 de 20 (80 %) el valor real puede estar entre el 62 % y el 98 %. Por eso conviene decidir con LQAS.")}`;
  }

  const EQUIPO_SUG = ["Coordinador/a de Calidad y Seguridad del Paciente", "Supervisor/a de Enfermería", "Facultativo/a del servicio", "Enfermera/o asistencial", "TCAE", "Personal administrativo", "Técnico/a de Calidad (observador externo)"];
  function disPaso1(a) {
    const D = a.diseno;
    return `
      ${idea("Lo primero es el <b>método</b>: <b>a quién</b> se audita (población), <b>de qué periodo</b> son los casos, <b>de dónde</b> salen los datos, <b>quién</b> audita y <b>con qué recursos</b>. De esto dependen los indicadores, las evidencias y la muestra; y dejarlo escrito permite repetir la auditoría igual en el seguimiento.")}
      ${facil(`<ul><li><b>Población</b>: los casos sobre los que se calcularán los indicadores (su denominador).</li><li><b>Periodo</b>: de qué fechas son los casos. Debe ser reciente y representativo.</li><li><b>Fuentes</b>: historia clínica, registros, observación directa, entrevistas… Marcan qué evidencias podrás usar.</li><li><b>Método</b>: cómo se va a revisar (documental, observación, entrevistas) y con qué tipo de hoja.</li></ul><p>Puedes afinarlo después, cuando elijas evidencias e instrumentos en el paso 3.</p>`)}
      <div data-zona="avisos-dis">${avisosDisHtml(a, 1)}</div>
      <div class="card">
        ${campo(a, "diseno.poblacion", "Población", { area: true, ph: "p. ej. Pacientes atendidos en Urgencias con decisión de ingreso hospitalario" })}
        ${campo(a, "diseno.periodo", "Periodo auditado", { ph: "p. ej. Del 1 al 31 de mayo" })}
        ${campo(a, "diseno.fuentes", "Fuentes de información", { area: true, ph: "p. ej. Historia clínica electrónica, registros de enfermería, observación directa, entrevistas" })}
        ${campo(a, "diseno.metodologia", "Método", { area: true, rows: 3, ph: "p. ej. Revisión documental, observación directa y entrevistas, con hoja de recogida de respuesta cerrada", extra: `<div class="quick"><button type="button" class="chip chip--accent" data-act="sug-metodo">✎ Proponer un texto de partida</button></div>` })}
      </div>
      <h2 class="sec-t">Equipo auditor</h2>
      <div class="card">
        ${campo(a, "diseno.equipo", "Quién forma el equipo y qué aporta", { area: true, rows: 4, sub: "Uno por línea.", ph: "p. ej. Supervisor/a de Enfermería (enfoque operativo)" })}
        <div class="quick">${EQUIPO_SUG.map(x => `<button type="button" class="chip" data-act="add-equipo" data-v="${esc(x)}">+ ${esc(x)}</button>`).join("")}</div>
        ${practica("Mejor multidisciplinar y con alguien <b>independiente</b> del área auditada. Quien forma parte del proceso auditado debe declararlo.")}
      </div>
      <h2 class="sec-t">Recursos</h2>
      <div class="card">${campo(a, "diseno.recursos", "Recursos humanos, documentales, materiales y de tiempo", { area: true, rows: 4, sub: "Uno por línea.", ph: "p. ej. Acceso a la historia clínica electrónica\nDos sesiones de 3 horas para la revisión" })}</div>`;
  }

  function disPaso5(a) {
    return `
      ${idea("Antes de recoger datos de verdad, <b>dos auditores</b> aplican la hoja a los <b>mismos 5–10 casos</b> por separado. Si no coinciden, el criterio está mal definido: se aclara y se repite.")}
      ${facil(`<p>Para cada caso, cada auditor marca si cumple (Sí), no cumple (No) o no aplica (NA), <b>sin hablar entre ellos</b>. La app calcula:</p>
        <ul><li><b>% de acuerdo</b>: en cuántos casos coinciden.</li><li><b>Kappa</b>: el acuerdo descontando el que saldría por azar (≥ 0,6 bueno; 0,4–0,6 aceptable; &lt; 0,4 bajo).</li></ul>
        <p>Con un acuerdo bajo, revisad juntos los casos discordantes y reescribid «cumple si…» en el paso de indicadores.</p>`)}
      <div class="toolbar no-print"><button class="btn btn--primary" data-act="hoja-word">⬇ Hoja de recogida (Word)</button><button class="btn" data-act="hoja-pdf">Hoja para imprimir / PDF</button></div>
      ${practica("La hoja trae una tabla por criterio con tantas filas como casos (y los números sorteados, si los hay), la definición de «cumple» y la regla de decisión LQAS. Imprímela o rellénala en el ordenador.")}
      <div data-zona="avisos-dis">${avisosDisHtml(a, 5)}</div>
      <h2 class="sec-t">Pilotaje con dos auditores</h2>
      ${a.criterios.map((c, i) => { const k = L.concordancia(c.piloto.pares); return `<div class="crit">${critCab(c, i)}
        ${c.piloto.pares.length ? `<div class="pil-tabla"><div class="pil-fila pil-cab"><span>Caso</span><span>Auditor A</span><span>Auditor B</span><span></span></div>
          ${c.piloto.pares.map((p, j) => `<div class="pil-fila"><span>${j + 1}</span>${["a", "b"].map(lado => `<span class="pil-seg">${[["si", "Sí"], ["no", "No"], ["na", "NA"]].map(([v, t]) => `<button type="button" class="${p[lado] === v ? "active" : ""}" data-act="par" data-c="${c.id}" data-i="${j}" data-lado="${lado}" data-v="${v}">${t}</button>`).join("")}</span>`).join("")}<span class="pil-ok">${p.a && p.b ? (p.a === p.b ? '<b class="ok">✓</b>' : '<b class="mal">✗</b>') : ""}</span></div>`).join("")}</div>` : ""}
        <div class="toolbar no-print"><button class="btn" data-act="pil-add" data-c="${c.id}">+ ${c.piloto.pares.length ? "1 caso más" : "Empezar pilotaje (5 casos)"}</button>${c.piloto.pares.length ? `<button class="btn btn--peligro-ghost" data-act="pil-del" data-c="${c.id}">Quitar el último</button>` : ""}</div>
        <div data-zc="${c.id}:piloto">${pilotoResHtml(k)}</div>
        ${c.piloto.pares.length ? campo(c, "piloto.nota", "Notas del pilotaje", { bind: cb(c, "piloto.nota"), area: true, opt: true, ph: "p. ej. Discrepancia en el caso 5: no estaba claro si contaba la valoración telefónica" }) : ""}
      </div>`; }).join("")}`;
  }
  function pilotoResHtml(k) {
    if (!k.n) return "";
    return `<div class="pil-res pil-res--${k.pocos ? "pocos" : k.nivel}"><span><b>${L.nfmt(k.pct, 0)} %</b> de acuerdo (${k.acuerdos} de ${k.n})</span><span>Kappa <b>${L.nfmt(k.kappa, 2)}</b></span><p>${esc(k.texto)}</p></div>`;
  }

  function controlHtml(o) {
    return `${personasHtml(o, "elaborado", "Elaborado por")}${personasHtml(o, "revisado", "Revisado por")}${personasHtml(o, "aprobado", "Aprobado por")}
      <div class="personas"><p class="personas-t">Histórico de revisiones</p>${o.control.historial.map((h, i) => `<div class="persona persona--hist">
        <input class="txt-in" data-ch="${i}" data-f="edicion" value="${esc(h.edicion)}" placeholder="Ed." autocomplete="off" />
        <input class="txt-in" type="date" data-ch="${i}" data-f="fecha" value="${esc(h.fecha)}" />
        <input class="txt-in" data-ch="${i}" data-f="cambio" value="${esc(h.cambio)}" placeholder="Qué cambia" autocomplete="off" />
        <button type="button" class="icon-btn no-print" data-act="ch-del" data-i="${i}" aria-label="Quitar">✕</button></div>`).join("")}
        <button type="button" class="link-btn no-print" data-act="ch-add">+ Nueva edición</button></div>`;
  }
  const docPlanEsp = a => L.documentoPlanEspecifico(a, buscaMapa(a.origen.mapaId), buscaPlan(a.planId), new Date().toLocaleDateString("es-ES"));
  function disPaso6(a) {
    return `
      <div class="toolbar no-print">
        <button class="btn btn--primary" data-act="pe-word">⬇ Plan específico (Word)</button>
        <button class="btn" data-act="informe">Ver para imprimir / PDF</button>
        <button class="btn" data-act="hoja-word">⬇ Hoja de recogida (Word)</button>
      </div>
      <h2 class="sec-t">Control del documento</h2>
      <div class="card">${controlHtml(a)}</div>
      <h2 class="sec-t">Vista previa</h2>
      <div class="doc-prev">${bloquesHtml(docPlanEsp(a).bloques)}</div>`;
  }

  const RENDER_DIS = { 1: disPaso1, 2: disPaso2, 3: disPaso3, 4: disPaso4, 5: disPaso5, 6: disPaso6 };
  function resumenDis(a) {
    const g = L.progresoDiseno(a), w = L.avisosDiseno(a).filter(x => x.nivel !== "nota").length;
    return `<div class="resumen">
      <div class="res-label">Diseño de la auditoría</div>
      <h3 class="resumen-nombre">${lleno(a.titulo) ? esc(a.titulo) : '<span class="vacio">Sin título</span>'}</h3>
      <div class="badges"><span class="badge">${plural(a.criterios.length, "criterio", "criterios")}</span>${w ? `<span class="badge badge--aviso">⚠ ${plural(w, "aviso", "avisos")}</span>` : ""}</div>
      <ul class="check-lista">${PASOS_DIS.slice(0, 5).map(s => `<li class="${g[s.n] ? "ok" : ""}">${g[s.n] ? "✓" : "○"} ${s.titulo}</li>`).join("")}</ul>
      <p class="res-prox"><b>Después:</b> la <a href="#/auditoria/${a.id}/recogida">recogida de datos</a> (fase Hacer).</p>
    </div>`;
  }
  function renderDiseno(a, sub) {
    actualAud = a; actualMapa = null; actualPlan = null; faseAud = "diseno"; subDiseno = sub; nAyuda = 0;
    if (document.body.classList.contains("ver-informe")) {
      const doc = new URLSearchParams((location.hash.split("?")[1]) || "").get("doc") === "hoja" ? L.documentoHoja(a, new Date().toLocaleDateString("es-ES")) : docPlanEsp(a);
      view.innerHTML = `${informeBar()}<div class="doc-prev doc-prev--informe">${bloquesHtml(doc.bloques)}</div>${informePie()}`;
      return;
    }
    const s = PASOS_DIS[sub - 1];
    view.innerHTML = `
      <div class="wiz-top no-print">${volver(modoEjemplo ? "#/ejemplos" : "#/auditorias", modoEjemplo ? "Ejemplos" : "Mis auditorías")}${pasosAud(a, "diseno")}</div>
      <div class="wiz-top no-print">${pasosDisHtml(a, sub)}</div>
      <div class="wiz-grid">
        <div class="wiz-main">
          <div class="wiz-titulo"><span class="wiz-paso">Diseño · paso ${sub} de 6 · Planificar</span><h1 class="page-title">${s.titulo}</h1></div>
          ${RENDER_DIS[sub](a)}
          <div class="wiz-nav no-print">
            ${sub > 1 ? `<a class="btn" href="#/auditoria/${a.id}/diseno/${sub - 1}">← Anterior</a>` : `<a class="btn" href="#/auditoria/${a.id}">← Inicio</a>`}
            ${sub < 6 ? `<a class="btn btn--primary" href="#/auditoria/${a.id}/diseno/${sub + 1}">Siguiente: ${PASOS_DIS[sub].corto} →</a>` : `<a class="btn btn--primary" href="#/auditoria/${a.id}/recogida">Siguiente: Recogida →</a>`}
          </div>
        </div>
        <aside class="wiz-side no-print" data-zona="resumen-dis">${resumenDis(a)}</aside>
      </div>`;
  }
  function refrescarDis() {
    const a = actualAud; if (!a) return;
    $$("[data-zc]").forEach(el => {
      const [id, tipo] = el.dataset.zc.split(":"), c = a.criterios.find(x => x.id === id); if (!c) return;
      el.innerHTML = tipo === "ind" ? zonaIndHtml(c) : tipo === "muestra" ? muestraResHtml(c) : tipo === "piloto" ? pilotoResHtml(L.concordancia(c.piloto.pares)) : "";
    });
    const z = $("[data-zona='resumen-dis']"); if (z) z.innerHTML = resumenDis(a);
    const av = $("[data-zona='avisos-dis']"); if (av) av.innerHTML = avisosDisHtml(a, subDiseno);
    const st = $$(".wiz-steps")[1]; if (st) st.outerHTML = pasosDisHtml(a, subDiseno);
  }

  // ---------- Auditoría: recogida de datos (entrega 4) ----------
  let critRecogida = null;
  const ESTADO_ICO = { verde: "●", rojo: "●", ambar: "●", gris: "○" };
  const semaforo = r => `<span class="sem-b sem-b--${r.estado}">${ESTADO_ICO[r.estado]} ${esc(r.lqas && r.lqas.acepta != null ? (r.lqas.acepta ? "Se acepta" : "Se rechaza") : L.ESTADO_TXT[r.estado])}</span>`;
  function barraProgreso(r) {
    const plan = Number.isFinite(r.planificados) ? r.planificados : Math.max(r.n, 1), p = Math.min(100, Math.round(r.n / plan * 100));
    return `<div class="rc-barra" title="${r.n} de ${plan} casos"><i style="width:${p}%"></i></div><span class="rc-cuenta">${r.n} de ${Number.isFinite(r.planificados) ? r.planificados : "?"} casos${r.na ? ` · ${r.na} NA` : ""}${r.pend ? ` · ${r.pend} sin valorar` : ""}</span>`;
  }
  function resultadoHtml(c) {
    const r = L.resultadoCriterio(c);
    if (!r.total) return `<p class="field-sub">Aún no hay casos. Prepara las filas y empieza a marcar.</p>`;
    const lq = r.lqas ? `<div class="res-lq"><b>LQAS</b> n = ${r.lqas.n}, c = ${r.lqas.c}: ${r.lqas.faltan ? `llevas ${r.n}; faltan ${r.lqas.faltan}` : `cumplen ${r.lqas.cumplenN} de los ${r.lqas.n} primeros`}</div>` : "";
    return `<div class="res-crit res-crit--${r.estado}">
      <div class="res-nums"><span class="rn rn--si"><b>${r.si}</b>Sí</span><span class="rn rn--no"><b>${r.no}</b>No</span><span class="rn"><b>${r.na}</b>NA</span>${r.n ? `<span class="rn rn--val"><b>${L.nfmt(r.valor, 1)} %</b>${c.ind.sentido === "menos" ? "fallos" : "cumple"}${Number.isFinite(r.margen) && c.muestra.objetivo !== "todos" ? ` · ±${L.nfmt(r.margen, 0)}` : ""}</span>` : ""}</div>
      ${lq}
      <p class="res-concl">${semaforo(r)} <span class="res-concl-txt">${esc(r.conclusion.replace(/^(Se acepta|Se rechaza|Cumple|No cumple|No concluyente): /, ""))}</span></p>
      ${r.detalle ? `<p class="res-det">${esc(r.detalle)}</p>` : ""}
    </div>`;
  }
  function avisosRecHtml(a, cid) { return L.avisosRecogida(a).filter(x => !cid || x.criterio === cid).filter(x => cid || x.nivel !== "nota" || !x.criterio).map(avisoHtml).join(""); }
  function resumenRec(a) {
    const p = L.progresoRecogida(a);
    return `<div class="resumen">
      <div class="res-label">Recogida de datos</div>
      <h3 class="resumen-nombre">${lleno(a.titulo) ? esc(a.titulo) : '<span class="vacio">Sin título</span>'}</h3>
      <p class="res-sub">${p.completos} de ${p.total} criterios con resultado</p>
      <div class="sem-resumen"><span class="sem-b sem-b--verde">● ${p.verdes}</span><span class="sem-b sem-b--rojo">● ${p.rojos}</span><span class="sem-b sem-b--ambar">● ${p.ambar}</span></div>
      <ul class="check-lista">${a.criterios.map((c, i) => { const r = L.resultadoCriterio(c); return `<li><a href="#/auditoria/${a.id}/recogida/${c.id}" class="sem-l sem-l--${r.estado}">${ESTADO_ICO[r.estado]} ${i + 1}. ${esc(L.corto(c.subproceso || c.criterio, 34))}</a></li>`; }).join("")}</ul>
      <p class="res-prox"><b>Después:</b> <a href="#/auditoria/${a.id}/informe/1">interpretar, buscar causas y redactar el informe</a> (fase Verificar).</p>
    </div>`;
  }
  function matrizHtml(a) {
    return `<div class="table-wrap"><table class="mini tabla-matriz"><thead><tr><th>Nº</th><th>Subproceso</th><th>Indicador</th><th>Estándar</th><th>Resultado</th><th>Conclusión</th></tr></thead><tbody>
      ${a.criterios.map((c, i) => { const r = L.resultadoCriterio(c); return `<tr><td>${i + 1}</td><td>${esc(c.subproceso)}</td><td>${esc(c.ind.nombre || c.criterio)}</td><td>${esc(L.textoEstandar(c.ind))}</td><td>${r.n ? esc(r.textoValor) : "—"}</td><td>${semaforo(r)}</td></tr>`; }).join("")}
    </tbody></table></div>`;
  }

  function renderRecogidaResumen(a) {
    const E = a.ejecucion;
    return `
      <div class="wiz-titulo"><span class="wiz-paso">Paso 3 de 5 · Hacer</span><h1 class="page-title">Recogida de datos</h1></div>
      ${idea("Ahora toca mirar los casos. Para cada uno, marca si <b>cumple</b> el criterio (Sí), <b>no lo cumple</b> (No) o <b>no aplica</b> (NA). La app va calculando el resultado y te dice qué puedes afirmar… y qué no.")}
      ${facil(`<ul><li>Usa la <b>hoja de recogida</b> del diseño (en papel o en el móvil) y aplica la definición de «cumple si…» al pie de la letra.</li>
        <li><b>NA</b> (no aplica) no cuenta: sale del numerador y del denominador.</li>
        <li>Con <b>LQAS</b> se decide con los <b>n primeros</b> casos valorados, en el orden del sorteo: si cumplen c o más, se acepta.</li>
        <li>Con <b>estimación</b>, solo se afirma «cumple» o «no cumple» si el estándar queda fuera del margen de error; si cae dentro, el resultado es <b>no concluyente</b>.</li>
        <li>Anota las incidencias del método (casos difíciles de valorar, datos que no estaban donde se esperaba): servirán para el informe y para la próxima vez.</li></ul>
        ${trampa("Nunca escribas nombres ni números de historia: solo códigos (HC-01…). La app avisa si un código lo parece.")}`)}
      <div data-zona="avisos-rec">${avisosRecHtml(a)}</div>
      <div class="card">
        <h2 class="sub-h">Datos de la recogida</h2>
        <div class="dos-col">
          <div class="field"><div class="field-head"><label class="field-label">Inicio</label></div><div class="input-wrap"><input class="txt-in" type="date" data-k="ejecucion.inicio" value="${esc(E.inicio)}" /></div></div>
          <div class="field"><div class="field-head"><label class="field-label">Fin</label></div><div class="input-wrap"><input class="txt-in" type="date" data-k="ejecucion.fin" value="${esc(E.fin)}" /></div></div>
        </div>
        ${campo(a, "ejecucion.auditores", "Quién ha recogido los datos", { ph: "p. ej. Supervisora de Enfermería y Técnico de Calidad" })}
        ${campo(a, "ejecucion.incidencias", "Incidencias del método", { area: true, opt: true, ph: "p. ej. En 3 historias el registro de triaje estaba en papel escaneado" })}
      </div>
      <h2 class="sec-t">Criterios</h2>
      <div class="rc-lista">${a.criterios.map((c, i) => { const r = L.resultadoCriterio(c); return `<a class="rc-card sem-borde--${r.estado}" href="#/auditoria/${a.id}/recogida/${c.id}">
        <span class="rc-cab"><span class="crit-n">${i + 1}</span><b>${esc(c.subproceso) || "Sin subproceso"}</b>${semaforo(r)}</span>
        <span class="rc-ind">${esc(c.ind.nombre || c.criterio)}</span>
        ${barraProgreso(r)}
        <span class="rc-ir">Recoger datos →</span>
      </a>`; }).join("") || `<p class="placeholder-box">La auditoría no tiene criterios. <a href="#/auditoria/${a.id}">Añádelos en el Inicio</a>.</p>`}</div>
      <h2 class="sec-t">Matriz de resultados</h2>
      <div data-zona="matriz">${matrizHtml(a)}</div>
      <div class="toolbar no-print"><button class="btn btn--primary" data-act="res-word">⬇ Matriz de resultados (Word)</button><button class="btn" data-act="informe">Ver para imprimir / PDF</button><button class="btn" data-act="res-excel">Exportar a Excel</button></div>`;
  }

  function filaCaso(c, x, j) {
    const b = f => `data-caso="${c.id}" data-i="${j}" data-f="${f}"`;
    return `<div class="caso caso--${x.valor || "vacio"}" data-fila="${j}">
      <span class="caso-n">${j + 1}</span>
      <input class="txt-in caso-cod" ${b("codigo")} value="${esc(x.codigo)}" placeholder="Código" autocomplete="off" aria-label="Código del caso ${j + 1}" />
      <span class="caso-seg" role="group" aria-label="¿Cumple?">${[["si", "Sí"], ["no", "No"], ["na", "NA"]].map(([v, t]) => `<button type="button" class="${x.valor === v ? "active" : ""}" data-act="valor" data-c="${c.id}" data-i="${j}" data-v="${v}">${t}</button>`).join("")}</span>
      <input class="txt-in caso-obs" ${b("obs")} value="${esc(x.obs)}" placeholder="Observación" autocomplete="off" aria-label="Observación del caso ${j + 1}" />
      ${x.listado ? `<span class="caso-lis" title="Número en el listado (sorteo)">#${esc(x.listado)}</span>` : ""}
    </div>`;
  }
  function renderRecogidaCriterio(a, c) {
    const i = a.criterios.indexOf(c), r = L.resultadoCriterio(c), m = L.calcMuestra(c), nPrep = Number.isFinite(m.n) ? Math.min(m.n, 200) : 10;
    const prev = a.criterios[i - 1], next = a.criterios[i + 1];
    const f = (k, v) => lleno(v) ? `<tr><th>${k}</th><td>${escMl(v)}</td></tr>` : "";
    return `
      <div class="wiz-top no-print">${volver(`#/auditoria/${a.id}/recogida`, "Todos los criterios")}<div class="tema-pills crit-pills">${a.criterios.map((x, k) => { const rx = L.resultadoCriterio(x); return `<a href="#/auditoria/${a.id}/recogida/${x.id}" class="sem-p sem-p--${rx.estado}${x === c ? " actual" : ""}" title="${esc(x.subproceso)}">${k + 1}</a>`; }).join("")}</div></div>
      <div class="wiz-titulo"><span class="wiz-paso">Recogida · criterio ${i + 1} de ${a.criterios.length}</span><h1 class="page-title">${esc(c.subproceso) || "Criterio " + (i + 1)}</h1></div>
      <details class="facil recordatorio"${r.total ? "" : " open"}><summary>Recordatorio: qué mirar</summary><div class="facil-body"><table class="ficha-t">
        ${f("Criterio", c.criterio)}${f("Indicador", c.ind.nombre)}${f("Estándar", L.textoEstandar(c.ind))}${f("Cumple si…", c.ind.cumpleSi)}${f("No aplica si…", c.ind.noAplicaSi)}${f("Dónde mirar", c.ind.fuente)}${f("Muestra", m.texto)}
      </table></div></details>
      <div data-zona="res-crit" class="res-sticky">${resultadoHtml(c)}</div>
      <div data-zona="avisos-rec">${avisosRecHtml(a, c.id)}</div>
      <h2 class="sec-t">Casos <span class="contador" data-zona="ncasos">${c.recogida.casos.length}</span></h2>
      ${c.recogida.casos.length ? `<div class="casos" data-zona="casos">${c.recogida.casos.map((x, j) => filaCaso(c, x, j)).join("")}</div>` : `<div class="placeholder-box"><p>Prepara las filas según la muestra del diseño (${nPrep} casos${c.muestra.sorteo.length ? ", con los números sorteados" : ""}) o añádelas una a una.</p></div>`}
      <div class="toolbar no-print">
        ${c.recogida.casos.length ? "" : `<button class="btn btn--primary" data-act="casos-preparar" data-c="${c.id}" data-n="${nPrep}">Preparar ${nPrep} filas</button>`}
        <button class="btn" data-act="casos-add" data-c="${c.id}" data-n="1">+ 1 caso</button>
        <button class="btn" data-act="casos-add" data-c="${c.id}" data-n="5">+ 5 casos</button>
        ${c.recogida.casos.some(x => !x.valor && !lleno(x.obs)) ? `<button class="btn btn--peligro-ghost" data-act="casos-limpiar" data-c="${c.id}">Quitar filas sin valorar</button>` : ""}
      </div>
      <div data-zona="res-crit" class="res-movil">${resultadoHtml(c)}</div>
      <h2 class="sec-t">Evidencia y comentario</h2>
      <div class="card">
        ${campo(c, "recogida.evidencia", "Evidencia analizada", { bind: cb(c, "recogida.evidencia"), area: true, ph: "p. ej. Registros de triaje de 10 pacientes seleccionados al azar", extra: `<div class="quick no-print"><button type="button" class="chip chip--accent" data-act="sug-evid" data-c="${c.id}">✎ Proponer</button></div>` })}
        ${campo(c, "recogida.comentario", "Comentario técnico", { bind: cb(c, "recogida.comentario"), area: true, rows: 3, ph: "Qué significa el resultado frente al estándar", help: "Una o dos frases neutrales: el resultado, el estándar y lo que se puede (o no se puede) afirmar con esta muestra.", extra: `<div class="quick no-print"><button type="button" class="chip chip--accent" data-act="sug-coment" data-c="${c.id}">✎ Proponer a partir del resultado</button></div>` })}
        ${campo(c, "recogida.observaciones", "Observaciones del auditor", { bind: cb(c, "recogida.observaciones"), area: true, opt: true, ph: "p. ej. Fue necesario revisar varios apartados de la historia" })}
      </div>
      <div class="wiz-nav no-print">
        ${prev ? `<a class="btn" href="#/auditoria/${a.id}/recogida/${prev.id}">← Criterio ${i}</a>` : `<a class="btn" href="#/auditoria/${a.id}/recogida">← Resumen</a>`}
        ${next ? `<a class="btn btn--primary" href="#/auditoria/${a.id}/recogida/${next.id}">Criterio ${i + 2} →</a>` : `<a class="btn btn--primary" href="#/auditoria/${a.id}/informe/1">Al informe →</a>`}
      </div>`;
  }
  function renderRecogida(a, cid) {
    actualAud = a; actualMapa = null; actualPlan = null; faseAud = "recogida"; critRecogida = cid || null; nAyuda = 0;
    if (document.body.classList.contains("ver-informe")) {
      view.innerHTML = `${informeBar()}<div class="doc-prev doc-prev--informe">${bloquesHtml(L.documentoResultados(a, new Date().toLocaleDateString("es-ES")).bloques)}</div>${informePie()}`;
      return;
    }
    const c = cid && a.criterios.find(x => x.id === cid);
    if (cid && !c) { location.hash = `#/auditoria/${a.id}/recogida`; return; }
    view.innerHTML = c ? `<div class="wiz-top no-print">${pasosAud(a, "hacer")}</div>${renderRecogidaCriterio(a, c)}` : `
      <div class="wiz-top no-print">${volver(modoEjemplo ? "#/ejemplos" : "#/auditorias", modoEjemplo ? "Ejemplos" : "Mis auditorías")}${pasosAud(a, "hacer")}</div>
      <div class="wiz-grid"><div class="wiz-main">${renderRecogidaResumen(a)}</div><aside class="wiz-side no-print" data-zona="resumen-rec">${resumenRec(a)}</aside></div>`;
  }
  function refrescarRec() {
    const a = actualAud; if (!a) return;
    const c = critRecogida && a.criterios.find(x => x.id === critRecogida);
    const Z = { "res-crit": () => c ? resultadoHtml(c) : "", "avisos-rec": () => avisosRecHtml(a, c ? c.id : null), "resumen-rec": () => resumenRec(a), matriz: () => matrizHtml(a), ncasos: () => c ? String(c.recogida.casos.length) : "" };
    $$("[data-zona]").forEach(el => { const f = Z[el.dataset.zona]; if (f) el.innerHTML = f(); });
    if (c) $$(".crit-pills a").forEach((el, k) => { const rx = L.resultadoCriterio(a.criterios[k]); el.className = el.className.replace(/sem-p--\S+/, "sem-p--" + rx.estado); });
  }

  // ---------- Auditoría: informe (entrega 5) ----------
  let subInforme = 1, docInforme = "informe";
  const PASOS_INF = [
    { n: 1, corto: "Interpretar", titulo: "Interpretar los resultados" },
    { n: 2, corto: "Causas", titulo: "Por qué ocurre: análisis de causas" },
    { n: 3, corto: "Recomendar", titulo: "Recomendaciones" },
    { n: 4, corto: "Conclusiones", titulo: "Conclusiones y resumen ejecutivo" },
    { n: 5, corto: "Informe", titulo: "Informe: validar y entregar" }
  ];
  function pasosInfHtml(a, sub) {
    const g = L.progresoInforme(a);
    return `<ol class="wiz-steps wiz-steps--5" aria-label="Pasos del informe">${PASOS_INF.map(s => `<li><a href="#/auditoria/${a.id}/informe/${s.n}" class="wiz-step${s.n === sub ? " actual" : ""}${g[s.n] ? " hecho" : ""}"${s.n === sub ? ' aria-current="step"' : ""}><span class="wiz-num">${g[s.n] && s.n !== sub ? "✓" : s.n}</span><span class="wiz-lbl">${s.corto}</span></a></li>`).join("")}</ol>`;
  }
  const avisosInfHtml = (a, sub) => L.avisosInforme(a).filter(x => x.paso === sub).map(avisoHtml).join("");
  const clasifBadge = k => L.CLASIF[k] ? `<span class="cl-b cl-b--${k}">${L.CLASIF[k].nom}</span>` : "";
  const critCabInf = (c, i) => `<div class="ent-cab"><span class="crit-n">${i + 1}</span><b>${esc(c.subproceso) || "Sin subproceso"}</b>${clasifBadge(c.analisis.clasif)}</div><p class="crit-txt">${esc(c.hallazgo)}</p>`;

  function infPaso1(a) {
    return `
      ${idea("Interpretar es decir <b>qué significa</b> el número: compararlo con el estándar, tener en cuenta el margen de error y la calidad del dato, y clasificar el hallazgo sin juicios.")}
      ${facil(`<ul>${Object.values(L.CLASIF).map(x => `<li><b>${x.nom}</b>: ${x.que.charAt(0).toLowerCase() + x.que.slice(1)}</li>`).join("")}</ul>
        <p>La app propone la clasificación según los datos: si el LQAS se rechaza, <b>no conformidad</b>; si se acepta pero el porcentaje observado queda por debajo del estándar (o el resultado no es concluyente), <b>observación</b>.</p>
        ${ejemplo("redacción neutral", "<p>✘ «El personal de noche no se lava las manos». ✔ «El cumplimiento fue del 65 % de las oportunidades observadas (objetivo 90 %); el menor cumplimiento se registró en el turno de noche».</p>")}
        ${trampa("Antes de concluir, comprueba la <b>calidad del dato</b>: registros incompletos, duplicados o sin actualizar pueden fabricar un incumplimiento que no existe.")}`)}
      <div data-zona="avisos-inf">${avisosInfHtml(a, 1)}</div>
      ${a.criterios.map((c, i) => { const sug = L.clasificacionSugerida(c); return `<div class="crit">${critCabInf(c, i)}
        ${resultadoHtml(c)}
        <div class="field"><div class="field-head"><label class="field-label">Clasificación del hallazgo</label>${sug ? `<span class="sugerida">Sugerida: <b>${L.CLASIF[sug].nom}</b></span>` : ""}</div>${segC(c, "analisis.clasif", Object.keys(L.CLASIF).map(k => [k, L.CLASIF[k].nom]))}</div>
        ${campo(c, "analisis.interpretacion", "Interpretación", { bind: cb(c, "analisis.interpretacion"), area: true, rows: 3, ph: "Qué significa el resultado frente al estándar y qué se puede afirmar con esta muestra", extra: `<div class="quick no-print"><button type="button" class="chip chip--accent" data-act="sug-interp" data-c="${c.id}">✎ Proponer a partir del resultado</button></div>` })}
      </div>`; }).join("") || `<p class="placeholder-box">Esta auditoría aún no tiene criterios.</p>`}`;
  }

  function infPaso2(a) {
    const C = a.criterios.filter(c => ["noConformidad", "observacion"].includes(c.analisis.clasif));
    return `
      ${idea("Si la mejora ataca el síntoma, el fallo vuelve. Antes de recomendar, pregunta <b>por qué</b> hasta llegar a la <b>causa raíz</b>: casi siempre está en el sistema, no en una persona.")}
      ${facil(`<p><b>Los 5 porqués</b>: escribe el problema y pregunta «¿por qué?» a cada respuesta. Suele bastar con 3 a 5 pasos. Cuando la respuesta es algo que la organización puede cambiar, has llegado a la causa raíz.</p>
        <p><b>Categorías</b> (espina de pescado): ${Object.values(L.CATEGORIAS_CAUSA).map(x => `<b>${x.nom.toLowerCase()}</b> (${x.que.charAt(0).toLowerCase() + x.que.slice(1, -1)})`).join("; ")}.</p>
        ${ejemplo("higiene de manos", "<p>Cumplimiento del 65 %. ¿Por qué? Se omite en el turno de noche. ¿Por qué? Los dispensadores no están a mano. ¿Por qué? Se colocaron en el pasillo, lejos del punto de atención. <b>Causa raíz</b>: ubicación de los dispensadores. <b>Mejora</b>: reubicarlos (y no solo «concienciar»).</p>")}
        ${trampa("«Falta de concienciación» o «el personal no cumple» no son causas raíz: son el punto de partida de la siguiente pregunta.")}`)}
      <div data-zona="avisos-inf">${avisosInfHtml(a, 2)}</div>
      ${C.map(c => { const i = a.criterios.indexOf(c); return `<div class="crit">${critCabInf(c, i)}
        ${lleno(c.analisis.interpretacion) ? `<p class="ent-hall">${esc(c.analisis.interpretacion)}</p>` : ""}
        <div class="field"><div class="field-head"><label class="field-label">Los 5 porqués</label></div>
          <div class="porques">${c.analisis.porques.map((p, k) => `<label class="porque"><span>${k === 0 ? "Problema" : "¿Por qué?"}</span><textarea class="txt-in" ${cb(c, "analisis.porques." + k)} rows="1" placeholder="${k === 0 ? "p. ej. Pacientes sin reevaluación tras 60 minutos" : "Porque…"}">${esc(p)}</textarea></label>`).join("")}</div></div>
        <div class="field"><div class="field-head"><label class="field-label">Categorías de causa</label></div>${chipsC(c, "analisis.categorias", L.CATEGORIAS_CAUSA, x => x.nom)}</div>
        ${campo(c, "analisis.causaRaiz", "Causa raíz", { bind: cb(c, "analisis.causaRaiz"), area: true, ph: "p. ej. No existe un circuito de vigilancia activa: la reevaluación no está asignada ni hay alertas de tiempo", help: "Una frase que explique el motivo de fondo, en términos del proceso o del sistema (algo que la organización puede cambiar)." })}
      </div>`; }).join("") || `<p class="placeholder-box">No hay no conformidades ni observaciones: no hace falta análisis de causas. Si aún no has clasificado los hallazgos, hazlo en el paso 1.</p>`}`;
  }

  function recHtml(c, x, k) {
    const b = f => `data-rec="${c.id}" data-i="${k}" data-f="${f}"`, fz = L.fuerzaMedida(x.texto);
    return `<div class="rec">
      <div class="rec-cab"><b>Recomendación ${k + 1}</b><span data-zr="fuerza-${c.id}-${k}">${fz ? `<span class="fz-b fz-b--${fz}" title="${esc(L.FUERZAS[fz].que)}">${L.FUERZAS[fz].nom}</span>` : ""}</span><button type="button" class="link-btn link-btn--peligro no-print" data-act="rec-del" data-c="${c.id}" data-i="${k}">Quitar</button></div>
      <textarea class="txt-in" ${b("texto")} rows="2" placeholder="Qué se propone hacer, en una o dos frases concretas">${esc(x.texto)}</textarea>
      <div class="dos-col">
        <div class="field"><div class="field-head"><label class="field-label">Responsable propuesto</label></div><div class="input-wrap"><input class="txt-in" ${b("responsable")} value="${esc(x.responsable)}" placeholder="p. ej. Supervisión de Enfermería" autocomplete="off" /></div></div>
        <div class="field"><div class="field-head"><label class="field-label">Prioridad</label></div><div class="seg" role="group">${Object.keys(L.PRIORIDADES).map(p => `<button type="button" class="${x.prioridad === p ? "active" : ""}" data-act="rec-prio" data-c="${c.id}" data-i="${k}" data-v="${p}">${L.PRIORIDADES[p]}</button>`).join("")}</div></div>
      </div>
      <div class="input-wrap"><input class="txt-in" ${b("motivo")} value="${esc(x.motivo)}" placeholder="Por qué esa prioridad (opcional)" autocomplete="off" /></div>
    </div>`;
  }
  function infPaso3(a) {
    const C = a.criterios.filter(c => ["noConformidad", "observacion"].includes(c.analisis.clasif)), conf = a.criterios.filter(c => c.analisis.clasif === "conformidad");
    return `
      ${idea("Cada hallazgo se convierte en recomendaciones <b>concretas, realistas y con responsable</b>. Lo habitual: dos por hallazgo, priorizadas según el riesgo, la viabilidad y el impacto.")}
      ${facil(`<table class="mini facil-tabla"><tr><th>Tipo de medida</th><th>Ejemplos</th></tr>
        <tr><td><b>Fuerte</b>: cambia el sistema</td><td>Campo obligatorio, alerta automática, punto de control que no deja continuar, simplificar o eliminar el paso que falla.</td></tr>
        <tr><td><b>Intermedia</b>: apoya la práctica</td><td>Lista de verificación, doble verificación, protocolo estandarizado, revisión periódica.</td></tr>
        <tr><td><b>Débil</b>: depende de la memoria o la voluntad</td><td>Formación, sesiones de sensibilización, carteles, «tener más cuidado».</td></tr></table>
        <p>Las débiles no sobran, pero <b>solas suelen funcionar poco</b>. Combina al menos una fuerte o intermedia con la formación. La app marca el tipo de cada medida y avisa si todas son débiles.</p>
        <p><b>Prioridad</b>: alta si afecta directamente a la seguridad del paciente; media si mejora de forma progresiva; baja si es conveniente pero no urgente.</p>`)}
      <div data-zona="avisos-inf">${avisosInfHtml(a, 3)}</div>
      ${C.map(c => { const i = a.criterios.indexOf(c); return `<div class="crit">${critCabInf(c, i)}
        ${lleno(c.analisis.causaRaiz) ? `<p class="ent-hall"><b>Causa raíz:</b> ${esc(c.analisis.causaRaiz)}</p>` : ""}
        ${c.analisis.recs.map((x, k) => recHtml(c, x, k)).join("")}
        <div class="toolbar no-print"><button class="btn" data-act="rec-add" data-c="${c.id}">+ Añadir recomendación</button></div>
      </div>`; }).join("") || `<p class="placeholder-box">No hay no conformidades ni observaciones que necesiten recomendaciones.</p>`}
      ${conf.length ? `<p class="field-sub">Conformidades (${conf.length}): no necesitan recomendaciones, aunque puedes reforzar las buenas prácticas en las conclusiones.</p>` : ""}`;
  }

  function infPaso4(a) {
    return `
      ${idea("El informe se adapta a quien lo lee: <b>detalle</b> para los equipos y un <b>resumen ejecutivo</b> de una o dos páginas para la Dirección, con lo esencial y lo que se le pide.")}
      <div data-zona="avisos-inf">${avisosInfHtml(a, 4)}</div>
      <div class="card">
        ${campo(a, "informe.fortalezas", "Fortalezas", { area: true, rows: 2, opt: true, ph: "Lo que funciona bien y conviene mantener" })}
        ${campo(a, "informe.conclusiones", "Conclusiones", { area: true, rows: 5, ph: "Qué se ha encontrado, qué significa y qué se propone, de forma neutral", extra: `<div class="quick no-print"><button type="button" class="chip chip--accent" data-act="sug-concl">✎ Proponer</button></div>` })}
      </div>
      <h2 class="sec-t">Resumen ejecutivo</h2>
      <div class="card">
        ${campo(a, "informe.destinatarios", "Para quién", { ph: "p. ej. Gerencia, Dirección Médica y de Enfermería, Jefatura del servicio" })}
        ${campo(a, "informe.resumen", "En pocas palabras", { area: true, rows: 6, ph: "Qué se auditó, resultado, hallazgos principales, recomendaciones prioritarias y próximos pasos", extra: `<div class="quick no-print"><button type="button" class="chip chip--accent" data-act="sug-resumen">✎ Proponer a partir de los hallazgos</button></div>` })}
      </div>
      ${practica("Tablas y gráficos antes que párrafos largos, y una reunión de devolución para resolver dudas: así las recomendaciones se convierten en acciones.")}`;
  }

  function infPaso5(a) {
    const I = a.informe, doc = docInforme === "resumen" ? L.documentoResumenEjecutivo(a, new Date().toLocaleDateString("es-ES")) : L.documentoInforme(a, buscaMapa(a.origen.mapaId), buscaPlan(a.planId), new Date().toLocaleDateString("es-ES"), datos.auditorias.find(x => x.id === a.seguimientoDe));
    return `
      ${idea("Antes de cerrar, <b>valida el borrador</b> con los responsables del área: confirma los hechos y mejora la aceptación. Después, la <b>reunión de devolución</b> con el equipo y la Dirección.")}
      <div data-zona="avisos-inf">${avisosInfHtml(a, 5)}</div>
      <div class="card">
        <div class="field"><div class="field-head"><label class="field-label">Estado del informe</label></div>${seg(a, "informe.estado", Object.entries(L.ESTADOS_INFORME))}</div>
        ${hitosHtml(a, ["validacion", "devolucion"])}
      </div>
      <h2 class="sec-t">Control del documento</h2>
      <div class="card">${controlHtml(a)}</div>
      <h2 class="sec-t">Documentos</h2>
      <div class="toolbar no-print">
        <button class="btn btn--primary" data-act="inf-word">⬇ Informe completo (Word)</button>
        <button class="btn btn--primary" data-act="resej-word">⬇ Resumen ejecutivo (Word)</button>
        <button class="btn" data-act="informe">Ver para imprimir / PDF</button>
      </div>
      <div class="seg seg--doc no-print" role="group"><button type="button" class="${docInforme === "informe" ? "active" : ""}" data-act="doc-inf" data-v="informe">Informe completo</button><button type="button" class="${docInforme === "resumen" ? "active" : ""}" data-act="doc-inf" data-v="resumen">Resumen ejecutivo</button></div>
      <div class="doc-prev">${bloquesHtml(doc.bloques)}</div>`;
  }

  const RENDER_INF = { 1: infPaso1, 2: infPaso2, 3: infPaso3, 4: infPaso4, 5: infPaso5 };
  function resumenInf(a) {
    const g = L.progresoInforme(a), w = L.avisosInforme(a).filter(x => x.nivel !== "nota").length, k = a.criterios.reduce((o, c) => (o[c.analisis.clasif || "sin"] = (o[c.analisis.clasif || "sin"] || 0) + 1, o), {});
    return `<div class="resumen">
      <div class="res-label">Informe de la auditoría</div>
      <h3 class="resumen-nombre">${lleno(a.titulo) ? esc(a.titulo) : '<span class="vacio">Sin título</span>'}</h3>
      <div class="badges">${["noConformidad", "observacion", "conformidad"].filter(x => k[x]).map(x => `<span class="cl-b cl-b--${x}">${k[x]} ${k[x] > 1 ? { noConformidad: "no conformidades", observacion: "observaciones", conformidad: "conformidades" }[x] : L.CLASIF[x].nom.toLowerCase()}</span>`).join("")}${w ? `<span class="badge badge--aviso">⚠ ${plural(w, "aviso", "avisos")}</span>` : ""}</div>
      <ul class="check-lista">${PASOS_INF.map(s => `<li class="${g[s.n] ? "ok" : ""}">${g[s.n] ? "✓" : "○"} ${s.titulo}</li>`).join("")}</ul>
      <p class="res-prox"><b>Después:</b> el <a href="#/auditoria/${a.id}/mejora/1">plan de acción de mejora y el seguimiento</a> (fase Actuar).</p>
    </div>`;
  }
  function renderInforme(a, sub) {
    actualAud = a; actualMapa = null; actualPlan = null; faseAud = "informe"; subInforme = sub; nAyuda = 0;
    if (document.body.classList.contains("ver-informe")) {
      const doc = new URLSearchParams((location.hash.split("?")[1]) || "").get("doc") === "resumen" ? L.documentoResumenEjecutivo(a, new Date().toLocaleDateString("es-ES")) : L.documentoInforme(a, buscaMapa(a.origen.mapaId), buscaPlan(a.planId), new Date().toLocaleDateString("es-ES"), datos.auditorias.find(x => x.id === a.seguimientoDe));
      view.innerHTML = `${informeBar()}<div class="doc-prev doc-prev--informe">${bloquesHtml(doc.bloques)}</div>${informePie()}`;
      return;
    }
    const s = PASOS_INF[sub - 1];
    view.innerHTML = `
      <div class="wiz-top no-print">${volver(modoEjemplo ? "#/ejemplos" : "#/auditorias", modoEjemplo ? "Ejemplos" : "Mis auditorías")}${pasosAud(a, "verificar")}</div>
      <div class="wiz-top no-print">${pasosInfHtml(a, sub)}</div>
      <div class="wiz-grid">
        <div class="wiz-main">
          <div class="wiz-titulo"><span class="wiz-paso">Informe · paso ${sub} de 5 · Verificar</span><h1 class="page-title">${s.titulo}</h1></div>
          ${RENDER_INF[sub](a)}
          <div class="wiz-nav no-print">
            ${sub > 1 ? `<a class="btn" href="#/auditoria/${a.id}/informe/${sub - 1}">← Anterior</a>` : `<a class="btn" href="#/auditoria/${a.id}/recogida">← Recogida</a>`}
            ${sub < 5 ? `<a class="btn btn--primary" href="#/auditoria/${a.id}/informe/${sub + 1}">Siguiente: ${PASOS_INF[sub].corto} →</a>` : `<a class="btn btn--primary" href="#/auditoria/${a.id}/mejora/1">Siguiente: Mejora →</a>`}
          </div>
        </div>
        <aside class="wiz-side no-print" data-zona="resumen-inf">${resumenInf(a)}</aside>
      </div>`;
  }
  function refrescarInf() {
    const a = actualAud; if (!a) return;
    const z = $("[data-zona='resumen-inf']"); if (z) z.innerHTML = resumenInf(a);
    const av = $("[data-zona='avisos-inf']"); if (av) av.innerHTML = avisosInfHtml(a, subInforme);
    $$("[data-zr^='fuerza-']").forEach(el => { const [, cid, k] = el.dataset.zr.split("-"), c = a.criterios.find(x => x.id === cid), x = c && c.analisis.recs[Number(k)]; if (!x) return; const fz = L.fuerzaMedida(x.texto); el.innerHTML = fz ? `<span class="fz-b fz-b--${fz}" title="${esc(L.FUERZAS[fz].que)}">${L.FUERZAS[fz].nom}</span>` : ""; });
    const st = $$(".wiz-steps")[1]; if (st) st.outerHTML = pasosInfHtml(a, subInforme);
  }

  // ---------- Auditoría: mejora y seguimiento (entrega 6) ----------
  let subMejora = 1;
  const PASOS_MEJ = [
    { n: 1, corto: "Acciones", titulo: "Plan de acción de mejora" },
    { n: 2, corto: "Priorizar", titulo: "Priorizar: criticidad × viabilidad" },
    { n: 3, corto: "Seguimiento", titulo: "Seguimiento y cierre del ciclo" },
    { n: 4, corto: "Documento", titulo: "Documento del plan de mejora" }
  ];
  const hoyIso = () => new Date().toISOString().slice(0, 10);
  function pasosMejHtml(a, sub) {
    const g = L.progresoMejora(a);
    return `<ol class="wiz-steps wiz-steps--4" aria-label="Pasos de la mejora">${PASOS_MEJ.map(s => `<li><a href="#/auditoria/${a.id}/mejora/${s.n}" class="wiz-step${s.n === sub ? " actual" : ""}${g[s.n] ? " hecho" : ""}"${s.n === sub ? ' aria-current="step"' : ""}><span class="wiz-num">${g[s.n] && s.n !== sub ? "✓" : s.n}</span><span class="wiz-lbl">${s.corto}</span></a></li>`).join("")}</ol>`;
  }
  const avisosMejHtml = (a, sub) => L.avisosMejora(a, hoyIso()).filter(x => x.paso === sub).map(avisoHtml).join("");
  const buscaAcc = id => actualAud && actualAud.mejora.acciones.find(x => x.id === id);
  const numAcc = (a, x) => a.mejora.acciones.indexOf(x) + 1;
  const fzBadge = t => { const f = L.fuerzaMedida(t); return f ? `<span class="fz-b fz-b--${f}" title="${esc(L.FUERZAS[f].que)}">${L.FUERZAS[f].nom}</span>` : ""; };
  const estadoAccBadge = x => `<span class="ea-b ea-b--${L.vencida(x, hoyIso()) ? "vencida" : x.estado}">${L.vencida(x, hoyIso()) ? "Vencida" : L.ESTADOS_ACCION[x.estado]}</span>`;

  function mejPaso1(a) {
    const nRecs = a.criterios.reduce((n, c) => n + c.analisis.recs.filter(r => lleno(r.texto) && !a.mejora.acciones.some(x => x.critId === c.id && x.recId === r.id)).length, 0);
    return `
      ${idea("Plan de mejora = <b>compromiso</b>, no intención. Cada acción tiene qué se hace, quién, cuándo, con qué recursos y cómo se sabrá si funciona.")}
      ${facil(`<ul><li><b>Objetivo</b>: qué se quiere conseguir (normalmente, que el indicador alcance el estándar).</li><li><b>Acción</b>: qué se va a hacer, en concreto.</li><li><b>Responsable</b>: una persona o un cargo.</li><li><b>Plazo</b>: inicio y fin, proporcionales a la complejidad.</li><li><b>Recursos</b>: personas, tiempo, material, formación.</li><li><b>Indicador de seguimiento</b>: cómo se comprobará que funciona.</li></ul>
        <p>Se registra con la documentación de calidad y se comunica a todos los implicados.</p>`)}
      <div class="toolbar no-print">${nRecs ? `<button class="btn btn--primary" data-act="acc-traer">⬇ Traer las recomendaciones del informe (${nRecs})</button>` : ""}<button class="btn" data-act="acc-add">+ Añadir acción a mano</button></div>
      <div data-zona="avisos-mej">${avisosMejHtml(a, 1)}</div>
      ${a.mejora.acciones.map((x, i) => { const b = f => `data-acc="${x.id}" data-f="${f}"`, c = a.criterios.find(y => y.id === x.critId); return `<div class="crit acc">
        <div class="crit-cab"><span class="crit-n">${i + 1}</span><b>Acción ${i + 1}</b><span data-zr="fz-${x.id}">${fzBadge(x.accion)}</span>${estadoAccBadge(x)}<button type="button" class="link-btn link-btn--peligro no-print" data-act="acc-del" data-id="${x.id}">Quitar</button></div>
        <div class="filtros filtros--solo"><label>Hallazgo al que responde<select data-act-sel="acc-crit" data-id="${x.id}"><option value="">Ninguno en concreto</option>${a.criterios.map((y, k) => `<option value="${y.id}"${y.id === x.critId ? " selected" : ""}>${k + 1}. ${esc(L.corto(y.hallazgo || y.subproceso, 60))}${L.CLASIF[y.analisis.clasif] ? " · " + L.CLASIF[y.analisis.clasif].nom : ""}</option>`).join("")}</select></label></div>
        ${campo(x, "accion", "Acción", { bind: b("accion"), area: true, ph: "Qué se va a hacer, en concreto" })}
        ${campo(x, "objetivo", "Objetivo", { bind: b("objetivo"), area: true, ph: "p. ej. Aumentar el % de pacientes reevaluados hasta ≥ 90 %" })}
        <div class="dos-col">
          ${campo(x, "responsable", "Responsable", { bind: b("responsable"), ph: "Persona o cargo" })}
          ${campo(x, "recursos", "Recursos", { bind: b("recursos"), opt: true, ph: "Tiempo, personas, material, formación" })}
        </div>
        <div class="dos-col">
          <div class="field"><div class="field-head"><label class="field-label">Inicio</label></div><div class="input-wrap"><input class="txt-in" type="date" ${b("inicio")} value="${esc(x.inicio)}" /></div></div>
          <div class="field"><div class="field-head"><label class="field-label">Fin (plazo)</label></div><div class="input-wrap"><input class="txt-in" type="date" ${b("fin")} value="${esc(x.fin)}" /></div></div>
        </div>
        ${campo(x, "indicador", "Indicador de seguimiento", { bind: b("indicador"), ph: "Cómo se sabrá si funciona", help: "Normalmente, el indicador del criterio y su estándar. También puede ser un indicador de implantación (p. ej. «alerta activa en el sistema»)." })}
        ${c && lleno(c.analisis.causaRaiz) ? `<p class="field-sub"><b>Causa raíz:</b> ${esc(c.analisis.causaRaiz)}</p>` : ""}
      </div>`; }).join("") || `<p class="placeholder-box">Aún no hay acciones. Tráelas del informe o añádelas a mano.</p>`}`;
  }

  function matrizHtml3(a) {
    const AC = a.mejora.acciones, celda = (c, v) => AC.filter(x => x.criticidad === String(c) && x.viabilidad === String(v));
    const zona = (c, v) => L.zonaAccion({ criticidad: String(c), viabilidad: String(v) }).k;
    return `<div class="matriz3">
      <div class="m3-ejey">Criticidad</div>
      <div class="m3-grid">${[3, 2, 1].map(c => `<span class="m3-lbl">${L.NIVEL3[c]}</span>${[1, 2, 3].map(v => `<div class="m3-c m3-c--${zona(c, v)}">${celda(c, v).map(x => `<span class="m3-n" title="${esc(L.corto(x.accion, 90))}">${numAcc(a, x)}</span>`).join("")}</div>`).join("")}`).join("")}
        <span></span>${[1, 2, 3].map(v => `<span class="m3-lbl m3-lbl--x">${L.NIVEL3[v]}</span>`).join("")}</div>
      <div class="m3-ejex">Viabilidad →</div>
    </div>
    <div class="leyenda"><span><i class="m3-c--ya"></i>Hacer ya</span><span><i class="m3-c--planificar"></i>Crítica pero difícil: planificar recursos</span><span><i class="m3-c--pronto"></i>Siguiente en la cola</span><span><i class="m3-c--rapida"></i>Fácil, poco crítica</span><span><i class="m3-c--reconsiderar"></i>Reconsiderar</span></div>`;
  }
  function mejPaso2(a) {
    const AC = a.mejora.acciones, orden = L.ordenarAcciones(AC);
    const segN = (x, f) => `<div class="seg seg--mini" role="group">${["3", "2", "1"].map(v => `<button type="button" class="${x[f] === v ? "active" : ""}" data-act="acc-nivel" data-id="${x.id}" data-f="${f}" data-v="${v}">${L.NIVEL3[v]}</button>`).join("")}</div>`;
    return `
      ${idea("No todo se puede hacer a la vez. Se empieza por lo <b>más crítico</b> para la seguridad del paciente que <b>sea viable</b> con los recursos que hay.")}
      ${facil(`<ul><li><b>Criticidad</b>: cuánto afecta el hallazgo a la seguridad del paciente o a la calidad asistencial.</li><li><b>Viabilidad</b>: posibilidad real de hacerlo con los recursos existentes (tiempo, dinero, personas, apoyos).</li><li><b>Impacto global</b> (desempata): cuánto reducirá el riesgo o fortalecerá la organización.</li></ul>
        <p>La criticidad viene propuesta desde la prioridad de la recomendación del informe. Lo crítico pero poco viable no se descarta: se <b>planifica</b> buscando recursos.</p>`)}
      <div data-zona="avisos-mej">${avisosMejHtml(a, 2)}</div>
      ${AC.length ? `<div class="card chart-card" data-zona="matriz3">${matrizHtml3(a)}</div>
      <h2 class="sec-t">Valora cada acción</h2>
      ${AC.map((x, i) => `<div class="acc-val">
        <div class="acc-val-cab"><span class="crit-n">${i + 1}</span><span>${esc(L.corto(x.accion || "Acción sin describir", 110))}</span>${fzBadge(x.accion)}</div>
        <div class="acc-val-segs"><label><span>Criticidad</span>${segN(x, "criticidad")}</label><label><span>Viabilidad</span>${segN(x, "viabilidad")}</label><label><span>Impacto</span>${segN(x, "impacto")}</label></div>
      </div>`).join("")}
      <h2 class="sec-t">Orden propuesto</h2>
      <ol class="orden-acc">${orden.map(x => { const z = L.zonaAccion(x); return `<li><b>${numAcc(a, x)}.</b> ${esc(L.corto(x.accion, 100))} ${z ? `<span class="z-b z-b--${z.k}">${z.nom}</span>` : '<span class="vacio">sin valorar</span>'}</li>`; }).join("")}</ol>` : `<p class="placeholder-box">Primero añade las acciones en el paso 1.</p>`}`;
  }

  function comparacionHtml(orig, a) {
    const F = L.compararSeguimiento(orig, a), txtR = r => !r || !r.n ? "—" : r.lqas && r.lqas.acepta != null ? `${esc(r.textoValor)}<br><small>LQAS ${r.lqas.acepta ? "acepta" : "rechaza"}</small>` : esc(r.textoValor);
    return `<div class="table-wrap"><table class="mini tabla-matriz"><thead><tr><th>Nº</th><th>Subproceso</th><th>Antes</th><th>Después</th><th>Cambio</th><th>Decisión</th></tr></thead><tbody>
      ${F.map(f => `<tr><td>${f.i + 1}</td><td>${esc(f.c.subproceso)}</td><td>${txtR(f.antes)}</td><td>${txtR(f.despues)}</td><td>${{ mejora: "▲ Mejora", empeora: "▼ Empeora", igual: "= Igual" }[f.cambio] || ""}</td><td><span class="dec-b dec-b--${f.decision}">${L.DECISION_TXT[f.decision]}</span></td></tr>`).join("")}
    </tbody></table></div>
    <ul class="dec-lista">${F.filter(f => f.decision !== "pendiente").map(f => `<li><b>Criterio ${f.i + 1}:</b> ${esc(f.texto)}</li>`).join("")}</ul>`;
  }
  function mejPaso3(a) {
    const rs = L.resumenAcciones(a, hoyIso()), orig = a.seguimientoDe && datos.auditorias.find(x => x.id === a.seguimientoDe), seg = a.mejora.seguimientoId && datos.auditorias.find(x => x.id === a.mejora.seguimientoId);
    const mapa = buscaMapa(a.origen.mapaId), plan = buscaPlan(a.planId);
    return `
      ${idea("Sin seguimiento, la auditoría es un ejercicio incompleto. Primero se comprueba que las acciones <b>se han hecho</b>; después, con la auditoría de seguimiento, que <b>han funcionado</b>.")}
      <div data-zona="avisos-mej">${avisosMejHtml(a, 3)}</div>
      ${orig ? `<h2 class="sec-t">Antes y después</h2>
        <p class="page-lead">Comparación con la auditoría inicial: <a href="#/auditoria/${orig.id}/mejora/3">${esc(orig.titulo)}</a>.</p>
        <div class="card">${comparacionHtml(orig, a)}</div>
        ${trampa("Una mejora parcial <b>no se cierra</b>: se analizan los casos que siguen sin cumplir, se ajustan las acciones y se vuelve a medir hasta alcanzar el estándar.")}` : ""}
      ${a.mejora.acciones.length ? `<h2 class="sec-t">Estado de las acciones</h2>
      <div class="ea-resumen">${Object.keys(L.ESTADOS_ACCION).map(k => `<span class="ea-b ea-b--${k}">${rs[k]} ${L.ESTADOS_ACCION[k].toLowerCase()}</span>`).join("")}${rs.vencidas ? `<span class="ea-b ea-b--vencida">${rs.vencidas} vencida${rs.vencidas > 1 ? "s" : ""}</span>` : ""}</div>
      ${a.mejora.acciones.map((x, i) => `<div class="acc-est">
        <div class="acc-val-cab"><span class="crit-n">${i + 1}</span><span>${esc(L.corto(x.accion || "Acción sin describir", 100))}<small>${esc(x.responsable)}${lleno(x.fin) ? " · plazo " + L.fmtFecha(x.fin) : ""}</small></span>${estadoAccBadge(x)}</div>
        <div class="seg seg--mini seg--wrap" role="group">${Object.keys(L.ESTADOS_ACCION).map(k => `<button type="button" class="${x.estado === k ? "active" : ""}" data-act="acc-estado" data-id="${x.id}" data-v="${k}">${L.ESTADOS_ACCION[k]}</button>`).join("")}</div>
        <input class="txt-in acc-nota" data-acc="${x.id}" data-f="nota" value="${esc(x.nota)}" placeholder="Nota (p. ej. qué falta, qué se ha comprobado)" autocomplete="off" />
      </div>`).join("")}` : ""}
      <h2 class="sec-t">Auditoría de seguimiento</h2>
      <div class="card">
        <div class="field"><div class="field-head"><label class="field-label">¿Cuándo?</label>${ayudaBtn("Semanas después para acciones sencillas; meses para cambios estructurales. Lo habitual: a los 3 meses de terminar las acciones principales.").btn}</div><p class="help" id="help-h${nAyuda}" hidden>Semanas después para acciones sencillas; meses para cambios estructurales. Lo habitual: a los 3 meses de terminar las acciones principales.</p><div class="input-wrap"><input class="txt-in" type="date" data-k="mejora.fechaSeguimiento" value="${esc(a.mejora.fechaSeguimiento)}" /></div></div>
        ${seg ? `<p>✓ Ya existe: <a href="#/auditoria/${seg.id}">${esc(seg.titulo)}</a></p><div class="toolbar"><a class="btn btn--primary" href="#/auditoria/${seg.id}/mejora/3">Ver el antes y después →</a></div>`
          : `<p class="field-sub">Con un clic se crea una auditoría nueva que <b>hereda el diseño</b> (criterios, indicadores, evidencias y muestra) y empieza con la recogida limpia. Después, la app compara los resultados con los de esta auditoría.${plan ? ` También se añade al Plan Anual ${esc(plan.anio)} como auditoría de seguimiento.` : ""}</p>
          <div class="toolbar">${modoEjemplo ? "" : `<button class="btn btn--primary" data-act="crear-seg">↻ Crear la auditoría de seguimiento</button>`}</div>`}
      </div>
      <h2 class="sec-t">Cerrar el ciclo</h2>
      ${box("idea", "Actuar", `<p>Con los resultados, <b>ajusta, refuerza o redefine</b> las acciones y actualiza las herramientas de partida: ${mapa ? `en el <a href="#/riesgos/${mapa.id}">Mapa de Riesgos</a>, revisa si han bajado la ocurrencia o la dificultad de detección de los riesgos auditados` : "el Mapa de Riesgos"}${plan ? ` y el <a href="#/plan/${plan.id}/4">Plan Anual</a>` : " y el Plan Anual"}. Así empieza la siguiente vuelta del ciclo.</p>`)}
      ${campo(a, "mejora.notas", "Notas del seguimiento", { area: true, opt: true, ph: "p. ej. Reunión de devolución: plan acordado con la Jefatura" })}`;
  }

  function mejPaso4(a) {
    const doc = L.documentoPlanMejora(a, new Date().toLocaleDateString("es-ES"), hoyIso());
    return `
      <div class="toolbar no-print">
        <button class="btn btn--primary" data-act="mej-word">⬇ Plan de mejora (Word)</button>
        <button class="btn" data-act="informe">Ver para imprimir / PDF</button>
        <button class="btn" data-act="mej-excel">Exportar a Excel</button>
      </div>
      ${practica("Registra el plan con la documentación de calidad y compártelo con todos los implicados: conocer los objetivos, los responsables y los plazos favorece la implicación.")}
      <h2 class="sec-t">Vista previa</h2>
      <div class="doc-prev">${bloquesHtml(doc.bloques)}</div>`;
  }

  const RENDER_MEJ = { 1: mejPaso1, 2: mejPaso2, 3: mejPaso3, 4: mejPaso4 };
  function resumenMej(a) {
    const g = L.progresoMejora(a), rs = L.resumenAcciones(a, hoyIso()), w = L.avisosMejora(a, hoyIso()).filter(x => x.nivel !== "nota").length;
    return `<div class="resumen">
      <div class="res-label">Mejora y seguimiento</div>
      <h3 class="resumen-nombre">${lleno(a.titulo) ? esc(a.titulo) : '<span class="vacio">Sin título</span>'}</h3>
      <div class="badges"><span class="badge">${plural(rs.total, "acción", "acciones")}</span>${rs.hecha + rs.verificada ? `<span class="ea-b ea-b--hecha">${rs.hecha + rs.verificada} hechas</span>` : ""}${rs.vencidas ? `<span class="ea-b ea-b--vencida">${rs.vencidas} vencidas</span>` : ""}${w ? `<span class="badge badge--aviso">⚠ ${plural(w, "aviso", "avisos")}</span>` : ""}</div>
      <ul class="check-lista">${PASOS_MEJ.slice(0, 3).map(s => `<li class="${g[s.n] ? "ok" : ""}">${g[s.n] ? "✓" : "○"} ${s.titulo}</li>`).join("")}</ul>
      ${a.seguimientoDe ? `<p class="res-prox">Esta es una <b>auditoría de seguimiento</b>.</p>` : ""}
    </div>`;
  }
  function renderMejora(a, sub) {
    actualAud = a; actualMapa = null; actualPlan = null; faseAud = "mejora"; subMejora = sub; nAyuda = 0;
    if (document.body.classList.contains("ver-informe")) {
      view.innerHTML = `${informeBar()}<div class="doc-prev doc-prev--informe">${bloquesHtml(L.documentoPlanMejora(a, new Date().toLocaleDateString("es-ES"), hoyIso()).bloques)}</div>${informePie()}`;
      return;
    }
    const s = PASOS_MEJ[sub - 1];
    view.innerHTML = `
      <div class="wiz-top no-print">${volver(modoEjemplo ? "#/ejemplos" : "#/auditorias", modoEjemplo ? "Ejemplos" : "Mis auditorías")}${pasosAud(a, "actuar")}</div>
      <div class="wiz-top no-print">${pasosMejHtml(a, sub)}</div>
      <div class="wiz-grid">
        <div class="wiz-main">
          <div class="wiz-titulo"><span class="wiz-paso">Mejora · paso ${sub} de 4 · Actuar</span><h1 class="page-title">${s.titulo}</h1></div>
          ${RENDER_MEJ[sub](a)}
          <div class="wiz-nav no-print">
            ${sub > 1 ? `<a class="btn" href="#/auditoria/${a.id}/mejora/${sub - 1}">← Anterior</a>` : `<a class="btn" href="#/auditoria/${a.id}/informe/5">← Informe</a>`}
            ${sub < 4 ? `<a class="btn btn--primary" href="#/auditoria/${a.id}/mejora/${sub + 1}">Siguiente: ${PASOS_MEJ[sub].corto} →</a>` : `<a class="btn btn--primary" href="#/auditorias">Mis auditorías</a>`}
          </div>
        </div>
        <aside class="wiz-side no-print" data-zona="resumen-mej">${resumenMej(a)}</aside>
      </div>`;
  }
  function refrescarMej() {
    const a = actualAud; if (!a) return;
    const z = $("[data-zona='resumen-mej']"); if (z) z.innerHTML = resumenMej(a);
    const av = $("[data-zona='avisos-mej']"); if (av) av.innerHTML = avisosMejHtml(a, subMejora);
    $$("[data-zr^='fz-']").forEach(el => { const x = buscaAcc(el.dataset.zr.slice(3)); if (x) el.innerHTML = fzBadge(x.accion); });
    const st = $$(".wiz-steps")[1]; if (st) st.outerHTML = pasosMejHtml(a, subMejora);
  }
  function crearSeguimientoUI(a, solo) {
    const s = L.crearSeguimiento(a, genId, hoy(), solo);
    datos.auditorias.push(s); a.mejora.seguimientoId = s.id; a.modificado = hoy();
    const plan = buscaPlan(a.planId);
    if (plan) {
      const mes = lleno(a.mejora.fechaSeguimiento) ? Number(a.mejora.fechaSeguimiento.slice(5, 7)) : 0;
      const en = Object.assign(L.nuevaEntrada(genId()), { titulo: "Seguimiento · " + (a.titulo || "auditoría").replace(/^Auditoría (interna|externa) · /, ""), tipo: "seguimiento", mapaId: a.origen.mapaId, riesgoIds: s.criterios.map(c => c.riesgoId).filter(Boolean), alcance: a.alcance, frecuencia: "puntual", responsables: a.ejecucion.auditores, meses: mes ? [mes] : [], auditoriaId: s.id });
      plan.entradas.push(en); plan.modificado = hoy(); s.entradaId = en.id;
    }
    guardar(true); location.hash = "#/auditoria/" + s.id;
    toast(`Auditoría de seguimiento creada con ${plural(s.criterios.length, "criterio", "criterios")}${plan ? " y añadida al Plan Anual" : ""}.`, 4500);
  }

  // ---------- Ponte a prueba (autoevaluación) ----------
  const respuestas = {};
  // Orden de las opciones barajado pero estable (para que la correcta no esté siempre en el mismo sitio)
  const barajar = (n, semilla) => { const a = Array.from({ length: n }, (_, i) => i); let s = semilla * 9301 + 49297; for (let i = n - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor(s / 233280 * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function renderPrueba(tema) {
    const Q = C.TEST.map((q, i) => Object.assign({ i }, q)).filter(q => !tema || q.t === tema);
    const hechas = Q.filter(q => q.i in respuestas), bien = hechas.filter(q => respuestas[q.i] === q.ok).length;
    view.innerHTML = `
      <h1 class="page-title">Ponte a prueba</h1>
      <p class="page-lead">${C.TEST.length} preguntas, cinco por cada tema de «Aprende». Toca la respuesta que creas correcta y lee la explicación.</p>
      <div class="tema-pills prueba-pills no-print"><a href="#/prueba" class="${!tema ? "actual" : ""}">Todas</a>${C.TEMAS.map(t => `<a href="#/prueba/${t.n}" class="pdca--${t.pdca}${tema === t.n ? " actual" : ""}" title="${esc(t.titulo)}">${t.n}</a>`).join("")}</div>
      <div class="marcador" data-zona="marcador">${marcadorHtml(Q)}</div>
      <div class="card">${Q.map(q => { const ord = barajar(q.o.length, q.i + 1), r = respuestas[q.i]; return `<div class="quiz-q" data-q="${q.i}">
        <p><span class="badge">Tema ${q.t}</span> <b>${esc(q.q)}</b></p>
        ${ord.map(j => `<button class="quiz-o${r != null ? (j === q.ok ? " quiz-o--ok" : j === r ? " quiz-o--mal" : "") : ""}" data-act="quiz" data-q="${q.i}" data-o="${j}">${esc(q.o[j])}</button>`).join("")}
        <p class="quiz-fb"${r == null ? " hidden" : ""}>${r != null ? `${r === q.ok ? "<b>¡Correcto!</b> " : "<b>No.</b> "}${esc(q.e)} <a href="#/aprende/${q.t}">Repasar el tema ${q.t}</a>` : ""}</p>
      </div>`; }).join("")}</div>
      <div class="toolbar no-print"><button class="btn" data-act="quiz-reset">Empezar de nuevo</button></div>`;
  }
  function marcadorHtml(Q) {
    const hechas = Q.filter(q => q.i in respuestas), bien = hechas.filter(q => respuestas[q.i] === q.ok).length;
    if (!hechas.length) return `<span class="field-sub">Aciertos a la primera: 0 de ${Q.length}</span>`;
    const p = bien / hechas.length;
    return `<span><b>${bien}</b> aciertos de ${hechas.length} respondidas (de ${Q.length})</span>${hechas.length === Q.length ? `<span class="sem-b sem-b--${p >= 0.8 ? "verde" : p >= 0.6 ? "ambar" : "rojo"}">${p >= 0.8 ? "¡Muy bien!" : p >= 0.6 ? "Bien: repasa los fallos" : "Repasa «Aprende»"}</span>` : ""}`;
  }

  // ---------- Ejemplos ----------
  function renderEjemplos() {
    view.innerHTML = `
      <h1 class="page-title">Ejemplos</h1>
      <p class="page-lead">Para ver cómo queda cada paso antes de hacerlo tú. Están aparte: puedes tocarlos, pero <b>no se guardan ni se mezclan con tus datos</b>. Si uno te sirve de punto de partida, pulsa «Copiar a mis datos».</p>
      <h2 class="sec-t">Ejemplo completo: admisión en Urgencias</h2>
      <p class="field-sub">Una auditoría clínica interna del proceso de admisión en Urgencias, desde que el paciente llega hasta la decisión de ingreso. Parte de un AMFE con 15 riesgos priorizados, los lleva a un Plan Anual con siete auditorías por subproceso y define la auditoría del proceso completo con 10 criterios. Recorre el ciclo completo: diseño, recogida, informe, plan de mejora y auditoría de seguimiento.</p>
      <div class="ej-grid">${C.EJEMPLOS.fichas.slice(0, 5).map(f => `<a class="ej-card" href="${f.href}"><b>${esc(f.t)}</b><span>${esc(f.s)}</span></a>`).join("")}</div>
      <h2 class="sec-t">Minicasos</h2>
      <div class="ej-grid">${C.EJEMPLOS.fichas.slice(5).map(f => `<a class="ej-card" href="${f.href}"><b>${esc(f.t)}</b><span>${esc(f.s)}</span></a>`).join("")}</div>
      ${practica("Las cifras de los ejemplos son ilustrativas. Adapta siempre los criterios y las puntuaciones a tu unidad.")}`;
  }

  // ---------- Aprende ----------
  function renderAprende(n) {
    const T = C.TEMAS, t = T.find(x => x.n === n);
    if (!t) {
      view.innerHTML = `
        <h1 class="page-title">Aprende</h1>
        <p class="page-lead">Seis temas, explicados fácil, para tener a mano mientras auditas. Cada uno corresponde a una parte del ciclo de mejora.</p>
        <div class="ciclo-wrap card">${cicloSVG()}<div><h2 class="sub-h">El ciclo de mejora continua</h2><p>Toda auditoría es una vuelta al ciclo <b class="t-P">Planificar</b> → <b class="t-H">Hacer</b> → <b class="t-V">Verificar</b> → <b class="t-A">Actuar</b>. Y cuando termina, la auditoría de seguimiento empieza la vuelta siguiente: por eso es un círculo y no una línea.</p></div></div>
        <div class="temas">${T.map(x => `<a class="tema-card pdca--${x.pdca}" href="#/aprende/${x.n}"><span class="tema-n">${x.n}</span><span><b>${x.titulo}</b><span>${x.sub}</span></span>${letraPDCA(x.pdca)}</a>`).join("")}</div>`;
      return;
    }
    const prev = T.find(x => x.n === n - 1), next = T.find(x => x.n === n + 1);
    view.innerHTML = `
      <div class="wiz-top no-print">${volver("#/aprende", "Aprende")}<div class="tema-pills">${T.map(x => `<a href="#/aprende/${x.n}" class="pdca--${x.pdca}${x.n === n ? " actual" : ""}">${x.n}</a>`).join("")}</div></div>
      <div class="wiz-titulo"><span class="wiz-paso">Tema ${n} de 6 · ${L.PDCA[t.pdca]}</span><h1 class="page-title">${t.titulo}</h1><p class="page-lead">${t.sub}</p></div>
      <div class="card minuto pdca--${t.pdca}"><h2 class="sub-h">En un minuto</h2><ul>${t.minuto.map(x => `<li>${x}</li>`).join("")}</ul></div>
      ${t.secciones.map((s, i) => `<details class="facil"${i === 0 ? " open" : ""}><summary>${s.t}</summary><div class="facil-body">${s.h}</div></details>`).join("")}
      ${box("ejemplo", "Minicaso", t.minicaso)}
      <div class="toolbar"><a class="btn" href="#/prueba/${n}">✓ Ponte a prueba con este tema</a>${t.practica.fuera ? `<a class="btn btn--primary" href="${t.practica.href}" target="_blank" rel="noopener">${t.practica.texto}</a>` : `<a class="btn btn--primary" href="${t.practica.href}">${t.practica.texto} →</a>`}</div>
      <div class="wiz-nav no-print">${prev ? `<a class="btn" href="#/aprende/${prev.n}">← ${prev.titulo}</a>` : "<span></span>"}${next ? `<a class="btn" href="#/aprende/${next.n}">${next.titulo} →</a>` : "<span></span>"}</div>`;
  }
  function cicloSVG() {
    const arco = (a0, a1, r) => { const p = a => [100 + r * Math.cos(a), 100 + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`; };
    const Q = [["P", "Planificar", -Math.PI / 2], ["H", "Hacer", 0], ["V", "Verificar", Math.PI / 2], ["A", "Actuar", Math.PI]];
    return `<svg class="ciclo" viewBox="0 0 200 200" role="img" aria-label="Ciclo PDCA: Planificar, Hacer, Verificar, Actuar">
      ${Q.map(([k, , a]) => `<path class="ciclo-arco pdca-stroke--${k}" d="${arco(a + 0.12, a + Math.PI / 2 - 0.12, 78)}"/>`).join("")}
      ${Q.map(([k, nom, a]) => { const m = a + Math.PI / 4, x = 100 + 78 * Math.cos(m), y = 100 + 78 * Math.sin(m); return `<circle class="pdca-fill--${k}" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="21"/><text class="ciclo-l" x="${x.toFixed(1)}" y="${(y + 6).toFixed(1)}" text-anchor="middle">${k}</text><text class="ciclo-t" x="${x.toFixed(1)}" y="${(y + (y > 100 ? 34 : -26)).toFixed(1)}" text-anchor="middle">${nom}</text>`; }).join("")}
      <text class="ciclo-c" x="100" y="96" text-anchor="middle">Mejora</text><text class="ciclo-c" x="100" y="112" text-anchor="middle">continua</text>
    </svg>`;
  }

  // ---------- Glosario ----------
  function renderGlosario() {
    view.innerHTML = `<h1 class="page-title">Glosario</h1><p class="page-lead">${C.GLOSARIO.length} términos en lenguaje llano.</p>
      <div class="input-wrap glos-buscar"><input id="glos-q" type="search" placeholder="Buscar término…" autocomplete="off" /></div>
      <dl class="glos-lista" id="glos-lista"></dl>`;
    const pinta = q => {
      const t = L.sinTildes(q);
      const l = C.GLOSARIO.filter(([a, b]) => !t || L.sinTildes(a + " " + b).includes(t)).sort((x, y) => x[0].localeCompare(y[0], "es"));
      $("#glos-lista").innerHTML = l.length ? l.map(([a, b]) => `<div class="glos-item"><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join("") : `<p class="placeholder-box">Sin resultados.</p>`;
    };
    pinta(""); $("#glos-q").addEventListener("input", e => pinta(e.target.value));
  }

  // ---------- PDF en iOS (sin librerías; mismo método que Tamaño Muestral e Indicadores) ----------
  // En iOS, window.print() no hace nada cuando la app está instalada en la pantalla de inicio.
  function esIOS() { return /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1); }
  function toast(msg, ms) {
    let t = $("#toast");
    if (!msg) { if (t) t.hidden = true; return; }
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.textContent = msg; t.hidden = false; clearTimeout(toast.h);
    if (ms) toast.h = setTimeout(() => { t.hidden = true; }, ms);
  }
  function pdfDesdeJPEGs(paginas, wPt, hPt) {
    const enc = new TextEncoder(), partes = [], offs = []; let pos = 0;
    const push = x => { const b = typeof x === "string" ? enc.encode(x) : x; partes.push(b); pos += b.length; };
    const obj = (n, cuerpo) => { offs[n] = pos; push(`${n} 0 obj\n`); cuerpo(); push("\nendobj\n"); };
    push("%PDF-1.4\n"); push(new Uint8Array([37, 226, 227, 207, 211, 10]));
    const n = paginas.length;
    obj(1, () => push("<< /Type /Catalog /Pages 2 0 R >>"));
    obj(2, () => push(`<< /Type /Pages /Kids [${paginas.map((_, i) => `${3 + i * 3} 0 R`).join(" ")}] /Count ${n} >>`));
    paginas.forEach((p, i) => {
      const pg = 3 + i * 3, cont = pg + 1, img = pg + 2, flujo = `q ${wPt} 0 0 ${hPt} 0 0 cm /Im${i} Do Q`;
      obj(pg, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${wPt} ${hPt}] /Resources << /XObject << /Im${i} ${img} 0 R >> >> /Contents ${cont} 0 R >>`));
      obj(cont, () => { push(`<< /Length ${flujo.length} >>\nstream\n${flujo}\nendstream`); });
      obj(img, () => { push(`<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.bytes.length} >>\nstream\n`); push(p.bytes); push("\nendstream"); });
    });
    const total = 3 + n * 3, xref = pos;
    let x = `xref\n0 ${total}\n0000000000 65535 f \n`;
    for (let k = 1; k < total; k++) x += String(offs[k]).padStart(10, "0") + " 00000 n \n";
    push(x + `trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(partes, { type: "application/pdf" });
  }
  async function generarPDF() {
    const ANCHO = 720, K = 2;
    const A4W = 595.28, A4H = 841.89, MARGEN_PT = 34;
    const PX = (A4W - 2 * MARGEN_PT) / ANCHO;
    const PW = A4W / PX, PH = A4H / PX, M = MARGEN_PT / PX, ALTO_UTIL = PH - 2 * M;
    const hoja = document.createElement("div");
    hoja.className = "view";
    hoja.style.cssText = `position:absolute;left:-20000px;top:0;width:${ANCHO}px;max-width:none;margin:0;padding:0;box-shadow:none;`;
    hoja.innerHTML = $("#view").innerHTML;
    $$(".informe-bar, [id]", hoja).forEach(el => { if (el.classList.contains("informe-bar")) el.remove(); else el.removeAttribute("id"); });
    $$("details", hoja).forEach(d => { d.open = true; });
    document.body.appendChild(hoja);
    try {
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const R0 = hoja.getBoundingClientRect();
      const ops = [], cortes = [0], bloques = [];
      const SIN_CORTE = ".print-head, .chart-card, tr, .formula, .box, .print-foot, h1, h2, h3, .ficha-cab, .leyenda";
      const rel = r => ({ x: r.left - R0.left, y: r.top - R0.top, w: r.width, h: r.height });
      const hayColor = c => !!c && c !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(c);
      const LADOS = ["Top", "Right", "Bottom", "Left"];
      const texto = (n, cs) => {
        const t = n.textContent, re = /\S+/g, rg = document.createRange(); let m;
        const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        while ((m = re.exec(t))) {
          rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
          const rs = rg.getClientRects(); if (!rs.length) continue;
          ops.push({ t: "txt", s: cs.textTransform === "uppercase" ? m[0].toUpperCase() : m[0], r: rel(rs[0]), font, col: cs.color, ls: cs.letterSpacing });
        }
      };
      const recorre = el => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        const r = rel(el.getBoundingClientRect());
        if (r.h > 0) cortes.push(r.y + r.h);
        if (el.matches(SIN_CORTE)) bloques.push([r.y, r.y + r.h]);
        if (el instanceof SVGSVGElement) { ops.push({ t: "svg", el, r }); return; }
        const bordes = LADOS.map(l => [parseFloat(cs[`border${l}Width`]) || 0, cs[`border${l}Color`]]);
        if (hayColor(cs.backgroundColor) || bordes.some(b => b[0] > 0 && hayColor(b[1]))) ops.push({ t: "caja", r, bg: cs.backgroundColor, rad: parseFloat(cs.borderTopLeftRadius) || 0, bordes });
        if (el.tagName === "LI") {
          const ol = el.parentElement.tagName === "OL", idx = Array.prototype.indexOf.call(el.parentElement.children, el) + 1;
          ops.push({ t: "txt", s: ol ? idx + "." : "•", r: { x: r.x - (ol ? 20 : 14), y: r.y, w: 16, h: parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4 }, font: `normal 700 ${cs.fontSize} ${cs.fontFamily}`, col: ol ? "#0b6f66" : cs.color, ls: "normal" });
        }
        for (const n of el.childNodes) {
          if (n.nodeType === 1) recorre(n);
          else if (n.nodeType === 3 && n.textContent.trim()) texto(n, cs);
        }
      };
      recorre(hoja);
      for (const op of ops.filter(o => o.t === "svg")) {
        const cl = op.el.cloneNode(true), orig = [op.el, ...op.el.querySelectorAll("*")], copia = [cl, ...cl.querySelectorAll("*")];
        orig.forEach((o, i) => { const cs = getComputedStyle(o); copia[i].setAttribute("style", ["fill", "stroke", "stroke-width", "stroke-dasharray", "font-family", "font-size", "font-weight"].map(p => `${p}:${cs.getPropertyValue(p)}`).join(";")); });
        cl.setAttribute("xmlns", "http://www.w3.org/2000/svg"); cl.setAttribute("width", op.r.w); cl.setAttribute("height", op.r.h);
        op.img = await new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(cl)); });
      }
      const alto = Math.ceil(R0.height);
      const parte = y => bloques.some(([a, b]) => a < y - 0.5 && y + 0.5 < b && b - a < ALTO_UTIL);
      const cands = [...new Set(cortes.map(c => Math.ceil(c)))].sort((a, b) => a - b);
      const pags = []; let y0 = 0;
      while (y0 < alto - 1) {
        const lim = y0 + ALTO_UTIL;
        if (lim >= alto) { pags.push([y0, alto]); break; }
        const y = cands.filter(c => c > y0 + 80 && c <= lim && !parte(c)).pop() || Math.floor(lim);
        pags.push([y0, y]); y0 = y;
      }
      const ponFuente = (ctx, f) => { ctx.font = "10px serif"; ctx.font = f; if (ctx.font === "10px serif") ctx.font = f.replace(/^(.*?\d+(\.\d+)?px).*$/, "$1 sans-serif"); };
      const caja = (ctx, op) => {
        const { x, y, w, h } = op.r, rad = Math.min(op.rad, w / 2, h / 2);
        const camino = () => { ctx.beginPath(); if (rad > 0 && ctx.roundRect) ctx.roundRect(x, y, w, h, rad); else ctx.rect(x, y, w, h); };
        if (hayColor(op.bg)) { ctx.fillStyle = op.bg; camino(); ctx.fill(); }
        const [t, d, b, l] = op.bordes;
        if (op.bordes.every(z => z[0] === t[0] && z[1] === t[1]) && t[0] > 0 && hayColor(t[1])) { ctx.strokeStyle = t[1]; ctx.lineWidth = t[0]; ctx.beginPath(); if (rad > 0 && ctx.roundRect) ctx.roundRect(x + t[0] / 2, y + t[0] / 2, w - t[0], h - t[0], Math.max(0, rad - t[0] / 2)); else ctx.rect(x + t[0] / 2, y + t[0] / 2, w - t[0], h - t[0]); ctx.stroke(); return; }
        const lado = (z, rx, ry, rw, rh) => { if (z[0] > 0 && hayColor(z[1])) { ctx.fillStyle = z[1]; ctx.fillRect(rx, ry, rw, rh); } };
        lado(t, x, y, w, t[0]); lado(b, x, y + h - b[0], w, b[0]); lado(l, x, y, l[0], h); lado(d, x + w - d[0], y, d[0], h);
      };
      const dibujaPaginas = conSVG => pags.map(([a, b]) => {
        const cv = document.createElement("canvas"); cv.width = Math.round(PW * K); cv.height = Math.round(PH * K);
        const ctx = cv.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.scale(K, K); ctx.translate(M, M - a);
        ctx.beginPath(); ctx.rect(-2, a, ANCHO + 4, b - a); ctx.clip();
        for (const op of ops) {
          if (op.r.y >= b || op.r.y + op.r.h <= a) continue;
          if (op.t === "caja") caja(ctx, op);
          else if (op.t === "svg") { if (conSVG && op.img) ctx.drawImage(op.img, op.r.x, op.r.y, op.r.w, op.r.h); }
          else {
            ponFuente(ctx, op.font); ctx.fillStyle = op.col; ctx.textBaseline = "alphabetic";
            if ("letterSpacing" in ctx) ctx.letterSpacing = op.ls && op.ls !== "normal" ? op.ls : "0px";
            const mt = ctx.measureText(op.s), asc = mt.fontBoundingBoxAscent || mt.actualBoundingBoxAscent || op.r.h * 0.8, desc = mt.fontBoundingBoxDescent || mt.actualBoundingBoxDescent || op.r.h * 0.2;
            ctx.fillText(op.s, op.r.x, op.r.y + (op.r.h - (asc + desc)) / 2 + asc);
          }
        }
        const url = cv.toDataURL("image/jpeg", 0.9), bin = atob(url.slice(url.indexOf(",") + 1)), bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return { bytes, w: cv.width, h: cv.height };
      });
      let paginas;
      try { paginas = dibujaPaginas(true); } catch (e) { paginas = dibujaPaginas(false); }
      return pdfDesdeJPEGs(paginas, A4W, A4H);
    } finally { hoja.remove(); }
  }
  let pdfListo = null;
  const rutaActual = () => location.hash.split("?")[0];
  const fechaArchivo = () => new Date().toLocaleDateString("es-ES").replace(/\//g, "-");
  function nombreArchivo(ext) {
    const base = actualMapa ? "Mapa de Riesgos " + (actualMapa.nombre || "").slice(0, 50) : actualAud ? (actualAud.titulo || "Auditoría").slice(0, 60) : actualPlan ? "Plan Anual de Auditorías " + (actualPlan.anio || "") : "Auditorías";
    return `${base.replace(/[\\/:*?"<>|%]/g, "").trim()} ${fechaArchivo()}.${ext}`;
  }
  function prepararPDF() {
    pdfListo = null; const r = rutaActual();
    setTimeout(() => { if (rutaActual() === r && document.body.classList.contains("ver-informe")) generarPDF().then(b => { pdfListo = { r, blob: b }; }).catch(() => {}); }, 300);
  }
  async function guardarPDF() {
    if (!document.body.classList.contains("ver-informe")) { irInforme(); toast("Preparando el PDF… pulsa de nuevo «Guardar / imprimir» en un momento.", 4000); return; }
    let blob = pdfListo && pdfListo.r === rutaActual() ? pdfListo.blob : null;
    if (!blob) { toast("Preparando el PDF…"); try { blob = await generarPDF(); pdfListo = { r: rutaActual(), blob }; } catch (e) { toast("No se ha podido crear el PDF.", 4000); return; } }
    const file = new File([blob], nombreArchivo("pdf"), { type: "application/pdf" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: file.name }); toast(""); }
      catch (e) { if (e && e.name === "AbortError") { toast(""); return; } toast("PDF listo: pulsa otra vez «Guardar / imprimir».", 4000); }
      return;
    }
    descargar(blob, file.name); toast("PDF descargado.", 3000);
  }
  function descargar(blob, nombre) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nombre;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 200);
  }
  function irInforme() { location.hash = (actualPlan ? `#/plan/${actualPlan.id}/6` : actualAud && faseAud === "diseno" ? `#/auditoria/${actualAud.id}/diseno/6` : actualAud && faseAud === "recogida" ? `#/auditoria/${actualAud.id}/recogida` : actualAud && faseAud === "informe" ? `#/auditoria/${actualAud.id}/informe/5` : actualAud && faseAud === "mejora" ? `#/auditoria/${actualAud.id}/mejora/4` : rutaActual()) + "?informe=1" + (faseAud === "informe" && docInforme === "resumen" ? "&doc=resumen" : ""); }
  function imprimir() {
    if (esIOS()) { guardarPDF(); return; }
    if (!document.body.classList.contains("ver-informe")) { irInforme(); setTimeout(() => window.print(), 400); return; }
    window.print();
  }
  function compartirOBajar(blob, nombre, msg) {
    const file = new File([blob], nombre, { type: blob.type });
    if (esIOS() && navigator.canShare && navigator.canShare({ files: [file] })) navigator.share({ files: [file], title: nombre }).catch(() => {});
    else { descargar(blob, nombre); toast(msg, 3000); }
  }

  // ---------- Copia de seguridad, importar y Excel ----------
  async function copiaSeguridad() {
    const contenido = JSON.stringify({ app: "auditorias", v: L.VERSION_DATOS, exportado: hoy(), mapas: datosUsuario.mapas, auditorias: datosUsuario.auditorias, planes: datosUsuario.planes }, null, 1);
    const nombre = `Auditorías copia ${new Date().toISOString().slice(0, 10)}.json`;
    const blob = new Blob([contenido], { type: "application/json" });
    const file = new File([blob], nombre, { type: "application/json" });
    if (esIOS() && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: nombre }); } catch (e) { if (e && e.name === "AbortError") return; }
    } else descargar(blob, nombre);
    datosUsuario.ultimaCopia = hoy(); guardar(true);
    toast("Copia guardada. Guárdala en un sitio seguro (Archivos, Drive, correo…).", 4500);
    if (rutaActual() === "#/" || rutaActual() === "") renderHome();
  }
  function importar(file) {
    const fr = new FileReader();
    fr.onload = () => {
      let s = null; try { s = L.sanearDatos(JSON.parse(fr.result), genId, hoy()); } catch (e) { /* */ }
      if (!s) { toast("Ese archivo no es una copia de Auditorías.", 4000); return; }
      // Nunca se importa nada con id de ejemplo
      [...s.mapas, ...s.auditorias, ...s.planes].forEach(x => { if (esIdEjemplo(x.id)) x.id = genId(); });
      const hay = datosUsuario.mapas.length + datosUsuario.auditorias.length + datosUsuario.planes.length;
      const resumen = `<b>${plural(s.mapas.length, "mapa de riesgos", "mapas de riesgos")}</b>, <b>${plural(s.planes.length, "plan anual", "planes anuales")}</b> y <b>${plural(s.auditorias.length, "auditoría", "auditorías")}</b>`;
      const aplicar = modo => {
        const r = modo === "sustituir" ? s : L.fusionar(datosUsuario, s);
        datosUsuario.mapas = r.mapas; datosUsuario.auditorias = r.auditorias; datosUsuario.planes = r.planes; guardar(true);
        toast(`Importados ${s.mapas.length} mapas, ${s.planes.length} planes y ${s.auditorias.length} auditorías.`, 4000);
        location.hash = "#/"; route();
      };
      if (!hay) { aplicar("sustituir"); return; }
      confirmar(`<p>La copia tiene ${resumen}.</p><p><b>Añadir</b> los junta con los tuyos (si uno está en los dos, se queda el más reciente): así se trabaja en equipo. Si prefieres <b>sustituir</b> todo lo tuyo por la copia, pulsa «Sustituir».</p>`, "Añadir a mis datos", () => aplicar("anadir"), { titulo: "Importar copia", peligro: false, otro: ["Sustituir", () => confirmar("<p>Se borrarán tus mapas, planes y auditorías actuales y se quedará solo lo de la copia. Esto no se puede deshacer.</p>", "Sustituir", () => aplicar("sustituir"))] });
    };
    fr.readAsText(file);
  }
  function exportarExcelMapa(m) {
    try {
      const bytes = window.Xlsx.construirLibroXlsx(L.hojasExcelMapa(m, new Date().toLocaleDateString("es-ES")));
      compartirOBajar(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), nombreArchivo("xlsx"), "Excel descargado.");
    } catch (e) { toast("No se ha podido crear el Excel.", 4000); }
  }

  // ---------- Confirmación ----------
  function confirmar(html, siTxt, alSi, o = {}) {
    const m = $("#modal-confirmar");
    $("#conf-titulo").textContent = o.titulo || "¿Seguro?";
    $("#conf-texto").innerHTML = html;
    const si = $("#btn-conf-si"), no = $("#btn-conf-no");
    si.textContent = siTxt; si.className = "btn " + (o.peligro === false ? "btn--primary" : "btn--peligro");
    let extra = $("#btn-conf-otro"); if (extra) extra.remove();
    if (o.otro) { extra = document.createElement("button"); extra.id = "btn-conf-otro"; extra.className = "btn"; extra.textContent = o.otro[0]; no.after(extra); extra.onclick = () => { m.hidden = true; o.otro[1](); }; }
    si.onclick = () => { m.hidden = true; alSi(); };
    no.onclick = () => { m.hidden = true; };
    m.hidden = false; si.focus();
  }

  // ---------- Copiar un ejemplo a mis datos ----------
  function copiarAMisDatos() {
    const ej = ejemplos();
    const copiaMapa = m => { const c = Object.assign(clon(m), { id: genId(), creado: hoy(), modificado: hoy() }); datosUsuario.mapas.push(c); return c; };
    if (actualMapa && esIdEjemplo(actualMapa.id)) {
      const c = copiaMapa(actualMapa); guardar(true); location.hash = "#/riesgos/" + c.id;
      toast("Copiado a tus mapas. Ya es tuyo: cámbialo a tu gusto.", 4000);
    } else if (actualPlan && esIdEjemplo(actualPlan.id)) {
      const p = Object.assign(clon(actualPlan), { id: genId(), creado: hoy(), modificado: hoy() });
      const nuevos = {};
      p.entradas.forEach(x => { x.auditoriaId = ""; const m = ej.mapas.find(y => y.id === x.mapaId); if (m) x.mapaId = nuevos[m.id] || (nuevos[m.id] = copiaMapa(m).id); });
      datosUsuario.planes.push(p); guardar(true); location.hash = `#/plan/${p.id}/1`;
      toast("Plan copiado a tus datos (con su Mapa de Riesgos).", 4000);
    } else if (actualAud && esIdEjemplo(actualAud.id)) {
      const a = Object.assign(clon(actualAud), { id: genId(), creado: hoy(), modificado: hoy() });
      const m = ej.mapas.find(x => x.id === a.origen.mapaId);
      if (m) a.origen.mapaId = copiaMapa(m).id;
      datosUsuario.auditorias.push(a); guardar(true); location.hash = "#/auditoria/" + a.id;
      toast(m ? "Copiada a tus auditorías (con su Mapa de Riesgos)." : "Copiada a tus auditorías.", 4000);
    }
  }

  // ---------- Enrutado ----------
  const NAV = [["", "Inicio"], ["riesgos", "Mapa de Riesgos"], ["plan", "Plan anual"], ["auditorias", "Auditorías"], ["ejemplos", "Ejemplos"], ["aprende", "Aprende"], ["prueba", "Ponte a prueba"], ["glosario", "Glosario"]];
  function buildNav() { $("#calc-nav").innerHTML = NAV.map(([r, t]) => `<a href="#/${r}" data-r="${r}">${t}</a>`).join(""); }
  function noEncontrado(que, href, txt) { view.innerHTML = `<div class="error-box">No se encuentra ${que} en este dispositivo.</div><p><a href="${href}">${txt}</a></p>`; }
  function route() {
    const [ruta, qs] = (location.hash.replace(/^#\/?/, "") || "").split("?");
    const partes = ruta.split("/"), q = new URLSearchParams(qs || "");
    const informe = q.get("informe") === "1";
    document.body.classList.toggle("ver-informe", informe);
    actualMapa = null; actualAud = null; actualPlan = null;
    if (rondasAbierto && location.hash !== rondasHash) { rondasAbierto = false; rondasCopia = null; rondasFuera.clear(); }
    if (acrAbierto && location.hash !== acrHash) { acrAbierto = false; acrCopia = null; acrFuera.clear(); }
    const idR = partes[1] || "";
    const ej = ejemplos();
    modoEjemplo = partes[0] === "ejemplos" || (esIdEjemplo(idR) && [...ej.mapas, ...ej.auditorias, ...ej.planes].some(x => x.id === idR));
    datos = modoEjemplo ? ej : datosUsuario;
    const banner = $("#banner-ejemplo");
    banner.hidden = !modoEjemplo || informe || partes[0] === "ejemplos";
    let navR = partes[0];
    if (partes[0] === "riesgos" && partes[1] === "nuevo") {
      const m = L.nuevoMapa(genId(), hoy()); borradores.set(m.id, m); abiertos.clear(); pegarAbierto = false; traerAbierto = false;
      history.replaceState(null, "", "#/riesgos/" + m.id); renderMapa(m);
    } else if (partes[0] === "riesgos" && partes[1]) {
      const m = buscaMapa(partes[1]) || borradores.get(partes[1]);
      if (m) { if (!actualMapaPrevio || actualMapaPrevio !== m.id) { abiertos.clear(); pegarAbierto = false; traerAbierto = false; filtroSub = ""; } actualMapaPrevio = m.id; renderMapa(m); }
      else noEncontrado("ese Mapa de Riesgos", "#/riesgos", "Ir a mis mapas");
    } else if (partes[0] === "riesgos") renderMapas();
    else if (partes[0] === "plan" && partes[1] === "nuevo") {
      const p = L.nuevoPlan(genId(), hoy()); p.anio = String(new Date().getFullYear() + (new Date().getMonth() >= 9 ? 1 : 0));
      const m = buscaMapa(q.get("mapa") || "");
      if (m) { p.ambito = m.unidad || ""; p.entradas = L.entradasDesdeMapa(m, "sub", genId); datos.planes.push(p); guardar(); }
      else borradores.set(p.id, p);
      history.replaceState(null, "", `#/plan/${p.id}/1`); renderPlan(p, 1);
    } else if (partes[0] === "plan" && partes[1]) {
      const p = buscaPlan(partes[1]) || borradores.get(partes[1]);
      if (p) renderPlan(p, informe ? 6 : Math.min(6, Math.max(1, parseInt(partes[2], 10) || 1)));
      else noEncontrado("ese plan", "#/plan", "Ir a mis planes");
    } else if (partes[0] === "plan") renderPlanes();
    else if (partes[0] === "auditoria" && partes[1] === "nueva") {
      const a = L.nuevaAuditoria(genId(), hoy());
      const m = buscaMapa(q.get("mapa") || "");
      if (m) {
        a.origen.tipo = "riesgos"; a.origen.mapaId = m.id;
        a.origen.riesgoIds = L.ordenarRiesgos(m.riesgos.filter(r => r.clave)).map(r => r.id);
        a.criterios = L.criteriosDesdeRiesgos(m, a.origen.riesgoIds, genId);
        a.unidad = m.unidad;
        datos.auditorias.push(a); guardar();
      } else borradores.set(a.id, a);
      history.replaceState(null, "", "#/auditoria/" + a.id); renderAuditoria(a); navR = "auditorias";
    } else if (partes[0] === "auditoria" && partes[1]) {
      const a = buscaAud(partes[1]) || borradores.get(partes[1]);
      if (!a) noEncontrado("esa auditoría", "#/auditorias", "Ir a mis auditorías");
      else if (partes[2] === "diseno") renderDiseno(a, informe ? 6 : Math.min(6, Math.max(1, parseInt(partes[3], 10) || 1)));
      else if (partes[2] === "recogida") renderRecogida(a, informe ? null : partes[3]);
      else if (partes[2] === "informe") renderInforme(a, informe ? 5 : Math.min(5, Math.max(1, parseInt(partes[3], 10) || 1)));
      else if (partes[2] === "mejora") renderMejora(a, informe ? 4 : Math.min(4, Math.max(1, parseInt(partes[3], 10) || 1)));
      else renderAuditoria(a);
      navR = "auditorias";
    } else if (partes[0] === "auditorias") renderAuditorias();
    else if (partes[0] === "ejemplos") renderEjemplos();
    else if (partes[0] === "aprende") renderAprende(parseInt(partes[1], 10) || 0);
    else if (partes[0] === "glosario") renderGlosario();
    else if (partes[0] === "prueba") renderPrueba(parseInt(partes[1], 10) || 0);
    else { renderHome(); navR = ""; }
    if (modoEjemplo) navR = "ejemplos";
    if (informe) { $$("details").forEach(d => { d.open = true; }); if (esIOS()) prepararPDF(); }
    $$("#calc-nav a").forEach(a => a.classList.toggle("active", a.dataset.r === navR));
    const act = $("#calc-nav a.active"); if (act && act.scrollIntoView) act.scrollIntoView({ block: "nearest", inline: "center" });
    window.scrollTo(0, 0);
  }
  let actualMapaPrevio = null;

  // ---------- Eventos ----------
  function tocado(obj) {
    obj.modificado = hoy();
    if (obj === actualMapa && !esVacioMapa(obj) && !datos.mapas.includes(obj)) { datos.mapas.push(obj); borradores.delete(obj.id); }
    if (obj === actualAud && !esVacioAud(obj) && !datos.auditorias.includes(obj)) { datos.auditorias.push(obj); borradores.delete(obj.id); }
    if (obj === actualPlan && !esVacioPlan(obj) && !datos.planes.includes(obj)) { datos.planes.push(obj); borradores.delete(obj.id); }
    guardar();
  }
  const buscaRiesgo = id => actualMapa && actualMapa.riesgos.find(r => r.id === id);
  const buscaCrit = id => actualAud && actualAud.criterios.find(c => c.id === id);
  const docObj = () => actualPlan || actualAud;
  const repintarDoc = () => actualPlan ? repintarPlan() : repintarAud();
  // Los cuadros de texto crecen con lo escrito
  function autoAlto(el) { el.style.height = "auto"; el.style.height = el.scrollHeight + 2 + "px"; }
  new MutationObserver(() => $$("textarea.txt-in", view).forEach(el => { if (!el.closest("[hidden]")) autoAlto(el); })).observe(view, { childList: true, subtree: true });

  view.addEventListener("input", e => {
    const t = e.target;
    if (t.matches("textarea.txt-in")) autoAlto(t);
    if (t.id === "pegar-txt") {
      const p = L.parsearTabla(t.value), z = $("[data-zona='pegar']"), b = $("[data-act='pegar-ok']");
      z.innerHTML = t.value.trim() ? (p.riesgos.length ? `<div class="note">ℹ Se ${p.riesgos.length === 1 ? "ha reconocido 1 riesgo" : "han reconocido " + p.riesgos.length + " riesgos"}${p.cabecera ? " (con fila de títulos)" : ""}. Primero: «${esc(L.corto(p.riesgos[0].fallo || p.riesgos[0].subproceso, 70))}».</div>` : "") + p.errores.map(x => `<div class="warn">⚠ ${esc(x)}</div>`).join("") : "";
      b.disabled = !p.riesgos.length; b.textContent = p.riesgos.length ? `Añadir ${plural(p.riesgos.length, "riesgo", "riesgos")}` : "Añadir los riesgos";
      return;
    }
    if (t.dataset.r) {
      const r = buscaRiesgo(t.dataset.r); if (!r) return;
      r[t.dataset.f] = t.value; tocado(actualMapa); refrescarMapa(r.id); return;
    }
    if (t.dataset.c) {
      const c = buscaCrit(t.dataset.c); if (!c) return;
      setPath(c, t.dataset.f, t.value); tocado(actualAud); refrescarAud(); return;
    }
    if (t.dataset.acc) {
      const x = buscaAcc(t.dataset.acc); if (!x) return;
      x[t.dataset.f] = t.value; tocado(actualAud); refrescarAud(); return;
    }
    if (t.dataset.rec) {
      const c = buscaCrit(t.dataset.rec), x = c && c.analisis.recs[Number(t.dataset.i)]; if (!x) return;
      x[t.dataset.f] = t.value; tocado(actualAud); refrescarAud(); return;
    }
    if (t.dataset.caso) {
      const c = buscaCrit(t.dataset.caso), x = c && c.recogida.casos[Number(t.dataset.i)]; if (!x) return;
      x[t.dataset.f] = t.value; tocado(actualAud); refrescarAud(); return;
    }
    if (t.dataset.e) {
      const e = buscaEnt(t.dataset.e); if (!e) return;
      e[t.dataset.f] = t.value; tocado(actualPlan); refrescarPlan(); return;
    }
    if (t.dataset.cp && docObj()) {
      const x = docObj().control[t.dataset.cp][Number(t.dataset.i)]; if (!x) return;
      x[t.dataset.f] = t.value; tocado(docObj()); return;
    }
    if (t.dataset.ch && docObj()) {
      const x = docObj().control.historial[Number(t.dataset.ch)]; if (!x) return;
      x[t.dataset.f] = t.value; tocado(docObj()); return;
    }
    if (t.dataset.k) {
      const obj = actualMapa || actualAud || actualPlan; if (!obj) return;
      setPath(obj, t.dataset.k, t.value); tocado(obj);
      if (actualMapa) refrescarMapa(); else if (actualAud) refrescarAud(); else refrescarPlan();
    }
  });
  view.addEventListener("change", e => {
    const f = e.target.closest("[data-filtro]");
    if (f) { if (f.dataset.filtro === "sub") filtroSub = f.value; else ordenMapa = f.value; repintarMapa(); return; }
    const ac = e.target.closest("[data-act-sel='acc-crit']");
    if (ac && actualAud) { const x = buscaAcc(ac.dataset.id); if (x) { x.critId = ac.value; tocado(actualAud); refrescarAud(); } return; }
    const ui = e.target.closest("[data-act-sel='usar-ind']");
    if (ui && actualAud && ui.value !== "") {
      const c = buscaCrit(ui.dataset.c), x = indImportados[Number(ui.value)]; if (!c || !x) return;
      const hacer = () => { Object.keys(c.ind).forEach(k => { if (x[k] !== undefined) c.ind[k] = x[k]; }); tocado(actualAud); repintarAud(); toast("Indicador importado. Revisa «cumple si…» y el estándar.", 3500); };
      if (lleno(c.ind.nombre)) confirmar("<p>Se sustituirá el indicador de este criterio por el importado.</p>", "Sustituir", hacer, { peligro: false }); else { hacer(); }
      return;
    }
    const se = e.target.closest("[data-act-sel='ent-add-rg']");
    if (se && actualPlan && se.value) {
      const en = buscaEnt(se.dataset.e); if (!en) return;
      en.riesgoIds.push(se.value); tocado(actualPlan); repintarPlan(); return;
    }
    const s = e.target.closest("[data-act-sel='aud-mapa']");
    if (s && actualAud) {
      const a = actualAud, m = buscaMapa(s.value);
      a.origen.mapaId = m ? m.id : ""; a.origen.riesgoIds = a.origen.riesgoIds.filter(id => m && m.riesgos.some(r => r.id === id));
      if (m && !a.criterios.length) {
        a.origen.riesgoIds = L.ordenarRiesgos(m.riesgos.filter(r => r.clave)).map(r => r.id);
        a.criterios = L.criteriosDesdeRiesgos(m, a.origen.riesgoIds, genId);
        if (a.criterios.length) toast(`Añadidos los ${a.criterios.length} hallazgos clave del mapa. Quita o añade los que quieras.`, 4000);
      }
      if (m && !lleno(a.unidad)) a.unidad = m.unidad;
      tocado(a); repintarAud();
    }
  });
  view.addEventListener("toggle", e => {
    if (e.target.matches && e.target.matches("details[data-recordar]") && !document.body.classList.contains("ver-informe")) escribir(KEY_FACIL, e.target.open ? "1" : "0");
  }, true);

  view.addEventListener("click", e => {
    const t = e.target; let b;
    if ((b = t.closest(".info-btn"))) { const h = $("#help-" + b.dataset.info); if (!h) return; const open = h.hidden; h.hidden = !open; b.setAttribute("aria-expanded", String(open)); return; }
    if ((b = t.closest("[data-pick]"))) {
      const obj = actualAud || actualMapa || actualPlan; if (!obj) return;
      setPath(obj, b.dataset.pick, b.dataset.v); tocado(obj);
      if (actualAud) repintarAud(); else if (actualMapa) repintarMapa(); else repintarPlan();
      return;
    }
    if ((b = t.closest("[data-epick]"))) {
      const en = buscaEnt(b.dataset.epick); if (!en) return;
      en[b.dataset.f] = b.dataset.v; tocado(actualPlan); repintarPlan(); return;
    }
    if ((b = t.closest("[data-emulti]"))) {
      const en = buscaEnt(b.dataset.emulti); if (!en) return;
      const i = en.tiposCriterio.indexOf(b.dataset.v); if (i < 0) en.tiposCriterio.push(b.dataset.v); else en.tiposCriterio.splice(i, 1);
      b.classList.toggle("active", i < 0); tocado(actualPlan); return;
    }
    if ((b = t.closest("[data-cpick]"))) {
      const c = buscaCrit(b.dataset.cpick); if (!c) return;
      setPath(c, b.dataset.f, b.dataset.v);
      if (b.dataset.f === "muestra.objetivo" || b.dataset.f === "muestra.metodo" || b.dataset.f === "muestra.umbral" || b.dataset.f === "muestra.beta") c.muestra.sorteo = [];
      tocado(actualAud); repintarAud(); return;
    }
    if ((b = t.closest("[data-cmulti]"))) {
      const c = buscaCrit(b.dataset.cmulti); if (!c) return;
      const arr = getPath(c, b.dataset.f), i = arr.indexOf(b.dataset.v); if (i < 0) arr.push(b.dataset.v); else arr.splice(i, 1);
      b.classList.toggle("active", i < 0); tocado(actualAud); refrescarAud(); return;
    }
    if ((b = t.closest("[data-eadd]"))) {
      const en = buscaEnt(b.dataset.eadd); if (!en) return;
      const ya = en.recursos.split(/[,;\n]/).map(x => L.sinTildes(x)); if (ya.includes(L.sinTildes(b.dataset.v))) return;
      en.recursos = (lleno(en.recursos) ? en.recursos.trim().replace(/[.,;]$/, "") + ", " : "") + b.dataset.v;
      const ta = $(`[data-e="${en.id}"][data-f="recursos"]`); if (ta) { ta.value = en.recursos; autoAlto(ta); }
      tocado(actualPlan); return;
    }
    if (!(b = t.closest("[data-act]"))) return;
    const a = b.dataset.act, id = b.dataset.id, m = actualMapa, au = actualAud;
    // --- Mapa de Riesgos ---
    if (a === "rg-toggle") {
      if (abiertos.has(id)) abiertos.delete(id); else abiertos.add(id);
      const card = $(`.rg[data-rid="${id}"]`); if (!card) return;
      const abierto = abiertos.has(id);
      $(".rg-body", card).hidden = !abierto; $(".rg-toggle", card).setAttribute("aria-expanded", abierto);
      if (abierto) $$("textarea.txt-in", card).forEach(autoAlto); else if (card.getBoundingClientRect().top < 60) card.scrollIntoView({ block: "start" });
    }
    else if (a === "rg-clave" && m) {
      const r = buscaRiesgo(id); if (!r) return;
      r.clave = !r.clave;
      if (r.clave) { abiertos.add(r.id); if (!lleno(r.motivo)) r.motivo = L.sugerirMotivo(m, r); }
      tocado(m); repintarMapa();
      if (r.clave) toast("Marcado como hallazgo clave. Completa la acción de mejora y la evidencia esperada.", 3500);
    }
    else if (a === "rg-add" && m) {
      const ult = m.riesgos[m.riesgos.length - 1];
      const r = Object.assign(L.nuevoRiesgo(genId()), { subproceso: filtroSub || (ult ? ult.subproceso : "") });
      m.riesgos.push(r); abiertos.add(r.id); tocado(m);
      if (ordenMapa !== "alta" && ordenMapa !== "ipr") ordenMapa = "ipr";
      renderMapa(m);
      const campoF = $(`.rg[data-rid="${r.id}"] [data-f="fallo"]`); if (campoF) { campoF.scrollIntoView({ block: "center" }); campoF.focus(); }
    }
    else if (a === "rg-del" && m) {
      const r = buscaRiesgo(id); if (!r) return;
      const quitar = () => { m.riesgos = m.riesgos.filter(x => x.id !== id); abiertos.delete(id); tocado(m); repintarMapa(); };
      if (["fallo", "efecto", "causa", "g", "o", "d", "accion"].some(k => lleno(r[k]))) confirmar(`<p>Se quitará el riesgo «${esc(L.corto(r.fallo || "sin describir", 80))}» de este mapa.</p>`, "Quitar", quitar, { titulo: "Quitar riesgo" }); else quitar();
    }
    else if (a === "rg-motivo" && m) {
      const r = buscaRiesgo(id); if (!r) return;
      const hacer = () => { r.motivo = L.sugerirMotivo(m, r); tocado(m); const ta = $(`.rg[data-rid="${id}"] [data-f="motivo"]`); if (ta) { ta.value = r.motivo; autoAlto(ta); } };
      if (lleno(r.motivo)) confirmar("<p>Se sustituirá el motivo que has escrito por uno propuesto a partir del IPR y la puntuación.</p>", "Sustituir", hacer, { peligro: false }); else hacer();
    }
    else if (a === "pegar-abrir") { pegarAbierto = true; traerAbierto = false; repintarMapa(); const ta = $("#pegar-txt"); if (ta) { ta.scrollIntoView({ block: "center" }); ta.focus(); } }
    else if (a === "pegar-cerrar") { pegarAbierto = false; repintarMapa(); }
    else if (a === "amfe-abrir") { traerAbierto = b.dataset.fuente === "mr" ? "mr" : "amfe"; amfeCopia = null; pegarAbierto = false; repintarTraer(); }
    /* [ind]
    if (a === "amfe-abrir") $("#input-amfe").click();
    [/ind] */
    else if (a === "amfe-cerrar") { traerAbierto = false; amfeCopia = null; repintarTraer(); }
    else if (a === "amfe-olvidar") { amfeCopia = null; repintarTraer(); }
    else if (a === "amfe-archivo") $("#input-amfe").click();
    else if (a === "amfe-traer") traerAmfe(Number(b.dataset.i));
    else if (a === "rondas-abrir") { rondasAbierto = b.dataset.modo === "plan" ? "plan" : "aud"; rondasHash = location.hash; rondasCopia = null; rondasFuera.clear(); repintarRondas(); }
    /* [ind]
    if (a === "rondas-abrir") $("#input-rondas").click();
    [/ind] */
    else if (a === "rondas-cerrar") { rondasAbierto = false; rondasCopia = null; rondasFuera.clear(); repintarRondas(); }
    else if (a === "rondas-olvidar") { rondasCopia = null; rondasFuera.clear(); repintarRondas(); }
    else if (a === "rondas-archivo") $("#input-rondas").click();
    else if (a === "rondas-pt") { const k = b.dataset.k; if (rondasFuera.has(k)) rondasFuera.delete(k); else rondasFuera.add(k); repintarRondas(); }
    else if (a === "rondas-traer") traerRondas(Number(b.dataset.i));
    else if (a === "acr-abrir") { acrAbierto = true; acrHash = location.hash; acrCopia = null; acrFuera.clear(); repintarAcr(); }
    /* [ind]
    if (a === "acr-abrir") $("#input-acr").click();
    [/ind] */
    else if (a === "acr-cerrar") { acrAbierto = false; acrCopia = null; acrFuera.clear(); repintarAcr(); }
    else if (a === "acr-olvidar") { acrCopia = null; acrFuera.clear(); repintarAcr(); }
    else if (a === "acr-archivo") $("#input-acr").click();
    else if (a === "acr-pt") { const k = b.dataset.k; if (acrFuera.has(k)) acrFuera.delete(k); else acrFuera.add(k); repintarAcr(); }
    else if (a === "acr-traer") traerAcr(Number(b.dataset.i));
    else if (a === "pegar-ok" && m) {
      const p = L.parsearTabla($("#pegar-txt").value); if (!p.riesgos.length) return;
      p.riesgos.forEach(x => m.riesgos.push(Object.assign(L.nuevoRiesgo(genId()), x)));
      pegarAbierto = false; tocado(m); ordenMapa = "ipr"; renderMapa(m);
      toast(`Añadidos ${plural(p.riesgos.length, "riesgo", "riesgos")}. Revisa que cada dato esté en su sitio.`, 4500);
    }
    else if (a === "mapa-excel" && m) exportarExcelMapa(m);
    else if (a === "mapa-dup") {
      const orig = buscaMapa(id); if (!orig) return;
      const c = Object.assign(clon(orig), { id: genId(), creado: hoy(), modificado: hoy(), nombre: (orig.nombre || "Mapa") + " (copia)" });
      datos.mapas.push(c); guardar(); location.hash = "#/riesgos/" + c.id; toast("Copia creada.", 2500);
    }
    else if (a === "mapa-del") {
      const x = buscaMapa(id) || (m && m.id === id ? m : null); if (!x) return;
      const usadas = datos.auditorias.filter(au2 => au2.origen.mapaId === x.id).length;
      confirmar(`<p>Se borrará el mapa «${esc(x.nombre || "sin nombre")}» con sus ${plural(x.riesgos.length, "riesgo", "riesgos")}. No se puede deshacer (salvo que tengas una copia de seguridad).</p>${usadas ? `<p>${usadas === 1 ? "Una auditoría lo usa" : usadas + " auditorías lo usan"} como origen: conservarán sus criterios, pero perderán el enlace al mapa.</p>` : ""}`, "Borrar", () => {
        datos.mapas = datos.mapas.filter(y => y.id !== x.id); borradores.delete(x.id); guardar(true);
        if (rutaActual() === "#/riesgos") renderMapas(); else location.hash = "#/riesgos";
        toast("Mapa borrado.", 2500);
      }, { titulo: "Borrar mapa" });
    }
    // --- Auditoría ---
    else if (a === "aud-riesgo" && au) {
      const mapa = buscaMapa(au.origen.mapaId), r = mapa && mapa.riesgos.find(x => x.id === id); if (!r) return;
      const i = au.origen.riesgoIds.indexOf(id);
      if (i < 0) {
        au.origen.riesgoIds.push(id);
        if (!au.criterios.some(c => c.riesgoId === id)) au.criterios.push(Object.assign(L.nuevoCriterio(genId()), { subproceso: r.subproceso, riesgoId: r.id, hallazgo: r.fallo }));
        tocado(au); repintarAud();
      } else {
        const c = au.criterios.find(x => x.riesgoId === id);
        const quitar = () => { au.origen.riesgoIds.splice(au.origen.riesgoIds.indexOf(id), 1); au.criterios = au.criterios.filter(x => x.riesgoId !== id); tocado(au); repintarAud(); };
        if (c && lleno(c.criterio)) confirmar(`<p>Se quitará también el criterio que has escrito para «${esc(L.corto(r.fallo, 70))}».</p>`, "Quitar", quitar, { titulo: "Quitar riesgo de la auditoría" }); else quitar();
      }
    }
    else if (a === "aud-lc" && au) {
      const aud = au;
      traerLC("Traer de Lectura Crítica", x => {
        const c = L.aplicarLectura(aud, x, genId); tocado(aud); repintarAud();
        toast(c ? (lleno(c.criterio) ? "Evidencia traída y criterio añadido. Ajusta el criterio para que se pueda comprobar." : "Evidencia traída. La lectura no tiene intervención en la PICO: escribe tú el criterio.") : "Evidencia traída. Ese criterio ya estaba en la auditoría.", 4500);
      });
    }
    else if (a === "crit-add" && au) {
      const c = L.nuevoCriterio(genId()); au.criterios.push(c); tocado(au); repintarAud();
      const f = $(`[data-c="${c.id}"][data-f="subproceso"]`); if (f) { f.scrollIntoView({ block: "center" }); f.focus(); }
    }
    else if (a === "crit-del" && au) {
      const c = buscaCrit(id); if (!c) return;
      const quitar = () => { au.criterios = au.criterios.filter(x => x.id !== id); if (c.riesgoId) au.origen.riesgoIds = au.origen.riesgoIds.filter(x => x !== c.riesgoId); tocado(au); repintarAud(); };
      if (lleno(c.criterio) || lleno(c.hallazgo)) confirmar("<p>Se quitará este criterio de la auditoría.</p>", "Quitar", quitar, { titulo: "Quitar criterio" }); else quitar();
    }
    else if ((a === "aud-sug-obj" || a === "aud-sug-tit") && au) {
      const k = a === "aud-sug-obj" ? "objetivoGeneral" : "titulo";
      const nuevo = a === "aud-sug-obj" ? L.sugerirObjetivo(au, buscaMapa(au.origen.mapaId)) : L.sugerirTitulo(au, buscaMapa(au.origen.mapaId));
      if (!nuevo) { toast("Escribe primero el proceso auditado.", 3000); return; }
      const hacer = () => { au[k] = nuevo; tocado(au); repintarAud(); toast("Revísalo y ajústalo a tu caso.", 3000); };
      if (lleno(au[k])) confirmar("<p>Se sustituirá lo que has escrito por el texto propuesto.</p>", "Sustituir", hacer, { peligro: false }); else hacer();
    }
    else if (a === "aud-dup") {
      const orig = buscaAud(id); if (!orig) return;
      const c = Object.assign(clon(orig), { id: genId(), creado: hoy(), modificado: hoy(), titulo: (orig.titulo || "Auditoría") + " (copia)" });
      c.criterios.forEach(x => { x.id = genId(); });
      datos.auditorias.push(c); guardar(); location.hash = "#/auditoria/" + c.id; toast("Copia creada.", 2500);
    }
    else if (a === "aud-del") {
      const x = buscaAud(id); if (!x) return;
      confirmar(`<p>Se borrará la auditoría «${esc(x.titulo || "sin título")}». No se puede deshacer (salvo que tengas una copia de seguridad).</p>`, "Borrar", () => {
        datos.auditorias = datos.auditorias.filter(y => y.id !== x.id); guardar(true); renderAuditorias(); toast("Auditoría borrada.", 2500);
      }, { titulo: "Borrar auditoría" });
    }
    // --- Plan Anual ---
    else if (a === "modo-import") { modoImport = b.dataset.v; repintarPlan(); }
    else if (a === "plan-importar" && actualPlan) {
      const mp = buscaMapa($("#plan-mapa").value); if (!mp) return;
      const nuevas = L.entradasDesdeMapa(mp, modoImport, genId);
      const ya = new Set(actualPlan.entradas.flatMap(x => x.riesgoIds));
      const utiles = nuevas.map(x => Object.assign(x, { riesgoIds: x.riesgoIds.filter(id => !ya.has(id)) })).filter(x => x.riesgoIds.length);
      if (!utiles.length) { toast("Esos hallazgos ya están en el plan.", 3000); return; }
      actualPlan.entradas.push(...utiles);
      if (!lleno(actualPlan.ambito) && lleno(mp.unidad)) actualPlan.ambito = mp.unidad;
      tocado(actualPlan); repintarPlan(); toast(`Añadidas ${plural(utiles.length, "auditoría", "auditorías")} al plan.`, 3000);
    }
    else if (a === "ent-add" && actualPlan) {
      const en = L.nuevaEntrada(genId()); actualPlan.entradas.push(en); tocado(actualPlan); repintarPlan();
      const f = $(`[data-e="${en.id}"][data-f="titulo"]`); if (f) { f.scrollIntoView({ block: "center" }); f.focus(); }
    }
    else if (a === "ent-del" && actualPlan) {
      const en = buscaEnt(id); if (!en) return;
      confirmar(`<p>Se quitará «${esc(en.titulo || "auditoría sin nombre")}» del plan, con su alcance, frecuencia y meses.</p>`, "Quitar", () => { actualPlan.entradas = actualPlan.entradas.filter(x => x.id !== id); tocado(actualPlan); repintarPlan(); }, { titulo: "Quitar del plan" });
    }
    else if (a === "ent-quitar-rg" && actualPlan) {
      const en = buscaEnt(b.dataset.e); if (!en) return;
      en.riesgoIds = en.riesgoIds.filter(x => x !== id); tocado(actualPlan); repintarPlan();
    }
    else if (a === "mes" && actualPlan) {
      const en = buscaEnt(b.dataset.e), mm = Number(b.dataset.m); if (!en) return;
      const i = en.meses.indexOf(mm); if (i < 0) en.meses.push(mm); else en.meses.splice(i, 1);
      en.meses.sort((x, y) => x - y); tocado(actualPlan); refrescarPlan();
    }
    else if (a === "bloq" && actualPlan) {
      const mm = Number(b.dataset.m), i = actualPlan.bloqueados.indexOf(mm);
      if (i < 0) actualPlan.bloqueados.push(mm); else actualPlan.bloqueados.splice(i, 1);
      actualPlan.bloqueados.sort((x, y) => x - y); tocado(actualPlan); refrescarPlan();
    }
    else if (a === "repartir" && actualPlan) {
      const P = actualPlan, hacer = todas => { const r = L.repartir(P, datos.mapas, todas); P.entradas.forEach(x => { if (r[x.id]) x.meses = r[x.id]; }); tocado(P); repintarPlan(); toast("Calendario repartido. Retócalo a mano si lo necesitas.", 3500); };
      if (P.entradas.some(x => !lleno(x.frecuencia))) toast("Las auditorías sin frecuencia se reparten como anuales.", 3500);
      const conMeses = P.entradas.filter(x => x.meses.length).length;
      if (!conMeses) hacer(true);
      else if (conMeses === P.entradas.length) confirmar("<p>Todas las auditorías tienen ya meses. ¿Rehacer el calendario completo?</p>", "Rehacer todo", () => hacer(true), { peligro: false, titulo: "Repartir automáticamente" });
      else confirmar(`<p>${plural(conMeses, "auditoría tiene", "auditorías tienen")} ya meses. Puedes repartir solo las que faltan (respetando las que ya están) o rehacer todo el calendario.</p>`, "Solo las que faltan", () => hacer(false), { peligro: false, titulo: "Repartir automáticamente", otro: ["Rehacer todo", () => hacer(true)] });
    }
    else if (a === "vaciar-crono" && actualPlan) confirmar("<p>Se quitarán todos los meses del calendario (se conservan las auditorías y sus datos).</p>", "Vaciar", () => { actualPlan.entradas.forEach(x => { x.meses = []; }); tocado(actualPlan); repintarPlan(); }, { titulo: "Vaciar el calendario" });
    else if (a === "cp-add" && docObj()) { docObj().control[b.dataset.k].push(L.nuevaPersona()); tocado(docObj()); repintarDoc(); }
    else if (a === "cp-del" && docObj()) { docObj().control[b.dataset.k].splice(Number(b.dataset.i), 1); tocado(docObj()); repintarDoc(); }
    else if (a === "ch-add" && docObj()) {
      const h = docObj().control.historial, ult = h[h.length - 1], n = ult ? parseInt(ult.edicion, 10) : -1;
      h.push({ edicion: String(Number.isFinite(n) ? n + 1 : h.length).padStart(2, "0"), fecha: new Date().toISOString().slice(0, 10), cambio: "" }); tocado(docObj()); repintarDoc();
    }
    else if (a === "ch-del" && docObj()) { docObj().control.historial.splice(Number(b.dataset.i), 1); tocado(docObj()); repintarDoc(); }
    // --- Diseño de la auditoría ---
    else if (a === "importar-ind") $("#input-ind").click();
    else if (a === "sug-ind" && au) {
      const c = buscaCrit(b.dataset.c); if (!c) return;
      const crit = String(c.criterio || c.hallazgo || "").trim().replace(/\.$/, "");
      if (!crit) { toast("Escribe primero el criterio en el Inicio.", 3000); return; }
      const hacer = () => {
        const f = crit.charAt(0).toLowerCase() + crit.slice(1);
        Object.assign(c.ind, { nombre: `% de casos revisados en los que ${f}`, numerador: `Casos en los que ${f}`, denominador: "Casos revisados en los que aplica el criterio", sentido: "mas", cumpleSi: crit + "." });
        if (!c.ind.tipo) c.ind.tipo = "proceso";
        tocado(au); repintarAud(); toast("Propuesta escrita. Cambia «casos» por lo que cuentas (pacientes, historias…) y pon el estándar.", 4500);
      };
      if (lleno(c.ind.nombre)) confirmar("<p>Se sustituirán el nombre, el numerador, el denominador y «cumple si…» que has escrito.</p>", "Sustituir", hacer, { peligro: false }); else hacer();
    }
    else if (a === "sug-metodo" && au) {
      const tipos = [...new Set(au.criterios.flatMap(c => c.evid.tipos))].map(k => L.EVIDENCIAS[k].nom.toLowerCase());
      const ins = [...new Set(au.criterios.flatMap(c => c.evid.instrumentos))].map(k => L.INSTRUMENTOS[k].nom.toLowerCase());
      const lq = au.criterios.some(c => c.muestra.objetivo === "decidir");
      au.diseno.metodologia = `Auditoría ${au.tipo === "externa" ? "externa" : "interna"} ${L.OBJETOS_AUD[au.objeto].nom.toLowerCase()}${tipos.length ? ", con evidencias " + tipos.join(", ") : ""}${ins.length ? ". Instrumentos: " + ins.join(", ") : ""}. Hoja de recogida de respuesta cerrada (Sí / No / No aplica) y casos elegidos al azar${lq ? "; para los criterios con plan LQAS se decide si se alcanza el estándar con pocos casos" : ""}.`;
      tocado(au); repintarAud();
    }
    else if (a === "add-equipo" && au) {
      const v = b.dataset.v; if (L.sinTildes(au.diseno.equipo).includes(L.sinTildes(v))) return;
      au.diseno.equipo = (lleno(au.diseno.equipo) ? au.diseno.equipo.replace(/\s+$/, "") + "\n" : "") + v;
      const ta = $('[data-k="diseno.equipo"]'); if (ta) { ta.value = au.diseno.equipo; autoAlto(ta); } tocado(au); refrescarAud();
    }
    else if (a === "sortear" && au) {
      const c = buscaCrit(b.dataset.c); if (!c) return;
      const r = L.calcMuestra(c), N = L.num(c.muestra.N);
      if (!Number.isFinite(N) || !Number.isFinite(r.n)) { toast("Para sortear hace falta el universo (N) y el número de casos.", 3500); return; }
      const rnd = () => { const x = new Uint32Array(1); crypto.getRandomValues(x); return x[0] / 4294967296; };
      const hacer = () => { c.muestra.sorteo = L.sortear(N, r.n, c.muestra.metodo, rnd); tocado(au); repintarAud(); toast(`Sorteados ${c.muestra.sorteo.length} casos. Saldrán en la hoja de recogida.`, 3500); };
      if (c.muestra.sorteo.length) confirmar("<p>Se hará un sorteo nuevo y se perderá el anterior.</p>", "Sortear de nuevo", hacer, { peligro: false }); else hacer();
    }
    else if (a === "par" && au) {
      const c = buscaCrit(b.dataset.c), p = c && c.piloto.pares[Number(b.dataset.i)]; if (!p) return;
      p[b.dataset.lado] = p[b.dataset.lado] === b.dataset.v ? "" : b.dataset.v; tocado(au); repintarAud();
    }
    else if (a === "pil-add" && au) { const c = buscaCrit(b.dataset.c); if (!c) return; const k = c.piloto.pares.length ? 1 : 5; for (let i = 0; i < k; i++) c.piloto.pares.push({ a: "", b: "" }); tocado(au); repintarAud(); }
    else if (a === "pil-del" && au) { const c = buscaCrit(b.dataset.c); if (!c) return; c.piloto.pares.pop(); tocado(au); repintarAud(); }
    else if (a === "hoja-word" && au) descargarWord(L.documentoHoja(au, new Date().toLocaleDateString("es-ES")), `Hoja de recogida ${(au.titulo || "").slice(0, 50).replace(/[\\/:*?"<>|%]/g, "")} ${fechaArchivo()}.docx`);
    else if (a === "hoja-pdf" && au) location.hash = `#/auditoria/${au.id}/diseno/6?informe=1&doc=hoja`;
    else if (a === "pe-word" && au) descargarWord(docPlanEsp(au), `Plan de auditoría ${(au.titulo || "").slice(0, 50).replace(/[\\/:*?"<>|%]/g, "")} ${fechaArchivo()}.docx`);
    else if (a === "roles-sug" && actualPlan) {
      let n = 0; ROLES.forEach(([k, , ph]) => { if (!lleno(actualPlan.roles[k])) { actualPlan.roles[k] = k === "coordinacion" && lleno(actualPlan.responsable) ? actualPlan.responsable + ": planifica, coordina y consolida los resultados." : ph; n++; } });
      tocado(actualPlan); repintarPlan(); toast(n ? "Propuesta añadida en los roles vacíos. Ajústala a tu unidad." : "Todos los roles tienen ya texto.", 3000);
    }
    else if (a === "comunicado" && actualPlan) { actualPlan.aprobacion.comunicado = b.dataset.v === "1"; tocado(actualPlan); repintarPlan(); }
    else if (a === "plan-word" && actualPlan) descargarWord(L.documentoPlan(actualPlan, datos.mapas, new Date().toLocaleDateString("es-ES")), nombreArchivo("docx"));
    else if (a === "plan-excel" && actualPlan) {
      try { const bytes = window.Xlsx.construirLibroXlsx(L.hojasExcelPlan(actualPlan, datos.mapas, new Date().toLocaleDateString("es-ES"))); compartirOBajar(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), nombreArchivo("xlsx"), "Excel descargado."); }
      catch (e2) { toast("No se ha podido crear el Excel.", 4000); }
    }
    else if (a === "crear-aud" && actualPlan) { const en = buscaEnt(b.dataset.e); if (en) crearAudDesdeEntrada(actualPlan, en); }
    else if (a === "plan-dup") {
      const orig = buscaPlan(id); if (!orig) return;
      const c = Object.assign(clon(orig), { id: genId(), creado: hoy(), modificado: hoy(), anio: orig.anio ? String(Number(orig.anio) + 1 || orig.anio) : "" });
      c.entradas.forEach(x => { x.id = genId(); x.auditoriaId = ""; });
      c.control = L.nuevoControl(); c.aprobacion = L.nuevoPlan("", "").aprobacion;
      datos.planes.push(c); guardar(); location.hash = `#/plan/${c.id}/1`; toast("Copia creada para el año siguiente (sin aprobación ni auditorías enlazadas).", 4000);
    }
    else if (a === "plan-del") {
      const x = buscaPlan(id) || (actualPlan && actualPlan.id === id ? actualPlan : null); if (!x) return;
      confirmar(`<p>Se borrará el Plan Anual ${esc(x.anio || "")} con sus ${plural(x.entradas.length, "auditoría programada", "auditorías programadas")}. Las auditorías que ya hayas creado desde él se conservan.</p>`, "Borrar", () => {
        datos.planes = datos.planes.filter(y => y.id !== x.id); borradores.delete(x.id); guardar(true);
        if (rutaActual() === "#/plan") renderPlanes(); else location.hash = "#/plan";
        toast("Plan borrado.", 2500);
      }, { titulo: "Borrar plan" });
    }
    else if (a === "mapa-word" && m) descargarWord(L.documentoMapa(m, new Date().toLocaleDateString("es-ES")), nombreArchivo("docx"), { horizontal: true });
    else if (a === "hito" && au) {
      const h = au.hitos[b.dataset.k]; if (!h) return;
      h.hecho = !h.hecho; if (h.hecho && !lleno(h.fecha)) h.fecha = new Date().toISOString().slice(0, 10);
      tocado(au); repintarAud();
    }
    // --- Mejora y seguimiento ---
    else if (a === "acc-traer" && au) { const n = L.accionesDesdeRecs(au, genId); au.mejora.acciones.push(...n); tocado(au); repintarAud(); toast(`Añadidas ${plural(n.length, "acción", "acciones")}. Completa plazos, recursos y, en el paso 2, la viabilidad.`, 4500); }
    else if (a === "acc-add" && au) { const nc = au.criterios.find(c => c.analisis.clasif === "noConformidad"); const x = Object.assign(L.nuevaAccion(genId()), { critId: nc ? nc.id : "" }); au.mejora.acciones.push(x); tocado(au); repintarAud(); const ta = $(`[data-acc="${x.id}"][data-f="accion"]`); if (ta) { ta.scrollIntoView({ block: "center" }); ta.focus(); } }
    else if (a === "acc-del" && au) { const x = buscaAcc(id); if (!x) return; const quitar = () => { au.mejora.acciones = au.mejora.acciones.filter(y => y !== x); tocado(au); repintarAud(); }; if (lleno(x.accion)) confirmar("<p>Se quitará esta acción del plan de mejora.</p>", "Quitar", quitar, { titulo: "Quitar acción" }); else quitar(); }
    else if (a === "acc-nivel" && au) { const x = buscaAcc(id); if (!x) return; x[b.dataset.f] = x[b.dataset.f] === b.dataset.v ? "" : b.dataset.v; tocado(au); repintarAud(); }
    else if (a === "acc-estado" && au) { const x = buscaAcc(id); if (!x) return; x.estado = b.dataset.v; tocado(au); repintarAud(); }
    else if (a === "crear-seg" && au) confirmar(`<p>Se creará una auditoría de seguimiento que hereda el diseño de esta (criterios, indicadores, evidencias y muestra), con la recogida de datos vacía.</p><p>¿Qué criterios incluye?</p>`, "Los que tienen hallazgos o acciones", () => crearSeguimientoUI(au, true), { titulo: "Auditoría de seguimiento", peligro: false, otro: ["Todos los criterios", () => crearSeguimientoUI(au, false)] });
    else if (a === "mej-word" && au) descargarWord(L.documentoPlanMejora(au, new Date().toLocaleDateString("es-ES"), hoyIso()), `Plan de mejora ${(au.titulo || "").slice(0, 50).replace(/[\\/:*?"<>|%]/g, "")} ${fechaArchivo()}.docx`);
    else if (a === "mej-excel" && au) {
      try { const bytes = window.Xlsx.construirLibroXlsx(L.hojasExcelMejora(au, new Date().toLocaleDateString("es-ES"), hoyIso())); compartirOBajar(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `Plan de mejora ${(au.titulo || "").slice(0, 50).replace(/[\\/:*?"<>|%]/g, "")} ${fechaArchivo()}.xlsx`, "Excel descargado."); }
      catch (e2) { toast("No se ha podido crear el Excel.", 4000); }
    }
    // --- Autoevaluación ---
    else if (a === "quiz") {
      const i = Number(b.dataset.q), j = Number(b.dataset.o), q = C.TEST[i]; if (i in respuestas) return;
      respuestas[i] = j; const caja = b.closest(".quiz-q");
      $$(".quiz-o", caja).forEach(x => { const k = Number(x.dataset.o); x.classList.toggle("quiz-o--ok", k === q.ok); x.classList.toggle("quiz-o--mal", k === j && j !== q.ok); });
      const fb = $(".quiz-fb", caja); fb.innerHTML = `${j === q.ok ? "<b>¡Correcto!</b> " : "<b>No.</b> "}${esc(q.e)} <a href="#/aprende/${q.t}">Repasar el tema ${q.t}</a>`; fb.hidden = false;
      const tema = parseInt((location.hash.split("/")[2] || ""), 10) || 0, Q = C.TEST.map((x, k) => Object.assign({ i: k }, x)).filter(x => !tema || x.t === tema);
      $("[data-zona='marcador']").innerHTML = marcadorHtml(Q);
    }
    else if (a === "quiz-reset") { Object.keys(respuestas).forEach(k => delete respuestas[k]); route(); }
    // --- Informe ---
    else if (a === "sug-interp" && au) {
      const c = buscaCrit(b.dataset.c); if (!c) return; const txt = L.interpretacionSugerida(c);
      if (!txt) { toast("Recoge primero los datos de este criterio.", 3000); return; }
      const hacer = () => { c.analisis.interpretacion = txt; if (!lleno(c.analisis.clasif)) c.analisis.clasif = L.clasificacionSugerida(c); tocado(au); repintarAud(); };
      if (lleno(c.analisis.interpretacion)) confirmar("<p>Se sustituirá la interpretación que has escrito.</p>", "Sustituir", hacer, { peligro: false }); else hacer();
    }
    else if (a === "rec-add" && au) { const c = buscaCrit(b.dataset.c); if (!c) return; c.analisis.recs.push(L.nuevaRec(genId())); tocado(au); repintarAud(); const ta = $$(`[data-rec="${c.id}"][data-f="texto"]`).pop(); if (ta) { ta.scrollIntoView({ block: "center" }); ta.focus(); } }
    else if (a === "rec-del" && au) {
      const c = buscaCrit(b.dataset.c), k = Number(b.dataset.i), x = c && c.analisis.recs[k]; if (!x) return;
      const quitar = () => { c.analisis.recs.splice(k, 1); tocado(au); repintarAud(); };
      if (lleno(x.texto)) confirmar("<p>Se quitará esta recomendación.</p>", "Quitar", quitar, { titulo: "Quitar recomendación" }); else quitar();
    }
    else if (a === "rec-prio" && au) { const c = buscaCrit(b.dataset.c), x = c && c.analisis.recs[Number(b.dataset.i)]; if (!x) return; x.prioridad = x.prioridad === b.dataset.v ? "" : b.dataset.v; tocado(au); repintarAud(); }
    else if ((a === "sug-resumen" || a === "sug-concl") && au) {
      const k = a === "sug-resumen" ? "resumen" : "conclusiones", txt = L.resumenEjecutivoSugerido(au);
      const hacer = () => { au.informe[k] = txt; tocado(au); repintarAud(); toast("Propuesta escrita: revísala y complétala.", 3000); };
      if (lleno(au.informe[k])) confirmar("<p>Se sustituirá el texto que has escrito.</p>", "Sustituir", hacer, { peligro: false }); else hacer();
    }
    else if (a === "doc-inf") { docInforme = b.dataset.v; repintarAud(); }
    else if (a === "inf-word" && au) descargarWord(L.documentoInforme(au, buscaMapa(au.origen.mapaId), buscaPlan(au.planId), new Date().toLocaleDateString("es-ES"), datos.auditorias.find(x => x.id === au.seguimientoDe)), `Informe ${(au.titulo || "").slice(0, 50).replace(/[\\/:*?"<>|%]/g, "")} ${fechaArchivo()}.docx`);
    else if (a === "resej-word" && au) descargarWord(L.documentoResumenEjecutivo(au, new Date().toLocaleDateString("es-ES")), `Resumen ejecutivo ${(au.titulo || "").slice(0, 50).replace(/[\\/:*?"<>|%]/g, "")} ${fechaArchivo()}.docx`);
    // --- Recogida de datos ---
    else if (a === "valor" && au) {
      const c = buscaCrit(b.dataset.c), j = Number(b.dataset.i), x = c && c.recogida.casos[j]; if (!x) return;
      x.valor = x.valor === b.dataset.v ? "" : b.dataset.v; tocado(au);
      const fila = b.closest(".caso"); if (fila) { fila.className = `caso caso--${x.valor || "vacio"}`; $$("[data-act='valor']", fila).forEach(z => z.classList.toggle("active", z.dataset.v === x.valor)); }
      refrescarAud();
      // Al marcar, si la fila siguiente queda tapada por la barra inferior, se acerca
      const sigFila = fila && fila.nextElementSibling;
      if (x.valor && sigFila && !c.recogida.casos[j + 1].valor && sigFila.getBoundingClientRect().bottom > window.innerHeight - 90) sigFila.scrollIntoView({ block: "center", behavior: "smooth" });
    }
    else if (a === "casos-preparar" && au) { const c = buscaCrit(b.dataset.c); if (!c) return; c.recogida.casos = L.prepararCasos(c, Number(b.dataset.n)); tocado(au); repintarAud(); }
    else if (a === "casos-add" && au) {
      const c = buscaCrit(b.dataset.c); if (!c) return; const n0 = c.recogida.casos.length, pref = n0 ? String(c.recogida.casos[n0 - 1].codigo).replace(/[-\s]?\d+$/, "") || "HC" : "HC";
      for (let k = 0; k < Number(b.dataset.n); k++) { const num = n0 + k + 1; c.recogida.casos.push(L.nuevoCaso(`${pref}-${String(num).padStart(2, "0")}`, c.muestra.sorteo[num - 1] ? String(c.muestra.sorteo[num - 1]) : "")); }
      tocado(au); repintarAud();
    }
    else if (a === "casos-limpiar" && au) { const c = buscaCrit(b.dataset.c); if (!c) return; c.recogida.casos = c.recogida.casos.filter(x => x.valor || lleno(x.obs)); tocado(au); repintarAud(); }
    else if (a === "sug-evid" && au) {
      const c = buscaCrit(b.dataset.c); if (!c) return;
      const hacer = () => { c.recogida.evidencia = L.sugerirEvidencia(c); tocado(au); repintarAud(); };
      if (lleno(c.recogida.evidencia)) confirmar("<p>Se sustituirá el texto que has escrito.</p>", "Sustituir", hacer, { peligro: false }); else hacer();
    }
    else if (a === "sug-coment" && au) {
      const c = buscaCrit(b.dataset.c); if (!c) return; const r = L.resultadoCriterio(c);
      if (!r.n) { toast("Valora primero algún caso.", 3000); return; }
      const hacer = () => { c.recogida.comentario = [r.conclusion, r.detalle].filter(lleno).join(" "); tocado(au); repintarAud(); };
      if (lleno(c.recogida.comentario)) confirmar("<p>Se sustituirá el comentario que has escrito.</p>", "Sustituir", hacer, { peligro: false }); else hacer();
    }
    else if (a === "res-word" && au) descargarWord(L.documentoResultados(au, new Date().toLocaleDateString("es-ES")), `Matriz de resultados ${(au.titulo || "").slice(0, 50).replace(/[\\/:*?"<>|%]/g, "")} ${fechaArchivo()}.docx`);
    else if (a === "res-excel" && au) {
      try { const bytes = window.Xlsx.construirLibroXlsx(L.hojasExcelRecogida(au, new Date().toLocaleDateString("es-ES"))); compartirOBajar(new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `Resultados ${(au.titulo || "").slice(0, 50).replace(/[\\/:*?"<>|%]/g, "")} ${fechaArchivo()}.xlsx`, "Excel descargado."); }
      catch (e2) { toast("No se ha podido crear el Excel.", 4000); }
    }
    // --- Generales ---
    else if (a === "informe") irInforme();
    else if (a === "volver") location.hash = rutaActual();
    else if (a === "imprimir") imprimir();
    else if (a === "copia") copiaSeguridad();
    else if (a === "importar") $("#input-importar").click();
  });
  $("#banner-copiar").addEventListener("click", copiarAMisDatos);
  $("#input-importar").addEventListener("change", e => { const f = e.target.files && e.target.files[0]; if (f) importar(f); e.target.value = ""; });
  $("#input-amfe").addEventListener("change", e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      let o = null; try { o = JSON.parse(fr.result); } catch (er) { /* */ }
      if (!traerAbierto) traerAbierto = "amfe";
      amfeCopia = FUENTES[traerAbierto].leer(o); repintarTraer();
      if (amfeCopia.error) toast("No se ha importado nada: revisa el aviso.", 4000);
    };
    fr.readAsText(f);
  });
  $("#input-rondas").addEventListener("change", e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      let o = null; try { o = JSON.parse(fr.result); } catch (er) { /* */ }
      if (!rondasAbierto) { rondasAbierto = actualPlan ? "plan" : "aud"; rondasHash = location.hash; }
      rondasCopia = L.leerRondas(o); rondasFuera.clear(); repintarRondas();
      if (rondasCopia.error) toast("No se ha importado nada: revisa el aviso.", 4000);
    };
    fr.readAsText(f);
  });
  $("#input-acr").addEventListener("change", e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      let o = null; try { o = JSON.parse(fr.result); } catch (er) { /* */ }
      if (!acrAbierto) { acrAbierto = true; acrHash = location.hash; }
      acrCopia = L.analisisDeAcr(o); acrFuera.clear(); repintarAcr();
      if (acrCopia.error) toast("No se ha importado nada: revisa el aviso.", 4000);
    };
    fr.readAsText(f);
  });
  $("#input-ind").addEventListener("change", e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      let l = null; try { l = L.indicadoresDeCopia(JSON.parse(fr.result)); } catch (er) { /* */ }
      if (!l || !l.length) { toast("Ese archivo no es una copia de la app Indicadores (o no tiene indicadores con nombre).", 4500); return; }
      indImportados = l; if (actualAud) repintarAud(); toast(`Cargados ${plural(l.length, "indicador", "indicadores")}. Elige en cada criterio cuál usar.`, 4000);
    };
    fr.readAsText(f);
  });

  // Imprimir: abrir los desplegables y restaurarlos después
  let cerrados = [];
  window.addEventListener("beforeprint", () => { cerrados = $$("details").filter(d => !d.open); cerrados.forEach(d => { d.open = true; }); });
  window.addEventListener("afterprint", () => { cerrados.forEach(d => { d.open = false; }); cerrados = []; });

  // ---------- «Traer de Lectura Crítica» (mismo código en AMFE, DAFO, Auditorías e Indicadores) ----------
  // traerLC(título de la ventana, función que recibe la lectura elegida). Lee el paquete de este navegador
  // o, si no hay, ofrece cargar la copia .json de Lectura Crítica (#input-lc).
  let lcCargadas = null, lcPendiente = null;
  function traerLC(titulo, alElegir) {
    lcPendiente = { titulo, alElegir };
    // [eco]
    let r = null; try { r = L.lecturasDe(JSON.parse(leer("lecturacritica-intercambio") || "null")); } catch (e) { /* */ }
    const lista = lcCargadas || (r && r.lecturas && r.lecturas.length ? r.lecturas : null);
    if (lista) { elegirLC(lista); return; }
    confirmar(r && r.error === "version" ? "<p>Las lecturas de este navegador son de una versión de <b>Lectura Crítica</b> que esta app aún no sabe leer.</p>"
      : "<p>No hay lecturas de la app <b>Lectura Crítica</b> en este navegador.</p><p>Si las tienes en otro dispositivo, carga su copia de seguridad (.json).</p>",
      "Cargar una copia", () => $("#input-lc").click(), { titulo, peligro: false });
    // [/eco]
    /* [ind]
    if (lcCargadas) { elegirLC(lcCargadas); return; }
    $("#input-lc").click();
    [/ind] */
  }
  function elegirLC(lista) {
    const { titulo, alElegir } = lcPendiente, cortar = (s, n) => s.length > n ? s.slice(0, n - 1) + "…" : s;
    const fila = (x, i) => `<label class="lc-op"><input type="radio" name="lc-sel" value="${i}"${i ? "" : " checked"} /><span><b>${esc(cortar(x.titulo || L.referenciaLC(x), 110))}</b>`
      + `<small>${esc([x.tipoNombre, x.anio].filter(lleno).join(" · "))}${x.tipoNombre || x.anio ? " · " : ""}${x.decision ? `<span class="lc-dec lc-dec--${x.decision}">${L.DECISION_LC[x.decision]}</span>` : "Sin decisión"}</small></span></label>`;
    confirmar(`<p>Elige la lectura cuya evidencia quieres traer. Se copia como texto, que luego puedes cambiar.</p><div class="lc-lista">${lista.map(fila).join("")}</div>`, "Traer", () => {
      const s = document.querySelector('input[name="lc-sel"]:checked'), x = s && lista[Number(s.value)]; if (!x) return;
      if (x.decision === "aplicar") { alElegir(x); return; }
      confirmar(`<p>La decisión de esta lectura fue <b>${x.decision ? L.DECISION_LC[x.decision].toLowerCase() : "ninguna todavía"}</b>: con ella sola no basta para cambiar la práctica.</p><p>¿Traerla de todos modos?</p>`,
        "Traer igualmente", () => alElegir(x), { titulo, peligro: false });
    }, { titulo, peligro: false });
  }
  $("#input-lc").addEventListener("change", e => {
    const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return;
    const fr = new FileReader();
    fr.onload = () => {
      let r = null; try { r = L.lecturasDe(JSON.parse(fr.result)); } catch (er) { /* */ }
      if (!r || r.error) { toast(r && r.error === "version" ? "Esa copia es de una versión de Lectura Crítica que esta app aún no sabe leer." : "Ese archivo no es una copia de la app Lectura Crítica.", 4500); return; }
      if (!r.lecturas.length) { toast("Esa copia no tiene lecturas con título o referencia.", 4000); return; }
      lcCargadas = r.lecturas; if (lcPendiente) elegirLC(lcCargadas);
    };
    fr.readAsText(f);
  });

  // ---------- Tema ----------
  function setTema(t) {
    document.documentElement.setAttribute("data-tema", t);
    const m = $("#meta-theme-color"); if (m) m.content = t === "claro" ? "#f0f7fb" : "#0d1b2a";
  }
  setTema(document.documentElement.getAttribute("data-tema") || "claro");
  $("#btn-tema").addEventListener("click", () => {
    const t = document.documentElement.getAttribute("data-tema") === "oscuro" ? "claro" : "oscuro";
    setTema(t); escribir("auditorias-tema", t);
  });
  if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", ev => { if (!leer("auditorias-tema")) setTema(ev.matches ? "oscuro" : "claro"); });

  // ---------- Modales ----------
  const KEY_BIENV = "auditorias-bienvenida-vista";
  const mb = $("#modal-bienvenida"), ma = $("#modal-acerca");
  const vista = leer(KEY_BIENV);
  if (!vista) mb.hidden = false;
  $("#btn-bienv-ok").addEventListener("click", () => { if ($("#modal-no-repetir").checked) escribir(KEY_BIENV, "1"); mb.hidden = true; });
  $("#btn-acerca").addEventListener("click", () => { ma.hidden = false; });
  $("#btn-acerca-cerrar").addEventListener("click", () => { ma.hidden = true; });
  ma.addEventListener("click", e => { if (e.target === ma) ma.hidden = true; });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { ma.hidden = true; $("#modal-confirmar").hidden = true; } });

  // ---------- Versiones y novedades ----------
  const KEY_VERSION = "auditorias-version-vista";
  const listaCambios = n => `<div class="version-item"><div class="version-cab"><b>${esc(n.titulo)}</b><span class="version-tag">v${esc(n.version)} · ${esc(n.fecha)}</span></div><ul>${n.cambios.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>`;
  $("#historial-versiones").innerHTML = NOVEDADES.map(listaCambios).join("");
  $("#about-version").textContent = $("#footer-version").textContent = `Versión ${APP_VERSION}`;
  const mn = $("#modal-novedades");
  $("#btn-novedades-ok").addEventListener("click", () => { mn.hidden = true; escribir(KEY_VERSION, APP_VERSION); });
  (function gestionarNovedades() {
    const vistaV = leer(KEY_VERSION);
    if (vistaV === APP_VERSION) return;
    if (!vistaV && !vista) { escribir(KEY_VERSION, APP_VERSION); return; }
    const idx = NOVEDADES.findIndex(n => n.version === vistaV);
    const nuevas = idx > 0 ? NOVEDADES.slice(0, idx) : [NOVEDADES[0]];
    $("#novedades-sub").textContent = nuevas.length > 1 ? "Esto es lo nuevo desde tu última visita" : "Gracias por mantener la app al día";
    $("#novedades-body").innerHTML = nuevas.map(listaCambios).join("");
    if (mb.hidden) mn.hidden = false;
  })();

  // ---------- Service worker y aviso de nueva versión ----------
  let actualizando = false;
  function avisoActualizacion(reg) {
    if ($("#update-banner")) return;
    const b = document.createElement("div");
    b.id = "update-banner"; b.className = "update-banner no-print"; b.setAttribute("role", "status");
    b.innerHTML = "<span>Nueva versión disponible</span><button type=\"button\">Actualizar</button>";
    b.querySelector("button").addEventListener("click", () => { guardar(true); actualizando = true; if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" }); b.remove(); });
    document.body.appendChild(b);
  }
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").then(reg => {
      if (reg.waiting && navigator.serviceWorker.controller) avisoActualizacion(reg);
      reg.addEventListener("updatefound", () => {
        const nw = reg.installing; if (!nw) return;
        nw.addEventListener("statechange", () => { if (nw.state === "installed" && navigator.serviceWorker.controller) avisoActualizacion(reg); });
      });
    }).catch(() => {});
    let recargando = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (recargando || !actualizando) return; recargando = true; location.reload(); });
  }

  // ---------- Instalar como aplicación ----------
  let avisoInstalar = null;
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); avisoInstalar = e; const b = $("#btn-instalar"); if (b) b.hidden = false; });
  $("#btn-instalar").addEventListener("click", async () => { if (!avisoInstalar) return; avisoInstalar.prompt(); try { await avisoInstalar.userChoice; } catch (e) { /* */ } avisoInstalar = null; $("#btn-instalar").hidden = true; });
  window.addEventListener("appinstalled", () => { const b = $("#btn-instalar"); if (b) b.hidden = true; });
  if (matchMedia("(display-mode: standalone)").matches || navigator.standalone) { const i = $("#instalar-bloque"); if (i) i.classList.add("instalada"); }

  window.Auditorias = { generarPDF, datos: () => datos };   // solo para pruebas desde la consola

  // ---------- Arranque ----------
  buildNav();
  window.addEventListener("hashchange", route);
  route();
})();
