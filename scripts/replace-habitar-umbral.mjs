import { readFileSync, writeFileSync } from "node:fs";

const pagePath = "out/index.html";
let html = readFileSync(pagePath, "utf8");
const css = readFileSync("static-site/habitar-umbral-new.css", "utf8");

const technical = [
  [14,"Planta baja","Planta"],
  [25,"Planta tipo","Planta"],
  [3,"Planta azotea","Planta"],
  [9,"Corte A - A","Corte"],
  [1,"Corte B - B","Corte"],
  [11,"Vista frente","Vista"],
  [18,"Vista lateral izquierda","Vista"],
  [19,"Vista a Rubén Darío","Vista"]
];

const renders = [
  [12,"Vista exterior",true],[2,"Interior · espacio común",false],[4,"Dormitorio",false],[5,"Espacio común interior",true],
  [6,"Patio y pileta",true],[8,"Patio y pileta · segunda mirada",false],[10,"Acceso e interior común",false],[15,"Núcleo y circulación vertical",false],
  [16,"Vista exterior · perspectiva",false],[17,"Patio y pileta · vista general",true],[20,"Patio y pileta · aproximación",false],[24,"Vista frontal",true],
  [27,"Gimnasio",false],[28,"Galería y patio",false],[29,"Patio y pileta · recorrido",true],[30,"Interior de vivienda",true],[31,"Vista exterior · atardecer",false],
  [36,"Baño",false]
];

const details = [
  [7,"Encuentro interior - exterior"],[37,"Borde de pileta y paisaje"],[38,"Balcón y envolvente vegetal"],[39,"Escalera y circulación interior"],[40,"Baño · detalle material"]
];

const schemes = [
  [41,"Envolvente, terrazas y paisaje"],[42,"Composición y ensamblaje"],[43,"Edificio Rubén Darío · axonométrica explotada"],
  [44,"Sección programática"],[45,"Envolvente, terrazas y paisaje · desarrollo"],[46,"Implantación, vacíos y circulaciones"]
];

const process = [
  [47,"Croquis exterior","Croquis"],[48,"Croquis del patio","Croquis"],[49,"Croquis interior","Croquis"],[50,"Maqueta física","Maqueta"]
];

const externalSources = {
  41: "https://adrian-360.floot.app/_cdn/static/9b7c037f-1616-4a85-b7a6-05f2858c87e3-habitar-umbral-esquema-41.webp"
};
const src = n => externalSources[n] || `./images/habitar-umbral-new/umbral-${String(n).padStart(2,"0")}.webp`;
const fig = (n,title,type,cls="") => `<figure${cls ? ` class="${cls}"` : ""}><div class="umbral-doc-media"><img src="${src(n)}" loading="lazy" decoding="async" alt="${title} de Habitar el Umbral"></div><figcaption><span>${title}</span><span>${String(n).padStart(2,"0")} · ${type}</span></figcaption></figure>`;

const technicalFigures = technical.map(([n,title,type]) => fig(n,title,type,"technical-small")).join("\n");
const renderFigures = renders.map(([n,title,feature]) => fig(n,title,"Render",feature ? "render-feature" : "")).join("\n");
const detailFigures = details.map(([n,title]) => fig(n,title,"Detalle","detail-small")).join("\n");
const schemeFigures = schemes.map(([n,title]) => fig(n,title,"Esquema","scheme-small")).join("\n");
const processFigures = process.map(([n,title,type]) => fig(n,title,type,"process-small")).join("\n");

const article = `
    <article class="project habitar-umbral-new" id="habitar-el-umbral">
      <div class="shell">
        <div class="project-heading">
          <span class="project-index">04</span>
          <h3>Habitar el Umbral</h3>
          <div class="project-tag">Proyecto académico · Vivienda colectiva</div>
        </div>
        <div class="project-cover"><img src="${src(35)}" loading="lazy" decoding="async" alt="Vista exterior de Habitar el Umbral"></div>
        <div class="project-summary">
          <p class="statement">Vivienda colectiva articulada por una planta baja de usos comunes, niveles residenciales, expansiones exteriores, una azotea compartida y una envolvente vegetal que integra paisaje y arquitectura.</p>
          <div class="project-data">
            <div class="datum"><small>Proyecto</small><span>Edificio Rubén Darío</span></div>
            <div class="datum"><small>Tipología</small><span>Vivienda colectiva</span></div>
            <div class="datum"><small>Estado</small><span>Proyecto académico</span></div>
            <div class="datum"><small>Autoría</small><span>Adrián Taberna</span></div>
          </div>
        </div>

        <div class="umbral-360-priority" aria-label="Panorama 360 interior de Habitar el Umbral">
          <span>Panorama interior</span>
          <a href="https://adrian-360.floot.app/patio" target="_blank" rel="noopener noreferrer">Explorar render 360° <strong aria-hidden="true">↗</strong></a>
        </div>

        <details class="case-file">
          <summary><span>Ver proyecto</span><strong>+</strong></summary>
          <div class="case-content">
            <div class="umbral-new-intro">
              <h4>Una documentación completamente renovada.</h4>
              <p>El proyecto se organiza por capas: volumen inferior de apoyo, planta baja de usos comunes, niveles tipo de vivienda y una azotea común. Terrazas, balcones, vegetación integrada, vacíos y recorridos construyen la relación entre la vida doméstica, los espacios compartidos y el paisaje.</p>
            </div>
            <div class="umbral-new-meta">
              <div><small>Planta baja</small><span>Hall, espacios comunes, servicios y paisaje</span></div>
              <div><small>Niveles residenciales</small><span>Viviendas, circulación vertical y expansiones</span></div>
              <div><small>Azotea</small><span>Terraza común, paneles solares y paisaje</span></div>
            </div>

            <div class="umbral-new-sectionhead compact-head">
              <h4>Plantas, cortes y vistas</h4>
              <p>Primero se presenta la documentación técnica esencial, sin repeticiones. Cada planta, corte y vista aparece una sola vez y en una escala contenida.</p>
            </div>
            <div class="umbral-technical-grid">${technicalFigures}</div>

            <div class="umbral-new-sectionhead">
              <h4>Renders</h4>
              <p>Las imágenes de mayor escala se reservan para las visualizaciones espaciales: exteriores, interiores, patios, expansiones y vida común.</p>
            </div>
            <div class="umbral-render-grid">${renderFigures}</div>

            <div class="umbral-new-sectionhead compact-head">
              <h4>Detalles</h4>
              <p>Encuentros de materialidad, paisaje, envolvente y circulación.</p>
            </div>
            <div class="umbral-detail-grid">${detailFigures}</div>

            <div class="umbral-new-sectionhead compact-head">
              <h4>Esquemas</h4>
              <p>Lecturas de composición, programa, envolvente, paisaje, implantación y circulaciones.</p>
            </div>
            <div class="umbral-scheme-grid">${schemeFigures}</div>

            <div class="umbral-new-sectionhead compact-head">
              <h4>Croquis y maqueta</h4>
              <p>Material de proceso y verificación volumétrica del proyecto.</p>
            </div>
            <div class="umbral-process-grid">${processFigures}</div>

            <p class="umbral-source-note">Habitar el Umbral · Nueva documentación integral</p>
            <div class="umbral-new-close"></div>
          </div>
        </details>
      </div>
    </article>`;

const start = html.indexOf('<article class="project" id="habitar-el-umbral">');
if (start < 0) throw new Error("No se encontró el artículo actual de Habitar el Umbral");
const end = html.indexOf('</article>', start);
if (end < 0) throw new Error("No se encontró el cierre de Habitar el Umbral");
html = html.slice(0,start) + article + html.slice(end + '</article>'.length);

if (!html.includes('id="habitar-umbral-new-styles"')) {
  html = html.replace('</head>', `<style id="habitar-umbral-new-styles">\n${css}\n</style>\n</head>`);
}

html = html.replace("title:'Habitar el Umbral',lead:'Proyecto académico · Vivienda colectiva · La Reja',note:'La planta baja como infraestructura colectiva entre ciudad, comunidad y vida doméstica.'", "title:'Habitar el Umbral',lead:'Proyecto académico · Vivienda colectiva · Edificio Rubén Darío',note:'Vivienda, espacios comunes, expansiones y paisaje integrados en una envolvente vegetal.'");

writeFileSync(pagePath, html);
console.log(`Habitar el Umbral corregido: ${technical.length} piezas técnicas únicas, renders jerarquizados y panorama 360 visible.`);
