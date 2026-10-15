import { readFileSync, writeFileSync } from "node:fs";

const pagePath = "out/index.html";
let html = readFileSync(pagePath, "utf8");
const css = readFileSync("static-site/centro-ambulatorio-new.css", "utf8");

const technical = [
  [14,1,"Planta general y circulaciones","Planta"],
  [15,2,"Planta de cubiertas","Planta"],
  [16,3,"Vista principal","Vista"],
  [17,4,"Vista lateral","Vista"],
  [18,5,"Corte longitudinal","Corte"],
  [19,6,"Corte transversal","Corte"]
];

const renders = [
  [21,8,"Vista exterior en esquina",false],
  [22,9,"Vista lateral exterior",false],
  [23,10,"Acceso principal · aproximación",true],
  [24,11,"Frente después de la lluvia",true],
  [25,12,"Ingreso y visual hacia el patio central",false],
  [26,13,"Sala de espera y patio central",true],
  [27,14,"Admisión",false],
  [28,15,"Circulación perimetral y jardín",true],
  [29,16,"Recorrido alrededor del patio",false],
  [30,17,"Consultorio · relación con el paisaje",false],
  [31,18,"Consultorio y continuidad del recorrido",false],
  [32,19,"Consultorio · equipamiento y luz natural",false],
  [33,20,"Consultorio · visual hacia el patio",false]
];

const details = [
  [34,21,"Encuentro de carpintería y materialidad"],
  [35,22,"Mueble clínico · detalle"],
  [36,23,"Equipamiento y zócalo · detalle"],
  [37,24,"Cielorraso de madera y encuentro superior"],
  [38,25,"Umbral interior y encuentro de materiales"]
];

const schemes = [
  [39,26,"Secuencia de organización","Esquema"],
  [40,27,"Corte ambiental y funcionamiento","Esquema"],
  [41,28,"Despiece programático","Esquema"]
];

const sketches = [
  [42,29,"Croquis exterior · acceso principal","Croquis"],
  [43,30,"Croquis interior · consultorio","Croquis"]
];

const models = [
  [44,31,"Maqueta física · vista 01"],
  [45,32,"Maqueta física · vista 02"],
  [46,33,"Maqueta física · vista 03"],
  [47,34,"Maqueta física · vista 04"],
  [48,35,"Maqueta física · vista 05"]
];

const src = page => `./images/centro-ambulatorio-new/centro-${String(page).padStart(2,"0")}.jpeg`;
const figure = (page,index,title,type,cls="") => `<figure${cls ? ` class="${cls}"` : ""}><div class="centro-media"><img src="${src(page)}" loading="lazy" decoding="async" alt="${title} del Centro Ambulatorio"></div><figcaption><span>${title}</span><span>${String(index).padStart(2,"0")} · ${type}</span></figcaption></figure>`;

const technicalFigures = technical.map(([page,index,title,type]) => figure(page,index,title,type)).join("\n");
const renderFigures = renders.map(([page,index,title,feature]) => figure(page,index,title,"Render",feature ? "feature" : "")).join("\n");
const detailFigures = details.map(([page,index,title]) => figure(page,index,title,"Detalle")).join("\n");
const schemeFigures = schemes.map(([page,index,title,type]) => figure(page,index,title,type)).join("\n");
const sketchFigures = sketches.map(([page,index,title,type]) => figure(page,index,title,type)).join("\n");
const modelFigures = models.map(([page,index,title]) => figure(page,index,title,"Maqueta")).join("\n");

const article = `
    <article class="project centro-ambulatorio-new" id="centro-ambulatorio">
      <div class="shell">
        <div class="project-heading">
          <span class="project-index">02</span>
          <h3>Centro Ambulatorio</h3>
          <div class="project-tag">Proyecto conceptual · Equipamiento de salud</div>
        </div>
        <div class="project-cover"><img src="${src(20)}" width="1448" height="1086" loading="lazy" decoding="async" alt="Acceso principal del Centro Ambulatorio"></div>
        <div class="project-summary">
          <p class="statement">Una arquitectura sanitaria de escala horizontal organizada alrededor de un patio ajardinado que articula orientación, luz natural, paisaje y bienestar.</p>
          <div class="project-data">
            <div class="datum"><small>Tipología</small><span>Equipamiento sanitario ambulatorio</span></div>
            <div class="datum"><small>Desarrollo</small><span>Edificio predominantemente de una planta</span></div>
            <div class="datum"><small>Organización</small><span>Anillo programático + patio central</span></div>
            <div class="datum"><small>Materialidad</small><span>Minerales claros · vidrio · madera · vegetación</span></div>
          </div>
        </div>
        <details class="case-file">
          <summary><span>Ver proyecto</span><strong>+</strong></summary>
          <div class="case-content">
            <div class="centro-intro">
              <h4>El patio como principio de humanización del espacio sanitario.</h4>
              <p>Centro Ambulatorio propone una organización espacial que sitúa al paciente y su experiencia dentro del edificio como elementos centrales del proyecto. El patio central ajardinado deja de ser un vacío residual para convertirse en la pieza que articula circulaciones, orientación, iluminación natural, vegetación y una experiencia de atención menos institucionalizada.</p>
            </div>

            <div class="centro-meta">
              <div><small>Implantación</small><span>Pieza horizontal exenta con paisaje perimetral</span></div>
              <div><small>Centro</small><span>Patio ajardinado como referencia espacial</span></div>
              <div><small>Circulación</small><span>Recorrido anular continuo alrededor del jardín</span></div>
              <div><small>Programa</small><span>Consultorios · espera · admisión · farmacia · apoyo clínico</span></div>
            </div>

            <div class="centro-narrative">
              <article><small>Implantación y acceso</small><p>El edificio concentra el programa asistencial en una pieza de baja altura, con retiros y superficies ajardinadas que construyen una transición gradual desde la calle. El acceso principal se reconoce con claridad y se diferencia del ingreso de servicios.</p></article>
              <article><small>Partido arquitectónico</small><p>Una geometría aproximadamente cuadrangular dispone el programa sobre los cuatro lados de un vacío central. La configuración anular permite conectar los distintos sectores mediante un recorrido continuo y mantener una referencia visual permanente hacia el patio.</p></article>
              <article><small>Programa y funcionamiento</small><p>Consultorios, salas de espera, admisión, farmacia y espacios de apoyo clínico se integran dentro de una estructura modular y reconocible. La distribución evita concentrar toda la espera en un único recinto y aproxima los ámbitos de permanencia a las áreas de atención.</p></article>
              <article><small>Patio y orientación</small><p>El jardín central constituye el núcleo de la experiencia arquitectónica. Introduce vegetación, luz y profundidad visual, facilita la lectura del edificio y transforma las circulaciones en espacios vinculados con condiciones naturales.</p></article>
              <article><small>Humanización y materialidad</small><p>Superficies minerales claras, cerramientos transparentes, elementos de madera y vegetación construyen una atmósfera sobria pero cálida. La arquitectura busca equilibrar precisión funcional, privacidad, accesibilidad y bienestar ambiental.</p></article>
              <article><small>Ambiente y adaptabilidad</small><p>El patio, las aberturas perimetrales y los lucernarios abren posibilidades de iluminación y ventilación natural, mientras que la organización modular permite pensar futuras adaptaciones programáticas sin perder la estructura espacial del conjunto.</p></article>
            </div>

            <div class="centro-sectionhead compact">
              <h4>Plantas, vistas y cortes</h4>
              <p>La documentación técnica esencial se presenta primero, completa y sin recortes, con una escala suficiente para leer el anillo programático, los accesos y la relación del edificio con el patio central.</p>
            </div>
            <div class="centro-tech">${technicalFigures}</div>

            <div class="centro-sectionhead">
              <h4>Renders</h4>
              <p>Las visualizaciones desarrollan la experiencia exterior e interior: el acceso, las circulaciones, las áreas de espera y consulta, y la presencia constante del jardín como referencia ambiental.</p>
            </div>
            <div class="centro-renders">${renderFigures}</div>

            <div class="centro-sectionhead compact">
              <h4>Detalles</h4>
              <p>Encuentros de carpintería, cielorrasos, equipamiento clínico y transiciones materiales muestran la escala de precisión con la que se construye la atmósfera interior.</p>
            </div>
            <div class="centro-details">${detailFigures}</div>

            <div class="centro-sectionhead compact">
              <h4>Esquemas</h4>
              <p>Organización, funcionamiento ambiental y despiece programático sintetizan la lógica espacial del conjunto y la centralidad del patio.</p>
            </div>
            <div class="centro-schemes">${schemeFigures}</div>

            <div class="centro-sectionhead compact">
              <h4>Croquis</h4>
              <p>Dos exploraciones gráficas acompañan la definición del acceso exterior y del ambiente interior de consulta.</p>
            </div>
            <div class="centro-sketches">${sketchFigures}</div>

            <div class="centro-sectionhead compact">
              <h4>Maqueta</h4>
              <p>Cinco vistas de la maqueta física muestran la implantación, la continuidad de la cubierta y el patio como corazón abierto del edificio.</p>
            </div>
            <div class="centro-models">${modelFigures}</div>

            <p class="centro-source">Centro Ambulatorio · Memoria descriptiva y proyecto renovado</p>
            <div class="centro-close"></div>
          </div>
        </details>
      </div>
    </article>`;

const start = html.indexOf('<article class="project" id="centro-ambulatorio">');
if (start < 0) throw new Error("No se encontró el artículo actual de Centro Ambulatorio");
const boundary = html.indexOf('<aside class="mid-cta"', start);
if (boundary < 0) throw new Error("No se encontró el límite posterior de Centro Ambulatorio");
const oldBlock = html.slice(start, boundary);
const close = oldBlock.lastIndexOf('</article>');
if (close < 0) throw new Error("No se encontró el cierre de Centro Ambulatorio");
html = html.slice(0,start) + article + oldBlock.slice(close + '</article>'.length) + html.slice(boundary);

if (!html.includes('id="centro-ambulatorio-new-styles"')) {
  html = html.replace('</head>', `<style id="centro-ambulatorio-new-styles">\n${css}\n</style>\n</head>`);
}

writeFileSync(pagePath, html);
console.log(`Centro Ambulatorio renovado: ${technical.length} piezas técnicas, ${renders.length + 1} renders, ${details.length} detalles, ${schemes.length} esquemas, ${sketches.length} croquis y ${models.length} vistas de maqueta.`);
