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
        // [eco]
        "Para diseñarlos a fondo tienes la app hermana <b>Indicadores</b>."
        // [/eco]
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
      // [eco]
      practica: { texto: "Abrir la app Indicadores ↗", href: "https://cjgaland.github.io/indicadores-calidad/", fuera: true }
      // [/eco]
      /* [ind]
      practica: { texto: "Ver los indicadores del ejemplo de Urgencias", href: "#/ejemplos" }
      [/ind] */
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
          <p>Para hacer estos cálculos con tus datos tienes <!--[eco]-->la app hermana <a href="https://cjgaland.github.io/tamano-muestral/" target="_blank" rel="noopener">Tamaño Muestral ↗</a><!--[/eco]--><!--[ind]la calculadora <a href="tamano-muestral/" target="_blank" rel="noopener">Tamaño Muestral ↗</a>, incluida en esta app[/ind]-->.</p>` },
        { t: "7 · Buenas prácticas", h: `
          <ul><li><b>Planifica</b> qué información necesitas, con qué instrumento, quién la recoge, cuándo, y de qué universo y con qué muestra.</li>
          <li><b>Registra</b> en el momento y de forma estructurada, sin interpretaciones.</li>
          <li><b>Valida</b> los hallazgos preliminares con los profesionales implicados cuando proceda.</li>
          <li><b>Protege</b> los datos: nunca nombres; usa códigos (HC-01, HC-02…).</li>
          <li><b>Custodia</b> la documentación para la auditoría de seguimiento.</li></ul>` }
      ],
      minicaso: `<p>Para verificar la higiene de manos en un Hospital de Día se combinan: <b>documentales</b> (registros de formación de los últimos 12 meses y consumo de solución hidroalcohólica), <b>observación directa</b> con lista de verificación en turnos y días elegidos al azar (muestreo estratificado, para no observar solo los momentos tranquilos) y <b>entrevistas</b> breves sobre las barreras para cumplir. Todo se anota en una matriz de hallazgos y se valida con los responsables de la unidad.</p>`,
      // [eco]
      practica: { texto: "Abrir Tamaño Muestral ↗", href: "https://cjgaland.github.io/tamano-muestral/", fuera: true }
      // [/eco]
      /* [ind]
      practica: { texto: "Abrir Tamaño Muestral ↗", href: "tamano-muestral/", fuera: true }
      [/ind] */
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
      practica: { texto: "Ver el plan de mejora del ejemplo", href: "#/auditoria/ej-aud-urg/mejora/2" }
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
  // Criterio con su diseño: indicador, evidencias e instrumentos, muestra y pilotaje
  // Casos de la recogida: n casos que cumplen salvo los de las posiciones «nos» (1, 2…); obs = { posición: texto }
  const casos = (n, nos, pref = "HC", obs = {}) => Array.from({ length: n }, (_, i) => ({ codigo: `${pref}-${String(i + 1).padStart(2, "0")}`, listado: "", valor: nos.includes(i + 1) ? "no" : "si", obs: obs[i + 1] || "" }));
  const rec = (cs, evidencia, comentario, observaciones = "") => ({ casos: cs, evidencia, comentario, observaciones });
  const c = (id, subproceso, riesgoId, hallazgo, criterio, ind = {}, evid = {}, muestra = {}, pares = [], recogida = null) => ({
    id, subproceso, riesgoId, hallazgo, criterio, origenId: "",
    ind: Object.assign({ nombre: "", tipo: "proceso", numerador: "", denominador: "", sentido: "mas", estandar: "", fuente: "", exclusiones: "", cumpleSi: "", noAplicaSi: "" }, ind),
    evid: Object.assign({ tipos: [], triangulacion: "", principios: [], instrumentos: [], justificacion: "" }, evid),
    muestra: Object.assign({ objetivo: "decidir", N: "", e: "10", p: "50", beta: "20", umbral: "", n: "", metodo: "aleatorio", unidad: "", sorteo: [] }, muestra),
    piloto: { pares: pares.map(([a, b]) => ({ a, b })), nota: pares.length ? "Pilotaje con dos auditoras sobre historias de abril, antes de la recogida real." : "" },
    recogida: recogida || { casos: [], evidencia: "", comentario: "", observaciones: "" },
    analisis: { clasif: "", interpretacion: "", porques: ["", "", "", "", ""], categorias: [], causaRaiz: "", recs: [] }
  });
  // Análisis de cada criterio: interpretación, causas y recomendaciones (las del informe del caso)
  const an = (clasif, interpretacion, porques, categorias, causaRaiz, recs) => ({ clasif, interpretacion, porques: [...porques, "", "", "", "", ""].slice(0, 5), categorias, causaRaiz,
    recs: recs.map(([texto, responsable, prioridad, motivo], k) => ({ id: "r" + k, texto, responsable, prioridad, motivo, plazo: "" })) });
  const ANALISIS_URG = {
    c1: an("observacion", "2 discrepancias en 10 casos (20 %) frente a un máximo del 10 %. El LQAS acepta (8 de 10 sin discrepancia; hacían falta 7): no hay evidencia suficiente de incumplimiento, pero el valor observado y el margen (±25 puntos) aconsejan vigilarlo con una muestra mayor.",
      ["La prioridad asignada en triaje no coincide con la de la supervisión clínica", "No se valoraron algunas constantes alteradas", "La clasificación se hace con prisa en los momentos de saturación", "No hay doble validación en los casos dudosos"], ["personas", "procedimiento", "entorno"],
      "Subestimación de signos vitales alterados en situaciones de presión asistencial, sin un mecanismo de doble validación en los casos dudosos.",
      [["Reforzar la formación específica en triaje clínico estructurado para el personal de enfermería, asegurando la correcta aplicación de los criterios de priorización.", "Supervisión de Enfermería de Urgencias", "alta", "Afecta directamente a la seguridad clínica y a los tiempos críticos de atención."],
       ["Establecer auditorías trimestrales de revisión cruzada de los triajes, para identificar patrones de error y ofrecer retroalimentación formativa.", "Responsable de Calidad", "media", "Mejora progresiva sin impacto inmediato sobre el riesgo."]]),
    c2: an("observacion", "16 de 20 historias con los antecedentes visibles en admisión (80 %) frente al 90 %. El LQAS acepta (16 ≥ 15): no se puede afirmar el incumplimiento con ±18 puntos de margen, pero conviene vigilarlo. En los casos que no cumplen, los antecedentes estaban registrados en otros apartados de la historia.",
      ["Los antecedentes no se ven en el campo de admisión", "Están registrados en otros apartados de la historia", "El módulo de admisión no tiene un campo visible obligatorio", "La historia está fragmentada entre aplicaciones"], ["sistemas", "procedimiento"],
      "Historia clínica fragmentada y sin un campo visible y obligatorio para los antecedentes relevantes en el módulo de admisión.",
      [["Solicitar al servicio TIC la creación de un campo obligatorio y visible en el módulo de admisión para consignar los antecedentes clínicos relevantes.", "Coordinador/a de Sistemas de Información", "alta", "Cambio estructural con efecto directo en el acceso a información clínica crítica."],
       ["Realizar sesiones de sensibilización al personal administrativo sobre el registro riguroso de los antecedentes clínicos en admisión.", "Jefe/a de Sección de Admisión", "media", "Requiere cambio de hábitos; impacto gradual."]]),
    c3: an("noConformidad", "En los 10 primeros casos, 6 tienen reevaluación registrada (hacían falta 7): el LQAS rechaza. Hay evidencia de que no se alcanza el estándar del 90 % de reevaluación en esperas superiores a 60 minutos.",
      ["Pacientes con más de 60 minutos de espera sin reevaluación registrada", "La reevaluación de la sala de espera no está asignada a un profesional concreto", "El protocolo no fija la periodicidad ni quién la hace", "En los momentos de saturación se prioriza el triaje de los que llegan", "No hay ninguna alerta que avise de que se ha superado el tiempo"], ["organizacion", "procedimiento", "sistemas"],
      "No existe un circuito de vigilancia activa de la sala de espera: la reevaluación no está asignada ni hay alertas de tiempo, y se pierde en los momentos de saturación.",
      [["Implantar un sistema de alertas automáticas en el módulo informático de Urgencias que avise a Enfermería cuando un paciente supere el tiempo de espera permitido.", "Supervisor/a de Enfermería del Área de Urgencias", "alta", "Permite actuar de forma inmediata y garantizar la reevaluación."],
       ["Incorporar al protocolo de triaje una revisión sistemática cada 60 minutos de los pacientes en espera, con un responsable asignado por turno.", "Coordinador/a Médico de Urgencias", "media", "Facilita la actualización periódica del estado clínico."]]),
    c4: an("observacion", "8 de 10 pacientes con la medicación habitual registrada antes de la prescripción (80 %) frente al 90 %. El LQAS acepta (8 ≥ 7): no hay evidencia suficiente de incumplimiento, aunque el margen es amplio (±25 puntos).",
      ["La medicación habitual no se registra antes de prescribir", "El módulo de prescripción permite prescribir sin ella", "Falta de tiempo en la valoración inicial"], ["sistemas", "personas"],
      "El sistema de prescripción no exige registrar la medicación habitual antes de la primera prescripción y la valoración inicial se hace con presión de tiempo.",
      [["Añadir un campo obligatorio en el módulo de prescripción electrónica que exija registrar la medicación habitual antes de permitir la prescripción urgente.", "Coordinador/a de Farmacia Hospitalaria", "alta", "Verificación estructural del dato clave."],
       ["Ofrecer una formación breve y práctica al personal médico sobre la conciliación de la medicación al ingreso.", "Jefe/a de Servicio de Urgencias", "media", "Intervención de bajo coste que refuerza la sensibilización."]]),
    c5: an("observacion", "15 de 20 pacientes de 75 años o más con la escala de fragilidad registrada (75 %) frente al 80 %. En los 19 primeros, 14 (hacían falta 12): el LQAS acepta. No se puede afirmar el incumplimiento, pero la herramienta no se aplica de forma sistemática.",
      ["No se registra la escala de fragilidad en todos los mayores de 75 años", "La escala no está integrada en el registro de triaje", "Parte del personal no conoce la herramienta"], ["procedimiento", "sistemas", "personas"],
      "Falta de un cribado geriátrico sistemático integrado en el registro de triaje.",
      [["Implantar un protocolo obligatorio de detección de fragilidad en mayores de 75 años durante el triaje, incorporando la herramienta al registro digital.", "Coordinación de Enfermería de Urgencias", "alta", "Impacto inmediato en la identificación de pacientes vulnerables."],
       ["Formar al personal de triaje en herramientas de cribado de fragilidad (FRAIL o similar) mediante sesiones clínicas prácticas.", "Unidad de Formación Continuada", "media", "Refuerza las competencias necesarias para consolidar el cambio."]]),
    c6: an("noConformidad", "6 de 10 resultados críticos comunicados en menos de 60 minutos (hacían falta 7): el LQAS rechaza. Hay evidencia de que no se alcanza el estándar del 90 %; la demora puede retrasar decisiones clínicas urgentes.",
      ["Los resultados críticos se comunican con más de 60 minutos de demora", "El laboratorio no localiza con rapidez al responsable clínico", "No hay un listado actualizado de responsables de guardia por turno", "El sistema no lanza una alerta con confirmación de lectura"], ["comunicacion", "sistemas", "organizacion"],
      "Circuito de comunicación de resultados críticos sin alerta automática ni responsable claramente identificado en cada turno.",
      [["Definir un circuito de alerta automática para resultados críticos en el sistema informático, con trazabilidad de la recepción por el responsable clínico.", "Servicio de Informática Clínica", "alta", "Previene demoras críticas en la atención."],
       ["Establecer un listado actualizado de responsables clínicos de guardia, accesible por turnos, para la comunicación directa de resultados relevantes.", "Jefatura de Servicio Médico de Urgencias", "media", "Mejora organizativa clave para una comunicación eficaz."]]),
    c7: an("observacion", "5 de 10 ingresos esperaron más de 6 horas (50 %) frente a un máximo del 20 %. El LQAS acepta (5 ≥ 5), pero la línea roja es muy baja (45 %) y con 10 casos la muestra es insuficiente para afirmar o negar el problema. Se recomienda repetir la medición con 29 ingresos.",
      ["Demoras de más de 6 horas en ocupar cama", "La disponibilidad de camas no se conoce en tiempo real", "Saturación hospitalaria y falta de planificación anticipada"], ["organizacion", "sistemas"],
      "Saturación hospitalaria y falta de un sistema compartido y en tiempo real de disponibilidad de camas.",
      [["Establecer un sistema de alerta automatizada que notifique a Urgencias la disponibilidad de camas libres en planta.", "Supervisión de Enfermería de Urgencias", "alta", "Reduce los tiempos de espera mediante notificación inmediata."],
       ["Coordinar una reunión semanal con los responsables de hospitalización para revisar los bloqueos estructurales en la asignación de camas.", "Subdirección Médica", "media", "Mejora progresiva del flujo sin cambios tecnológicos inmediatos."]]),
    c8: an("observacion", "4 de 20 incidentes en pacientes sin acompañamiento documentado (20 %) frente a un máximo del 15 %. En los 16 primeros, 12 con acompañamiento (hacían falta 11): el LQAS acepta. Riesgo a vigilar en población vulnerable.",
      ["Incidentes en pacientes vulnerables sin acompañamiento", "No consta si el paciente necesita acompañamiento", "Recursos humanos limitados en la sala de espera"], ["organizacion", "entorno"],
      "Recursos limitados en la sala de espera y paciente frágil sin una alerta de riesgo que active el acompañamiento.",
      [["Implantar un protocolo obligatorio de acompañamiento para los pacientes con deterioro cognitivo o dependencia funcional.", "Coordinación de Enfermería de Urgencias", "alta", "Actúa directamente sobre la causa de los incidentes."],
       ["Incorporar un campo obligatorio en el registro de triaje que indique si el paciente necesita acompañamiento y si está garantizado.", "Equipo de Sistemas de Información Clínicos", "media", "Mejora la trazabilidad y facilita las auditorías futuras."]]),
    c9: an("observacion", "15 de 20 pacientes frágiles con el protocolo activado (75 %) frente al 80 %. En los 19 primeros, 14 (hacían falta 12): el LQAS acepta. El 75 % observado no permite afirmar el incumplimiento.",
      ["El protocolo de paciente frágil no se activa en todos los casos", "En admisión no hay un procedimiento claro para activarlo", "Desconocimiento del riesgo en el primer contacto"], ["procedimiento", "personas"],
      "Ausencia de un procedimiento operativo claro para detectar y activar el protocolo de paciente frágil desde admisión.",
      [["Elaborar y difundir un procedimiento operativo para detectar y activar el protocolo de paciente frágil en admisión.", "Dirección de Enfermería", "alta", "Impacto potencial en la seguridad desde el primer contacto."],
       ["Formar al personal administrativo y de enfermería de admisión en la identificación precoz y la derivación de pacientes frágiles.", "Coordinación de la Unidad de Formación", "media", "Implantación progresiva; consolida la sensibilización."]]),
    c10: an("observacion", "18 de 20 pacientes con pulsera (90 %) frente al 95 %. En los 14 primeros, 13 (hacían falta 11): el LQAS acepta. Margen ±13 (77 %–100 %): no se puede afirmar que estemos por debajo del estándar. Los dos casos sin pulsera se relacionan con su retirada durante procedimientos.",
      ["Pacientes sin pulsera al pasar a box o a pruebas", "La pulsera se retira durante algunos procedimientos (canalización de vías)", "Tras el procedimiento no se recoloca", "El software de triaje no exige registrar la colocación"], ["procedimiento", "sistemas"],
      "La pulsera se retira durante algunos procedimientos y no hay un punto de control que obligue a comprobarla antes del paso a box o a pruebas.",
      [["Establecer un punto de control obligatorio en el software de triaje que no permita continuar sin registrar la colocación de la pulsera identificativa.", "Departamento de Sistemas", "alta", "Asegura un cumplimiento sistemático y sin omisiones."],
       ["Implantar una revisión semanal de las incidencias relacionadas con la falta de pulsera mediante una auditoría rápida.", "Supervisión de Enfermería", "media", "Detecta desviaciones o fallos persistentes."]])
  };
  const ev = (tipos, triangulacion, principios, instrumentos, justificacion) => ({ tipos, triangulacion, principios, instrumentos, justificacion });
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
    diseno: {
      poblacion: "Pacientes atendidos en el Área de Urgencias con decisión final de ingreso hospitalario.",
      periodo: "Del 1 al 31 de mayo de 2025",
      fuentes: "Historia clínica electrónica, módulo de triaje, registros de enfermería, módulo de gestión de camas, sistema de notificación de incidentes, observación directa y entrevistas breves a profesionales.",
      equipo: "Coordinador/a de Calidad y Seguridad del Paciente (coordina y consolida los resultados)\nSupervisor/a de Enfermería de Urgencias (enfoque operativo y viabilidad de las mejoras)\nFacultativo de Urgencias (criterio clínico)\nEnfermera asistencial (práctica de los cuidados y circuitos reales)\nTCAE (puntos críticos del día a día)\nAdministrativo/a del área (flujos administrativos y registro)\nTécnico/a de Calidad, observador externo al servicio (rigor metodológico)",
      recursos: "Humanos: equipo auditor multidisciplinar y coordinación con experiencia en calidad.\nDocumentales: AMFE del proceso, mapa del proceso, protocolos, listas de verificación y hojas de recogida.\nMateriales: acceso a la historia clínica electrónica, hojas impresas, hoja de cálculo.\nTiempo: 2–3 sesiones de trabajo de 2–4 horas y 4–6 horas para el análisis y el informe.",
      metodologia: "Auditoría clínica interna de proceso: revisión documental de historias, observación directa y entrevistas breves, con hoja de recogida de respuesta cerrada (Sí / No / No aplica). Para cada criterio, plan LQAS: se decide si se alcanza el estándar con pocos casos elegidos al azar."
    },
    control: {
      elaborado: [{ nombre: "", cargo: "Coordinador/a de Calidad y Seguridad del Paciente" }, { nombre: "", cargo: "Técnicos de Calidad y Seguridad del Paciente" }],
      revisado: [{ nombre: "", cargo: "Jefe/a de Servicio de Urgencias" }],
      aprobado: [{ nombre: "", cargo: "Gerencia del Área de Gestión Sanitaria" }],
      historial: [{ edicion: "00", fecha: "2025-09-01", cambio: "Documento inicial" }]
    },
    ejecucion: { inicio: "2025-09-22", fin: "2025-10-10", auditores: "Equipo auditor organizado en cinco grupos (A–E), dos criterios por grupo.", incidencias: "Hubo que definir en la primera sesión cómo seleccionar los casos al azar (listado numerado y sorteo) para que todos los grupos lo hicieran igual." },
    informe: {
      conclusiones: "La auditoría confirma dos no conformidades con evidencia suficiente: la reevaluación de los pacientes con esperas prolongadas y la comunicación a tiempo de los resultados críticos. Ambas se deben a fallos del circuito (falta de alertas y de responsables asignados), no a profesionales concretos. En otros ocho criterios el cumplimiento observado está por debajo del estándar, pero con el tamaño de muestra utilizado no puede afirmarse el incumplimiento: se clasifican como observaciones y se recomienda vigilarlos, en particular la demora de cama, que requiere una muestra mayor. Las recomendaciones de prioridad alta proponen, sobre todo, cambios en los sistemas (alertas, campos obligatorios, puntos de control), más eficaces que las medidas basadas solo en la formación.",
      fortalezas: "Implicación multidisciplinar del equipo; registros electrónicos que permiten trazar los tiempos; cumplimiento elevado de la identificación con pulsera (18 de 20) y de la conciliación de la medicación (8 de 10).",
      resumen: "Se ha auditado el proceso de admisión en Urgencias hasta la decisión de ingreso (mayo de 2025) con 10 criterios en 7 subprocesos. Resultado: 2 no conformidades —reevaluación de los pacientes con esperas superiores a 60 minutos y comunicación de resultados críticos en menos de 60 minutos— y 8 observaciones en las que el cumplimiento está por debajo del estándar sin evidencia suficiente para afirmar el incumplimiento. Recomendaciones prioritarias: alertas automáticas de tiempo de espera y de resultados críticos, y campos obligatorios en admisión, prescripción y triaje. Se propone acordar el plan de mejora en la reunión de devolución y repetir la auditoría a los tres meses.",
      destinatarios: "Gerencia, Dirección Médica y de Enfermería, y Jefatura del Servicio de Urgencias", estado: "validado"
    },
    hitos: { aprobacion: { hecho: true, fecha: "2025-09-08", nota: "Aprobada por la Gerencia junto con el Jefe de Servicio." }, comunicacion: { hecho: true, fecha: "2025-09-15", nota: "Sesión de servicio y correo al personal." }, validacion: { hecho: true, fecha: "2025-10-24", nota: "Borrador revisado con la Jefatura y la Supervisión de Urgencias." }, devolucion: { hecho: false, fecha: "", nota: "" } },
    criterios: [
      c("c1", TRI, "u8", "Clasificación errónea del nivel de prioridad", "El nivel de prioridad asignado en triaje coincide con el reevaluado por la supervisión clínica.",
        { nombre: "% de discrepancias entre el nivel de prioridad asignado en triaje y el reevaluado por la supervisión clínica", numerador: "Casos con discrepancia de prioridad", denominador: "Casos revisados", sentido: "menos", estandar: "10", fuente: "Hoja de triaje e historia clínica", cumpleSi: "Cumple (sin discrepancia) si el nivel de prioridad asignado en triaje coincide con el que asigna la supervisión clínica al revisar el caso con los mismos datos.", noAplicaSi: "Pacientes que no pasaron por triaje (traslado directo a reanimación)." },
        ev(["registros", "documental", "entrevista"], "Se contrastan los registros de triaje con la reevaluación de la supervisión clínica y con entrevistas al personal, para distinguir errores de juicio, de formación o del sistema.", ["veracidad", "trazabilidad", "imparcialidad", "relevancia"], ["checklist", "entrevista"], "La revisión estructurada compara las decisiones reales con la revisión experta; las entrevistas recogen los motivos del fallo."),
        { N: "1800", umbral: "60", metodo: "sistematico", unidad: "Episodio de triaje" },
        [["si", "si"], ["si", "si"], ["no", "no"], ["si", "si"], ["si", "no"], ["si", "si"], ["no", "no"], ["si", "si"]],
        rec(casos(10, [2, 4], "HC", { 2: "Triaje 3; supervisión 2", 4: "Triaje 2; supervisión 3" }), "Registros de triaje y fichas de reevaluación clínica de 10 pacientes seleccionados al azar.", "2 discrepancias en 10 casos (20 %), por encima del límite del 10 %. Pero con 10 casos el margen es de ±25 puntos: el plan LQAS acepta (8 ≥ 7), así que no hay evidencia suficiente para afirmar el incumplimiento. Para vigilar una línea roja más exigente (70 %) harían falta 20 casos.", "Al principio costó seleccionar los casos al azar de forma homogénea: conviene dejar definido el criterio de selección antes de empezar.")),
      c("c2", REC, "u5", "El sistema no alerta de antecedentes clínicos relevantes", "Los antecedentes clínicos relevantes son visibles en el campo de admisión y el sistema los alerta.",
        { nombre: "% de historias con los antecedentes clínicos relevantes visibles en el campo de admisión", numerador: "Historias con los antecedentes visibles en admisión", denominador: "Historias revisadas de pacientes con antecedentes relevantes", estandar: "90", fuente: "Historia clínica electrónica (HIS)", cumpleSi: "Los antecedentes relevantes (alergias, enfermedades crónicas, anticoagulación) aparecen en el campo visible de admisión.", noAplicaSi: "Pacientes sin antecedentes relevantes." },
        ev(["documental", "registros", "entrevista"], "Historia clínica electrónica, simulación del registro de admisión y entrevistas breves: permiten saber si el problema es de documentación, de visibilidad o de formación.", ["veracidad", "trazabilidad", "confidencialidad"], ["checklist", "entrevista"], "La revisión documental estructurada detecta si los antecedentes están en un lugar visible; las entrevistas, si el personal los conoce y los consulta."),
        { N: "1200", umbral: "70", unidad: "Historia clínica" },
        [["si", "si"], ["si", "si"], ["no", "no"], ["si", "si"], ["si", "si"], ["si", "si"]],
        rec(casos(20, [4, 8, 15, 19], "HC", { 4: "Omisión", 8: "Omisión", 15: "Omisión", 19: "Omisión" }), "Auditoría de 20 historias clínicas con entrevistas breves al personal administrativo y clínico.", "16 de 20 historias con antecedentes visibles (80 %), por debajo del 90 %. El margen es de ±18 puntos (62 %–98 %): el LQAS acepta (16 ≥ 15), no se puede afirmar el incumplimiento. Para una línea roja del 75 % harían falta 33 historias.", "Fue necesario revisar varios apartados de la historia para saber si los antecedentes no estaban registrados o solo no eran visibles en admisión.")),
      c("c3", SAL, "u15", "Espera prolongada sin reevaluación clínica", "Los pacientes que superan el tiempo máximo de espera se reevalúan clínicamente y queda registrado.",
        { nombre: "% de pacientes con espera superior a 60 minutos con reevaluación clínica registrada", numerador: "Pacientes con espera > 60 min y reevaluación registrada", denominador: "Pacientes con espera > 60 min", estandar: "90", fuente: "Módulo de triaje y seguimiento clínico", cumpleSi: "Consta en la historia una reevaluación (constantes o valoración) dentro de los primeros 60 minutos de espera.", noAplicaSi: "Pacientes atendidos antes de 60 minutos." },
        ev(["registros", "observacion", "entrevista"], "Cruce de los tiempos del sistema de triaje con la observación del flujo en la sala y entrevistas sobre las causas (falta de personal, sobrecarga, desconocimiento del protocolo).", ["trazabilidad", "veracidad", "relevancia"], ["checklist", "observacion"], "La lista de verificación cuantifica el incumplimiento; la observación aporta el contexto de la sala."),
        { N: "700", umbral: "60", unidad: "Paciente con espera > 60 min" }, [],
        rec(casos(12, [3, 5, 7, 9, 12]), "Registros del módulo de triaje y de seguimiento clínico de 12 pacientes con espera superior a 60 minutos.", "En los 10 primeros casos solo 6 tienen reevaluación (hacían falta 7): se rechaza. El «no cumple» está justificado y hay que investigar las causas (carga asistencial, circuito de reevaluación).")),
      c("c4", VAL, "u23", "No conciliación de la medicación habitual", "Se documenta la conciliación de la medicación habitual antes de la prescripción en Urgencias.",
        { nombre: "% de pacientes con la medicación habitual registrada antes de la prescripción en Urgencias", numerador: "Pacientes con la medicación habitual registrada antes de la primera prescripción", denominador: "Pacientes revisados con prescripción en Urgencias", estandar: "90", fuente: "Historia clínica electrónica y módulo de prescripción", cumpleSi: "La medicación habitual consta registrada (o consta «sin tratamiento habitual») antes de la primera prescripción en Urgencias.", noAplicaSi: "Pacientes sin ninguna prescripción en Urgencias." },
        ev(["documental", "registros"], "Historia clínica frente al módulo de prescripción y muestra cruzada con la receta electrónica.", ["veracidad", "trazabilidad", "confidencialidad"], ["checklist"], "Lista de verificación de revisión documental: registro sí/no y momento del registro."),
        { N: "900", umbral: "60", unidad: "Historia clínica" }, [],
        rec(casos(10, [4, 8]), "Historias clínicas de 10 pacientes con prescripción en Urgencias y muestra cruzada con la receta electrónica.", "8 de 10 con la medicación habitual registrada (80 %). El LQAS acepta (8 ≥ 7): no hay evidencia de que estemos por debajo del 90 %, aunque el margen es amplio (±25).")),
      c("c5", TRI, "u9", "No detección de paciente frágil o con deterioro cognitivo", "El triaje incluye la evaluación de la fragilidad en los pacientes de 75 años o más.",
        { nombre: "% de pacientes de 75 años o más evaluados con una herramienta de detección de fragilidad en el triaje", numerador: "Pacientes ≥ 75 años con escala de fragilidad registrada", denominador: "Pacientes ≥ 75 años triados", estandar: "80", fuente: "Historia clínica electrónica y módulo de triaje", cumpleSi: "Consta una escala de fragilidad (p. ej. FRAIL) cumplimentada en el registro de triaje.", noAplicaSi: "Pacientes en situación crítica atendidos directamente en reanimación." },
        ev(["registros", "documental", "entrevista"], "Registro de triaje, historia clínica y entrevistas al personal de triaje sobre el uso de la escala.", ["veracidad", "relevancia", "trazabilidad"], ["checklist", "entrevista"], "La lista de verificación mide si se aplica la escala; la guía de entrevista explica por qué no."),
        { N: "650", umbral: "55", unidad: "Episodio de paciente ≥ 75 años" }, [],
        rec(casos(20, [3, 7, 11, 15, 18]), "Registros de triaje de 20 pacientes de 75 años o más.", "En los 19 primeros hay 14 con la escala (hacían falta 12): se acepta. No hay evidencia de que estemos por debajo del 80 %. Para vigilar una línea roja del 60 % harían falta 29 casos.")),
      c("c6", COM, "u36", "No revisión o interpretación incompleta de resultados", "Los resultados críticos se comunican al responsable clínico en menos de 60 minutos y queda registrado.",
        { nombre: "% de resultados críticos comunicados al responsable clínico en menos de 60 minutos", tipo: "resultado", numerador: "Resultados críticos comunicados en < 60 min", denominador: "Resultados críticos revisados", estandar: "90", fuente: "Registro de validación del laboratorio y comunicación anotada en la historia clínica", cumpleSi: "Entre la validación del resultado crítico en el laboratorio y su comunicación registrada al responsable pasan menos de 60 minutos." },
        ev(["registros", "documental"], "Hora de validación del laboratorio frente a la hora de comunicación anotada en la historia clínica.", ["trazabilidad", "veracidad", "relevancia"], ["checklist"], "Auditoría de tiempos con lista de verificación."),
        { N: "240", umbral: "60", unidad: "Resultado crítico" }, [],
        rec(casos(10, [2, 5, 8, 9], "RC"), "Registro de validación del laboratorio y comunicación anotada en la historia de 10 resultados críticos.", "Solo 6 de 10 comunicados en menos de 60 minutos (hacían falta 7): se rechaza. La demora puede retrasar decisiones clínicas urgentes; hay que investigar el circuito.")),
      c("c7", ING, "u43", "Demora prolongada en encontrar cama disponible", "El paciente con indicación de ingreso ocupa cama en planta en menos de 6 horas.",
        { nombre: "% de ingresos con espera superior a 6 horas desde la indicación médica", tipo: "resultado", numerador: "Ingresos con espera > 6 h desde la orden de ingreso", denominador: "Ingresos revisados", sentido: "menos", estandar: "20", fuente: "Historia clínica electrónica y módulo de gestión de camas", cumpleSi: "Cumple si el paciente ocupa la cama en 6 horas o menos desde la orden de ingreso." },
        ev(["registros", "entrevista"], "Hora de la orden de ingreso frente a la hora de ocupación de la cama, y entrevistas a Admisión y supervisión sobre los bloqueos.", ["trazabilidad", "relevancia"], ["checklist", "entrevista"], "Auditoría de tiempos; la entrevista explica los bloqueos estructurales."),
        { N: "600", umbral: "45", unidad: "Ingreso" }, [],
        rec(casos(10, [1, 3, 6, 8, 10]), "Hora de la orden de ingreso y de ocupación de cama de 10 ingresos.", "5 de 10 ingresos esperaron más de 6 horas. Con 10 casos la única línea roja vigilable es muy baja (45 %) y no se cruza (5 ≥ 5): la muestra es insuficiente para afirmar o negar el problema. Para una línea roja del 60 % harían falta 29 ingresos.")),
      c("c8", SAL, "u16", "Falta de acompañamiento o supervisión", "Los pacientes con deterioro cognitivo o dependencia permanecen acompañados o supervisados en la sala de espera.",
        { nombre: "% de incidentes por caída o desorientación en pacientes sin acompañamiento documentado", tipo: "resultado", numerador: "Incidentes en pacientes sin acompañamiento documentado", denominador: "Incidentes por caída o desorientación en la sala de espera", sentido: "menos", estandar: "15", fuente: "Sistema de notificación de incidentes e historia clínica", cumpleSi: "Cumple si el paciente del incidente tenía documentado el acompañamiento o la supervisión." },
        ev(["registros", "documental", "observacion"], "Notificaciones de incidentes, historia clínica y observación en la sala de espera.", ["veracidad", "confidencialidad", "relevancia"], ["checklist", "observacion"], "La lista de verificación revisa cada incidente; la observación comprueba el acompañamiento real."),
        { N: "", umbral: "60", unidad: "Incidente notificado" }, [],
        rec(casos(20, [2, 6, 10, 14], "IN"), "20 notificaciones de caídas o desorientación revisadas junto con la historia clínica.", "En los 16 primeros incidentes, 12 con acompañamiento documentado (hacían falta 11): se acepta. No hay evidencia de que superemos el 15 % de incidentes sin acompañamiento, aunque el 20 % observado invita a vigilarlo.")),
      c("c9", REC, "u7", "Falta de protocolo ante paciente frágil", "Se activa el protocolo de paciente frágil en todos los pacientes identificados como frágiles en admisión.",
        { nombre: "% de pacientes identificados como frágiles en admisión con el protocolo activado", numerador: "Pacientes frágiles con el protocolo activado", denominador: "Pacientes identificados como frágiles en admisión", estandar: "80", fuente: "Historia clínica electrónica y módulo de admisión", cumpleSi: "Consta la activación del protocolo de paciente frágil en el registro de admisión o de triaje." },
        ev(["documental", "registros"], "Registro de admisión frente al registro de triaje.", ["veracidad", "trazabilidad"], ["checklist"], "Lista de verificación documental."),
        { N: "400", umbral: "55", unidad: "Paciente frágil" }, [],
        rec(casos(20, [4, 8, 12, 16, 19]), "Registros de admisión y de triaje de 20 pacientes identificados como frágiles.", "En los 19 primeros hay 14 activaciones (hacían falta 12): se acepta. El 75 % observado no permite afirmar el incumplimiento del 80 %.")),
      c("c10", TRI, "u11", "No colocación de pulsera identificativa", "Todos los pacientes están identificados con pulsera antes de pasar a box o a pruebas.",
        { nombre: "% de pacientes triados con la pulsera colocada antes del paso a box o a pruebas", numerador: "Pacientes con pulsera colocada antes del paso a box o pruebas", denominador: "Pacientes triados observados", estandar: "95", fuente: "Observación directa y registro de triaje", cumpleSi: "El paciente lleva la pulsera identificativa con sus datos correctos al pasar a box o a pruebas." },
        ev(["observacion", "registros", "entrevista"], "Observación directa en el momento del paso a box frente al registro de triaje; entrevistas a enfermería y celadores para saber si falla la colocación o se pierde la pulsera.", ["veracidad", "relevancia", "imparcialidad"], ["observacion", "checklist"], "La observación estructurada, en turnos elegidos al azar, verifica la pulsera en tiempo real; la lista de verificación unifica el criterio entre turnos."),
        { N: "3000", umbral: "75", metodo: "estratificado", unidad: "Paciente observado (turnos de mañana, tarde y noche)" }, [],
        rec(casos(20, [9, 17], "OB", { 9: "Pulsera retirada para canalizar la vía", 17: "Sin pulsera al pasar a Radiología" }), "Observación directa de 20 pacientes en turnos de mañana, tarde y noche, contrastada con el registro de triaje.", "18 de 20 con pulsera (90 %). En los 14 primeros, 13 (hacían falta 11): se acepta. El margen es de ±13 (77 %–100 %): no se puede afirmar que estemos por debajo del 95 %."))
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

  AUD_URG.criterios.forEach(cr => { if (ANALISIS_URG[cr.id]) { cr.analisis = ANALISIS_URG[cr.id]; cr.analisis.recs.forEach((r, k) => { r.id = cr.id + "r" + k; }); } });

  // Plan de acción de mejora: una acción por recomendación. [viabilidad, impacto, inicio, fin, estado, recursos]
  const ACC_URG = {
    c1r0: ["3", "2", "2025-11-03", "2025-12-19", "hecha", "Dos sesiones de 2 horas en horario laboral; casos clínicos de triaje"],
    c1r1: ["3", "2", "2026-01-12", "2026-12-18", "curso", "Técnico de Calidad: 4 horas al trimestre"],
    c2r0: ["2", "3", "2025-11-03", "2026-02-27", "hecha", "Desarrollo en el módulo de admisión (servicio TIC)"],
    c2r1: ["3", "2", "2025-11-17", "2025-12-19", "hecha", "Una sesión por turno para el personal administrativo"],
    c3r0: ["2", "3", "2025-11-03", "2026-01-30", "verificada", "Configuración de alertas en el sistema de Urgencias (TIC)"],
    c3r1: ["3", "2", "2025-11-03", "2025-12-19", "verificada", "Actualización del protocolo de triaje y difusión"],
    c4r0: ["2", "3", "2025-11-03", "2026-03-31", "hecha", "Cambio en la prescripción electrónica (Farmacia y TIC)"],
    c4r1: ["3", "2", "2025-11-17", "2025-12-19", "hecha", "Sesión clínica de 1 hora"],
    c5r0: ["3", "3", "2025-11-03", "2026-01-30", "hecha", "Escala FRAIL integrada en el registro de triaje"],
    c5r1: ["3", "2", "2025-11-17", "2026-01-30", "hecha", "Sesiones prácticas de 1 hora"],
    c6r0: ["2", "3", "2025-11-03", "2026-02-27", "hecha", "Integración del laboratorio con el sistema de Urgencias (TIC)"],
    c6r1: ["3", "2", "2025-11-03", "2025-11-28", "verificada", "Listado de guardias en la intranet, actualizado por la Jefatura"],
    c7r0: ["1", "3", "2026-01-12", "2026-12-18", "curso", "Panel de camas en tiempo real: proyecto con Admisión y TIC"],
    c7r1: ["3", "2", "2025-11-10", "2025-12-19", "hecha", "Reunión semanal de 30 minutos"],
    c8r0: ["3", "3", "2025-11-03", "2026-01-30", "hecha", "Protocolo de acompañamiento y hoja de vigilancia"],
    c8r1: ["2", "2", "2025-11-03", "2026-02-27", "hecha", "Campo en el registro de triaje (TIC)"],
    c9r0: ["3", "3", "2025-11-03", "2026-01-30", "hecha", "Procedimiento operativo y difusión"],
    c9r1: ["3", "2", "2025-12-01", "2026-01-30", "hecha", "Dos sesiones formativas"],
    c10r0: ["2", "3", "2025-11-03", "2026-01-30", "verificada", "Punto de control en el software de triaje (TIC)"],
    c10r1: ["3", "2", "2025-11-03", "2025-12-19", "verificada", "Auditoría rápida semanal de 10 pacientes"]
  };
  AUD_URG.mejora = {
    acciones: AUD_URG.criterios.flatMap(cr => cr.analisis.recs.map(r => { const v = ACC_URG[r.id] || ["", "", "", "", "pendiente", ""], est = cr.ind.estandar ? `${cr.ind.sentido === "menos" ? "≤" : "≥"} ${cr.ind.estandar} %` : "";
      return { id: "a" + r.id, critId: cr.id, recId: r.id, objetivo: `${cr.ind.sentido === "menos" ? "Reducir" : "Aumentar"} el ${cr.ind.nombre.charAt(0).toLowerCase() + cr.ind.nombre.slice(1)} hasta ${est}`, accion: r.texto, responsable: r.responsable,
        inicio: v[2], fin: v[3], recursos: v[5], indicador: `${cr.ind.nombre} (estándar ${est})`, criticidad: r.prioridad === "alta" ? "3" : r.prioridad === "media" ? "2" : "1", viabilidad: v[0], impacto: v[1], estado: v[4], nota: "" }; })),
    fechaSeguimiento: "2026-02-16", seguimientoId: "ej-aud-urg-seg", notas: "Reunión de devolución el 5 de noviembre de 2025: se acordó el plan con la Jefatura y la Supervisión. La auditoría de seguimiento se centra en las dos no conformidades y en la identificación con pulsera."
  };
  AUD_URG.seguimientoDe = "";
  AUD_URG.hitos.devolucion = { hecho: true, fecha: "2025-11-05", nota: "Presentación a la Dirección y al equipo; plan de mejora acordado." };
  AUD_URG.informe.estado = "aprobado";

  // Auditoría de seguimiento (cuatro meses después): hereda el diseño de tres criterios y compara antes y después
  const SEG_CRITS = { c3: [10, [4]], c6: [10, [3, 7]], c10: [14, []] };
  const AUD_URG_SEG = JSON.parse(JSON.stringify(Object.assign({}, AUD_URG, { mejora: undefined })));
  Object.assign(AUD_URG_SEG, {
    id: "ej-aud-urg-seg", titulo: "Seguimiento · Auditoría interna del proceso de admisión en Urgencias", seguimientoDe: "ej-aud-urg",
    introduccion: "Auditoría de seguimiento de la auditoría interna del proceso de admisión en Urgencias, para comprobar si las acciones de mejora se han implantado y si han sido eficaces.",
    objetivoGeneral: "Verificar la eficacia de las acciones de mejora implantadas tras la auditoría inicial, comparando los resultados con los de esa auditoría.",
    objetivosEsp: "Comprobar que las acciones del plan de mejora se han implantado.\nMedir de nuevo los criterios con el mismo método que en la auditoría inicial.\nDecidir, para cada criterio, si se puede cerrar o si hay que ajustar las acciones y volver a medir.",
    origen: { tipo: "seguimiento", mapaId: "ej-mapa-urg", riesgoIds: ["u15", "u36", "u11"], detalle: "Seguimiento de la auditoría interna del proceso de admisión en Urgencias (periodo inicial: mayo de 2025)." },
    mejora: { acciones: [{ id: "as1", critId: "s-c6", recId: "", objetivo: "Aumentar el % de resultados críticos comunicados en menos de 60 minutos hasta ≥ 90 %", accion: "Analizar los dos casos sin comunicación a tiempo (cambio de turno) y añadir al circuito de alerta la confirmación de lectura obligatoria por el facultativo responsable.", responsable: "Servicio de Informática Clínica", inicio: "2026-03-09", fin: "2026-04-30", recursos: "Ajuste del circuito de alertas (TIC)", indicador: "% de resultados críticos comunicados en menos de 60 minutos (estándar ≥ 90 %)", criticidad: "3", viabilidad: "2", impacto: "3", estado: "hecha", nota: "" }], fechaSeguimiento: "2026-06-15", seguimientoId: "", notas: "Nueva medición del criterio 6 en junio." },
    informe: { conclusiones: "Las acciones han sido eficaces en la reevaluación de los pacientes en espera (de 6 a 9 de 10) y en la identificación con pulsera (14 de 14): se pueden cerrar. La comunicación de resultados críticos mejora de 6 a 8 de 10, pero no alcanza el estándar del 90 %: no se cierra. Los dos casos que siguen fuera de plazo coinciden con cambios de turno; se ajusta el circuito y se repetirá la medición en junio.", fortalezas: "Implantación rápida de las alertas automáticas y del punto de control de la pulsera.", resumen: "", destinatarios: "Gerencia, Dirección Médica y de Enfermería, y Jefatura del Servicio de Urgencias", estado: "validado" },
    diseno: Object.assign({}, AUD_URG.diseno, { periodo: "Febrero de 2026" }),
    ejecucion: { inicio: "2026-02-16", fin: "2026-02-27", auditores: "Supervisión de Enfermería de Urgencias y Técnico de Calidad", incidencias: "" },
    hitos: { aprobacion: { hecho: true, fecha: "2026-02-02", nota: "" }, comunicacion: { hecho: true, fecha: "2026-02-09", nota: "" }, validacion: { hecho: true, fecha: "2026-03-04", nota: "" }, devolucion: { hecho: false, fecha: "", nota: "" } },
    control: { elaborado: [{ nombre: "", cargo: "Técnicos de Calidad y Seguridad del Paciente" }], revisado: [{ nombre: "", cargo: "Jefe/a de Servicio de Urgencias" }], aprobado: [{ nombre: "", cargo: "Gerencia del Área de Gestión Sanitaria" }], historial: [{ edicion: "00", fecha: "2026-03-04", cambio: "Documento inicial" }] },
    creado: "2026-02-02T09:00:00.000Z", modificado: "2026-03-04T09:00:00.000Z"
  });
  delete AUD_URG_SEG.mejora.undefined;
  AUD_URG_SEG.criterios = AUD_URG_SEG.criterios.filter(cr => SEG_CRITS[cr.id]).map(cr => {
    const [n, nos] = SEG_CRITS[cr.id], rCasos = casos(n, nos, cr.id === "c10" ? "OB" : cr.id === "c6" ? "RC" : "HC");
    const interp = { c3: "9 de 10 pacientes con reevaluación registrada (90 %): el LQAS acepta y se alcanza el estándar del 90 %. Antes: 6 de 10 (rechazo).", c6: "8 de 10 resultados críticos comunicados en menos de 60 minutos (80 %). El LQAS acepta (8 ≥ 7), pero el valor sigue por debajo del 90 %. Antes: 6 de 10 (rechazo). Mejora parcial.", c10: "14 de 14 pacientes con pulsera (100 %): el LQAS acepta y se supera el estándar del 95 %. Antes: 13 de 14 en los primeros casos." }[cr.id];
    return Object.assign(cr, { id: "s-" + cr.id, origenId: cr.id, muestra: Object.assign(cr.muestra, { sorteo: [] }), piloto: { pares: [], nota: "" },
      recogida: { casos: rCasos, evidencia: cr.recogida.evidencia, comentario: "", observaciones: "" },
      analisis: { clasif: cr.id === "c6" ? "observacion" : "conformidad", interpretacion: interp, porques: ["", "", "", "", ""], categorias: [], causaRaiz: cr.id === "c6" ? "Los casos fuera de plazo coinciden con cambios de turno: la alerta llega, pero no se confirma su lectura." : "", recs: cr.id === "c6" ? [{ id: "s-c6r0", texto: "Añadir al circuito de alerta la confirmación de lectura obligatoria por el facultativo responsable.", responsable: "Servicio de Informática Clínica", prioridad: "alta", motivo: "Los fallos se concentran en los cambios de turno.", plazo: "" }] : [] }
    });
  });
  AUD_URG_SEG.mejora.acciones[0].recId = "s-c6r0";

  // Minicaso inventado (a partir del minicaso de planificación): Hospitalización Médica

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
    auditorias: [AUD_URG, AUD_URG_SEG],
    planes: [PLAN_URG],
    fichas: [
      { href: "#/riesgos/ej-mapa-urg", t: "Urgencias · Mapa de Riesgos", s: "AMFE del proceso de admisión: 15 riesgos priorizados y 10 hallazgos clave" },
      { href: "#/plan/ej-plan-urg", t: "Urgencias · Plan Anual", s: "7 auditorías por subproceso con alcance, criterios, frecuencia, responsables y cronograma" },
      { href: "#/auditoria/ej-aud-urg", t: "Urgencias · Auditoría", s: "Origen, objetivos y los 10 criterios a auditar en 7 subprocesos" },
      { href: "#/auditoria/ej-aud-urg/mejora/1", t: "Urgencias · Plan de mejora", s: "20 acciones priorizadas con la matriz criticidad × viabilidad" },
      { href: "#/auditoria/ej-aud-urg-seg/mejora/3", t: "Urgencias · Seguimiento", s: "Antes y después: dos criterios se cierran y uno mejora sin llegar al estándar" },
      { href: "#/riesgos/ej-mapa-hos", t: "Hospitalización · Minicaso", s: "5 riesgos: por qué el IPR no lo es todo" }
    ]
  };

  // ---------- Autoevaluación: 30 preguntas, 5 por tema (t = tema, ok = índice de la respuesta correcta) ----------
  const TEST = [
    {"t": 1, "q": "¿Cuál es la principal finalidad de una auditoría en el ámbito sanitario?", "o": ["Evaluar solo la satisfacción del personal.", "Detectar exclusivamente errores administrativos.", "Verificar la conformidad de procesos y fomentar la mejora continua.", "Reducir los costes de personal.", "Sustituir la normativa vigente."], "ok": 2, "e": "En sanidad, la auditoría busca comprobar que los procesos se ajustan a normas y estándares y, además, generar información para aprender y mejorar de forma continua."},
    {"t": 1, "q": "Según las normas internacionales, una auditoría es un proceso que debe ser:", "o": ["Esporádico y no documentado.", "Dependiente y subjetivo.", "Sistematizado, independiente y documentado.", "Realizado solo por inspectores externos.", "Exclusivo para organizaciones privadas."], "ok": 2, "e": "La ISO 19011 y otras guías lo definen como un proceso sistemático, independiente y documentado para evaluar evidencias y verificar conformidad."},
    {"t": 1, "q": "¿Cuál de estos principios NO corresponde a una auditoría bien realizada?", "o": ["Objetividad.", "Confidencialidad.", "Subjetividad.", "Independencia.", "Orientación a la mejora."], "ok": 2, "e": "Una auditoría se basa en objetividad, sistematicidad, independencia, confidencialidad y enfoque de mejora. La subjetividad debe evitarse."},
    {"t": 1, "q": "¿Qué tipo de auditoría se realiza dentro de la propia organización?", "o": ["Auditoría externa.", "Autoauditoría interna.", "Acreditación internacional.", "Inspección regulatoria.", "Evaluación de producto final por clientes."], "ok": 1, "e": "Las auditorías internas o autoauditorías verifican el cumplimiento de normas y planes dentro de la organización."},
    {"t": 1, "q": "¿Qué relación existe entre el Mapa de Riesgos y la auditoría?", "o": ["La auditoría sustituye al Mapa de Riesgos.", "No existe relación entre ambos.", "El Mapa identifica procesos críticos y la auditoría verifica y evalúa su control.", "El Mapa de Riesgos solo sirve para formación inicial.", "La auditoría se aplica solo a áreas no clínicas."], "ok": 2, "e": "El Mapa de Riesgos identifica puntos vulnerables y la auditoría comprueba si se controlan adecuadamente y si los planes de mejora funcionan."},
    {"t": 2, "q": "¿Cuál es el objetivo principal de un Plan de Auditorías en una organización sanitaria?", "o": ["Evitar la acreditación externa.", "Planificar revisiones para priorizar procesos críticos y fomentar la mejora continua.", "Cubrir vacantes de personal auditor.", "Elaborar estadísticas para redes sociales.", "Suplir la normativa vigente."], "ok": 1, "e": "Un plan bien diseñado organiza revisiones con criterios claros para priorizar procesos clave, alinearse con objetivos estratégicos y garantizar la mejora continua."},
    {"t": 2, "q": "¿Qué significa definir el alcance de un Plan de Auditorías?", "o": ["Determinar el presupuesto de la unidad de calidad.", "Delimitar qué procesos o áreas se van a auditar y hasta dónde llega la revisión.", "Contratar auditores externos.", "Aumentar el volumen de trabajo sin orden.", "Repetir auditorías innecesarias."], "ok": 1, "e": "El alcance define qué se revisa y qué no, priorizando procesos críticos para usar recursos de forma eficaz."},
    {"t": 2, "q": "¿Qué criterios pueden servir de referencia para realizar una auditoría interna?", "o": ["Solo normas internacionales.", "Exclusivamente la normativa legal estatal.", "Criterios internos y externos como protocolos, Estándares ACSA o ISO 9001.", "Opiniones personales del auditor.", "Encuestas de clima laboral."], "ok": 2, "e": "Los criterios deben ser claros, alineados con normativa y guías internas y externas, ajustados a cada proceso auditado."},
    {"t": 2, "q": "¿Qué elemento NO es propio de un cronograma eficaz de auditorías?", "o": ["Fechas claras y escalonadas.", "Evitar solapamientos con periodos críticos.", "Concentrar todas las auditorías en el mismo mes.", "Incluir auditorías de seguimiento.", "Considerar la criticidad de los procesos."], "ok": 2, "e": "Concentrar todas las auditorías en un mismo mes genera sobrecarga y reduce su eficacia; lo recomendable es distribuirlas."},
    {"t": 2, "q": "¿Qué relación existe entre el Plan de Auditorías y el Mapa de Riesgos?", "o": ["Son herramientas independientes sin relación.", "El Plan de Auditorías actualiza el Mapa de Riesgos con nuevos hallazgos y prioridades.", "El Mapa de Riesgos solo se usa en auditorías externas.", "El Plan de Auditorías sustituye la necesidad del Mapa de Riesgos.", "No es relevante para el ciclo PDCA."], "ok": 1, "e": "El Mapa de Riesgos y el Plan de Auditorías se retroalimentan: los riesgos detectados orientan auditorías y los hallazgos actualizan el mapa."},
    {"t": 3, "q": "¿Qué es un indicador clave de rendimiento (KPI) en auditoría sanitaria?", "o": ["Un dato aislado sin relación con estándares.", "Una métrica específica y relevante para evaluar la eficacia de un proceso.", "Un formulario de recursos humanos.", "Una encuesta de satisfacción anual.", "Una tarea exclusivamente administrativa."], "ok": 1, "e": "Un KPI permite medir si los procesos se desarrollan como se espera, relacionando datos con objetivos y estándares definidos."},
    {"t": 3, "q": "¿Cuál de estos elementos NO forma parte de las características SMART de un buen indicador?", "o": ["Específico.", "Medible.", "Ambiguo.", "Alcanzable.", "Temporal."], "ok": 2, "e": "Un buen indicador debe ser Específico, Medible, Alcanzable, Relevante y Temporal. La ambigüedad se evita."},
    {"t": 3, "q": "¿Qué tipo de indicador evalúa cómo se realizan las actividades dentro de un proceso?", "o": ["Indicador de estructura.", "Indicador de resultado.", "Indicador financiero.", "Indicador de proceso.", "Indicador de marketing."], "ok": 3, "e": "Los indicadores de proceso analizan cómo se llevan a cabo las actividades, su correcta implantación y seguimiento."},
    {"t": 3, "q": "¿Qué ventaja aporta definir bien los indicadores antes de implantarlos?", "o": ["Reduce la fiabilidad de los datos.", "Facilita la interpretación homogénea y mejora la toma de decisiones.", "Sustituye la necesidad de auditorías de seguimiento.", "Genera sobrecarga administrativa sin beneficio.", "Evita la participación de los equipos."], "ok": 1, "e": "Una definición clara asegura que todos comprendan qué se mide, cómo se mide y para qué, favoreciendo el aprendizaje y la mejora."},
    {"t": 3, "q": "¿Qué relación tienen los indicadores con el Mapa de Riesgos y el ciclo PDCA?", "o": ["No existe relación alguna.", "Los indicadores sustituyen al Mapa de Riesgos.", "Los indicadores monitorizan los riesgos priorizados y alimentan la mejora continua.", "Solo se usan en procesos administrativos.", "Se aplican solo a indicadores de estructura."], "ok": 2, "e": "Los indicadores se diseñan alineados con los riesgos identificados, monitorizan su evolución y alimentan el ciclo PDCA para cerrar el proceso de mejora."},
    {"t": 4, "q": "¿Qué se entiende por “evidencia” en el contexto de una auditoría?", "o": ["Una opinión personal del auditor.", "Una percepción subjetiva de los resultados.", "Registros, hechos o información verificable que respalda conclusiones.", "Un rumor sin documentación.", "Una hipótesis sin soporte documental."], "ok": 2, "e": "Según ISO 19011, la evidencia son registros, declaraciones de hechos u otra información pertinente y verificable que sustenta los hallazgos."},
    {"t": 4, "q": "¿Qué tipo de evidencia NO se considera adecuado para sustentar un hallazgo de auditoría?", "o": ["Registro documental actualizado.", "Observación directa de un proceso.", "Opinión sin soporte.", "Entrevista estructurada.", "Datos de sistemas de información."], "ok": 2, "e": "En auditoría se exige objetividad; una opinión sin base verificable carece de valor como evidencia."},
    {"t": 4, "q": "¿Qué instrumento es más adecuado para verificar punto por punto el cumplimiento de un protocolo?", "o": ["Una lista de verificación (checklist).", "Un gráfico de barras.", "Un manual de bienvenida.", "Una hoja de incidencias económicas.", "Un correo electrónico sin firmar."], "ok": 0, "e": "El checklist detalla los elementos a comprobar, asegurando que nada importante quede fuera."},
    {"t": 4, "q": "¿Qué principio debe respetarse siempre al recolectar evidencias en auditoría?", "o": ["Registrar solo lo que confirme hipótesis previas.", "Guardar los hallazgos sin compartirlos con nadie.", "Trazabilidad, pertinencia y confidencialidad de la información.", "Delegar toda la recolección en personal ajeno al proceso.", "Omitir información para reducir el volumen de datos."], "ok": 2, "e": "La recolección debe ser objetiva, trazable y confidencial, garantizando fiabilidad y confianza en los resultados."},
    {"t": 4, "q": "¿Qué relación tiene la recolección de evidencias con el ciclo PDCA?", "o": ["Es independiente y no se vincula con ninguna fase.", "Solo se relaciona con la fase de planificación.", "Está integrada en todas las fases, sustentando hallazgos y acciones de mejora.", "Se usa solo para justificar gastos.", "Sustituye la necesidad de auditoría de seguimiento."], "ok": 2, "e": "Las evidencias alimentan cada fase del ciclo PDCA: Planificar, Hacer, Verificar y Actuar, cerrando el bucle de mejora."},
    {"t": 5, "q": "¿Qué función principal cumple el informe de auditoría?", "o": ["Guardar la información en archivo sin difundirla.", "Proporcionar información objetiva, interpretada y útil para la mejora.", "Justificar gastos presupuestarios.", "Sustituir la planificación de auditorías futuras.", "Divulgar datos confidenciales públicamente."], "ok": 1, "e": "El informe comunica hallazgos, los interpreta y plantea recomendaciones prácticas para la toma de decisiones y la mejora continua."},
    {"t": 5, "q": "¿Cuál NO es un requisito clave de un buen informe de auditoría?", "o": ["Claridad en la redacción.", "Objetividad basada en evidencias.", "Coherencia con datos e indicadores.", "Utilidad práctica para la acción.", "Opiniones subjetivas sin respaldo."], "ok": 4, "e": "Las opiniones sin evidencias verificables no cumplen con la objetividad exigida en auditoría."},
    {"t": 5, "q": "¿Qué apartado NO suele formar parte de la estructura básica de un informe de auditoría?", "o": ["Portada y datos identificativos.", "Metodología aplicada.", "Análisis financiero de la empresa.", "Hallazgos y evidencias.", "Conclusiones y recomendaciones."], "ok": 2, "e": "El análisis financiero no forma parte del informe de auditoría clínica salvo que sea objeto de la auditoría. El resto son apartados habituales."},
    {"t": 5, "q": "¿Qué aspecto es fundamental al interpretar datos en un informe de auditoría?", "o": ["Sacar conclusiones precipitadas sin validación.", "Relacionar los datos con objetivos y criterios establecidos.", "Evitar analizar tendencias para ahorrar tiempo.", "Basarse solo en percepciones personales.", "Omitir datos que contradicen hipótesis iniciales."], "ok": 1, "e": "Relacionar datos con estándares y objetivos permite evaluar desviaciones y planificar mejoras de forma coherente."},
    {"t": 5, "q": "¿Qué buena práctica refuerza la utilidad del informe de auditoría?", "o": ["Guardarlo en archivo sin compartirlo.", "Validar borradores con responsables del área auditada.", "Presentarlo solo a la dirección sin implicar al equipo.", "Publicarlo en redes sociales sin autorización.", "Elaborarlo sin principios éticos ni confidencialidad."], "ok": 1, "e": "Revisar y validar el informe con los responsables fomenta la transparencia, la comprensión y la aceptación de resultados y mejoras."},
    {"t": 6, "q": "¿Qué finalidad tiene planificar mejoras tras una auditoría?", "o": ["Archivar los hallazgos sin actuar.", "Elaborar informes sin seguimiento.", "Traducir hallazgos en acciones prácticas, responsables y medibles.", "Justificar presupuestos de calidad.", "Evitar nuevas auditorías de seguimiento."], "ok": 2, "e": "El objetivo es garantizar que los hallazgos se conviertan en mejoras reales con responsables, plazos y recursos definidos."},
    {"t": 6, "q": "¿Qué elemento NO forma parte básica de un plan de acciones de mejora?", "o": ["Objetivos claros.", "Acciones propuestas.", "Cronograma y responsables.", "Indicadores de seguimiento.", "Publicidad en redes sociales."], "ok": 4, "e": "Publicitar en redes sociales no forma parte del plan de acciones; los elementos clave son objetivos, acciones, responsables, cronograma e indicadores."},
    {"t": 6, "q": "¿Cuál es la finalidad principal de la auditoría de seguimiento?", "o": ["Identificar nuevos hallazgos sin cerrar los anteriores.", "Validar la eficacia de las acciones correctoras implantadas.", "Sustituir el ciclo PDCA.", "Evitar la actualización del Mapa de Riesgos.", "Elaborar encuestas de satisfacción."], "ok": 1, "e": "La auditoría de seguimiento verifica si las acciones se ejecutaron bien, si los resultados se alcanzaron y si quedan riesgos abiertos."},
    {"t": 6, "q": "¿Qué factor favorece el éxito de un plan de mejora?", "o": ["Falta de seguimiento real.", "Resistencia al cambio.", "Compromiso de la dirección y comunicación transparente.", "Sobrecarga de tareas sin recursos.", "Comunicación ineficaz."], "ok": 2, "e": "El compromiso directivo y la buena comunicación son claves para legitimar recursos, motivar equipos y consolidar cambios."},
    {"t": 6, "q": "¿Qué principio ético refuerza la cultura de seguridad en auditorías de seguimiento?", "o": ["Enfoque punitivo.", "Búsqueda de responsables individuales.", "Análisis como oportunidad de aprendizaje y mejora continua.", "Divulgación de datos sin confidencialidad.", "Ocultar hallazgos negativos."], "ok": 2, "e": "El enfoque no punitivo convierte los hallazgos en oportunidades de aprendizaje, reforzando la confianza y la cultura de seguridad."}
  ];

  const API = { TEMAS, GLOSARIO, EJEMPLOS, TEST };
  if (typeof module !== "undefined" && module.exports) module.exports = API; else raiz.Contenido = API;
})(typeof window !== "undefined" ? window : globalThis);
