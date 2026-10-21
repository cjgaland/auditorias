// ============================================================
//  contenido.js — Textos didácticos y ejemplos · Auditorías
//  Aprende (6 temas), glosario y datos de los ejemplos.
//  Solo datos: sin DOM. window.Contenido en navegador y module.exports en Node.
//  Los textos son HTML de confianza (escritos aquí, nunca del usuario).
// ============================================================
(function (raiz) {
  "use strict";

  const box = (tipo, tag, html) => `<div class="box box--${tipo}"><span class="box-tag">${tag}</span>${html}</div>`;
  const idea = h => box("idea", "Idea clave", `<p>${h}</p>`);
  const trampa = h => box("trampa", "Ojo, trampa", `<p>${h}</p>`);
  const practica = h => box("practica", "En la práctica", `<p>${h}</p>`);
  const ejemplo = (t, h) => box("ejemplo", "Ejemplo" + (t ? " · " + t : ""), h);

  // ---------- Aprende: seis temas ----------
  // fase = clave de la fase de la línea PDCA que más se relaciona con el tema
  const TEMAS = [
    {
      n: 1, titulo: "Qué es una auditoría", sub: "Definición, principios, tipos y fases", pdca: "P", fase: "riesgos",
      minuto: [
        "Auditar es <b>comparar lo que se hace con lo que se debería hacer</b>, con método y con pruebas.",
        "Es un proceso <b>sistemático, independiente y documentado</b> (ISO 19011).",
        "No es un examen ni una inspección para buscar culpables: es una herramienta de <b>aprendizaje y mejora</b>.",
        "Sigue el ciclo <b>PDCA</b>: planificar, hacer (recoger evidencias), verificar (informe) y actuar (mejoras y seguimiento).",
        "En sanidad nace casi siempre de un <b>riesgo</b>: lo que el Mapa de Riesgos dice que puede fallar."
      ],
      secciones: [
        { t: "1 · La definición, en limpio", h: `
          <p>La palabra viene del latín <i>audire</i>, «escuchar». Según la norma ISO 19011, una auditoría es <b>un proceso sistemático, independiente y documentado para obtener evidencias y evaluarlas objetivamente</b>, con el fin de saber en qué medida se cumplen unos criterios.</p>
          <p>Tres palabras sostienen todo lo demás:</p>
          <ul>
            <li><b>Sistemática</b>: sigue un método y forma parte de un plan; no es una iniciativa aislada.</li>
            <li><b>Independiente y objetiva</b>: quien audita no debería auditar su propio trabajo. En la práctica se admiten las <b>autoauditorías</b>, pero hay que saber que pierden parte de esa independencia.</li>
            <li><b>Basada en evidencias</b>: cada conclusión se apoya en registros u observaciones que otra persona podría comprobar.</li>
          </ul>
          ${idea("Auditar es comparar lo que <b>se hace</b> con lo que <b>se debería hacer</b>, y demostrarlo con pruebas.")}` },
        { t: "2 · Los cinco principios", h: `
          <table class="mini facil-tabla"><tr><th>Principio</th><th>Qué significa</th></tr>
            <tr><td><b>Independencia</b></td><td>Libertad de criterio; no auditar el propio trabajo.</td></tr>
            <tr><td><b>Objetividad</b></td><td>Juicios basados en evidencias, no en opiniones.</td></tr>
            <tr><td><b>Sistematicidad</b></td><td>Un plan estructurado y repetible.</td></tr>
            <tr><td><b>Confidencialidad</b></td><td>Proteger la información sensible de pacientes y profesionales.</td></tr>
            <tr><td><b>Orientación a la mejora</b></td><td>Detectar desviaciones para corregirlas, no para castigar.</td></tr></table>
          ${trampa("Si la auditoría se vive como una fiscalización, los equipos esconden los fallos y se pierde lo más valioso: aprender. El enfoque debe ser <b>no punitivo</b>.")}` },
        { t: "3 · Tipos de auditoría", h: `
          <p><b>Según quién la hace:</b></p>
          <ul><li><b>Interna</b>: profesionales de la propia organización (por ejemplo, un hospital revisa su protocolo de identificación de pacientes).</li>
          <li><b>Externa</b>: una entidad independiente (agencia de acreditación, inspección, certificadora). Suele ser formal y estar ligada a acreditación o certificación.</li></ul>
          <p><b>Según qué revisa:</b></p>
          <ul><li><b>De sistema</b>: todo el sistema de gestión de la calidad.</li>
          <li><b>De proceso</b>: un procedimiento concreto (conciliación de la medicación, higiene de manos…). Es la más habitual en las unidades.</li>
          <li><b>De producto o servicio</b>: el resultado final (por ejemplo, la calidad de los informes quirúrgicos).</li></ul>
          <p>Cuando revisa prácticas asistenciales se habla de <b>auditoría clínica</b>: los mismos principios aplicados a la atención al paciente.</p>` },
        { t: "4 · Marco de referencia", h: `
          <ul><li><b>Estándares de acreditación</b> (en Andalucía, los de la ACSA): fijan requisitos de calidad y seguridad que sirven como criterios de auditoría.</li>
          <li><b>ISO 19011:2018</b>: directrices para auditar sistemas de gestión.</li>
          <li><b>Normas internas</b>: protocolos, procedimientos y políticas de calidad de cada unidad o área.</li></ul>
          <p>El propósito es doble: <b>verificar la conformidad</b> (se cumple o no lo establecido) y, sobre todo, <b>generar información útil para mejorar</b>.</p>` },
        { t: "5 · Mapa de Riesgos y auditoría", h: `
          <p>El <b>Mapa de Riesgos</b> (por ejemplo, un AMFE) identifica qué puede fallar en un proceso y con qué prioridad. La auditoría toma el relevo:</p>
          <ul><li>Verifica si las medidas de control de esos riesgos <b>se aplican de verdad</b>.</li>
          <li>Evalúa si los planes de mejora <b>son eficaces</b>.</li>
          <li>Propone ajustes y, con lo que encuentra, <b>actualiza el propio mapa</b>.</li></ul>
          ${idea("Mapa de Riesgos y auditoría se retroalimentan: el mapa dice <b>dónde mirar</b>; la auditoría dice <b>qué está pasando de verdad</b>.")}` },
        { t: "6 · Las cuatro fases (PDCA)", h: `
          <ol><li><b>Planificar</b>: objetivo, alcance, criterios, equipo auditor y cronograma.</li>
          <li><b>Hacer</b>: revisar registros, observar, entrevistar y recoger las evidencias.</li>
          <li><b>Verificar</b>: redactar el informe con conformidades, no conformidades y observaciones, y formular recomendaciones.</li>
          <li><b>Actuar</b>: poner en marcha las acciones de mejora y comprobar su eficacia con una auditoría de seguimiento.</li></ol>
          <p>Esta app sigue exactamente ese camino: la línea de colores que ves en toda la app es el ciclo PDCA.</p>` }
      ],
      minicaso: `<p>En un Servicio de Urgencias, el Mapa de Riesgos muestra un riesgo alto de errores en la <b>conciliación de la medicación</b> de pacientes polimedicados. Se programa una auditoría clínica interna:</p>
        <ul><li><b>Objetivo</b>: comprobar que el protocolo de conciliación se aplica al ingreso y al alta.</li>
        <li><b>Evidencias</b>: 20 historias clínicas, observación directa del pase de guardia y entrevistas a enfermería.</li>
        <li><b>Hallazgo</b>: en el 40 % de los casos no consta un registro validado por el facultativo.</li>
        <li><b>Mejora</b>: formación, actualizar la lista de verificación y auditoría de seguimiento a los 3 meses.</li></ul>`,
      practica: { texto: "Empieza por tu Mapa de Riesgos", href: "#/riesgos" }
    },
    {
      n: 2, titulo: "Planificar el plan de auditorías", sub: "Alcance, criterios, frecuencia y calendario", pdca: "P", fase: "plan",
      minuto: [
        "El <b>Plan de Auditorías</b> es la hoja de ruta del año: qué se audita, con qué criterios, cuándo y con qué recursos.",
        "Hay un <b>plan global</b> (todas las auditorías del año) y un <b>plan específico</b> para cada auditoría.",
        "El <b>alcance</b> dice qué se audita y hasta dónde; los <b>criterios</b>, contra qué se compara.",
        "Se prioriza por <b>riesgo (IPR)</b>, resultados previos y recursos: no hay que auditarlo todo cada año.",
        "El calendario <b>escalonado</b> evita picos de trabajo y deja tiempo para mejorar y volver a medir."
      ],
      secciones: [
        { t: "1 · Qué es un plan de auditorías", h: `
          <p>Un documento de trabajo, <b>aprobado por la Dirección y comunicado a todos los implicados</b>, que ordena qué procesos se auditarán, con qué criterios, en qué plazos y con qué recursos. No es una tabla de fechas: es un elemento vivo de la gestión de la calidad.</p>
          <ul><li><b>Plan global</b>: todas las auditorías de un periodo (normalmente un año), priorizadas por criticidad y recursos.</li>
          <li><b>Plan específico</b>: el detalle de cada auditoría (objetivo, alcance exacto, responsables, normas aplicables, cronograma).</li></ul>
          ${trampa("Sin plan, la auditoría se vuelve improvisada y reactiva: se audita lo que ha salido en el último incidente, no lo que más riesgo tiene.")}` },
        { t: "2 · El alcance: qué sí y qué no", h: `
          <p>Definir el alcance es decidir <b>qué se va a auditar y hasta dónde llega la revisión</b>: procesos, actividades, áreas, unidades, periodo y población. Se decide teniendo en cuenta:</p>
          <ul><li>La <b>normativa y los estándares</b> aplicables (lo que exige la acreditación).</li>
          <li>El <b>Mapa de Riesgos</b>: los procesos donde un fallo tendría más impacto.</li>
          <li>Los <b>recursos</b> disponibles: tiempo, personas, medios.</li>
          <li>Los <b>resultados de auditorías previas</b>.</li></ul>
          ${ejemplo("acotar el alcance", "<p>En lugar de «toda la gestión de la medicación», mejor <b>«la conciliación de la medicación en los ingresos programados de los últimos 3 meses»</b>. Para la identificación de pacientes, se puede auditar todo el circuito (de admisión al alta) o solo quirófano y hospitalización. Cuanto más preciso, más eficaz.</p>")}` },
        { t: "3 · Los criterios: contra qué se compara", h: `
          <p>Los criterios son el <b>marco de referencia</b> con el que se compara la práctica real. Sin criterios claros no se puede decir si algo cumple o no. Deben ser <b>claros, actualizados y comunicados antes</b> de la auditoría.</p>
          <table class="mini facil-tabla"><tr><th>Tipo</th><th>Ejemplos</th></tr>
            <tr><td><b>Normativos</b></td><td>Leyes y regulaciones.</td></tr>
            <tr><td><b>Procedimentales</b></td><td>Protocolos, procedimientos normalizados (POE), guías de la unidad.</td></tr>
            <tr><td><b>Contractuales</b></td><td>Acuerdos con terceros.</td></tr>
            <tr><td><b>Regulatorios</b></td><td>Acreditación y certificación (ACSA, ISO).</td></tr></table>
          <p>También se habla de criterios <b>internos</b> (protocolos propios) y <b>externos</b> (estándares de acreditación, normas internacionales, guías de sociedades científicas).</p>
          ${trampa("Los criterios deben ser <b>específicos de cada proceso</b>. No es lo mismo auditar «la identificación del paciente» que «la verificación de la identidad antes de una transfusión».")}` },
        { t: "4 · Prioridad y frecuencia", h: `
          <ul><li>Lo que más riesgo tiene (<b>IPR alto</b>) y más impacto en la seguridad del paciente se audita con más frecuencia: trimestral o, como mucho, semestral.</li>
          <li>Los procesos de alto impacto suelen revisarse <b>cada 6 a 12 meses</b>.</li>
          <li>Pesan también los <b>resultados previos</b> (si falló, se vuelve antes) y los <b>recursos</b>.</li>
          <li><b>No hay que auditar todo cada año.</b></li></ul>
          ${idea("Frecuencia realista y proporcional al riesgo: ni tan poca que no sirva, ni tanta que sature al equipo.")}` },
        { t: "5 · El calendario anual", h: `
          <p>Un cronograma con fechas claras y escalonadas: evita solapamientos con periodos de mucha presión asistencial, reparte el trabajo del equipo auditor y permite a los auditados prepararse.</p>
          ${ejemplo("un proceso por trimestre", "<p>1.<sup>er</sup> trimestre: conciliación de la medicación · 2.º: identificación de pacientes · 3.º: higiene de manos · 4.º: profilaxis quirúrgica. Se cubre lo crítico sin sobrecargar a nadie.</p>")}
          ${practica("Agrupa por subproceso en vez de caso a caso: el calendario queda más claro. Y reserva huecos para las auditorías de seguimiento.")}` },
        { t: "6 · Quién hace qué", h: `
          <ul><li><b>Equipo auditor</b>: profesionales formados y, si se puede, independientes del área auditada. Mejor multidisciplinar.</li>
          <li><b>Responsable del plan</b>: coordina, revisa y hace seguimiento (habitualmente Calidad y Seguridad del Paciente).</li>
          <li><b>Dirección y mandos intermedios</b>: aprueban el plan, lo difunden y garantizan los recursos.</li>
          <li><b>Profesionales auditados</b>: conocen el plan con antelación y participan con transparencia.</li></ul>
          <p><b>Barreras</b> habituales: falta de tiempo, resistencia al cambio, percepción punitiva. <b>Facilitadores</b>: compromiso directivo, recursos, formación e implicación de los mandos intermedios.</p>` }
      ],
      minicaso: `<p>Una Unidad de Hospitalización Médica actualiza su Mapa de Riesgos y detecta tres procesos prioritarios: <b>conciliación de la medicación</b>, <b>administración segura de medicamentos</b> y <b>aislamiento</b> de infecciones transmisibles. Para cada uno define el alcance (etapas y unidades), fija los criterios (estándares de acreditación y protocolos internos), reparte las auditorías a lo largo del año dejando tiempo para mejorar y volver a medir, y forma un equipo auditor con personal de Calidad y profesionales de fuera de la unidad.</p>`,
      practica: { texto: "Ver el minicaso de Hospitalización en los ejemplos", href: "#/ejemplos" }
    },
    {
      n: 3, titulo: "Indicadores", sub: "Del criterio al número", pdca: "P", fase: "diseno",
      minuto: [
        "Un <b>indicador</b> convierte un criterio en algo que se puede contar y comparar con un estándar.",
        "Según lo que miden: de <b>estructura</b> (lo que se tiene), <b>proceso</b> (lo que se hace) y <b>resultado</b> (lo que se logra).",
        "Un buen indicador es <b>SMART</b>, válido, fiable y útil.",
        "Su ficha define <b>numerador, denominador, fuente, estándar</b> y periodicidad.",
        "Para diseñarlos a fondo tienes la app hermana <b>Indicadores</b>."
      ],
      secciones: [
        { t: "1 · Del criterio al indicador", h: `
          <p>Un <b>dato</b> es una información suelta («este mes hubo 12 caídas»). Un <b>indicador</b> la relaciona con un objetivo y permite ver tendencias («caídas por 1.000 estancias, frente a un estándar»).</p>
          <p>Se construye a partir de un <b>criterio</b> de buena práctica:</p>
          ${ejemplo("", "<p><b>Criterio</b>: «se documenta la conciliación de la medicación habitual al ingreso». <b>Indicador</b>: «% de pacientes con la medicación habitual registrada antes de la prescripción en Urgencias». <b>Estándar</b>: ≥ 90 %.</p>")}` },
        { t: "2 · Tipos y forma de cálculo", h: `
          <table class="mini facil-tabla"><tr><th>Tipo</th><th>Mira…</th><th>Ejemplo</th></tr>
            <tr><td><b>Estructura</b></td><td>lo que se tiene</td><td>Dispensadores de solución hidroalcohólica en el punto de atención.</td></tr>
            <tr><td><b>Proceso</b></td><td>lo que se hace</td><td>% de pacientes con la lista de verificación quirúrgica aplicada.</td></tr>
            <tr><td><b>Resultado</b></td><td>lo que se logra</td><td>Tasa de infección de localización quirúrgica.</td></tr></table>
          <p>En auditoría de historias casi todo es <b>cumple / no cumple</b>: se expresa en porcentaje y se puede analizar con muestras pequeñas. Los <b>centinela</b> (un solo caso ya es grave, como la cirugía en lugar equivocado) no se muestrean: se revisan todos.</p>` },
        { t: "3 · Un buen indicador", h: `
          <ul><li><b>SMART</b>: específico, medible, alcanzable, relevante y con periodicidad definida.</li>
          <li><b>Válido</b>: mide lo que dice medir.</li>
          <li><b>Fiable</b>: dos auditores llegan al mismo resultado con la misma historia.</li>
          <li><b>Útil</b>: alguien puede actuar con lo que muestra.</li></ul>
          ${trampa("El <b>sentido</b> del estándar importa: si cuentas fallos («% sin pulsera»), menos es mejor y el estándar va con ≤. Si cuentas aciertos («% con pulsera»), va con ≥. Mezclarlos es el error más frecuente al interpretar.")}` },
        { t: "4 · La ficha del indicador", h: `
          <p>Cada indicador de la auditoría necesita: nombre, tipo, <b>fórmula</b> (numerador ÷ denominador × 100), población y exclusiones, <b>fuente de datos</b>, <b>estándar</b> (y sentido), umbral de alarma, periodicidad y responsable.</p>
          ${practica("En esta app definirás un indicador por cada criterio de la auditoría (fase de Diseño). Si quieres trabajarlos con más detalle —calidad SMART, pilotaje, compuestos— usa la app <b>Indicadores</b> y luego impórtalos.")}` }
      ],
      minicaso: `<p>Para el riesgo «no colocación de la pulsera identificativa» en triaje, el criterio es «todos los pacientes están identificados con pulsera antes de pasar a box o a pruebas». El indicador: <b>% de pacientes triados con pulsera colocada antes del paso a box</b> = pacientes con pulsera ÷ pacientes triados × 100, por observación directa y registro de triaje, con un estándar ≥ 95 %.</p>`,
      practica: { texto: "Abrir la app Indicadores ↗", href: "https://cjgaland.github.io/indicadores-calidad/", fuera: true }
    },
    {
      n: 4, titulo: "Evidencias, instrumentos y muestra", sub: "Cómo se recogen las pruebas y cuántos casos revisar", pdca: "H", fase: "hacer",
      minuto: [
        "Sin <b>evidencias</b> no hay auditoría: cada conclusión debe poder comprobarse.",
        "Cuatro tipos: <b>documentales</b>, <b>observación directa</b>, <b>entrevistas</b> y <b>registros electrónicos</b>. Combinarlas es <b>triangular</b>.",
        "Los <b>instrumentos</b> (checklist, guía de entrevista, matriz de hallazgos…) hacen que todos auditen igual.",
        "La muestra debe ser <b>aleatoria</b>: la de conveniencia sale mejor de lo que es.",
        "¿<b>Estimar</b> un porcentaje (más casos) o <b>decidir</b> si hay problema (LQAS, pocos casos)?"
      ],
      secciones: [
        { t: "1 · Qué es una evidencia", h: `
          <p>Toda información <b>documentada, verificable y objetiva</b> que respalda las conclusiones. La ISO 19011 la define como registros, declaraciones de hechos u otra información <b>pertinente y verificable</b>.</p>
          ${trampa("Una opinión no es una evidencia. «La supervisora cree que se cumple» no vale; «en 18 de 20 historias consta la valoración» sí.")}` },
        { t: "2 · Tipos de evidencia y triangulación", h: `
          <table class="mini facil-tabla"><tr><th>Tipo</th><th>Para qué sirve</th></tr>
            <tr><td><b>Documental</b></td><td>Protocolos, hojas de verificación, historias clínicas: ¿se ajusta lo registrado a lo planificado?</td></tr>
            <tr><td><b>Observación directa</b></td><td>Ver la práctica real (higiene de manos, identificación), que a veces no queda en los registros.</td></tr>
            <tr><td><b>Entrevistas</b></td><td>Contexto: por qué ocurren las desviaciones.</td></tr>
            <tr><td><b>Registros electrónicos</b></td><td>Bases de datos y sistemas de información: potentes, pero hay que saber interpretarlos.</td></tr></table>
          ${idea("<b>Triangular</b> es contrastar varias fuentes: lo registrado, lo observado y lo que cuentan los profesionales. Si coinciden, la conclusión es sólida; si no, has encontrado algo interesante.")}` },
        { t: "3 · Principios para recoger evidencias", h: `
          <ul><li><b>Veracidad y pertinencia</b>: auténtica y relacionada con lo auditado.</li>
          <li><b>Trazabilidad</b>: se puede seguir hasta su origen y volver a comprobar.</li>
          <li><b>Relevancia</b>: aporta valor; no toda la información disponible es útil.</li>
          <li><b>Fiabilidad de las fuentes</b>: documentos oficiales, actualizados y completos.</li>
          <li><b>Imparcialidad</b>: quien forma parte del proceso auditado debe declararlo.</li>
          <li><b>Confidencialidad</b>: proteger los datos de pacientes y profesionales.</li></ul>` },
        { t: "4 · Instrumentos de evaluación", h: `
          <ul><li><b>Lista de verificación (checklist)</b>: los puntos a revisar, uno a uno (Sí / No / No aplica).</li>
          <li><b>Guía de entrevista</b>: preguntas abiertas o cerradas preparadas de antemano.</li>
          <li><b>Observación estructurada</b>: un guion para anotar de forma objetiva lo que se ve.</li>
          <li><b>Matriz de hallazgos</b>: tabla con cada hallazgo, su evidencia y su gravedad.</li>
          <li><b>Registro de no conformidades</b>: las desviaciones, con su evidencia y, si se conoce, su causa.</li></ul>
          ${practica("Los instrumentos no son burocracia: garantizan que todo el equipo auditor trabaja con el mismo criterio.")}` },
        { t: "5 · La muestra: cuáles y cuántos", h: `
          <p>Casi nunca se puede revisar todo. Se revisa una parte (la <b>muestra</b>) del total (el <b>universo</b>) y se sacan conclusiones. Para que valgan, la muestra debe ser <b>aleatoria</b>:</p>
          <ul><li><b>Aleatorio simple</b>: se numera el listado y se sortean números.</li>
          <li><b>Sistemático</b>: un caso cada k = N ÷ n, tras un arranque al azar (cuidado si el listado tiene patrones).</li>
          <li><b>Estratificado</b>: se sortea dentro de cada grupo (turnos, unidades) para que todos estén representados.</li></ul>
          ${idea("Para saber si la sopa está salada basta una cucharada… después de <b>remover</b>. Remover es el azar.")}
          <p><b>¿Cuántos casos?</b></p>
          <ul><li><b>Regla práctica</b>: unas 50 historias (mínimo 30) para evaluaciones internas. Solo detecta cambios grandes.</li>
          <li><b>Estimar con precisión</b>: n = z² × p × (1 − p) ÷ e². Con 95 % de confianza y ±10 %: <b>97</b> historias; con ±5 %: <b>385</b> (menos si el universo es pequeño).</li>
          <li><b>Decidir</b> si se alcanza el estándar: <b>LQAS</b>, con 15 a 35 casos.</li></ul>
          ${trampa("La muestra de conveniencia («las 20 historias que hay sobre la mesa») no vale: lo más reciente y lo más a mano suele estar mejor cumplimentado.")}` },
        { t: "6 · Estimar o decidir: LQAS", h: `
          <p>El <b>LQAS</b> (muestreo para la aceptación de lotes) no mide cuánto se cumple: funciona como un <b>semáforo</b>. Se fijan el <b>estándar</b> (lo que queremos mantener), el <b>umbral</b> (la línea roja) y los errores aceptados; unas tablas dan <b>n</b> (casos a revisar) y <b>c</b> (cumplimientos mínimos). Si en los n casos hay c o más cumplimientos, se acepta; si hay menos, hay que investigar.</p>
          ${ejemplo("registro del dolor en triaje", "<p>Estándar 85 %, umbral 60 %, α = 5 %, β = 20 % → <b>n = 16, c = 11</b>. Si hay 12 historias con el dolor registrado, se acepta; si hay 10, hay que investigar.</p>")}
          ${trampa("Con pocas historias, un porcentaje por debajo del estándar <b>no basta</b> para afirmar el «no cumple»: con 16 de 20 (80 %) el valor real puede estar entre el 62 % y el 98 %. Decide con LQAS o amplía la muestra.")}
          <p>Para hacer estos cálculos con tus datos tienes la app hermana <a href="https://cjgaland.github.io/tamano-muestral/" target="_blank" rel="noopener">Tamaño Muestral ↗</a>.</p>` },
        { t: "7 · Buenas prácticas", h: `
          <ul><li><b>Planifica</b> qué información necesitas, con qué instrumento, quién la recoge, cuándo, y de qué universo y con qué muestra.</li>
          <li><b>Registra</b> en el momento y de forma estructurada, sin interpretaciones.</li>
          <li><b>Valida</b> los hallazgos preliminares con los profesionales implicados cuando proceda.</li>
          <li><b>Protege</b> los datos: nunca nombres; usa códigos (HC-01, HC-02…).</li>
          <li><b>Custodia</b> la documentación para la auditoría de seguimiento.</li></ul>` }
      ],
      minicaso: `<p>Para verificar la higiene de manos en un Hospital de Día se combinan: <b>documentales</b> (registros de formación de los últimos 12 meses y consumo de solución hidroalcohólica), <b>observación directa</b> con lista de verificación en turnos y días elegidos al azar (muestreo estratificado, para no observar solo los momentos tranquilos) y <b>entrevistas</b> breves sobre las barreras para cumplir. Todo se anota en una matriz de hallazgos y se valida con los responsables de la unidad.</p>`,
      practica: { texto: "Abrir Tamaño Muestral ↗", href: "https://cjgaland.github.io/tamano-muestral/", fuera: true }
    },
    {
      n: 5, titulo: "El informe de resultados", sub: "Interpretar, redactar y comunicar", pdca: "V", fase: "verificar",
      minuto: [
        "El informe convierte los datos en <b>decisiones</b>: hallazgos, conclusiones y recomendaciones.",
        "Debe ser <b>claro, objetivo, coherente y útil</b>.",
        "Cada hallazgo se vincula a su <b>evidencia</b> y se clasifica: conformidad, no conformidad u observación.",
        "Interpretar es comparar con el estándar, mirar tendencias y buscar <b>causas</b>, no solo síntomas.",
        "Se <b>valida el borrador</b> con los responsables y se adapta a cada destinatario (resumen ejecutivo para la Dirección)."
      ],
      secciones: [
        { t: "1 · Qué debe tener un buen informe", h: `
          <ul><li><b>Claridad</b>: comprensible para todos los destinatarios.</li>
          <li><b>Objetividad</b>: cada hallazgo, fundamentado en evidencias verificables.</li>
          <li><b>Coherencia</b>: trazabilidad entre criterios, evidencias e indicadores.</li>
          <li><b>Utilidad práctica</b>: conclusiones y recomendaciones concretas.</li></ul>` },
        { t: "2 · Estructura", h: `
          <ol><li><b>Portada</b> y datos: título, fecha, unidad o proceso, equipo auditor, quién elabora, revisa y aprueba.</li>
          <li><b>Objetivo</b>: qué se pretendía evaluar y por qué.</li>
          <li><b>Alcance y criterios</b>: qué se revisó, bajo qué normas y con qué límites.</li>
          <li><b>Metodología</b>: técnicas de recogida, instrumentos, muestra.</li>
          <li><b>Hallazgos y evidencias</b>: los hechos, con su prueba.</li>
          <li><b>Conclusiones y recomendaciones</b>: fortalezas, no conformidades y acciones propuestas.</li>
          <li><b>Anexos</b>: listas de verificación, matriz de hallazgos, indicadores, cronograma.</li></ol>
          ${practica("Esta app generará el informe completo (en Word y PDF) a partir de lo que vayas completando en cada fase.")}` },
        { t: "3 · Redactar hallazgos", h: `
          <ul><li><b>Conformidad</b>: se cumple el criterio.</li>
          <li><b>No conformidad</b>: no se cumple el criterio (con la evidencia que lo demuestra).</li>
          <li><b>Observación</b>: no es un incumplimiento, pero conviene vigilarlo o mejorarlo.</li></ul>
          ${ejemplo("redacción neutral", "<p>✘ «El personal de noche no se lava las manos».<br>✔ «El cumplimiento de higiene de manos fue del 65 % de las oportunidades observadas (objetivo 90 %); el menor cumplimiento se registró en el turno de noche».</p>")}` },
        { t: "4 · Interpretar los datos", h: `
          <ul><li><b>Compara</b> con el estándar y el contexto: un dato aislado no dice nada.</li>
          <li><b>Mira la evolución</b>, no solo la foto de hoy, e intenta llegar a la <b>causa raíz</b>.</li>
          <li><b>Comprueba la calidad del dato</b>: errores de registro, duplicidades, datos sin actualizar.</li>
          <li><b>No te precipites</b>: con pocos casos, el margen de error es grande.</li></ul>` },
        { t: "5 · Comunicar y principios éticos", h: `
          <p>Adapta el mensaje: <b>resumen ejecutivo</b> para la Dirección, detalle para los equipos. Usa tablas y gráficos y organiza una <b>reunión de devolución</b> para resolver dudas. Antes de cerrarlo, <b>valida el borrador</b> con los responsables del área: refuerza la transparencia y la aceptación.</p>
          <p>Protección de datos, uso exclusivo para la mejora (nunca para buscar culpables), imparcialidad y respeto a los equipos auditados.</p>` }
      ],
      minicaso: `<p>Auditoría de higiene de manos en hospitalización: cumplimiento del <b>65 %</b> de las oportunidades observadas frente a un objetivo del <b>90 %</b>. Al interpretar, se ven turnos con menos cumplimiento y dispensadores poco visibles. Recomendaciones: reubicar dispensadores, formación específica en los turnos con peores datos y auditoría de seguimiento a los 3 meses. El informe se presenta resumido a la Dirección y al equipo, y se acuerda un plan con responsables y fechas.</p>`,
      practica: { texto: "Ver el ejemplo completo de Urgencias", href: "#/ejemplos" }
    },
    {
      n: 6, titulo: "Mejoras y auditoría de seguimiento", sub: "Cerrar el ciclo PDCA", pdca: "A", fase: "actuar",
      minuto: [
        "Cada hallazgo se convierte en una <b>acción</b>: qué se hace, quién, en qué plazo y con qué recursos.",
        "Se prioriza por <b>criticidad, viabilidad e impacto</b>.",
        "El plan de mejora incluye <b>indicadores de seguimiento</b>.",
        "La <b>auditoría de seguimiento</b> comprueba si las mejoras han funcionado.",
        "Si la mejora es parcial, <b>no se cierra</b>: se ajusta y se vuelve a medir."
      ],
      secciones: [
        { t: "1 · De los hallazgos a las acciones", h: `
          <p>Para cada hallazgo hay que definir:</p>
          <ul><li><b>Qué acción</b> elimina la causa o reduce el riesgo.</li>
          <li><b>Quién</b> es el responsable directo (una persona o cargo, no «el equipo»).</li>
          <li><b>Plazo</b> realista, proporcional a la complejidad.</li>
          <li><b>Recursos</b> humanos, materiales o formativos.</li></ul>
          <p>Y priorizar por <b>criticidad</b> (impacto en la seguridad del paciente), <b>viabilidad</b> (¿se puede hacer con lo que hay?) e <b>impacto global</b>.</p>
          ${trampa("«Reforzar la formación» o «concienciar al personal» como única medida suele ser una intención, no una acción. Las medidas que cambian el sistema (un campo obligatorio, una alerta automática, una lista de verificación) suelen ser más eficaces.")}` },
        { t: "2 · El plan de acciones de mejora", h: `
          <ul><li><b>Objetivos</b>: qué se pretende conseguir.</li>
          <li><b>Acciones</b> concretas.</li>
          <li><b>Responsables</b>.</li>
          <li><b>Cronograma</b>: inicio y fin.</li>
          <li><b>Indicadores de seguimiento</b>: si la acción se aplica y si se alcanza el resultado.</li></ul>
          <p>Se registra y custodia con la documentación de calidad y se comunica a todos los implicados.</p>` },
        { t: "3 · La auditoría de seguimiento", h: `
          <p>Verifica si las acciones <b>se han implantado</b>, si los resultados <b>alcanzan los objetivos</b> y si quedan <b>riesgos sin resolver</b> o aparecen nuevos. La inicial identifica problemas; la de seguimiento evalúa la <b>eficacia</b> de las soluciones.</p>
          <p>Plazos: semanas para acciones sencillas; meses para cambios estructurales. Se usan las mismas técnicas que en la inicial.</p>
          ${idea("Sin seguimiento, la auditoría es un ejercicio incompleto. Plan de mejora = <b>compromiso</b>, no intención.")}` },
        { t: "4 · Cerrar el ciclo PDCA", h: `
          <ul><li><b>Planificar</b>: objetivos, alcance, criterios y plan de mejora.</li>
          <li><b>Hacer</b>: implantar las acciones.</li>
          <li><b>Verificar</b>: auditoría de seguimiento.</li>
          <li><b>Actuar</b>: ajustar, reforzar o redefinir; actualizar el Mapa de Riesgos y el Plan de Auditorías.</li></ul>
          <p><b>Factores de éxito</b>: compromiso de la Dirección, implicación de los profesionales, recursos y comunicación bidireccional. <b>Barreras</b>: falta de seguimiento real, resistencia al cambio, sobrecarga y comunicación ineficaz.</p>` }
      ],
      minicaso: `<p>La profilaxis antibiótica prequirúrgica se cumple en el <b>75 %</b> de los casos (estándar 100 %). Plan: formación del personal de quirófano, hoja de verificación actualizada y recordatorios visuales; responsables, la supervisora de quirófano y el jefe de bloque; plazo, 2 meses. A los 3 meses, la auditoría de seguimiento muestra un <b>95 %</b>: mejora notable, pero sin alcanzar el estándar. Se analizan los casos incumplidos (cirugías urgentes, cambios de turno), se ajustan las medidas y se programa otra auditoría de seguimiento. <b>No se cierra ante una mejora parcial.</b></p>`,
      practica: { texto: "Volver al inicio", href: "#/" }
    }
  ];

  // ---------- Glosario ----------
  const GLOSARIO = [
    ["Auditoría", "Proceso sistemático, independiente y documentado para obtener evidencias y evaluarlas objetivamente, con el fin de saber en qué medida se cumplen unos criterios."],
    ["Auditoría clínica", "Auditoría que revisa prácticas asistenciales (por ejemplo, el cumplimiento de un protocolo) para mejorar la calidad de la atención y la seguridad del paciente."],
    ["Auditoría interna", "La realizan profesionales de la propia organización."],
    ["Auditoría externa", "La realiza una entidad independiente (agencia de acreditación, inspección, certificadora)."],
    ["Autoauditoría", "Auditoría que hace la propia unidad sobre su trabajo. Muy habitual por operatividad, aunque pierde parte de la independencia."],
    ["Auditoría de seguimiento", "La que comprueba, tras un plan de mejora, si las acciones se han implantado y han sido eficaces."],
    ["AMFE", "Análisis Modal de Fallos y Efectos: método para identificar qué puede fallar en un proceso (modo de fallo), qué consecuencias tendría (efecto), por qué (causa) y con qué prioridad (IPR)."],
    ["Mapa de Riesgos", "Relación de los riesgos de un proceso o unidad, valorados y priorizados. Indica dónde conviene auditar."],
    ["Subproceso", "Cada una de las fases en que se divide un proceso (recepción, triaje, valoración, ingreso…)."],
    ["Modo de fallo", "Lo que puede salir mal en un subproceso. En la app lo llamamos «fallo» o «hallazgo»."],
    ["Gravedad (G)", "En el AMFE, cuánto daño causaría el fallo si ocurre. De 1 (ninguno) a 10 (catastrófico)."],
    ["Ocurrencia (O)", "En el AMFE, con qué frecuencia se produce el fallo. De 1 (remoto) a 10 (casi seguro)."],
    ["Detección (D)", "En el AMFE, lo difícil que es detectar el fallo antes de que cause daño. Va al revés: 1 = casi seguro que se detecta; 10 = imposible de detectar."],
    ["IPR", "Índice de Prioridad de Riesgo = Gravedad × Ocurrencia × Detección (de 1 a 1.000). Ordena los riesgos para empezar por los más prioritarios."],
    ["Hallazgo clave", "Riesgo del Mapa que se elige para auditar, normalmente por su IPR alto, su gravedad o su impacto."],
    ["Plan de Auditorías", "Documento aprobado y comunicado que ordena qué se audita en un periodo, con qué criterios, cuándo y con qué recursos."],
    ["Plan específico", "El detalle de una auditoría concreta: objetivo, alcance, criterios, metodología, equipo, recursos y calendario."],
    ["Alcance", "Qué se audita y hasta dónde: procesos, áreas, periodo, población. Dice también qué queda fuera."],
    ["Criterio de auditoría", "La referencia con la que se compara la práctica real: un estándar, un protocolo, una norma. Se escribe como buena práctica verificable."],
    ["Estándar de acreditación", "Requisito de calidad y seguridad fijado por una agencia (en Andalucía, la ACSA) que sirve de criterio de auditoría."],
    ["POE", "Procedimiento Operativo Estandarizado: protocolo escrito de cómo se hace una tarea."],
    ["Cronograma", "Calendario de las auditorías del plan, escalonado para evitar solapamientos y picos de trabajo."],
    ["Equipo auditor", "Personas que realizan la auditoría. Mejor formadas, multidisciplinares y, si es posible, independientes del área auditada."],
    ["Indicador", "Herramienta que convierte un criterio en un valor que se puede medir y comparar con un estándar."],
    ["Estándar (de un indicador)", "El nivel que se quiere alcanzar o mantener (por ejemplo, ≥ 90 %)."],
    ["Umbral", "Nivel a partir del cual la situación se considera claramente mala (la «línea roja»)."],
    ["Evidencia", "Información documentada, verificable y objetiva que respalda una conclusión de la auditoría."],
    ["Triangulación", "Contrastar evidencias de varias fuentes (registros, observación, entrevistas) para que la conclusión sea más fiable."],
    ["Lista de verificación", "Instrumento con los puntos a revisar uno a uno (Sí / No / No aplica). También «checklist»."],
    ["Matriz de hallazgos", "Tabla que recoge cada hallazgo con su evidencia, su clasificación y su gravedad."],
    ["Universo", "Todos los casos entre los que se puede elegir para revisar (también «marco muestral»)."],
    ["Muestra aleatoria", "Casos elegidos de forma que todos tenían la misma probabilidad de salir. La de conveniencia no vale."],
    ["Muestreo estratificado", "Sortear casos dentro de cada grupo (turno, unidad) para que todos estén representados."],
    ["LQAS", "Muestreo para la aceptación de lotes: con pocos casos decide si se acepta o se rechaza un estándar. No mide el cumplimiento, funciona como un semáforo."],
    ["Margen de error", "Lo que puede alejarse el porcentaje de la muestra del valor real. Con pocos casos es grande."],
    ["Conformidad", "Hallazgo que muestra que se cumple el criterio."],
    ["No conformidad", "Hallazgo que muestra, con evidencia, que no se cumple un criterio."],
    ["Observación", "Hallazgo que no es un incumplimiento pero conviene vigilar o mejorar."],
    ["Recomendación", "Propuesta concreta para corregir una no conformidad o reforzar una buena práctica, con responsable y prioridad."],
    ["Resumen ejecutivo", "Versión breve del informe para la Dirección: hallazgos principales, conclusiones y acciones."],
    ["Causa raíz", "El motivo de fondo de un fallo. Actuar sobre ella evita soluciones superficiales."],
    ["Plan de acción de mejora", "Documento con las acciones para corregir los hallazgos: objetivo, acción, responsable, plazos, recursos e indicador de seguimiento."],
    ["PDCA", "Ciclo de mejora continua: Planificar, Hacer, Verificar y Actuar. También llamado ciclo de Deming."],
    ["Cultura de seguridad", "Forma de trabajar en la que los fallos se ven como oportunidades de aprender y no como culpas individuales."],
    ["ISO 19011", "Norma internacional con las directrices para auditar sistemas de gestión."],
    ["ACSA", "Agencia de Calidad Sanitaria de Andalucía: acredita centros y unidades con su modelo de estándares."]
  ];

  // ---------- Ejemplos ----------
  // Ejemplo completo: proceso de admisión en Urgencias (AMFE con 15 riesgos priorizados).
  // Ids de los objetos de primer nivel con prefijo «ej-»; los riesgos y criterios, con ids propios.
  const SUB_URG = ["Recepción y registro administrativo", "Triaje de enfermería", "Estancia en sala de espera", "Valoración médica inicial", "Pruebas diagnósticas y traslado", "Comunicación de resultados y decisión clínica", "Gestión del ingreso"];
  const [REC, TRI, SAL, VAL, PRU, COM, ING] = SUB_URG;
  const r = (id, subproceso, fallo, efecto, causa, g, o, d, clave, accion = "", evidencia = "", motivo = "") =>
    ({ id, subproceso, fallo, efecto, causa, g: String(g), o: String(o), d: String(d), medidas: "", clave, accion, evidencia, motivo });
  const MAPA_URG = {
    id: "ej-mapa-urg", nombre: "Admisión en Urgencias", unidad: "Servicio de Urgencias", proceso: "Proceso de admisión en Urgencias hasta el destino final del paciente",
    fecha: "Mayo 2025", equipo: "Coordinación de Calidad y Seguridad del Paciente, supervisión de Enfermería de Urgencias, medicina, enfermería, TCAE y personal administrativo.",
    notas: "Análisis AMFE del proceso completo, desde que el paciente llega a Urgencias hasta la decisión de ingreso. Se muestran los 15 fallos con mayor IPR.",
    subprocesos: SUB_URG.slice(),
    riesgos: [
      r("u10", TRI, "Omisión de constantes clave o mal registro", "Asignación incorrecta de prioridad; fallo en la alerta de sepsis", "Automatización excesiva; omisión por prisa", 7, 7, 7, false, "Lista de verificación obligatoria en triaje y monitorización sistemática", "Registro completo en la historia clínica digital", ""),
      r("u8", TRI, "Clasificación errónea del nivel de prioridad", "Retraso en la atención; progresión del cuadro clínico", "Subestimación de signos vitales alterados; presión asistencial", 8, 7, 6, true, "Formación continua en clasificación de pacientes y doble validación en casos dudosos", "Actas de formación, revisión de casos, auditoría interna de registros", "IPR 336 (2.º del mapa). Afecta a la atención inmediata y a la seguridad del paciente."),
      r("u5", REC, "El sistema no alerta de antecedentes clínicos relevantes", "Riesgo en la atención inicial por falta de alertas previas", "Historia clínica fragmentada, mal interoperada o sin codificar", 7, 6, 7, true, "Historia clínica interoperable con alertas automáticas", "Capturas de alertas activas; informe de pruebas de interoperabilidad", "IPR 294. Riesgo transversal en todo el circuito asistencial."),
      r("u15", SAL, "Espera prolongada sin reevaluación clínica", "Empeoramiento del estado sin detectarlo", "Saturación del servicio; falta de protocolos de vigilancia activa", 7, 7, 6, true, "Protocolo de vigilancia activa y reevaluación periódica con registro", "Hojas de reevaluación cumplimentadas; auditoría de cumplimiento", "IPR 294. Alto impacto en la detección temprana de complicaciones."),
      r("u29", PRU, "Pérdida o no colocación de la pulsera identificativa", "Riesgo de realizar pruebas al paciente equivocado", "Omisión previa en triaje o retirada accidental no detectada", 7, 6, 7, false, "Doble verificación de identidad antes y durante el traslado", "Lista de verificación de pulsera; revisión de incidencias de identificación", ""),
      r("u9", TRI, "No detección de paciente frágil o con deterioro cognitivo", "Pérdida de oportunidad de atención prioritaria y acompañamiento", "Falta de cribado geriátrico; comunicación deficiente", 7, 6, 6, true, "Cribado geriátrico obligatorio en triaje (índice de fragilidad breve)", "Formularios de cribado cumplimentados; indicadores trimestrales", "IPR 252. Riesgo crítico para la atención prioritaria del paciente vulnerable."),
      r("u23", VAL, "No conciliación de la medicación habitual", "Interacciones, duplicidades o errores de tratamiento", "Falta de tiempo; no consultar la historia previa ni la base de datos farmacológica", 7, 6, 6, true, "Herramienta electrónica de conciliación obligatoria al ingreso", "Registro de conciliación en la historia digital; errores evitados", "IPR 252. Riesgo alto de eventos adversos por errores de medicación."),
      r("u36", COM, "No revisión o interpretación incompleta de resultados", "Diagnóstico erróneo o retrasado", "Saturación, distracciones, falta de seguimiento", 7, 6, 6, true, "Doble validación de resultados críticos y formación en interpretación", "Protocolo de doble validación; lista de resultados revisados; incidencias", "IPR 252. Riesgo de errores diagnósticos o retrasos clínicos relevantes."),
      r("u45", ING, "Falta de coordinación entre Urgencias y la planta receptora", "Omisión de datos importantes, duplicidades o discontinuidad asistencial", "Comunicación incompleta, registros no compartidos, traslado precipitado", 7, 6, 6, false, "Transferencia clínica estructurada (SBAR) con confirmación de recepción", "Protocolos SBAR firmados; auditoría de transferencias", ""),
      r("u7", REC, "Falta de protocolo ante paciente frágil", "No se activa el circuito preferente ni el seguimiento específico", "Desconocimiento del riesgo o falta de cribado geriátrico inicial", 6, 6, 6, true, "Formulario de cribado geriátrico en admisión con alerta automática en triaje", "Formularios de cribado cumplimentados; activación de alertas", "IPR 216. Falta un circuito seguro para el paciente frágil desde el primer contacto."),
      r("u16", SAL, "Falta de acompañamiento o supervisión", "Riesgo de caídas, desorientación o ansiedad", "Recursos humanos limitados; paciente frágil sin alerta de riesgo", 6, 6, 6, true, "Enfermera de sala para pacientes con alerta de riesgo, con control de acompañamiento", "Registro de vigilancia activa; lista de seguimiento de pacientes frágiles", "IPR 216. Riesgo de caídas y desorientación en pacientes vulnerables."),
      r("u30", PRU, "Confusión de camillas al volver de pruebas", "Error de localización o atención a paciente equivocado", "Falta de etiquetado visible; desorganización en pasillos o boxes", 6, 6, 6, false, "Etiquetado visible de camillas y doble identificación en destino", "Lista de verificación de traslado; revisión de errores", ""),
      r("u43", ING, "Demora prolongada en encontrar cama disponible", "Empeoramiento del estado clínico, descompensación", "Saturación hospitalaria; falta de planificación anticipada", 6, 6, 6, true, "Panel de camas actualizado en tiempo real e integrado con el sistema de ingresos", "Tiempo medio hasta la ubicación; informe de ocupación", "IPR 216. Impacto en el estado clínico y en la continuidad del tratamiento."),
      r("u3", REC, "Omisión de datos clínicos relevantes (alergias, medicación)", "Falta de información crítica para el triaje y la atención médica", "No recogida sistemática; desconocimiento de su importancia", 7, 6, 5, false, "Recogida sistemática de información crítica en admisión con revisión cruzada", "Campo obligatorio en el sistema; validación de registros completos", ""),
      r("u11", TRI, "No colocación de pulsera identificativa", "Riesgo de error de identidad en pruebas o medicación", "Rutina interrumpida; recursos saturados", 6, 6, 5, true, "Reforzar el protocolo de identificación con verificación en triaje y auditorías mensuales", "Informe de cumplimiento; registro de pulseras colocadas; incidencias", "IPR 180, pero un error de identidad puede tener consecuencias graves en pruebas y medicación.")
    ],
    creado: "2025-05-30T09:00:00.000Z", modificado: "2025-05-30T09:00:00.000Z"
  };
  const c = (id, subproceso, riesgoId, hallazgo, criterio) => ({ id, subproceso, riesgoId, hallazgo, criterio });
  const AUD_URG = {
    id: "ej-aud-urg", titulo: "Auditoría interna del proceso de admisión en Urgencias", unidad: "Servicio de Urgencias", centro: "Hospital (ejemplo)",
    proceso: "el proceso de admisión en Urgencias hasta la decisión de ingreso",
    origen: { tipo: "riesgos", mapaId: "ej-mapa-urg", riesgoIds: ["u8", "u5", "u15", "u23", "u9", "u36", "u43", "u16", "u7", "u11"], detalle: "" },
    tipo: "interna", objeto: "proceso",
    introduccion: "Esta auditoría clínica interna evalúa el proceso completo de admisión en el Área de Urgencias, desde que el paciente accede al área asistencial hasta la decisión de ingreso hospitalario, sin incluir el seguimiento posterior en planta. Parte de los resultados del AMFE realizado sobre el proceso y se centra en los riesgos con mayor IPR.",
    objetivoGeneral: "Evaluar el grado de cumplimiento y la eficacia de las medidas de seguridad implantadas en los subprocesos críticos del circuito de admisión en Urgencias, desde que el paciente accede al área asistencial hasta la decisión de ingreso hospitalario, centrándose en los riesgos con mayor IPR del AMFE.",
    objetivosEsp: "Comprobar si las acciones preventivas propuestas en el AMFE se han implantado y se mantienen en la práctica clínica.\nMedir, con un indicador por criterio, el cumplimiento en los siete subprocesos del circuito.\nIdentificar los puntos críticos donde el incumplimiento supone más riesgo para el paciente.\nProponer mejoras realistas, priorizadas y con responsable.\nReforzar la cultura de seguridad del paciente en el servicio.",
    alcance: "Episodios de pacientes atendidos en el Área de Urgencias con decisión final de ingreso hospitalario, desde la llegada hasta la decisión de ingreso (sin el seguimiento posterior en planta). Siete subprocesos: recepción y registro administrativo, triaje, sala de espera, valoración médica inicial, pruebas diagnósticas y traslado, comunicación de resultados y gestión del ingreso.",
    planId: "", entradaId: "",
    hitos: { aprobacion: { hecho: true, fecha: "2025-09-08", nota: "Aprobada por la Gerencia junto con el Jefe de Servicio." }, comunicacion: { hecho: true, fecha: "2025-09-15", nota: "Sesión de servicio y correo al personal." }, validacion: { hecho: false, fecha: "", nota: "" }, devolucion: { hecho: false, fecha: "", nota: "" } },
    criterios: [
      c("c1", TRI, "u8", "Clasificación errónea del nivel de prioridad", "El nivel de prioridad asignado en triaje coincide con el reevaluado por la supervisión clínica."),
      c("c2", REC, "u5", "El sistema no alerta de antecedentes clínicos relevantes", "Los antecedentes clínicos relevantes son visibles en el campo de admisión y el sistema los alerta."),
      c("c3", SAL, "u15", "Espera prolongada sin reevaluación clínica", "Los pacientes que superan el tiempo máximo de espera se reevalúan clínicamente y queda registrado."),
      c("c4", VAL, "u23", "No conciliación de la medicación habitual", "Se documenta la conciliación de la medicación habitual antes de la prescripción en Urgencias."),
      c("c5", TRI, "u9", "No detección de paciente frágil o con deterioro cognitivo", "El triaje incluye la evaluación de la fragilidad en los pacientes de 75 años o más."),
      c("c6", COM, "u36", "No revisión o interpretación incompleta de resultados", "Los resultados críticos se comunican al responsable clínico en menos de 60 minutos y queda registrado."),
      c("c7", ING, "u43", "Demora prolongada en encontrar cama disponible", "El paciente con indicación de ingreso ocupa cama en planta en menos de 6 horas."),
      c("c8", SAL, "u16", "Falta de acompañamiento o supervisión", "Los pacientes con deterioro cognitivo o dependencia permanecen acompañados o supervisados en la sala de espera."),
      c("c9", REC, "u7", "Falta de protocolo ante paciente frágil", "Se activa el protocolo de paciente frágil en todos los pacientes identificados como frágiles en admisión."),
      c("c10", TRI, "u11", "No colocación de pulsera identificativa", "Todos los pacientes están identificados con pulsera antes de pasar a box o a pruebas.")
    ],
    creado: "2025-09-01T09:00:00.000Z", modificado: "2025-09-01T09:00:00.000Z"
  };
  // Plan Anual de ejemplo: los hallazgos del AMFE de Urgencias agrupados por subproceso, con el alcance,
  // los criterios, la frecuencia, los responsables, los recursos y las observaciones de la planificación del caso.
  const en = (id, titulo, riesgoIds, alcance, criterios, tiposCriterio, documentos, frecuencia, responsables, recursos, meses, observaciones) =>
    ({ id, titulo, mapaId: "ej-mapa-urg", riesgoIds, hallazgos: "", alcance, criterios, tiposCriterio, documentos, frecuencia, responsables, recursos, horas: "", meses, tipo: "interna", observaciones, auditoriaId: "" });
  const PLAN_URG = {
    id: "ej-plan-urg", anio: "2026", ambito: "el Servicio de Urgencias", responsable: "Coordinación de Calidad y Seguridad del Paciente",
    objetivo: "", introduccion: "", notas: "Plan de ejemplo. Los hallazgos de más riesgo se auditan cada trimestre; por eso el equipo auditor necesita capacidad para tres auditorías al mes. Agosto queda libre por las vacaciones.",
    capacidad: "3", bloqueados: [8],
    entradas: [
      en("e1", REC, ["u5", "u7", "u3"], "Funcionalidad del sistema de información (HIS) en pacientes polimedicados; 10 registros administrativos de pacientes de 80 años o más; 20 registros en los que se omitió información relevante al ingreso.", "Manual del sistema HIS y política de continuidad asistencial. Protocolo de atención a pacientes vulnerables y Plan de Humanización. Protocolo de recogida de datos al ingreso.", ["procedimental"], "Registro administrativo y pantalla del HIS, checklist administrativo, hoja de ingreso, historia clínica y hoja de alergias.", "trimestral", "Supervisor/a de Admisión y Médico Responsable de Área, con apoyo del Técnico de Calidad y del Responsable TIC.", "HIS, protocolos de verificación, capturas de pantalla, plantilla de entrada de datos, checklist de validación, entrevistas a profesionales.", [2, 5, 9, 11], "Incluir la revisión de la historia clínica en el protocolo de admisión."),
      en("e2", TRI, ["u10", "u8", "u9", "u11"], "Registros de triaje de los últimos 30 días (20 historias de pacientes mayores de 70 años); casos con discrepancias entre triaje y atención médica; triajes de mayores de 75 años sin valoración de fragilidad; colocación de la pulsera en 10 turnos consecutivos.", "Protocolo de triaje y de clasificación de prioridad. Estándares ACSA de valoración inicial e identificación de riesgos. Protocolo de identificación del paciente frágil. Protocolo de identificación segura del paciente.", ["procedimental", "regulatorio"], "Historia clínica electrónica, hoja de triaje, HIS, escalas FRAIL y Barthel, lista de pacientes, observación directa.", "trimestral", "Supervisora de Enfermería y Responsable de Calidad, con el Médico Responsable de Área.", "Checklist de triaje validado, acceso a historias clínicas, revisión cruzada, observación directa, formación puntual previa.", [1, 4, 7, 10], "Incluir sesiones formativas previas al arranque de la auditoría."),
      en("e3", SAL, ["u15", "u16"], "Pacientes que permanecieron más de 2 horas sin reevaluación en los últimos 15 días; presencia de acompañante en pacientes dependientes.", "Procedimiento de reevaluación en Urgencias. Protocolo de atención a personas con discapacidad y normas de acogida.", ["procedimental"], "Registro enfermero, observaciones del HIS, registro de acompañantes, hoja de enfermería.", "trimestral", "Supervisor/a de guardia y Supervisor/a del Área Social, con el Médico de guardia.", "Observación in situ, hoja de reevaluación, control de tiempos en el HIS, registro de incidencias.", [3, 6, 9, 12], "Valorar si hay condiciones estructurales que limiten las mejoras."),
      en("e4", VAL, ["u23"], "Historias clínicas sin conciliación de la medicación registrada en las primeras 12 horas.", "Protocolo de conciliación de la medicación. Recomendaciones del Ministerio de Sanidad.", ["procedimental", "normativo"], "Historia clínica, hoja de evolución médica, módulo de prescripción.", "trimestral", "Jefe/a de Urgencias y Farmacia.", "Historia clínica, herramienta de conciliación farmacológica, formularios específicos.", [2, 5, 9, 11], "Hacer una muestra cruzada con la receta electrónica."),
      en("e5", PRU, ["u29", "u30"], "Uso correcto de la pulsera en pacientes trasladados a Radiología; 10 trayectos recientes desde Radiología (coincidencias y errores).", "Protocolo de identificación del paciente y procedimiento de traslado seguro. Estándares ACSA.", ["procedimental", "regulatorio"], "Registros de triaje, hoja de pruebas, checklist de traslado, registro de salida y entrada.", "trimestral", "Supervisor/a de Enfermería y Técnico de Transporte, con el Técnico de Calidad.", "Observación directa, checklist de identificación, etiquetado visual, simulacro de trazabilidad.", [1, 4, 7, 10], "Comprobar el cumplimiento del checklist de identificación en los traslados."),
      en("e6", COM, ["u36"], "Casos con resultados críticos no validados o comunicados con más de 2 horas de retraso.", "Protocolo de gestión de resultados críticos. Norma ISO 15189 del laboratorio clínico.", ["procedimental", "regulatorio"], "Registro del laboratorio, trazabilidad en el HIS, hoja de evolución médica.", "semestral", "Médico Responsable de Guardia y Coordinación Médica.", "Resultados en el HIS, actas de sesión clínica, hoja de verificación.", [6, 12], "Revisar qué sistemas de validación y doble lectura existen."),
      en("e7", ING, ["u45", "u43"], "Ingresos no documentados o con más de 3 horas de retraso tras la orden médica; hora de la orden de ingreso frente a la hora efectiva de ocupación de cama.", "Procedimiento de coordinación entre unidades y de gestión de camas. Instrucción operativa del servicio de salud.", ["procedimental"], "Parte de ingreso, parte de camas, comunicaciones en el HIS, hoja de enfermería.", "trimestral", "Jefatura de Urgencias, Admisión y Supervisión de planta.", "Hojas de traspaso, registro de tiempos, protocolo de asignación de camas, entrevistas a profesionales.", [1, 4, 7, 10], "Medir el tiempo desde la indicación de ingreso hasta el traslado efectivo.")
    ],
    roles: {
      coordinacion: "Coordinación de Calidad y Seguridad del Paciente: planifica, coordina los grupos de trabajo y consolida los resultados.",
      equipo: "Equipo multidisciplinar: supervisión de Enfermería de Urgencias, un facultativo, enfermería asistencial, TCAE, personal administrativo y un técnico de calidad como observador externo al servicio.",
      revision: "Supervisión de Enfermería y Jefatura de Servicio: revisan las acciones correctoras y su eficacia en las auditorías de seguimiento.",
      direccion: "Gerencia y Dirección Médica y de Enfermería: aprueban el plan, lo difunden y garantizan tiempo y recursos.",
      auditados: "Profesionales del Servicio de Urgencias: conocen el plan con antelación y participan en la definición de mejoras."
    },
    aprobacion: { fecha: "2026-01-12", comunicado: true, fechaComunicacion: "2026-01-19", via: "sesión de servicio y correo a todo el personal" },
    control: {
      elaborado: [{ nombre: "", cargo: "Coordinador/a de Calidad y Seguridad del Paciente" }, { nombre: "", cargo: "Técnicos de Calidad y Seguridad del Paciente" }],
      revisado: [{ nombre: "", cargo: "Jefe/a de Servicio de Urgencias" }],
      aprobado: [{ nombre: "", cargo: "Gerencia del Área de Gestión Sanitaria" }],
      historial: [{ edicion: "00", fecha: "2026-01-12", cambio: "Documento inicial" }]
    },
    creado: "2026-01-12T09:00:00.000Z", modificado: "2026-01-12T09:00:00.000Z"
  };

  // Minicaso inventado (a partir del minicaso de planificación): Hospitalización Médica
  const SUB_HOS = ["Ingreso", "Prescripción y administración", "Aislamiento", "Cuidados de enfermería"];
  const MAPA_HOS = {
    id: "ej-mapa-hos", nombre: "Hospitalización Médica", unidad: "Unidad de Hospitalización Médica", proceso: "Atención al paciente ingresado en planta médica",
    fecha: "", equipo: "Supervisión de la unidad, dos facultativos, dos enfermeras y Farmacia.",
    notas: "Minicaso con cifras inventadas. Fíjate en la administración de medicamentos: su IPR no es de los más altos, pero su gravedad es 9 y se ha elegido igualmente, con su motivo.",
    subprocesos: SUB_HOS.slice(),
    riesgos: [
      r("h1", "Ingreso", "Errores en la conciliación de la medicación en pacientes pluripatológicos", "Duplicidades, omisiones o interacciones", "Información incompleta al ingreso; falta de tiempo", 8, 6, 6, true, "Conciliación estructurada por Farmacia en las primeras 24 h", "Registro de conciliación en la historia", "IPR 288, el más alto del mapa. Frecuente en pacientes pluripatológicos."),
      r("h2", "Prescripción y administración", "Administración de un medicamento al paciente equivocado", "Daño grave por fármaco no indicado", "Interrupciones; no verificar la identidad antes de administrar", 9, 3, 5, true, "Verificación de identidad con pulsera antes de cada administración", "Observación directa de rondas de medicación", "Aunque su IPR (135) no es de los primeros, la gravedad es 9: un solo error puede causar un daño grave."),
      r("h3", "Aislamiento", "Aislamiento no aplicado o retrasado en infecciones transmisibles", "Transmisión cruzada a otros pacientes", "Resultado microbiológico no comunicado; falta de habitaciones", 7, 5, 5, true, "Alerta automática de microbiología y circuito de asignación de habitación", "Registro de alertas y hora de inicio del aislamiento", "IPR 175. Impacto en otros pacientes y en la seguridad de la unidad."),
      r("h4", "Cuidados de enfermería", "Valoración del riesgo de úlceras por presión no registrada al ingreso", "Úlceras evitables", "Carga de trabajo; escala no integrada en el registro", 6, 6, 5, false),
      r("h5", "Cuidados de enfermería", "No valoración del riesgo de caídas", "Caídas con lesión", "Escala no aplicada en reingresos", 7, 6, 4, false)
    ],
    creado: "2026-01-15T09:00:00.000Z", modificado: "2026-01-15T09:00:00.000Z"
  };
  const EJEMPLOS = {
    mapas: [MAPA_URG, MAPA_HOS],
    auditorias: [AUD_URG],
    planes: [PLAN_URG],
    fichas: [
      { href: "#/riesgos/ej-mapa-urg", t: "Urgencias · Mapa de Riesgos", s: "AMFE del proceso de admisión: 15 riesgos priorizados y 10 hallazgos clave" },
      { href: "#/plan/ej-plan-urg", t: "Urgencias · Plan Anual", s: "7 auditorías por subproceso con alcance, criterios, frecuencia, responsables y cronograma" },
      { href: "#/auditoria/ej-aud-urg", t: "Urgencias · Auditoría", s: "Origen, objetivos y los 10 criterios a auditar en 7 subprocesos" },
      { href: "#/riesgos/ej-mapa-hos", t: "Hospitalización · Minicaso", s: "5 riesgos: por qué el IPR no lo es todo" }
    ]
  };

  const API = { TEMAS, GLOSARIO, EJEMPLOS };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else raiz.Contenido = API;
})(typeof window !== "undefined" ? window : globalThis);
