export interface Track {
  id: string;
  title: string;
  focus: string;
  tag: string;
  description: string;
  icon: string;
  details: {
    narrative: string;
    challenges: string[];
    techStack: string[];
    deliverable: string;
  };
}

export const tracks: Track[] = [
  {
    id: "manantiales-de-datos",
    title: "Manantiales de Datos",
    focus: "Eco-monitoreo e Infraestructura Hídrica",
    tag: "Track 01",
    icon: "💧",
    description:
      "Optimización del ciclo del agua en el bosque, detección temprana de incendios forestales y mapeo analítico de la biodiversidad en las cuatro secciones mediante arquitecturas de datos abiertos y sensores IoT.",
    details: {
      narrative:
        "Los manantiales de Chapultepec alimentaron a la gran Tenochtitlan. Hoy, esos mismos flujos de agua necesitan un sistema nervioso digital: sensores que midan calidad, caudal y temperatura en tiempo real, modelos predictivos que detecten anomalías antes de que se conviertan en crisis, y dashboards públicos que devuelvan la transparencia al recurso más vital del bosque.",
      challenges: [
        "Diseñar una red de sensores IoT para monitoreo hídrico en tiempo real de los manantiales activos",
        "Crear modelos de machine learning para detección temprana de incendios forestales usando datos satelitales y terrestres",
        "Desarrollar un mapa interactivo de biodiversidad con datos abiertos de las cuatro secciones del bosque",
        "Implementar un sistema de alertas ambientales para la comunidad circundante",
      ],
      techStack: [
        "Python / R para análisis de datos",
        "TensorFlow / PyTorch para modelos predictivos",
        "Apache Kafka para streaming de datos IoT",
        "PostGIS para datos geoespaciales",
        "D3.js / Deck.gl para visualización",
      ],
      deliverable:
        "Prototipo funcional de plataforma de eco-monitoreo con al menos un pipeline de datos activo, visualización en mapa y sistema de alertas.",
    },
  },
  {
    id: "el-gran-acueducto",
    title: "El Gran Acueducto",
    focus: "Movilidad e Interconectividad Sustentable",
    tag: "Track 02",
    icon: "🗺️",
    description:
      "Soluciones de software orientadas a mitigar el impacto ambiental del flujo peatonal, mejorar la accesibilidad universal y diseñar algoritmos de distribución y transporte limpio que conecten la infraestructura histórica con la nueva Cuarta Sección.",
    details: {
      narrative:
        "El acueducto de Chapultepec fue una obra maestra de ingeniería que conectó dos mundos. Este track busca su equivalente digital: algoritmos que distribuyan el flujo de 15 millones de visitantes anuales de forma inteligente, rutas accesibles para personas con discapacidad motriz, y sistemas de transporte limpio que eliminen el carbono de la experiencia del bosque.",
      challenges: [
        "Desarrollar un algoritmo de distribución peatonal que reduzca la saturación en zonas críticas del bosque",
        "Crear una plataforma de accesibilidad universal con rutas adaptadas y señalización digital inclusiva",
        "Diseñar un sistema de transporte eléctrico interno con optimización de rutas en tiempo real",
        "Implementar un modelo de huella de carbono por visitante con gamificación para incentivar prácticas sustentables",
      ],
      techStack: [
        "Graph algorithms para optimización de rutas",
        "React Native / Flutter para apps móviles",
        "WebSockets para datos en tiempo real",
        "OpenStreetMap / Mapbox para cartografía",
        "Node.js para APIs de distribución",
      ],
      deliverable:
        "Aplicación funcional que demuestre al menos una solución de movilidad sustentable con interfaz de usuario y backend operativo.",
    },
  },
  {
    id: "memorias-del-ahuehuete",
    title: "Memorias del Ahuehuete",
    focus: "Cultura y Patrimonio Digitalizado",
    tag: "Track 03",
    icon: "🌳",
    description:
      "Desarrollo de plataformas web inmersivas, herramientas de realidad aumentada o repositorios interactivos que rescaten, preserven y democraticen la memoria histórica, arqueológica y artística del circuito de museos de Chapultepec.",
    details: {
      narrative:
        "El Ahuehuete de Moctezuma ha sido testigo silencioso de 500 años de historia. Este track busca darle voz: herramientas digitales que rescaten archivos históricos de la oscuridad, experiencias de realidad aumentada que superpongan el pasado sobre el presente, y plataformas colaborativas donde la comunidad pueda contribuir a preservar la memoria colectiva del bosque.",
      challenges: [
        "Construir una plataforma web inmersiva para recorrer virtualmente el circuito de museos de Chapultepec",
        "Desarrollar una experiencia de realidad aumentada que revele capas históricas del bosque in situ",
        "Crear un repositorio interactivo de patrimonio arqueológico con digitalización 3D de piezas clave",
        "Diseñar un sistema de narrativas colaborativas donde la comunidad documente historias orales del bosque",
      ],
      techStack: [
        "Three.js / A-Frame para experiencias 3D e inmersivas",
        "WebXR para realidad aumentada en navegador",
        "Astro / Next.js para plataformas web de alto rendimiento",
        "Supabase / Firebase para backend colaborativo",
        "IIIF para estándares de patrimonio digital",
      ],
      deliverable:
        "Experiencia digital interactiva que demuestre al menos una forma innovadora de preservar o democratizar el patrimonio cultural de Chapultepec.",
    },
  },
];
