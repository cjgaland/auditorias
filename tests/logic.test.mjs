// Pruebas de la lógica pura y del Excel · node tests/logic.test.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const L = require("../logic.js");
const X = require("../xlsx.js");

let ok = 0, fallos = 0;
const t = (nombre, cond) => { if (cond) ok++; else { fallos++; console.error("✗ " + nombre); } };
const eq = (nombre, a, b) => t(`${nombre} (esperado ${JSON.stringify(b)}, obtenido ${JSON.stringify(a)})`, JSON.stringify(a) === JSON.stringify(b));
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
eq("Siguiente: auditar", L.siguientePaso({ mapas: [m3], auditorias: [] }).k, "auditar");
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
t("Ejemplos: el saneado no cambia nada", JSON.stringify(ordena(sEj.mapas)) + JSON.stringify(ordena(sEj.auditorias)) === JSON.stringify(ordena(C.EJEMPLOS.mapas)) + JSON.stringify(ordena(C.EJEMPLOS.auditorias)));
const urg = C.EJEMPLOS.mapas[0];
eq("Ejemplo Urgencias: IPR máximo 343", L.resumenMapa(urg).maxIPR, 343);
eq("Ejemplo Urgencias: 10 claves", L.resumenMapa(urg).claves, 10);
t("Ejemplos: sin avisos ni errores", C.EJEMPLOS.mapas.every(m => !L.avisosMapa(m).some(a => a.nivel !== "nota")));
t("Ejemplo: criterios apuntan a riesgos del mapa", C.EJEMPLOS.auditorias[0].criterios.every(c => urg.riesgos.some(r => r.id === c.riesgoId)));
eq("Temas: seis", C.TEMAS.length, 6);

console.log(`${ok} pruebas correctas${fallos ? `, ${fallos} FALLIDAS` : ""}.`);
process.exit(fallos ? 1 : 0);
