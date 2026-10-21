# Auditorías

PWA estática (HTML/CSS/JS puro, sin dependencias ni CDN, funciona sin conexión) para planificar, realizar, informar y hacer el seguimiento de auditorías de calidad y seguridad del paciente, paso a paso y aprendiendo mientras se hace: del Mapa de Riesgos a la mejora continua, siguiendo el ciclo PDCA.

Recorre el ciclo de mejora completo (Planificar, Hacer, Verificar, Actuar):

- **Mapa de Riesgos** (AMFE): IPR, prioridad, avisos, pegar desde Excel, hallazgos clave.
- **Plan Anual de Auditorías**: alcance, criterios, frecuencia según el IPR, responsables, recursos, cronograma con reparto automático, roles, aprobación y control del documento.
- **Auditoría**, en cinco fases: inicio (origen, objetivos, criterios e hitos); diseño (indicadores, evidencias, instrumentos, muestra con LQAS y sorteo, pilotaje con kappa); recogida de datos caso a caso con margen de error y decisión LQAS; informe (interpretación, análisis de causas, recomendaciones, informe completo y resumen ejecutivo); mejora (plan de acción con matriz criticidad × viabilidad y auditoría de seguimiento con comparación antes/después).
- **Documentos** en Word editable, PDF y Excel, sin dependencias.
- **Aprende** (seis temas), **Ponte a prueba** (30 preguntas), **glosario** y un **ejemplo completo** (proceso de admisión en Urgencias).

Los datos se guardan solo en el dispositivo; para trabajar en equipo se comparte la copia de seguridad.

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
