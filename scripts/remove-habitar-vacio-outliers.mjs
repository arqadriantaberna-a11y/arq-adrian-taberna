import {readFileSync, writeFileSync, unlinkSync, existsSync} from "node:fs";

const pagePath = "out/proyectos/habitar-el-vacio/index.html";
const folder = "out/images/habitar-vacio/";
const targets = [
  "12-pasarela-piezas-elevadas.webp",
  "20-mirador-hacia-edificio.webp"
];

let html = readFileSync(pagePath, "utf8");

// Intervenir exclusivamente dos figuras del book de Habitar el Vacío.
// No alterar las restantes imágenes, textos, planos ni otras secciones.
for (const filename of targets) {
  const figures = [...html.matchAll(/<figure\b[^>]*>[\s\S]*?<\/figure>/g)];
  const matches = figures.filter(match =>
    match[0].includes('src="../../images/habitar-vacio/' + filename + '"')
  );
  if (matches.length !== 1) {
    throw new Error(filename + ": se esperaba exactamente una figura, se encontraron " + matches.length);
  }
  html = html.replace(matches[0][0], "");
  if (html.includes('src="../../images/habitar-vacio/' + filename + '"')) {
    throw new Error("La figura sigue presente: " + filename);
  }
}

writeFileSync(pagePath, html);

// Evitar que estas dos imágenes descartadas queden expuestas como archivos sueltos.
for (const filename of targets) {
  const imagePath = folder + filename;
  if (!existsSync(imagePath)) throw new Error("No existe el archivo para retirar: " + imagePath);
  unlinkSync(imagePath);
}

console.log("Habitar el Vacío: retiradas únicamente dos vistas inconsistentes; grilla restante intacta.");
