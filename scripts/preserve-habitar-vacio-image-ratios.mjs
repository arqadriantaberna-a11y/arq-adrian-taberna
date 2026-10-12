import { readFileSync, writeFileSync } from "node:fs";

const pagePath = "out/proyectos/habitar-el-vacio/index.html";
let html = readFileSync(pagePath, "utf8");

if (html.includes('id="habitar-vacio-original-ratios"')) {
  throw new Error("La corrección de proporciones originales ya fue aplicada");
}

const style = `
<style id="habitar-vacio-original-ratios">
/* Habitar el Vacío: mostrar cada imagen completa, sin recortes ni proporciones forzadas. */
.page .hero {
  height: auto !important;
  max-height: none !important;
  aspect-ratio: auto !important;
  overflow: visible !important;
  background: transparent !important;
}

.page .hero img {
  display: block !important;
  width: 100% !important;
  height: auto !important;
  max-height: none !important;
  object-fit: contain !important;
  object-position: center center !important;
}

.page .gallery .media,
.page .gallery figure.wide .media,
.page .gallery figure.tall .media,
.page .media,
.page .media.contain {
  aspect-ratio: auto !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  overflow: visible !important;
}

.page .gallery .media img,
.page .gallery figure.wide .media img,
.page .gallery figure.tall .media img,
.page .media img,
.page .media.contain img {
  display: block !important;
  width: 100% !important;
  height: auto !important;
  max-height: none !important;
  object-fit: contain !important;
  object-position: center center !important;
}

@media (max-width: 760px) {
  .page .hero,
  .page .gallery .media,
  .page .gallery figure.wide .media,
  .page .gallery figure.tall .media,
  .page .media,
  .page .media.contain {
    aspect-ratio: auto !important;
    height: auto !important;
    max-height: none !important;
  }

  .page .hero img,
  .page .gallery .media img,
  .page .gallery figure.wide .media img,
  .page .gallery figure.tall .media img,
  .page .media img,
  .page .media.contain img {
    height: auto !important;
    max-height: none !important;
    object-fit: contain !important;
  }
}
</style>
`;

const marker = "</head>";
if (!html.includes(marker)) {
  throw new Error("No se encontró </head> en Habitar el Vacío");
}

html = html.replace(marker, `${style}${marker}`);
writeFileSync(pagePath, html);
console.log("Habitar el Vacío: todas las imágenes conservan su proporción original y se muestran completas.");
