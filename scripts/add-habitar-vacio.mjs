import { readFileSync, writeFileSync } from "node:fs";

const pagePath = "out/index.html";
let html = readFileSync(pagePath, "utf8");

if (html.includes('id="habitar-el-vacio"')) {
  throw new Error("Habitar el Vacío ya está incorporado en la portada");
}

const project = `
    <article class="project" id="habitar-el-vacio">
      <div class="shell">
        <div class="project-heading">
          <span class="project-index">05</span>
          <h3>Habitar el Vacío</h3>
          <div class="project-tag">Proyecto académico · Microequipamiento urbano</div>
        </div>
        <div class="project-cover"><img src="./images/habitar-vacio/09-frente-principal.webp" width="1122" height="1402" loading="lazy" decoding="async" alt="Frente de Habitar el Vacío sobre Francisco Acuña de Figueroa"></div>
        <div class="project-summary">
          <p class="statement">Una arquitectura mínima que concentra el programa sobre un borde, libera el suelo natural y transforma la vegetación existente en el espacio principal del proyecto.</p>
          <div class="project-data">
            <div class="datum"><small>Ubicación</small><span>Almagro · CABA</span></div>
            <div class="datum"><small>Tipo</small><span>Microequipamiento urbano + infraestructura ecológica</span></div>
            <div class="datum"><small>Estado</small><span>Ejercicio académico</span></div>
            <div class="datum"><small>Autoría</small><span>Adrián Taberna</span></div>
          </div>
        </div>
        <details class="case-file">
          <summary><span>Ver proyecto</span><strong>+</strong></summary>
          <div class="case-content">
            <div class="case-intro"><p>Habitar el borde para liberar el centro. El proyecto concentra la arquitectura sobre el lateral derecho, preserva la microreserva y eleva los usos principales para construir una secuencia desde la calle hasta las copas.</p><a class="text-link" href="./proyectos/habitar-el-vacio/">Abrir proyecto completo ↗</a></div>
          </div>
        </details>
      </div>
    </article>`;

const habitarStart = html.indexOf('<article class="project" id="habitar-el-umbral">');
if (habitarStart < 0) throw new Error("No se encontró Habitar el Umbral");
const habitarEnd = html.indexOf('</article>', habitarStart);
if (habitarEnd < 0) throw new Error("No se encontró el cierre de Habitar el Umbral");
const insertionPoint = habitarEnd + '</article>'.length;
html = html.slice(0, insertionPoint) + project + html.slice(insertionPoint);

html = html.replace(
  '<div class="nav-submenu"><a href="#proyectos">Todos los proyectos</a><a href="#casa-patio">Residencial</a><a href="#centro-ambulatorio">Salud</a><a href="#habitar-el-umbral">Vivienda colectiva</a></div>',
  '<div class="nav-submenu"><a href="#proyectos">Todos los proyectos</a><a href="#casa-patio">Residencial</a><a href="#centro-ambulatorio">Salud</a><a href="#habitar-el-umbral">Vivienda colectiva</a><a href="#habitar-el-vacio">Microequipamiento</a></div>'
);

html = html.replace(
  '<div class="menu-index-group"><small>Arquitectura</small><a href="#proyectos">• Proyectos</a><a href="#casa-patio">• Residencial</a><a href="#centro-ambulatorio">• Salud</a><a href="#habitar-el-umbral">• Vivienda colectiva</a></div>',
  '<div class="menu-index-group"><small>Arquitectura</small><a href="#proyectos">• Proyectos</a><a href="#casa-patio">• Residencial</a><a href="#centro-ambulatorio">• Salud</a><a href="#habitar-el-umbral">• Vivienda colectiva</a><a href="#habitar-el-vacio">• Microequipamiento</a></div>'
);

writeFileSync(pagePath, html);
console.log("Habitar el Vacío incorporado a la grilla de Arquitectura y a ambos menús.");
