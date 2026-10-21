# CLAUDE.md — Auditorías

Guía de referencia para el desarrollo asistido por IA. Léela antes de proponer cambios. Responder siempre en español y en lenguaje claro (el autor no es programador). El diseño completo y el plan por entregas están en `/Users/Trabajo/Desktop/Auditorías/DISEÑO_SUPERAPLICACION.md` (léelo también al empezar una sesión).

## 1. Descripción
PWA estática (sin build, sin dependencias, sin CDN) para **planificar, realizar, informar y hacer el seguimiento de auditorías de calidad y seguridad del paciente**, paso a paso y de forma didáctica, siguiendo el ciclo PDCA. Nace del curso «Auditorías para la Mejora de la Seguridad del Paciente. Del Mapa de Riesgos a la Mejora Continua» (contenido en `/Users/Trabajo/Desktop/Auditorías/Curso Auditorías`), para que el alumnado pueda hacer solo una auditoría real después del curso. Herramienta docente y de apoyo; no sustituye el criterio profesional.

Hermana de **Indicadores** (`/Users/Trabajo/Desktop/Indicadores/`) y **Tamaño Muestral** (`/Users/Trabajo/Desktop/Tamaño Muestral/`): mismos tokens CSS, modo claro/oscuro, modales (bienvenida, Acerca de, novedades, confirmar), SW network-first con aviso «Nueva versión disponible», vista de informe imprimible y PDF en iOS. Es **autónoma** (incluirá lo esencial de indicadores y muestra) pero enlaza a las dos.

Autoría (idéntica en el pie de index.html, «Acerca de», `informePie()` en app.js y el README; orden alfabético, sin centro de trabajo): Carlos J. Galán Doval (Médico de Familia · Técnico en Calidad y Seguridad del Paciente) y Rafael J. Romero de Castilla Gil (Médico de Familia · Responsable del Área de Calidad y Seguridad del Paciente), Área de Gestión Sanitaria Sur de Córdoba · Andalucía.

## 2. Arquitectura
- `index.html` — esqueleto, header, nav, franja de ejemplo, modales e `<input type=file>` para importar. Script inline que fija `data-tema` antes de pintar.
- `styles.css` — base copiada de Indicadores + bloque final «Componentes propios de Auditorías» (colores PDCA `--pP/--pH/--pV/--pA`, línea de fases, tarjetas de riesgo, niveles de IPR, gráfico, auditoría, Aprende). Móvil primero (360 px).
- `logic.js` — funciones PURAS (`window.Logica` / `module.exports`): IPR y niveles, orden y puestos, `resumenMapa`, `avisosMapa` (trampas didácticas), `sugerirMotivo`, `parsearTabla` (pegar desde Excel/Calc/Word), modelo (`nuevoMapa`, `nuevoRiesgo`, `nuevaAuditoria`, `nuevoCriterio`), `ORIGENES`, `FASES` (con la entrega en que se activa cada una), `deArt`, `sugerirTitulo`, `sugerirObjetivo`, `progresoInicio`, `siguientePaso`, **saneado por esquema** (`ESQ` + `sanear`), `sanearDatos`, `fusionar`, `hojasExcelMapa`.
- `contenido.js` — solo datos (`window.Contenido`): `TEMAS` (Aprende, 6 temas), `GLOSARIO`, `EJEMPLOS` (mapas, auditorías y fichas). HTML de confianza escrito a mano.
- `xlsx.js` — Excel real sin dependencias, copiado de Indicadores.
- `app.js` — UI: datos, enrutado, inicio, Mapa de Riesgos, auditoría (inicio), ejemplos, Aprende, glosario, PDF iOS, copia/importar, Excel, tema, modales, SW.
- `sw.js` — network-first; sin `skipWaiting` al instalar.
- `tests/logic.test.mjs` — `node tests/logic.test.mjs` (lógica, ejemplos y Excel).

### Rutas (hash)
`#/` inicio · `#/riesgos` mis mapas · `#/riesgos/nuevo` (crea un borrador y redirige) · `#/riesgos/<id>` mapa (`?informe=1` = vista imprimible) · `#/auditorias` · `#/auditoria/nueva[?mapa=<id>]` · `#/auditoria/<id>` · `#/ejemplos` · `#/aprende` y `#/aprende/<1-6>` · `#/glosario`.

### Datos
- `localStorage["auditorias-datos"]` = `{ app, v, ultimaCopia, mapas: [], auditorias: [] }`. Guardado con 250 ms de retardo y al salir (`pagehide`).
- Al cargar e importar se pasa SIEMPRE por `sanearDatos`. **Al añadir un campo nuevo**: añadirlo a la fábrica (`nuevoX`) y a `ESQ` en logic.js (si no, el saneado lo borra al recargar). Subir `VERSION_DATOS` solo si cambia el significado de algo ya guardado.
- Riesgos: `{ id, subproceso, fallo, efecto, causa, g, o, d, medidas, clave, accion, evidencia, motivo }` (G/O/D como texto; IPR siempre calculado, nunca guardado).
- Auditoría: `{ id, titulo, unidad, proceso, centro, origen: { tipo, mapaId, riesgoIds, detalle }, tipo, objeto, introduccion, objetivoGeneral, objetivosEsp, criterios: [{ id, subproceso, riesgoId, hallazgo, criterio }] }`. Las siguientes entregas colgarán de cada criterio su indicador, evidencias, instrumento, muestra y resultados.
- Enlaces en la UI: campos del objeto en edición con `data-k="ruta"`; riesgos con `data-r` + `data-f`; criterios con `data-c` + `data-f`. Al escribir se refrescan zonas (`refrescarMapa`, `refrescarAud`) sin perder el foco; los cambios de estructura repintan conservando el scroll (`repintarMapa`, `repintarAud`).
- Borradores: «nuevo mapa» / «nueva auditoría» viven en `borradores` hasta que se escribe algo (`esVacioMapa`, `esVacioAud`). Crear auditoría desde un mapa (`?mapa=`) la guarda al momento (con sus hallazgos clave como criterios).
- Ejemplos: viven en memoria (`ejemplos()`, ids de primer nivel `ej-…`); la ruta decide `modoEjemplo`; `guardar()` solo escribe `datosUsuario`. «Copiar a mis datos» copia el mapa, o la auditoría **con su mapa** (ids nuevos). Nunca se importa un id `ej-`.
- Copia de seguridad: `.json` (en iOS, Compartir) y aviso en inicio si no hay copia o tiene más de 30 días. Importar: añadir (fusiona por id, gana el más reciente: así se trabaja en equipo) o sustituir (doble confirmación).

## 3. Decisiones del autor (2026-10-21)
- **Uso general**: en pantalla no se menciona el curso; solo aparece como fuente en «Acerca de».
- **Ejemplos**: SÍ se usa el caso real de Urgencias del curso (AMFE de 15 riesgos, 10 hallazgos clave, 7 subprocesos, auditoría interna), sin nombres de centro ni de personas, más minicasos inventados. (Diferente de Indicadores, donde los ejercicios no se usan.)
- **Equipo**: sin servidor; se comparte con la copia `.json` y se fusiona al importar.
- **Documentos**: Word (.docx sin dependencias, a construir en `docx.js`) + PDF/imprimir.
- **Protección de datos**: avisos para usar códigos (HC-01…) y nunca nombres ni NHC.
- Textos con lenguaje inclusivo neutro («Te damos la bienvenida»).

## 4. Entorno y pruebas
- Node v26 (Homebrew). `node tests/logic.test.mjs`.
- Servir en local: el panel de vista previa NO puede arrancar el servidor (sin permiso para leer el Escritorio). Arrancarlo desde Bash en segundo plano: `cd "/Users/Trabajo/Desktop/App Auditorías" && python3 -m http.server 8767`, y abrir la vista previa `app-auditorias` de `/Users/Trabajo/Desktop/Auditorías/.claude/launch.json` (solo URL). El navegador integrado no admite service workers.
- Revisar siempre en escritorio y en móvil (360 px): sin scroll horizontal (`document.documentElement.scrollWidth === 360`), y en modo oscuro.

## 5. Versiones
- `APP_VERSION` y `NOVEDADES` al principio de `app.js` (formato AAAA.NN, la más reciente arriba). Claves de localStorage: `auditorias-datos`, `auditorias-tema`, `auditorias-bienvenida-vista`, `auditorias-version-vista`, `auditorias-facil-abierto`.

## 6. Copias de seguridad locales
Carpeta `Backup/` (ignorada en git) con las 5 copias más recientes:
`bash ~/.claude/skills/app-copia_seguridad/scripts/copia_seguridad.sh --root "/Users/Trabajo/Desktop/App Auditorías" --name Auditorias`. Hacer una antes de cada publicación.

## 7. Publicación
Aún NO publicada. Cuando el autor lo pida: repositorio público en GitHub (`cjgaland/…`) con GitHub Pages desde `main`, igual que las hermanas. Pasos por versión: copia de seguridad; entrada en `NOVEDADES` + `APP_VERSION`; mismos `?v=` en index.html; subir `CACHE_NAME` en sw.js; tests; commit en español terminado en `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; push.

## 8. Estado y pendiente (ver plan por entregas en el documento de diseño)
- **Entrega 1 (hecha, 2026-10-21)**: esqueleto e identidad, inicio con línea PDCA y «Tu siguiente paso», Mapa de Riesgos completo (IPR, avisos, pegar desde Excel, gráfico, hallazgos clave, Excel, informe/PDF), auditoría · inicio (origen, datos generales, objetivos, criterios), ejemplos, Aprende (6 temas), glosario, copias.
- Entrega 2: Plan Anual (alcance, criterios, frecuencia, responsables, recursos, cronograma 12 meses con solapes) + `docx.js` y primer documento Word.
- Entrega 3: Diseño (indicador por criterio, evidencias y triangulación, principios e instrumentos, muestra/LQAS, hoja de recogida imprimible).
- Entrega 4: Recogida (rejilla de casos, resultados, margen de error, LQAS).
- Entrega 5: Informe (interpretación, hallazgos, recomendaciones, informe completo y resumen ejecutivo).
- Entrega 6: Mejora y seguimiento, autoevaluación (test), manual, publicación.
