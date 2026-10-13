import { readFileSync, writeFileSync } from "node:fs";

const pagePath = "out/index.html";
let html = readFileSync(pagePath, "utf8");
const css = readFileSync("static-site/casa-patio-new.css", "utf8");

const technical = [
  [1,"Planta general","Planta"],
  [2,"Planta de cubiertas","Planta"],
  [3,"Corte longitudinal A - A","Corte"],
  [4,"Corte transversal B - B","Corte"],
  [5,"Elevación principal","Elevación"],
  [6,"Elevación hacia el patio","Elevación"]
];

const renders = [
  [8,"Patio central · vista exterior",true],
  [9,"Vista exterior · aproximación",false],
  [10,"Frente al atardecer",true],
  [11,"Patio central · recorrido",false],
  [12,"Acceso principal · detalle",false],
  [13,"Estar y patio central",true],
  [14,"Estar · relación con el patio",false],
  [15,"Estar-comedor y vacío central",true],
  [16,"Estar · patio como foco",false],
  [17,"Dormitorio · relación con jardín",false],
  [18,"Dormitorio · luz natural",false],
  [19,"Dormitorio · carpintería y madera",false],
  [20,"Dormitorio · vista al exterior",false],
  [21,"Dormitorio · iluminación natural",false],
  [22,"Dormitorio · relación con paisaje",false],
  [23,"Patio · continuidad interior-exterior",true],
  [24,"Acceso · materialidad",false],
  [25,"Cocina",false],
  [26,"Dormitorio · detalle interior-exterior",false],
  [27,"Baño",false],
  [28,"Umbral interior-exterior",false]
];

const schemes = [
  [29,"Vacío central y sistema espacial","Esquema"],
  [30,"Secuencia de composición","Esquema"]
];

const sketches = [
  [32,"Croquis de fachada y acceso","Croquis"],
  [33,"Croquis interior y patio","Croquis"],
  [34,"Croquis del vacío central","Croquis"]
];

const src = n => `./images/casa-patio-new/casa-${String(n).padStart(2,"0")}.jpeg`;
const figure = (n,title,type,cls="") => `<figure${cls ? ` class="${cls}"` : ""}><div class="casa-patio-media"><img src="${src(n)}" loading="lazy" decoding="async" alt="${title} de Casa Patio"></div><figcaption><span>${title}</span><span>${String(n).padStart(2,"0")} · ${type}</span></figcaption></figure>`;

const technicalFigures = technical.map(([n,title,type]) => figure(n,title,type)).join("\n");
const renderFigures = renders.map(([n,title,feature]) => figure(n,title,"Render",feature ? "feature" : "")).join("\n");
const schemeFigures = schemes.map(([n,title,type]) => figure(n,title,type)).join("\n");
const sketchFigures = sketches.map(([n,title,type]) => figure(n,title,type)).join("\n");

const article = `
    <article class="project casa-patio-new" id="casa-patio">
      <div class="shell">
        <div class="project-heading">
          <span class="project-index">01</span>
          <h3>Casa Patio</h3>
          <div class="project-tag">Vivienda unifamiliar · Patio central</div>
        </div>
        <div class="project-cover"><img src="${src(7)}" width="1448" height="1086" loading="lazy" decoding="async" alt="Acceso principal de Casa Patio"></div>
        <div class="project-summary">
          <p class="statement">Una vivienda de una planta organizada alrededor de un vacío central que articula luz, vegetación, recorridos y vida doméstica.</p>
          <div class="project-data">
            <div class="datum"><small>Tipología</small><span>Vivienda unifamiliar</span></div>
            <div class="datum"><small>Implantación</small><span>Volumen de una planta</span></div>
            <div class="datum"><small>Organización</small><span>Perímetro construido + patio central</span></div>
            <div class="datum"><small>Materialidad</small><span>Minerales · vidrio · madera</span></div>
          </div>
        </div>
        <details class="case-file">
          <summary><span>Ver proyecto</span><strong>+</strong></summary>
          <div class="case-content">
            <div class="casa-patio-intro">
              <h4>El vacío como principio organizador del habitar.</h4>
              <p>Casa Patio incorpora el patio como núcleo conceptual, espacial y ambiental de la vivienda. La arquitectura se desarrolla alrededor de un centro abierto que establece relaciones visuales, funcionales y sensoriales entre los ambientes, haciendo de la luz natural, la vegetación y el paisaje inmediato parte de la experiencia cotidiana.</p>
            </div>

            <div class="casa-patio-meta">
              <div><small>Configuración</small><span>Geometría compacta y desarrollo horizontal</span></div>
              <div><small>Centro</small><span>Patio rectangular con vegetación</span></div>
              <div><small>Relación espacial</small><span>Continuidad interior - exterior</span></div>
              <div><small>Expresión</small><span>Sobriedad material y transparencia</span></div>
            </div>

            <div class="casa-patio-narrative">
              <article><small>Implantación</small><p>La vivienda se presenta como un volumen compacto de una planta, rodeado por superficie ajardinada. La regularidad de la arquitectura se contrapone al carácter orgánico de la vegetación y construye una transición gradual entre edificio y paisaje.</p></article>
              <article><small>Organización funcional</small><p>Los sectores social, privado y de servicio se distribuyen alrededor del patio. El vacío central funciona como referencia permanente, orienta los desplazamientos y mantiene una relación común entre los distintos ambientes.</p></article>
              <article><small>Patio central</small><p>El patio es el principal acontecimiento espacial del proyecto: ilumina, introduce vegetación, amplía la profundidad visual y construye una relación transversal entre los espacios cerrados de la vivienda.</p></article>
              <article><small>Luz y materialidad</small><p>Superficies minerales, grandes cerramientos vidriados, perfiles oscuros y terminaciones de madera forman una paleta contenida. La luz y las sombras de la vegetación modifican esa arquitectura estable a lo largo del día.</p></article>
            </div>

            <div class="casa-patio-sectionhead compact">
              <h4>Plantas, cortes y elevaciones</h4>
              <p>La documentación técnica esencial se presenta primero, en una escala legible y sin competir con las visualizaciones espaciales.</p>
            </div>
            <div class="casa-patio-tech">${technicalFigures}</div>

            <div class="casa-patio-sectionhead">
              <h4>Renders</h4>
              <p>Las imágenes de mayor escala muestran la experiencia del acceso, el patio, los espacios sociales y privados, y la continuidad material entre interior y exterior.</p>
            </div>
            <div class="casa-patio-renders">${renderFigures}</div>

            <div class="casa-patio-sectionhead compact">
              <h4>Esquemas</h4>
              <p>El vacío central, la organización programática y la secuencia de composición sintetizan la lógica del proyecto.</p>
            </div>
            <div class="casa-patio-schemes">${schemeFigures}</div>

            <div class="casa-patio-sectionhead compact">
              <h4>Croquis</h4>
              <p>Exploraciones de fachada, patio e interior que acompañan la definición espacial de la vivienda.</p>
            </div>
            <div class="casa-patio-sketches">${sketchFigures}</div>

            <p class="casa-patio-source">Casa Patio · Memoria descriptiva y documentación renovada</p>
            <div class="casa-patio-close"></div>
          </div>
        </details>
      </div>
    </article>`;

const start = html.indexOf('<article class="project" id="casa-patio">');
if (start < 0) throw new Error("No se encontró el artículo actual de Casa Patio");
const end = html.indexOf('</article>', start);
if (end < 0) throw new Error("No se encontró el cierre de Casa Patio");
html = html.slice(0,start) + article + html.slice(end + '</article>'.length);

if (!html.includes('id="casa-patio-new-styles"')) {
  html = html.replace('</head>', `<style id="casa-patio-new-styles">\n${css}\n</style>\n</head>`);
}

html = html.replace(/<div class="hero-media"><img[^>]+><\/div>/, `<div class="hero-media"><img src="${src(10)}" width="1448" height="1086" fetchpriority="high" decoding="async" alt="Casa Patio al atardecer, vivienda organizada alrededor de un patio central"></div>`);
html = html.replaceAll("Proyecto conceptual · Vivienda unifamiliar · 244,80 m²", "Vivienda unifamiliar · Patio central · Una planta");
html = html.replaceAll("Luz, vegetación y vida cotidiana organizadas alrededor de un vacío central.", "El vacío como principio organizador del habitar.");

writeFileSync(pagePath, html);
console.log(`Casa Patio renovada: ${technical.length} piezas técnicas, ${renders.length + 1} renders, ${schemes.length} esquemas y ${sketches.length} croquis.`);
