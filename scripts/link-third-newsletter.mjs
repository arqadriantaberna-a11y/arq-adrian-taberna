import { readFileSync, writeFileSync } from "node:fs";

const pagePath = "out/index.html";
const page = readFileSync(pagePath, "utf8");

const before = '<article class="note-card">\n          <small>03 · Arquitectura</small>\n          <div><h3>Umbrales que construyen comunidad</h3><p>Entre la calle y la vivienda existe un espacio capaz de cambiar cómo habitamos juntos.</p></div>\n        </article>';
const after = '<a class="note-card" href="./newsletter/umbrales-que-construyen-comunidad/" aria-label="Leer Umbrales que construyen comunidad">\n          <small>03 · Arquitectura</small>\n          <div><h3>Umbrales que construyen comunidad</h3><p>Entre la calle y la vivienda existe un espacio capaz de cambiar cómo habitamos juntos.</p></div>\n        </a>';

const first = page.indexOf(before);
if (first < 0 || page.indexOf(before, first + before.length) >= 0) {
  throw new Error("No se encontró exactamente una vez la tercera tarjeta del Newsletter");
}

const result = page.slice(0, first) + after + page.slice(first + before.length);
writeFileSync(pagePath, result);
console.log("Tercer artículo del Newsletter enlazado sin alterar la composición de la tarjeta.");
