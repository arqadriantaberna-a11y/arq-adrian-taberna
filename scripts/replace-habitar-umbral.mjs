import { readFileSync, writeFileSync } from "node:fs";

const pagePath = "out/index.html";
let html = readFileSync(pagePath, "utf8");
const css = readFileSync("static-site/habitar-umbral-new.css", "utf8");

const items = [
  [1,"Corte B - B","Documentación",true],[2,"Interior · espacio común","Render",false],[3,"Planta azotea","Documentación",true],[4,"Dormitorio","Render",false],[5,"Espacio común interior","Render",false],[6,"Patio y pileta","Render",false],[7,"Encuentro interior - exterior","Detalle",false],[8,"Patio y pileta","Render",false],[9,"Corte A - A","Documentación",true],[10,"Acceso e interior común","Render",false],[11,"Vista frente","Documentación",true],[12,"Vista exterior","Render",false],[13,"Corte A - A","Documentación",true],[14,"Planta baja","Documentación",true],[15,"Núcleo y circulación vertical","Render",false],[16,"Vista exterior","Render",false],[17,"Patio y pileta","Render",false],[18,"Vista lateral izquierda","Documentación",true],[19,"Vista a Rubén Darío","Documentación",true],[20,"Patio y pileta · aproximación","Render",false],[21,"Corte B - B","Documentación",true],[22,"Vista a Rubén Darío","Documentación",true],[23,"Planta azotea","Documentación",true],[24,"Vista frontal","Render",false],[25,"Planta tipo","Documentación",true],[26,"Vista frente","Documentación",true],[27,"Gimnasio","Render",false],[28,"Galería y patio","Render",false],[29,"Patio y pileta","Render",false],[30,"Interior de vivienda","Render",false],[31,"Vista exterior","Render",false],[32,"Vista lateral izquierda","Documentación",true],[33,"Planta tipo","Documentación",true],[34,"Planta baja","Documentación",true],[35,"Vista exterior","Render",false],[36,"Baño","Render",false],[37,"Borde de pileta y paisaje","Detalle",false],[38,"Balcón y envolvente vegetal","Detalle",false],[39,"Escalera y circulación interior","Detalle",false],[40,"Baño · detalle material","Detalle",false],[41,"Envolvente, terrazas y paisaje","Esquema",true],[42,"Composición y ensamblaje","Esquema",true],[43,"Edificio Rubén Darío · axonométrica explotada","Esquema",true],[44,"Sección programática","Esquema",true],[45,"Envolvente, terrazas y paisaje","Esquema",true],[46,"Implantación, vacíos y circulaciones","Esquema",true],[47,"Croquis exterior","Croquis",false],[48,"Croquis del patio","Croquis",false],[49,"Croquis interior","Croquis",false],[50,"Maqueta física","Maqueta",true]
];

const figures = items.map(([n,title,type,full]) => {
  const num = String(n).padStart(2,"0");
  return `<figure${full ? ' class="full"' : ''}><div class="umbral-doc-media"><img src="./images/habitar-umbral-new/umbral-${num}.webp" loading="lazy" decoding="async" alt="${title} de Habitar el Umbral"></div><figcaption><span>${title}</span><span>${num} · ${type}</span></figcaption></figure>`;
}).join("\n");

const article = `
    <article class="project habitar-umbral-new" id="habitar-el-umbral">
      <div class="shell">
        <div class="project-heading">
          <span class="project-index">04</span>
          <h3>Habitar el Umbral</h3>
          <div class="project-tag">Proyecto académico · Vivienda colectiva</div>
        </div>
        <div class="project-cover"><img src="./images/habitar-umbral-new/umbral-35.webp" loading="lazy" decoding="async" alt="Vista exterior de Habitar el Umbral"></div>
        <div class="project-summary">
          <p class="statement">Vivienda colectiva articulada por una planta baja de usos comunes, niveles residenciales, expansiones exteriores, una azotea compartida y una envolvente vegetal que integra paisaje y arquitectura.</p>
          <div class="project-data">
            <div class="datum"><small>Proyecto</small><span>Edificio Rubén Darío</span></div>
            <div class="datum"><small>Tipología</small><span>Vivienda colectiva</span></div>
            <div class="datum"><small>Estado</small><span>Proyecto académico</span></div>
            <div class="datum"><small>Autoría</small><span>Adrián Taberna</span></div>
          </div>
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
            <div class="umbral-new-sectionhead">
              <h4>Documentación completa</h4>
              <p>La serie se presenta íntegra, en el orden del nuevo book y sin recortar las imágenes: planos, cortes, vistas, renders, detalles, esquemas, croquis y maqueta.</p>
            </div>
            <div class="umbral-doc-grid">${figures}</div>
            <div class="umbral-360-only" aria-labelledby="umbral-360-title">
              <div><h4 id="umbral-360-title">Panorama 360° interior</h4><p>Se conserva el recorrido panorámico interactivo de la versión anterior del proyecto.</p></div>
              <a class="text-link" href="https://adrian-360.floot.app/patio" target="_blank" rel="noopener noreferrer" aria-label="Abrir panorama 360 grados del patio en una nueva pestaña">Explorar el patio en 360° <span aria-hidden="true">↗</span></a>
            </div>
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
console.log(`Habitar el Umbral reemplazado por la documentación nueva: ${items.length} imágenes y panorama 360 conservado.`);
