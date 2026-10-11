import { readFileSync, writeFileSync } from "node:fs";

const pagePath = "out/index.html";
const page = readFileSync(pagePath, "utf8");

const mobileFix = `
<style id="mobile-project-heading-fix">
@media (max-width: 760px) {
  .project-grid .project-heading {
    display: grid !important;
    grid-template-columns: minmax(0, 1fr) !important;
    gap: 12px !important;
    align-items: start !important;
  }

  .project-grid .project-index {
    display: none !important;
  }

  .project-grid .project h3,
  .project-grid > .project:has(.case-file[open]) h3 {
    grid-column: 1 !important;
    grid-row: auto !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    overflow-wrap: normal !important;
    word-break: normal !important;
    hyphens: none !important;
    -webkit-hyphens: none !important;
    white-space: normal !important;
  }

  .project-grid .project-tag,
  .project-grid > .project:has(.case-file[open]) .project-tag {
    grid-column: 1 !important;
    grid-row: auto !important;
    position: static !important;
    width: auto !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    text-align: left !important;
  }
}
</style>
`;

if (page.includes('id="mobile-project-heading-fix"')) {
  throw new Error("La corrección móvil de encabezados ya fue aplicada");
}

const marker = "</head>";
if (!page.includes(marker)) {
  throw new Error("No se encontró </head> en out/index.html");
}

const result = page.replace(marker, `${mobileFix}${marker}`);
writeFileSync(pagePath, result);
console.log("Encabezados de proyectos corregidos exclusivamente en móvil.");
