import { readFileSync, writeFileSync } from "node:fs";

const pagePath = "out/index.html";
const page = readFileSync(pagePath, "utf8");

const before = '<article class="note-card">\n          <small>02 · Documentación</small>\n          <div><h3>El detalle no aparece al final del proyecto</h3><p>Dibujar para fabricar también transforma y mejora la idea inicial.</p></div>\n        </article>';
const after = '<a class="note-card" href="./newsletter/el-detalle-no-aparece/" aria-label="Leer El detalle no aparece al final del proyecto">\n          <small>02 · Documentación</small>\n          <div><h3>El detalle no aparece al final del proyecto</h3><p>Dibujar para fabricar también transforma y mejora la idea inicial.</p></div>\n        </a>';

const first = page.indexOf(before);
if (first < 0 || page.indexOf(before, first + before.length) >= 0) {
  throw new Error("No se encontró exactamente una vez la segunda tarjeta del Newsletter");
}

const result = page.slice(0, first) + after + page.slice(first + before.length);
writeFileSync(pagePath, result);
console.log("Segundo artículo del Newsletter enlazado sin alterar la composición de la tarjeta.");
