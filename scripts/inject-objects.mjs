import { readFileSync, writeFileSync } from "node:fs";

const pagePath = "out/index.html";
const page = readFileSync(pagePath, "utf8");
const section = readFileSync("static-site/objects-section.html", "utf8");
const styles = readFileSync("static-site/objects-section.css", "utf8");

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

writeFileSync(pagePath, result);
console.log("Objetos de diseño incorporados a la portada y a ambos menús.");
