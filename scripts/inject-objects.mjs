import { readFileSync, writeFileSync } from "node:fs";

const pagePath = "out/index.html";
const page = readFileSync(pagePath, "utf8");
const section = readFileSync("static-site/objects-section.html", "utf8");
const styles = readFileSync("static-site/objects-section.css", "utf8");
const gallery = readFileSync("static-site/objects-gallery.js", "utf8");
const refinements = readFileSync("static-site/portfolio-refinements.js", "utf8");

function replaceOnce(source, before, after) {
  const first = source.indexOf(before);
  if (first < 0 || source.indexOf(before, first + before.length) >= 0) {
    throw new Error(`No se encontró exactamente una vez: ${before.slice(0, 75)}`);
  }
  return source.slice(0, first) + after + source.slice(first + before.length);
}

if (page.includes('id="objetos"')) throw new Error("La sección ya fue insertada");

let result = replaceOnce(page, "  </style>", `\n${styles}\n  </style>`);
result = replaceOnce(result, '  <section class="notebook" id="cuaderno"', `${section}\n  <section class="notebook" id="cuaderno"`);
result = replaceOnce(result,
  '<div class="nav-submenu"><a href="#mobiliario">Mobiliario</a><a href="#mobiliario">A medida</a>',
  '<div class="nav-submenu"><a href="#mobiliario">Mobiliario</a><a href="#objetos">Objetos de diseño</a><a href="#mobiliario">A medida</a>');
result = replaceOnce(result,
  '<div class="menu-index-group"><small>Diseño</small><a href="#mobiliario">• Mobiliario</a>',
  '<div class="menu-index-group"><small>Diseño</small><a href="#mobiliario">• Mobiliario</a><a href="#objetos">• Objetos de diseño</a>');
result = replaceOnce(result,
  'Arquitectura, documentación técnica, mobiliario y coordinación de producción.',
  'Arquitectura, documentación técnica, mobiliario y objetos de diseño.');
result = replaceOnce(result,
  '"Diseño de mobiliario","Coordinación de producción"',
  '"Diseño de mobiliario","Diseño de objetos","Coordinación de producción"');

// El estado real de cada proyecto aparece primero y en la misma posición.
result = replaceOnce(result,
  '<div class="project-tag">Vivienda unifamiliar · Proyecto conceptual</div>',
  '<div class="project-tag">Proyecto conceptual · Vivienda unifamiliar</div>');
result = replaceOnce(result,
  '<div class="project-tag">Equipamiento de salud · Proyecto conceptual</div>',
  '<div class="project-tag">Proyecto conceptual · Equipamiento de salud</div>');
result = replaceOnce(result,
  '<div class="project-tag">Vivienda multifamiliar · Proyecto conceptual</div>',
  '<div class="project-tag">Proyecto conceptual · Vivienda multifamiliar</div>');
result = replaceOnce(result,
  '<div class="project-tag">Vivienda colectiva · Proyecto académico</div>',
  '<div class="project-tag">Proyecto académico · Vivienda colectiva</div>');

// Perfil basado en experiencia profesional comprobada.
result = replaceOnce(result,
  '<h2 id="perfil-title">Mirada proyectual y capacidad de ejecución.</h2>\n        <p>Soy arquitecto y trabajo entre el diseño, la documentación y la producción. Mi experiencia en obra y mobiliario me permite tomar decisiones atendiendo tanto a la calidad espacial como a su resolución concreta.</p>',
  '<h2 id="perfil-title">Transformo ideas en documentación construible.</h2>\n        <p>Soy arquitecto matriculado y trabajo en el punto donde el proyecto se vuelve construible: documentación técnica, coordinación y producción. Fui Arquitecto Fiscal en el Ministerio de Salud de CABA, encargado de oficina técnica en Frío Premium y actualmente soy encargado de producción en Belgrano Home. Esa experiencia me permite proyectar atendiendo a la calidad espacial, los procesos y la ejecución real.</p>');
result = replaceOnce(result,
  '<div class="career-row"><small>2024 — Actualidad</small><h3>Belgrano Home</h3><p>Diseño de mobiliario, documentación para fabricación y coordinación de producción.</p></div>',
  '<div class="career-row"><small>2024 — Actualidad</small><h3>Belgrano Home</h3><p>Encargado de producción. Diseño de mobiliario residencial, planos de ensamblaje, corte y detalle, coordinación logística y control de stock.</p></div>');
result = replaceOnce(result,
  '<div class="career-row"><small>2023</small><h3>Ministerio de Salud · CABA</h3><p>Seguimiento de obras, relevamientos, control de calidad e informes técnicos.</p></div>',
  '<div class="career-row"><small>2023</small><h3>Ministerio de Salud · CABA</h3><p>Arquitecto Fiscal. Seguimiento de obras en residencias para adultos mayores, control de avance y calidad, relevamientos e informes técnicos.</p></div>');
result = replaceOnce(result,
  '<div class="career-row"><small>2022 — 2023</small><h3>Frío Premium</h3><p>Diseño y documentación de mobiliario industrial y coordinación técnica.</p></div>',
  '<div class="career-row"><small>2022 — 2023</small><h3>Frío Premium</h3><p>Encargado de oficina técnica. Diseño de mobiliario industrial y cámaras de frío, documentación para fabricación y corte láser, coordinación con clientes y equipo técnico.</p></div>');

// El formulario publicado prepara una consulta completa en el correo del visitante.
result = replaceOnce(result,
  '<button class="contact-submit" type="submit"><span>Preparar consulta</span><strong>↗</strong></button>',
  '<button class="contact-submit" type="submit"><span>Enviar consulta</span><strong>↗</strong></button>');
result = replaceOnce(result,
  '<p class="contact-form-note">Al enviar se abrirá tu aplicación de correo con la consulta preparada. En la versión publicada este formulario se conectará directamente.</p>',
  '<p class="contact-form-note">Se abrirá tu aplicación de correo con el mensaje completo y listo para enviar.</p>');

result = replaceOnce(result, '</body>', `<script>\n${gallery}\n</script>\n<script>\n${refinements}\n</script>\n</body>`);

writeFileSync(pagePath, result);
console.log("Objetos de diseño incorporados a la portada y a ambos menús.");
