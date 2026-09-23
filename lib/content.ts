export type Project = {
  slug: string;
  title: string;
  category: string;
  status: string;
  location?: string;
  area?: string;
  year?: string;
  role: string;
  statement: string;
  problem: string;
  response: string;
  cover: string;
  images: { src: string; alt: string; caption?: string; kind?: "technical" | "wide" }[];
};

export const projects: Project[] = [
  {
    slug: "casa-patio",
    title: "Casa Patio",
    category: "Vivienda unifamiliar",
    status: "Proyecto conceptual",
    area: "244,80 m²",
    role: "Diseño integral",
    statement: "Una vivienda organizada alrededor de un vacío central que vincula luz, vegetación y vida cotidiana.",
    problem: "Conseguir privacidad y continuidad espacial sin aislar la vivienda de la luz ni del paisaje.",
    response: "El patio funciona como orientación, expansión y centro doméstico; hormigón, madera y vidrio construyen una atmósfera serena.",
    cover: "/images/casa-patio-exterior.webp",
    images: [
      { src: "/images/casa-patio-exterior.webp", alt: "Vista exterior de Casa Patio", kind: "wide" },
      { src: "/images/casa-patio-planta.webp", alt: "Planta general de Casa Patio", caption: "Planta general", kind: "technical" },
      { src: "/images/casa-patio-axonometrica.webp", alt: "Axonométrica explotada de Casa Patio", caption: "Organización espacial", kind: "technical" }
    ]
  },
  {
    slug: "centro-ambulatorio",
    title: "Centro Ambulatorio",
    category: "Arquitectura para la salud",
    status: "Proyecto conceptual",
    location: "Córdoba, Argentina",
    area: "1.980 m²",
    role: "Diseño arquitectónico",
    statement: "Un edificio de salud legible y humano, organizado en torno a patios que orientan y aportan calidad ambiental.",
    problem: "Resolver recorridos clínicos complejos sin producir un edificio hostil o dependiente de señalización constante.",
    response: "El patio se vuelve referencia espacial y separa accesos, esperas y atención mientras introduce luz y ventilación natural.",
    cover: "/images/centro-ambulatorio-exterior.webp",
    images: [
      { src: "/images/centro-ambulatorio-exterior.webp", alt: "Vista exterior del Centro Ambulatorio", kind: "wide" },
      { src: "/images/centro-ambulatorio-planta.webp", alt: "Planta general del Centro Ambulatorio", caption: "Planta y circulaciones", kind: "technical" },
      { src: "/images/centro-ambulatorio-axonometrica.webp", alt: "Axonométrica del Centro Ambulatorio", caption: "Patio y organización funcional", kind: "technical" }
    ]
  },
  {
    slug: "torre-residencial",
    title: "Torre Residencial",
    category: "Vivienda multifamiliar",
    status: "Proyecto conceptual",
    role: "Diseño arquitectónico",
    statement: "Densidad urbana con expansiones privadas, vegetación y un basamento que activa la relación con la ciudad.",
    problem: "Aumentar la densidad sin perder expansión, relación con el exterior ni una escala amable en planta baja.",
    response: "La torre libera el centro de manzana; el basamento comercial y las terrazas trasladan cualidades domésticas a la vivienda en altura.",
    cover: "/images/torre-residencial-exterior.webp",
    images: [
      { src: "/images/torre-residencial-exterior.webp", alt: "Vista urbana de la Torre Residencial", kind: "wide" },
      { src: "/images/torre-residencial-planta.webp", alt: "Planta tipo de la Torre Residencial", caption: "Planta tipo", kind: "technical" },
      { src: "/images/torre-residencial-axonometrica.webp", alt: "Axonométrica explotada de la Torre Residencial", caption: "Basamento, viviendas y terrazas", kind: "technical" }
    ]
  },
  {
    slug: "habitar-el-umbral",
    title: "Habitar el Umbral",
    category: "Vivienda colectiva",
    status: "Proyecto académico",
    location: "La Reja, Moreno",
    role: "Adrián Taberna + Axel Staino",
    statement: "Un edificio que transforma la planta baja en infraestructura colectiva y extiende el habitar hacia la comunidad, la producción y el paisaje.",
    problem: "Evitar que los espacios compartidos sean circulaciones residuales sin identidad ni apropiación.",
    response: "Las viviendas se concentran para liberar un zócalo colectivo; balcones profundos, filtros vegetales y cubierta productiva construyen el gradiente entre ciudad y vida doméstica.",
    cover: "/images/habitar-umbral-exterior.webp",
    images: [
      { src: "/images/habitar-umbral-exterior.webp", alt: "Vista nocturna de Habitar el Umbral", kind: "wide" },
      { src: "/images/habitar-umbral-axonometrica.webp", alt: "Axonométrica explotada de Habitar el Umbral", caption: "Edificio por capas", kind: "technical" },
      { src: "/images/habitar-umbral-patio.webp", alt: "Patio común de Habitar el Umbral", caption: "Paisaje común y encuentro", kind: "wide" },
      { src: "/images/habitar-umbral-planta.webp", alt: "Planta baja programática de Habitar el Umbral", caption: "Zócalo colectivo", kind: "technical" },
      { src: "/images/habitar-umbral-acceso.webp", alt: "Acceso colectivo de Habitar el Umbral", caption: "Acceso y apropiación", kind: "wide" },
      { src: "/images/habitar-umbral-interior.webp", alt: "Interior doméstico de Habitar el Umbral", caption: "Interior abierto al balcón", kind: "wide" }
    ]
  }
];

export type Furniture = {
  slug: string;
  title: string;
  type: string;
  materials: string;
  dimensions: string;
  description: string;
  cover: string;
};

export const furniture: Furniture[] = [
  {
    slug: "comoda-blanca-paraiso",
    title: "Cómoda Blanca Paraíso",
    type: "Dormitorio · Guardado",
    materials: "Laca blanca · Madera de paraíso",
    dimensions: "1000 × 450 × 900 mm",
    description: "Una pieza de guardado de ocho cajones donde la continuidad blanca se interrumpe con líneas cálidas de madera. El zócalo retranqueado reduce visualmente el volumen y hace que el cuerpo parezca apoyarse con ligereza.",
    cover: "/images/comoda-blanca-paraiso.webp"
  },
  {
    slug: "mesa-comedor-paraiso",
    title: "Mesa de Comedor Paraíso",
    type: "Comedor · Mesa",
    materials: "Madera de paraíso · Hierro negro",
    dimensions: "1600 × 800 × 800 mm",
    description: "La tapa de paraíso se apoya sobre dos bastidores metálicos delgados vinculados por un larguero longitudinal. La estructura busca máxima claridad: estabilidad constructiva con la menor presencia visual posible.",
    cover: "/images/mesa-comedor-paraiso.webp"
  },
  {
    slug: "mesa-paraiso-blanca",
    title: "Mesa Paraíso Blanca",
    type: "Comedor · Mesa",
    materials: "Madera de paraíso · Tapa blanca",
    dimensions: "Configuración a medida",
    description: "Una mesa de proporciones domésticas que combina la calidez de la madera con una superficie clara y continua. Los paneles laterales se leen como planos estructurales y construyen una silueta serena.",
    cover: "/images/mesa-paraiso-blanca.webp"
  },
  {
    slug: "cama-plataforma-biblioteca",
    title: "Cama Plataforma Biblioteca",
    type: "Dormitorio · Sistema integrado",
    materials: "Laca blanca · Madera de nogal",
    dimensions: "Configuración a medida",
    description: "La cama se convierte en una pequeña arquitectura: plataforma, guardado y biblioteca forman un único sistema. Los nichos de nogal introducen profundidad, tactilidad y una escala más íntima dentro del volumen blanco.",
    cover: "/images/cama-plataforma-biblioteca.webp"
  }
];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
export const getFurniture = (slug: string) => furniture.find((piece) => piece.slug === slug);
