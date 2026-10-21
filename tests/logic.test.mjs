// Pruebas de la lógica pura y del Excel · node tests/logic.test.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const L = require("../logic.js");
const X = require("../xlsx.js");

let ok = 0, fallos = 0;
const t = (nombre, cond) => { if (cond) ok++; else { fallos++; console.error("✗ " + nombre); } };
const eq = (nombre, a, b) => t(`${nombre} (esperado ${JSON.stringify(b).slice(0, 300)}, obtenido ${JSON.stringify(a).slice(0, 300)})`, JSON.stringify(a) === JSON.stringify(b));
let n = 0; const gid = () => "id" + (++n);

// IPR
eq("IPR 7×7×7", L.ipr(7, 7, 7), 343);
eq("IPR con textos", L.ipr("8", "7", "6"), 336);
eq("IPR fuera de rango", L.ipr(11, 7, 7), null);
eq("IPR decimal", L.ipr("7,5", 7, 7), null);
eq("IPR vacío", L.ipr("", 7, 7), null);
eq("Nivel 343", L.nivelIPR(343).k, "muyalto");
eq("Nivel 216", L.nivelIPR(216).k, "alto");
eq("Nivel 180", L.nivelIPR(180).k, "medio");
eq("Nivel 50", L.nivelIPR(50).k, "bajo");
eq("Nivel nulo", L.nivelIPR(null), null);

// Mapa y orden
const mapa = L.nuevoMapa("m1", "2026-10-21");
const R = (fallo, g, o, d, sub = "Triaje") => Object.assign(L.nuevoRiesgo(gid()), { fallo, g: String(g), o: String(o), d: String(d), subproceso: sub });
mapa.riesgos = [R("Pulsera", 6, 6, 5), R("Constantes", 7, 7, 7), R("Prioridad", 8, 7, 6), R("Sin puntuar", "", "", ""), R("Fragilidad", 7, 6, 6, "Recepción")];
mapa.riesgos[3].g = mapa.riesgos[3].o = mapa.riesgos[3].d = "";
eq("Orden por IPR", L.ordenarRiesgos(mapa.riesgos).map(r => r.fallo), ["Constantes", "Prioridad", "Fragilidad", "Pulsera", "Sin puntuar"]);
eq("Orden por subproceso", L.ordenarRiesgos(mapa.riesgos, "sub").map(r => r.fallo), ["Fragilidad", "Constantes", "Prioridad", "Pulsera", "Sin puntuar"]);
const P = L.puestos(mapa.riesgos);
eq("Puesto 1", P[mapa.riesgos[1].id], 1);
eq("Puesto sin IPR", P[mapa.riesgos[3].id], null);
const res = L.resumenMapa(mapa);
eq("Resumen n", res.n, 5); eq("Resumen con IPR", res.conIPR, 4); eq("Resumen max", res.maxIPR, 343);
eq("Resumen niveles", res.porNivel, { muyalto: 2, alto: 1, medio: 1, bajo: 0 });

// Avisos
let A = L.avisosMapa(mapa);
t("Aviso sin puntuar", A.some(a => /sin puntuar/.test(a.texto)));
t("Aviso marcar clave", A.some(a => /Marca con ★/.test(a.texto)));
mapa.riesgos[0].clave = true;   // elige el de IPR más bajo y deja fuera 343
A = L.avisosMapa(mapa);
t("Aviso elegir bajo dejando alto", A.some(a => a.nivel === "warn" && /dejas fuera/.test(a.texto)));
t("Aviso clave incompleto", A.some(a => /hallazgo clave no tiene/.test(a.texto)));
mapa.riesgos[0].motivo = "Incidentes recientes";
t("Con motivo no avisa de elegir bajo", !L.avisosMapa(mapa).some(a => /dejas fuera/.test(a.texto)));
const grave = R("Lado equivocado", 10, 2, 3); mapa.riesgos.push(grave);
t("Aviso gravedad alta con IPR bajo", L.avisosMapa(mapa).some(a => a.riesgo === grave.id));
mapa.riesgos.push(R("constantes", 5, 5, 5));
t("Aviso duplicado", L.avisosMapa(mapa).some(a => /repetido/.test(a.texto)));
const malo = R("Malo", 12, 2, 3); mapa.riesgos.push(malo);
t("Aviso fuera de rango", L.avisosMapa(mapa).some(a => a.nivel === "error"));
t("Motivo sugerido", /IPR 343 \(puesto 1/.test(L.sugerirMotivo(mapa, mapa.riesgos[1])));

// Pegar desde Excel
let p = L.parsearTabla("Subproceso\tFallo\tEfecto\tCausa\tG\tO\tD\tIPR\nTriaje\tOmisión de constantes\tPrioridad errónea\tPrisa\t7\t7\t7\t343\nSala\tEspera\t\t\t7\t7\t6\t294");
eq("Pegar con cabecera: filas", p.riesgos.length, 2); t("Pegar: detecta cabecera", p.cabecera);
eq("Pegar: campos", [p.riesgos[0].subproceso, p.riesgos[0].fallo, p.riesgos[0].g, p.riesgos[1].d], ["Triaje", "Omisión de constantes", "7", "6"]);
p = L.parsearTabla("Triaje;Omisión;Efecto;Causa;7;7;7");
eq("Pegar sin cabecera con ;", [p.riesgos.length, p.cabecera, p.riesgos[0].d], [1, false, "7"]);
p = L.parsearTabla("Fallo\tG\tO\tD\nCaída\t8\t5\t4");
eq("Pegar cabecera en otro orden", [p.riesgos[0].fallo, p.riesgos[0].g, p.riesgos[0].subproceso], ["Caída", "8", ""]);
p = L.parsearTabla("solo texto sin columnas");
t("Pegar sin columnas da error", p.errores.length && !p.riesgos.length);
p = L.parsearTabla("Triaje\tX\t\t\t15\t2\t2");
t("Pegar avisa de G fuera de rango", p.errores.length === 1 && p.riesgos.length === 1);

// Auditoría
const aud = L.nuevaAuditoria("a1", "2026-10-21");
aud.origen = { tipo: "riesgos", mapaId: "m1", riesgoIds: [mapa.riesgos[0].id, mapa.riesgos[1].id], detalle: "" };
aud.criterios = L.criteriosDesdeRiesgos(mapa, aud.origen.riesgoIds, gid);
eq("Criterios desde riesgos (orden IPR)", aud.criterios.map(c => c.hallazgo), ["Constantes", "Pulsera"]);
aud.proceso = "la atención en Urgencias"; aud.unidad = "el Servicio de Urgencias";
const obj = L.sugerirObjetivo(aud, mapa);
t("Objetivo sugerido", /^Evaluar el grado de cumplimiento y la eficacia de las medidas de seguridad implantadas en la atención en Urgencias en el Servicio de Urgencias, centrándose en el subproceso de triaje, para verificar/.test(obj));
eq("deArt el", L.deArt("el proceso de admisión"), "del proceso de admisión");
eq("deArt la", L.deArt("La atención"), "de la atención");
eq("deArt sin artículo", L.deArt("Conciliación de la medicación"), "de Conciliación de la medicación");
eq("deArt sigla", L.deArt("UCI pediátrica"), "de UCI pediátrica");
eq("Título sugerido", L.sugerirTitulo(Object.assign(L.nuevaAuditoria("t", ""), { proceso: "el proceso de admisión", unidad: "Urgencias" }), null), "Auditoría interna del proceso de admisión en Urgencias");
eq("Título sin repetir unidad", L.sugerirTitulo(Object.assign(L.nuevaAuditoria("t", ""), { proceso: "el proceso de admisión en Urgencias", unidad: "Urgencias" }), null), "Auditoría interna del proceso de admisión en Urgencias");
eq("Título desde el mapa", L.sugerirTitulo(L.nuevaAuditoria("t", ""), Object.assign(L.nuevoMapa("m", ""), { nombre: "Hospitalización Médica" })), "Auditoría interna de Hospitalización Médica");
eq("Progreso inicio", L.progresoInicio(aud).hechos, 3);

// Siguiente paso
const vacio = { mapas: [], auditorias: [] };
eq("Siguiente: empezar", L.siguientePaso(vacio).k, "empezar");
const m2 = L.nuevoMapa("m2", ""); m2.riesgos = [R("a", "", "", "")]; m2.riesgos[0].g = "";
eq("Siguiente: puntuar", L.siguientePaso({ mapas: [m2], auditorias: [] }).k, "puntuar");
const m3 = L.nuevoMapa("m3", ""); m3.riesgos = [R("a", 5, 5, 5), R("b", 6, 6, 6), R("c", 7, 7, 7)];
eq("Siguiente: elegir", L.siguientePaso({ mapas: [m3], auditorias: [] }).k, "elegir");
m3.riesgos[2].clave = true;
eq("Siguiente: planificar", L.siguientePaso({ mapas: [m3], auditorias: [] }).k, "planificar");
const a3 = L.nuevaAuditoria("a3", ""); a3.origen.mapaId = "m3";
eq("Siguiente: completar", L.siguientePaso({ mapas: [m3], auditorias: [a3] }).k, "completar");

// Saneado
const sucio = { app: "auditorias", mapas: [{ id: "m<script>", nombre: 42, riesgos: [{ fallo: "x".repeat(5000), g: "7", clave: "sí", hack: 1 }, "basura"], subprocesos: ["Triaje", 7, null, ""] }],
  auditorias: [{ id: "a1", tipo: "rara", objeto: "sistema", origen: { tipo: "riesgos", mapaId: "m1", riesgoIds: ["r1", "<x>"] }, criterios: [{ hallazgo: "h" }], titulo: ["no"] }] };
const s = L.sanearDatos(sucio, gid, "2026-10-21");
t("Saneado: id inválido sustituido", /^id\d+$/.test(s.mapas[0].id));
eq("Saneado: número a texto", s.mapas[0].nombre, "42");
eq("Saneado: texto recortado", s.mapas[0].riesgos[0].fallo.length, 1000);
eq("Saneado: booleano estricto", s.mapas[0].riesgos[0].clave, false);
t("Saneado: claves desconocidas fuera", !("hack" in s.mapas[0].riesgos[0]));
eq("Saneado: basura fuera", s.mapas[0].riesgos.length, 1);
eq("Saneado: lista de textos", s.mapas[0].subprocesos, ["Triaje", "7"]);
eq("Saneado: enumerado inválido", s.auditorias[0].tipo, "interna");
eq("Saneado: enumerado válido", s.auditorias[0].objeto, "sistema");
eq("Saneado: refs", s.auditorias[0].origen.riesgoIds, ["r1"]);
t("Saneado: criterio con id", /^id\d+$/.test(s.auditorias[0].criterios[0].id));
eq("Saneado: título no texto", s.auditorias[0].titulo, "");
eq("Saneado: fecha por defecto", s.mapas[0].creado, "2026-10-21");
eq("Saneado: rechaza lo que no es copia", L.sanearDatos({ indicadores: [] }, gid, ""), null);

// Fusión
const f = L.fusionar({ mapas: [{ id: "x", modificado: "2026-01-01", v: 1 }], auditorias: [] }, { mapas: [{ id: "x", modificado: "2026-02-01", v: 2 }, { id: "y", modificado: "1" }], auditorias: [{ id: "z" }] });
eq("Fusión: gana el más reciente", f.mapas.find(m => m.id === "x").v, 2);
eq("Fusión: añade", [f.mapas.length, f.auditorias.length], [2, 1]);

// Excel
const libro = L.hojasExcelMapa(mapa, "21/10/2026");
const bytes = X.construirLibroXlsx(libro);
t("Excel: es un ZIP", bytes[0] === 0x50 && bytes[1] === 0x4b);
const xml = new TextDecoder().decode(bytes);
t("Excel: contiene el fallo de mayor IPR", xml.includes("Constantes"));
t("Excel: IPR numérico", xml.includes("<v>343</v>"));


// Ejemplos: pasan el saneado sin perder nada y sus IPR son coherentes
const C = require("../contenido.js");
const sEj = L.sanearDatos(C.EJEMPLOS, gid, "x");
const ordena = o => Array.isArray(o) ? o.map(ordena) : o && typeof o === "object" ? Object.keys(o).sort().reduce((a, k) => (a[k] = ordena(o[k]), a), {}) : o;
for (const k of ["mapas", "auditorias", "planes"]) eq("Ejemplos: el saneado no cambia nada en " + k, JSON.stringify(ordena(sEj[k])), JSON.stringify(ordena(C.EJEMPLOS[k])));
const urg = C.EJEMPLOS.mapas[0];
eq("Ejemplo Urgencias: IPR máximo 343", L.resumenMapa(urg).maxIPR, 343);
eq("Ejemplo Urgencias: 10 claves", L.resumenMapa(urg).claves, 10);
t("Ejemplos: sin avisos ni errores", C.EJEMPLOS.mapas.every(m => !L.avisosMapa(m).some(a => a.nivel !== "nota")));
t("Ejemplo: criterios apuntan a riesgos del mapa", C.EJEMPLOS.auditorias[0].criterios.every(c => urg.riesgos.some(r => r.id === c.riesgoId)));
eq("Temas: seis", C.TEMAS.length, 6);

// Plan Anual
eq("Rondas: Ene-Feb es una", L.rondas([1, 2]), 1);
eq("Rondas: 4 sueltas", L.rondas([1, 4, 7, 10]), 4);
eq("Rondas: dos tramos", L.rondas([1, 2, 7]), 2);
eq("Texto meses", L.textoMeses([1, 2, 7, 10, 11]), "Enero–febrero, julio, octubre–noviembre");
const mp = L.nuevoMapa("mp", ""); mp.riesgos = [R("A", 7, 7, 7, "Triaje"), R("B", 6, 6, 5, "Triaje"), R("C", 6, 5, 4, "Sala"), R("D", 9, 2, 3, "Sala"), R("E", 3, 3, 3, "Sala")];
mp.riesgos.slice(0, 4).forEach(r => { r.clave = true; });
const ents = L.entradasDesdeMapa(mp, "sub", gid);
eq("Entradas por subproceso", ents.map(e => [e.titulo, e.riesgoIds.length]), [["Triaje", 2], ["Sala", 2]]);
eq("Frecuencia sugerida trimestral (IPR 343)", ents[0].frecuencia, "trimestral");
eq("Frecuencia sugerida: gravedad 9 sube a semestral", L.frecuenciaSugerida(Object.assign(L.nuevaEntrada("x"), { mapaId: "mp", riesgoIds: [mp.riesgos[3].id] }), [mp]).k, "semestral");
eq("Entradas por hallazgo", L.entradasDesdeMapa(mp, "hallazgo", gid).length, 4);
const plan = Object.assign(L.nuevoPlan("p1", ""), { anio: "2026", ambito: "Urgencias", capacidad: "1", bloqueados: [8] });
plan.entradas = ents;
plan.entradas.push(Object.assign(L.nuevaEntrada(gid()), { titulo: "Anual", frecuencia: "anual", hallazgos: "Algo" }));
const rep = L.repartir(plan, [mp], true);
t("Repartir: no usa meses bloqueados", Object.values(rep).every(ms => !ms.includes(8)));
eq("Repartir: rondas según frecuencia", plan.entradas.map(e => L.rondas(rep[e.id])), [4, 2, 1]);
plan.entradas.forEach(e => { e.meses = rep[e.id]; });
t("Repartir: con capacidad 1 no repite mes", L.cargaMensual(plan).n.every(n => n <= 1));
let AP = L.avisosPlan(plan, [mp]);
t("Plan: avisa de alcance y criterios", AP.some(a => /alcance/.test(a.texto)) && AP.some(a => /criterios/.test(a.texto)));
t("Plan: sin avisos de cronograma", !AP.some(a => a.paso === 4 && a.nivel === "warn"));
plan.entradas[0].meses = [1, 2, 3];
AP = L.avisosPlan(plan, [mp]);
t("Plan: trimestral con una ronda avisa", AP.some(a => a.paso === 4 && /trimestral/.test(a.texto)));
plan.entradas[0].meses = [8]; plan.entradas[1].meses = [8];
AP = L.avisosPlan(plan, [mp]);
t("Plan: avisa de mes bloqueado", AP.some(a => /alta presión/.test(a.texto)));
t("Plan: avisa de sobrecarga", AP.some(a => /a la vez en agosto/.test(a.texto)));
plan.entradas[0].frecuencia = "puntual";
t("Plan: frecuencia muy baja para el riesgo", L.avisosPlan(plan, [mp]).some(a => a.paso === 3 && a.nivel === "warn"));
const g = L.progresoPlan(plan);
eq("Progreso plan", [g[1], g[2], g[4], g[5]], [true, false, true, false]);
const sp = L.sanearDatos({ planes: [{ id: "pp", entradas: [{ meses: [3, 3, 13, "4", 1.5, 2], tiposCriterio: ["regulatorio", "raro", "regulatorio"], frecuencia: "diaria" }], bloqueados: [8, 0] }] }, gid, "f");
eq("Saneado plan: meses", sp.planes[0].entradas[0].meses, [2, 3]);
eq("Saneado plan: tipos de criterio", sp.planes[0].entradas[0].tiposCriterio, ["regulatorio"]);
eq("Saneado plan: frecuencia inválida", sp.planes[0].entradas[0].frecuencia, "");
eq("Saneado plan: bloqueados", sp.planes[0].bloqueados, [8]);
eq("Saneado plan: control por defecto", sp.planes[0].control.historial[0].cambio, "Documento inicial");
const ejP = C.EJEMPLOS.planes[0];
eq("Ejemplo plan: sin avisos", L.avisosPlan(ejP, C.EJEMPLOS.mapas).filter(a => a.nivel !== "nota").map(a => a.texto), []);
t("Ejemplo plan: completo", Object.values(L.progresoPlan(ejP)).every(Boolean));
eq("Siguiente paso con plan completo y sin auditorías", L.siguientePaso({ mapas: [C.EJEMPLOS.mapas[0]], auditorias: [], planes: [ejP] }).k, "auditar");

// Diseño: muestra, LQAS, sorteo, concordancia
eq("LQAS 90/75 β20", L.lqas(90, 75, "20"), { n: 33, c: 26 });
eq("LQAS 85/60 β20", L.lqas(85, 60, "20"), { n: 16, c: 11 });
eq("LQAS 85/60 β10", L.lqas(85, 60, "10"), { n: 24, c: 17 });
eq("LQAS 90/75 β10", L.lqas(90, 75, "10"), { n: 49, c: 40 });
eq("LQAS 85/70 β20", L.lqas(85, 70, "20"), { n: 43, c: 32 });
eq("LQAS umbral ≥ estándar", L.lqas(80, 85, "20"), null);
eq("LQAS fuera de tabla", L.lqas(92, 70, "20"), null);
t("Opciones LQAS para 90: de exigente a laxo", L.opcionesLqas(90, "20")[0].umbral === 85 && L.opcionesLqas(90, "20").some(o => o.umbral === 75 && o.n === 33));
eq("Estimar ±10 % sin universo", L.tamEstimar("10", "50", "").n, 97);
eq("Estimar ±5 %", L.tamEstimar("5", "50", "").n, 385);
eq("Estimar con universo 200", L.tamEstimar("10", "50", "200").n, 66);
eq("Estimar con universo 1000 (tabla)", L.tamEstimar("10", "50", "1000").n, 88);
eq("Estimar ±15 % universo 500", L.tamEstimar("15", "50", "500").n, 40);
t("Margen de error 16/20", Math.abs(L.margenError(0.8, 20) - 0.175) < 0.001);
const cr = L.nuevoCriterio("cr");
Object.assign(cr.ind, { estandar: "10", sentido: "menos" }); Object.assign(cr.muestra, { objetivo: "decidir", umbral: "60" });
eq("Muestra LQAS con sentido «menos»", [L.calcMuestra(cr).n, L.calcMuestra(cr).c], [10, 7]);
cr.ind.estandar = "100"; cr.ind.sentido = "mas";
t("LQAS con estándar 100 % avisa", L.calcMuestra(cr).avisos.some(a => a.nivel === "warn" && /100 %/.test(a.texto)));
cr.ind.estandar = "85"; cr.muestra.N = "60";
t("LQAS: más del 10 % del lote", L.calcMuestra(cr).avisos.some(a => /10 %/.test(a.texto)));
cr.muestra.N = "10";
t("LQAS: universo menor que n", L.calcMuestra(cr).avisos.some(a => a.nivel === "warn"));
cr.muestra.objetivo = "practica"; cr.muestra.N = "";
eq("Regla práctica", L.calcMuestra(cr).n, 50);
cr.muestra.objetivo = "todos"; cr.muestra.N = "18";
eq("Todos los casos", L.calcMuestra(cr).n, 18);
let semilla = 1; const rnd = () => { semilla = (semilla * 16807) % 2147483647; return (semilla - 1) / 2147483646; };
const sa = L.sortear(600, 50, "aleatorio", rnd);
t("Sorteo aleatorio: 50 distintos, ordenados, en rango", sa.length === 50 && new Set(sa).size === 50 && sa.every((x, i) => x >= 1 && x <= 600 && (!i || x > sa[i - 1])));
const ss = L.sortear(600, 50, "sistematico", () => 0.5);
eq("Sorteo sistemático: salto 12", [ss.length, ss[1] - ss[0], ss[0]], [50, 12, 7]);
eq("Sorteo con n ≥ N: todos", L.sortear(5, 10, "aleatorio"), [1, 2, 3, 4, 5]);
const k1 = L.concordancia([["si", "si"], ["si", "si"], ["no", "no"], ["si", "si"], ["si", "no"], ["si", "si"], ["no", "no"], ["si", "si"]].map(([a, b]) => ({ a, b })));
t("Kappa 0,71", Math.abs(k1.kappa - 0.714) < 0.01 && k1.nivel === "aceptable");
const k2 = L.concordancia(Array(6).fill({ a: "si", b: "si" }));
eq("Concordancia perfecta sin variación", [k2.pct, k2.kappa, k2.nivel], [100, 1, "bueno"]);
const k3 = L.concordancia([["si", "no"], ["no", "si"], ["si", "si"], ["no", "no"], ["si", "no"], ["no", "si"]].map(([a, b]) => ({ a, b })));
eq("Concordancia baja", k3.nivel, "bajo");
t("Pocos casos", L.concordancia([{ a: "si", b: "si" }]).pocos);
const audEj = C.EJEMPLOS.auditorias[0];
eq("Ejemplo auditoría: diseño sin avisos", L.avisosDiseno(audEj).filter(a => a.nivel !== "nota").map(a => a.texto), []);
t("Ejemplo auditoría: diseño completo", Object.values(L.progresoDiseno(audEj)).every(Boolean));
const cr2 = L.nuevoCriterio("x"); Object.assign(cr2.ind, { nombre: "% de errores", estandar: "95", sentido: "menos", numerador: "a", denominador: "b" });
t("Aviso de sentido sospechoso", L.avisosDiseno(Object.assign(L.nuevaAuditoria("z", ""), { criterios: [cr2] })).some(a => /cuentas fallos|cuentas aciertos/.test(a.texto)));
const imp = L.indicadoresDeCopia({ app: "indicadores", indicadores: [{ nombre: "% de pacientes con pulsera", tipo: "proceso", numerador: "Con pulsera", denominador: "Triados", sentido: "mas", estandar: "95 %", fuentes: ["Observación directa"], fuenteOtra: "", terminos: "Pulsera legible", hack: "<x>" }, { nombre: "" }] });
eq("Importar de Indicadores", [imp.length, imp[0].estandar, imp[0].fuente, imp[0].cumpleSi], [1, "95", "Observación directa", "Pulsera legible"]);
eq("Importar: no es copia de Indicadores", L.indicadoresDeCopia({ mapas: [] }), null);

// Word
const D = require("../docx.js");
const doc = L.documentoPlan(ejP, C.EJEMPLOS.mapas, "21/10/2026");
const wb = D.construirDocx(Object.assign({ pie: "Plan Anual" }, doc));
t("Word: es un ZIP", wb[0] === 0x50 && wb[1] === 0x4b);
const wxml = new TextDecoder().decode(wb);
t("Word: título", wxml.includes("Plan Anual de Auditorías 2026"));
t("Word: cronograma", wxml.includes("Auditorías en el mes"));
t("Word: escapa caracteres", D.construirDocx({ titulo: "x", bloques: [{ t: "p", texto: "a < b & \"c\"" }] }).length > 0 && new TextDecoder().decode(D.construirDocx({ titulo: "x", bloques: [{ t: "p", texto: "a < b & c" }] })).includes("a &lt; b &amp; c"));
const dm = L.documentoMapa(C.EJEMPLOS.mapas[0], "x");
const dpe = L.documentoPlanEspecifico(audEj, C.EJEMPLOS.mapas[0], null, "x");
t("Word del plan específico", new TextDecoder().decode(D.construirDocx(dpe)).includes("Cuándo se considera que cumple"));
const dh = L.documentoHoja(audEj, "x");
t("Hoja de recogida: filas según n", dh.bloques.filter(b => b.t === "tabla" && b.cab && b.cab[0] === "Nº" && b.cab[2] === "Código del caso")[0].filas.length === 11);
t("Word del mapa", new TextDecoder().decode(D.construirDocx(dm)).includes("Omisión de constantes"));


// Recogida y resultados
const ejA = C.EJEMPLOS.auditorias[0];
const dec = ejA.criterios.map(c => { const r = L.resultadoCriterio(c); return r.lqas.acepta ? "A" : "R"; }).join("");
eq("Decisiones LQAS del ejemplo (como el ejercicio 7bis)", dec, "AARAARAAAA");
eq("Márgenes del ejemplo", [0, 1, 4, 6, 9].map(i => Math.round(L.resultadoCriterio(ejA.criterios[i]).margen)), [25, 18, 19, 31, 13]);
t("Criterio 7: aviso de línea roja lejana", /muy lejos/.test(L.resultadoCriterio(ejA.criterios[6]).detalle));
t("Ejemplo sin avisos graves de recogida", !L.avisosRecogida(ejA).some(a => a.nivel !== "nota"));
const cc = L.nuevoCriterio("cc"); Object.assign(cc.ind, { estandar: "90", sentido: "mas" }); Object.assign(cc.muestra, { objetivo: "estimar", e: "10", p: "50", N: "" });
cc.recogida.casos = Array.from({ length: 97 }, (_, i) => L.nuevoCaso("HC-" + i, "")); cc.recogida.casos.forEach((x, i) => { x.valor = i < 95 ? "si" : "no"; });
let rr = L.resultadoCriterio(cc);
eq("Estimar: cumple con el intervalo por encima", rr.estado, "verde");
cc.recogida.casos.forEach((x, i) => { x.valor = i < 85 ? "si" : "no"; }); rr = L.resultadoCriterio(cc);
eq("Estimar: no concluyente si el estándar cae dentro", rr.estado, "ambar");
cc.recogida.casos.forEach((x, i) => { x.valor = i < 60 ? "si" : "no"; }); rr = L.resultadoCriterio(cc);
eq("Estimar: no cumple con el intervalo por debajo", rr.estado, "rojo");
cc.muestra.objetivo = "todos"; cc.recogida.casos.forEach((x, i) => { x.valor = i < 88 ? "si" : i < 90 ? "na" : "no"; }); rr = L.resultadoCriterio(cc);
eq("Todos los casos: sin margen, NA fuera del denominador", [rr.estado, rr.n, rr.na], ["verde", 95, 2]);
cc.muestra.objetivo = "decidir"; cc.muestra.umbral = "75"; cc.recogida.casos = cc.recogida.casos.slice(0, 20); rr = L.resultadoCriterio(cc);
eq("LQAS: faltan casos", [rr.estado, rr.lqas.faltan], ["gris", 13]);
t("Margen con p = 1 no es cero", L.margen95(1, 20) > 0);
t("Código que parece nombre", L.pareceIdentificador("Juan Pérez") && L.pareceIdentificador("NHC 1234567") && !L.pareceIdentificador("HC-07"));
const aid = L.nuevaAuditoria("ai", ""); const cx = L.nuevoCriterio("cx"); cx.recogida.casos = [L.nuevoCaso("María López"), L.nuevoCaso("HC-01"), L.nuevoCaso("HC-01")]; aid.criterios = [cx];
const AR = L.avisosRecogida(aid);
t("Avisos de recogida: identificador y repetido", AR.some(a => a.nivel === "error") && AR.some(a => /repetido/.test(a.texto)));
const pc = L.prepararCasos(Object.assign(L.nuevoCriterio("p"), { muestra: Object.assign(L.nuevoCriterio("q").muestra, { sorteo: [5, 9] }) }), 3);
eq("Preparar casos con sorteo", pc.map(x => x.codigo + ":" + x.listado), ["HC-01:5", "HC-02:9", "HC-03:"]);
const dr = L.documentoResultados(ejA, "x");
t("Word de resultados", new TextDecoder().decode(D.construirDocx(dr)).includes("Matriz de resultados"));
t("Excel de resultados", X.construirLibroXlsx(L.hojasExcelRecogida(ejA, "x")).length > 1000);


// Informe: clasificación, causas, recomendaciones
const ejI = C.EJEMPLOS.auditorias[0];
eq("Clasificaciones sugeridas del ejemplo", ejI.criterios.map(L.clasificacionSugerida).map(x => x[0]).join(""), "oonoonoooo");
eq("Ejemplo: sin avisos graves en el informe", L.avisosInforme(ejI).filter(a => a.nivel !== "nota").map(a => a.texto), []);
t("Ejemplo: informe completo", Object.values(L.progresoInforme(ejI)).every(Boolean));
eq("Fuerza: campo obligatorio", L.fuerzaMedida("Añadir un campo obligatorio en la prescripción"), "fuerte");
eq("Fuerza: lista de verificación", L.fuerzaMedida("Usar una lista de verificación en el traslado"), "intermedia");
eq("Fuerza: formación", L.fuerzaMedida("Formar al personal en triaje"), "debil");
eq("Fuerza: «bloqueos» no es bloquear", L.fuerzaMedida("Reunión semanal para revisar los bloqueos"), "intermedia");
eq("Palabras no neutras", L.palabrasNoNeutras("El personal de noche nunca lo hace por dejadez"), ["dejadez", "nunca"]);
eq("Texto neutro", L.palabrasNoNeutras("El cumplimiento fue del 65 % en el turno de noche"), []);
const cI = JSON.parse(JSON.stringify(ejI.criterios[2]));
cI.analisis.causaRaiz = ""; cI.analisis.recs = [{ id: "x", texto: "Sensibilizar al personal", responsable: "todos", prioridad: "alta", motivo: "", plazo: "" }];
const AI = L.avisosInforme(Object.assign(L.nuevaAuditoria("ii", ""), { criterios: [cI] }));
t("Avisos: NC sin causa, responsable vago, medidas débiles", AI.some(a => /causas/.test(a.texto)) && AI.some(a => /no es un responsable concreto/.test(a.texto)) && AI.some(a => /medidas débiles/.test(a.texto)));
cI.analisis.clasif = "conformidad";
t("Avisos: conformidad con resultado rechazado", L.avisosInforme(Object.assign(L.nuevaAuditoria("ii", ""), { criterios: [cI] })).some(a => /Revisa la clasificación/.test(a.texto)));
t("Interpretación sugerida", /LQAS.*se rechaza/.test(L.interpretacionSugerida(ejI.criterios[2])));
t("Resumen ejecutivo sugerido", /2 no conformidades/.test(L.resumenEjecutivoSugerido(ejI)));
const sp2 = L.sanear("analisis", { porques: ["a"], recs: [{ texto: "x", prioridad: "urgente" }] }, gid);
eq("Saneado: 5 porqués y prioridad inválida", [sp2.porques.length, sp2.recs[0].prioridad], [5, ""]);
const dInf = L.documentoInforme(ejI, C.EJEMPLOS.mapas[0], null, "x"), dRes = L.documentoResumenEjecutivo(ejI, "x");
t("Word del informe", new TextDecoder().decode(D.construirDocx(dInf)).includes("Causa raíz"));
t("Word del resumen ejecutivo", new TextDecoder().decode(D.construirDocx(dRes)).includes("Recomendaciones prioritarias"));

console.log(`${ok} pruebas correctas${fallos ? `, ${fallos} FALLIDAS` : ""}.`);
process.exit(fallos ? 1 : 0);
