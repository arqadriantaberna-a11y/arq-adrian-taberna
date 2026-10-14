import { readFileSync, writeFileSync } from "node:fs";

const pagePath = "out/index.html";
let html = readFileSync(pagePath, "utf8");
const css = readFileSync("static-site/torre-residencial-new.css", "utf8");

const technical = [
  [1,"Planta baja","Planta"],
  [2,"Planta tipo","Planta"],
  [3,"Planta terraza","Planta"],
  [4,"Vista principal","Vista"],
  [5,"Vista lateral","Vista"],
  [6,"Corte longitudinal","Corte"],
  [7,"Corte transversal","Corte"]
];

const renders = [
  [9,"Vista exterior en esquina",true],
  [10,"Vista principal · lluvia",false],
  [11,"Basamento y planta baja",false],
  [12,"Vista aérea del conjunto",true],
  [13,"Vista exterior nocturna",false],
  [14,"Estar-comedor y expansión",false],
  [15,"Dormitorio y balcón",false],
  [16,"Galería interior y patio central",true],
  [17,"Lobby y patio central",false],
  [18,"Cocina y comedor",false],
  [19,"Baño · materialidad",false],
  [20,"Circulación alrededor del patio",true],
  [21,"Dormitorio y terraza",false],
  [22,"Espacio gastronómico en planta baja",false],
  [23,"Balcón ajardinado · detalle",false],
  [24,"Galería colectiva · detalle",false],
  [25,"Planta baja y relación con la calle",true],
  [26,"Umbral interior-exterior",false],
  [27,"Baño · detalle interior",false],
  [28,"Área gastronómica · detalle",false]
];

const schemes = [
  [29,"Vacío central e implantación","Esquema"],
  [30,"Secuencia de composición","Esquema"],
  [31,"Programa, núcleos y circulaciones","Esquema"],
  [32,"Despiece vertical","Esquema"],
  [33,"Sección ambiental y paisaje vertical","Esquema"]
];

const sketches = [
  [34,"Croquis exterior · perspectiva","Croquis"],
  [35,"Croquis exterior · vista frontal","Croquis"],
  [36,"Croquis interior · lobby y patio","Croquis"]
];

const models = [
  [37,"Maqueta física · vista 01"],
  [38,"Maqueta física · vista 02"],
  [39,"Maqueta física · vista 03"],
  [40,"Maqueta física · vista 04"],
  [41,"Maqueta física · vista 05"]
];

const src = n => `./images/torre-residencial-new/torre-${String(n).padStart(2,"0")}.webp`;
const figure = (n,title,type,cls="") => `<figure${cls ? ` class="${cls}"` : ""}><div class="torre-media"><img src="${src(n)}" loading="lazy" decoding="async" alt="${title} de Torre Residencial"></div><figcaption><span>${title}</span><span>${String(n).padStart(2,"0")} · ${type}</span></figcaption></figure>`;

const technicalFigures = technical.map(([n,title,type]) => figure(n,title,type)).join("\n");
const renderFigures = renders.map(([n,title,feature]) => figure(n,title,"Render",feature ? "feature" : "")).join("\n");
const schemeFigures = schemes.map(([n,title,type]) => figure(n,title,type)).join("\n");
const sketchFigures = sketches.map(([n,title,type]) => figure(n,title,type)).join("\n");
const modelFigures = models.map(([n,title]) => figure(n,title,"Maqueta")).join("\n");

const article = `
    <article class="project torre-residencial-new" id="torre-residencial">
      <div class="shell">
        <div class="project-heading">
          <span class="project-index">03</span>
          <h3>Torre Residencial</h3>
          <div class="project-tag">Vivienda colectiva en altura · Vacío central</div>
        </div>
        <div class="project-cover"><img src="${src(8)}" width="1122" height="1402" loading="lazy" decoding="async" alt="Torre Residencial con basamento transparente, balcones y vegetación"></div>
        <div class="project-summary">
          <p class="statement">Una reinterpretación de la vivienda colectiva en altura donde un patio interior de escala común organiza luz, paisaje, recorridos y vida comunitaria.</p>
          <div class="project-data">
            <div class="datum"><small>Tipología</small><span>Vivienda colectiva en altura</span></div>
            <div class="datum"><small>Organización</small><span>Perímetro construido + vacío central</span></div>
            <div class="datum"><small>Programa</small><span>Subsuelo + basamento + viviendas + terraza</span></div>
            <div class="datum"><small>Materialidad</small><span>Hormigón · vidrio · metal · vegetación</span></div>
          </div>
        </div>
        <details class="case-file">
          <summary><span>Ver proyecto</span><strong>+</strong></summary>
          <div class="case-content">
            <div class="torre-intro">
              <h4>El vacío como articulador de la vivienda colectiva en altura.</h4>
              <p>Torre Residencial parte de la integración entre naturaleza, densidad urbana y calidad espacial. La operación principal consiste en trasladar los principios del patio tradicional a una tipología de mayor densidad, construyendo un vacío central continuo que atraviesa verticalmente el edificio y vincula arquitectura, vegetación, iluminación natural y vida comunitaria.</p>
            </div>

            <div class="torre-meta">
              <div><small>Implantación</small><span>Ocupación compacta en altura</span></div>
              <div><small>Centro</small><span>Patio interior ajardinado de escala colectiva</span></div>
              <div><small>Circulación</small><span>Recorridos interiores vinculados al vacío</span></div>
              <div><small>Coronamiento</small><span>Terraza colectiva ajardinada</span></div>
            </div>

            <div class="torre-narrative">
              <article><small>Implantación y ciudad</small><p>El edificio diferencia un basamento de carácter público o colectivo y un cuerpo superior residencial. La planta baja busca una relación transparente con la calle, mientras que balcones, vegetación y planos horizontales construyen la presencia urbana del volumen en altura.</p></article>
              <article><small>Organización funcional</small><p>Los niveles subterráneos concentran estacionamiento y servicios; la planta baja incorpora usos compartidos alrededor del patio; las plantas tipo organizan las viviendas sobre el perímetro y la terraza completa el sistema con áreas de expansión y permanencia.</p></article>
              <article><small>Patio central</small><p>El jardín interior constituye la operación espacial y ambiental más significativa. Su continuidad vertical permite relaciones visuales entre plantas y transforma la circulación colectiva en una experiencia vinculada con luz, aire y paisaje.</p></article>
              <article><small>Vivienda y comunidad</small><p>La propuesta articula distintos grados de privacidad. Las unidades mantienen su independencia y sus expansiones, pero participan de una estructura común donde el patio y los ámbitos colectivos construyen una identidad residencial compartida.</p></article>
              <article><small>Fachadas y materialidad</small><p>La expresión surge de la repetición de losas, balcones, soportes verticales y cerramientos transparentes. Hormigón aparente, vidrio, metal y vegetación producen una arquitectura sobria donde estructura, profundidad y paisaje forman un único sistema.</p></article>
              <article><small>Terraza y ambiente</small><p>La cubierta se transforma en paisaje colectivo elevado. El patio, los balcones y las superficies vegetadas abren posibilidades de iluminación, ventilación, sombra y contacto cotidiano con la naturaleza dentro de una organización de alta densidad.</p></article>
            </div>

            <div class="torre-sectionhead compact">
              <h4>Plantas, vistas y cortes</h4>
              <p>La documentación técnica esencial se presenta primero, completa y sin recortes, con una escala suficiente para leer el sistema de vacío central, los niveles residenciales y el basamento.</p>
            </div>
            <div class="torre-tech">${technicalFigures}</div>

            <div class="torre-sectionhead">
              <h4>Renders</h4>
              <p>Las visualizaciones desarrollan la experiencia exterior e interior del proyecto: la relación con la ciudad, las viviendas, las circulaciones en torno al patio y los espacios colectivos de planta baja.</p>
            </div>
            <div class="torre-renders">${renderFigures}</div>

            <div class="torre-sectionhead compact">
              <h4>Esquemas</h4>
              <p>Vacío central, implantación, composición, programa, núcleos, despiece vertical y comportamiento ambiental sintetizan la lógica del conjunto.</p>
            </div>
            <div class="torre-schemes">${schemeFigures}</div>

            <div class="torre-sectionhead compact">
              <h4>Croquis</h4>
              <p>Exploraciones gráficas del volumen urbano, la fachada principal y la experiencia interior vinculada con el patio.</p>
            </div>
            <div class="torre-sketches">${sketchFigures}</div>

            <div class="torre-sectionhead compact">
              <h4>Maqueta</h4>
              <p>Cinco vistas de la maqueta física muestran la masa construida, el vacío central, el basamento y la continuidad vegetal de balcones y cubierta.</p>
            </div>
            <div class="torre-models">${modelFigures}</div>

            <p class="torre-source">Torre Residencial · Memoria descriptiva y proyecto renovado</p>
            <div class="torre-close"></div>
          </div>
        </details>
      </div>
    </article>`;

const start = html.indexOf('<article class="project" id="torre-residencial">');
if (start < 0) throw new Error("No se encontró el artículo actual de Torre Residencial");
const end = html.indexOf('</article>', start);
if (end < 0) throw new Error("No se encontró el cierre de Torre Residencial");
html = html.slice(0,start) + article + html.slice(end + '</article>'.length);

if (!html.includes('id="torre-residencial-new-styles"')) {
  html = html.replace('</head>', `<style id="torre-residencial-new-styles">\n${css}\n</style>\n</head>`);
}

writeFileSync(pagePath, html);
console.log(`Torre Residencial renovada: ${technical.length} piezas técnicas, ${renders.length + 1} renders, ${schemes.length} esquemas, ${sketches.length} croquis y ${models.length} vistas de maqueta.`);
