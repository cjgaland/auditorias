# Auditorías

PWA estática (HTML/CSS/JS puro, sin dependencias ni CDN, funciona sin conexión) para planificar, realizar, informar y hacer el seguimiento de auditorías de calidad y seguridad del paciente, paso a paso y aprendiendo mientras se hace: del Mapa de Riesgos a la mejora continua, siguiendo el ciclo PDCA.

Versión actual (en construcción): Plan Anual de Auditorías en seis pasos (alcance, criterios, frecuencia según el IPR, responsables, recursos, cronograma con reparto automático, roles, aprobación y control del documento) con documento en Word, PDF y Excel; Mapa de Riesgos (AMFE con IPR, avisos, pegar desde Excel, gráfico de prioridad, hallazgos clave, Excel e informe en PDF), inicio de la auditoría (origen, datos generales, alcance, objetivos, criterios e hitos), ejemplos (mapa, plan anual y auditoría del proceso de admisión en Urgencias, y un minicaso de Hospitalización), «Aprende» en seis temas, glosario, copia de seguridad e importación. Los datos se guardan solo en el dispositivo.

Hermana de [Indicadores](https://cjgaland.github.io/indicadores-calidad/) y [Tamaño Muestral](https://cjgaland.github.io/tamano-muestral/).

## Uso
Servir la carpeta y abrir `index.html`:

    python3 -m http.server 8767

Tests de la lógica y del Excel:

    node tests/logic.test.mjs

Documentación técnica y decisiones: ver `CLAUDE.md`.

Aplicación desarrollada por:

- **Carlos J. Galán Doval** · Médico de Familia · Técnico en Calidad y Seguridad del Paciente
- **Rafael J. Romero de Castilla Gil** · Médico de Familia · Responsable del Área de Calidad y Seguridad del Paciente

Área de Gestión Sanitaria Sur de Córdoba · Andalucía. De libre uso con fines docentes y divulgativos. No sustituye el criterio profesional.
