import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {join} from "node:path";

const data=JSON.parse(readFileSync("static-site/editorial-data.json","utf8"));
const items=data.furniture;
const homeFile="out/index.html";
let home=readFileSync(homeFile,"utf8");
const start=home.indexOf('<section class="furniture"');
const stop=home.indexOf('<section class="objects"',start);
if(start<0||stop<0||!items.length)throw Error("Catálogo y listado aprobados no encontrados");
const section=home.slice(start,stop);
const cards=[...section.matchAll(/<article class="design-card[^"]*"[^>]*>[\s\S]*?<\/article>/g)]
 .map(match=>{const raw=match[0];return {
  title:(raw.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)||[])[1]?.trim(),
  alt:(raw.match(/<img\b[^>]*alt="([^"]+)"/)||[])[1]||"",
  src:(raw.match(/<img\b[^>]*src="([^"]+)"/)||[])[1]||""
 }});
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
const furniture=items.map(p=>{
 const card=cards.find(c=>c.title===p.title);
 if(!card||!card.src.startsWith("./images/editorial-inline/"))throw Error("No se encontró pieza original aprobada: "+p.title);
 return {...p,image:card.src.slice(2),alt:card.alt};
});
writeFileSync("out/editorial/furniture.json",JSON.stringify(furniture,null,2));
function head(title,description,canonical,image,depth){
 return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<meta name="description" content="'+esc(description)+'"><meta name="theme-color" content="#f0ece5">'+
 '<meta property="og:type" content="article"><meta property="og:title" content="'+esc(title)+'">'+
 '<meta property="og:description" content="'+esc(description)+'"><meta property="og:image" content="https://arqadriantaberna-a11y.github.io/arq-adrian-taberna/'+image+'">'+
 '<link rel="canonical" href="'+canonical+'"><title>'+esc(title)+' — Arq. Adrián Taberna</title>'+
 '<link rel="stylesheet" href="'+depth+'editorial/editorial.css"></head>';
}
function siteHeader(depth){
 return '<header class="ed-project-header"><a class="ed-project-brand" href="'+depth+'">Adrián Taberna · Arquitecto</a><nav class="ed-project-header-links" aria-label="Secciones"><a href="'+depth+'#proyectos">Arquitectura</a><a href="'+depth+'#mobiliario">Mobiliario</a><a href="'+depth+'#revista">CALIGO</a><a href="'+depth+'#contacto">Contacto ↗</a></nav></header>';
}
const cardsHtml=furniture.map((p,i)=>'<article class="ed-furniture-card">'+
 '<a class="ed-furniture-image" href="./'+esc(p.slug)+'/" aria-label="Ver '+esc(p.title)+'"><img src="../'+esc(p.image)+'" alt="'+esc(p.alt)+'" loading="lazy" decoding="async"></a>'+
 '<div class="ed-work-meta"><span>'+String(i+1).padStart(2,"0")+' / '+esc(p.category)+'</span><span>Diseño de mobiliario</span></div>'+
 '<h2><a href="./'+esc(p.slug)+'/">'+esc(p.title)+'</a></h2><p>'+esc(p.material)+'</p>'+
 '<a class="ed-work-cta" href="./'+esc(p.slug)+'/">Ver ficha de diseño ↗</a></article>').join("\n");
const catalogue=head("Mobiliario — Archivo de diseño","Mobiliario seleccionado de Adrián Taberna: proporción, materiales y desarrollo técnico.",
 "https://arqadriantaberna-a11y.github.io/arq-adrian-taberna/diseno/",furniture[0].image,"../")+
 '<body class="ed-project-template ed-furniture-page">'+siteHeader("../")+
 '<main class="ed-case-wrap"><div class="ed-case-topline"><span>Diseño / Mobiliario</span><span>Archivo seleccionado · '+furniture.length+' piezas</span></div>'+
 '<section class="ed-case-intro"><div><p class="ed-eyebrow">Diseño de producto / Interior</p><h1>Mobiliario.</h1></div><p class="ed-case-lead">Piezas y sistemas explorados desde la escala del usuario, la proporción y el material hasta las decisiones necesarias para documentar su producción.</p></section>'+
 '<div class="ed-furniture-grid">'+cardsHtml+'</div>'+
 '<section class="ed-crosslink"><div><span class="ed-ui-label">Documentación</span><h2>Del dibujo<br>a la pieza.</h2></div><div><p>La documentación de taller forma parte del diseño. Estas fichas presentan las piezas con el material disponible, sin atribuirles fabricantes, fechas u obras realizadas no verificados.</p><a href="../#contacto">Consultar sobre mobiliario ↗</a></div></section></main>'+
 '<footer class="ed-project-footer"><span>© Adrián Taberna · Diseño</span><a href="../#mobiliario">Volver al portfolio ↗</a></footer></body></html>';
mkdirSync("out/diseno",{recursive:true});
writeFileSync("out/diseno/index.html",catalogue);
for(let i=0;i<furniture.length;i++){
 const p=furniture[i],other=furniture[(i+1)%furniture.length];
 const path=join("out/diseno",p.slug);mkdirSync(path,{recursive:true});
 const text="Diseño de mobiliario: "+p.title+". "+p.category+" · "+p.material+".";
 const facts='<div class="ed-case-facts"><dl><dt>Disciplina</dt><dd>Diseño de mobiliario</dd></dl><dl><dt>Tipología</dt><dd>'+esc(p.type)+'</dd></dl><dl><dt>Materialidad</dt><dd>'+esc(p.material)+'</dd></dl><dl><dt>Autoría</dt><dd>Adrián Taberna</dd></dl></div>';
 const body=head(p.title,text,"https://arqadriantaberna-a11y.github.io/arq-adrian-taberna/diseno/"+p.slug+"/",p.image,"../../")+
 '<body class="ed-project-template ed-product-template">'+siteHeader("../../")+
 '<main class="ed-case-wrap"><div class="ed-case-topline"><span>Diseño / '+String(i+1).padStart(2,"0")+' — '+String(furniture.length).padStart(2,"0")+'</span><span>'+esc(p.category)+'</span></div>'+
 '<section class="ed-case-intro"><div><p class="ed-eyebrow">Diseño de mobiliario · '+esc(p.category)+'</p><h1>'+esc(p.title)+'</h1></div><p class="ed-case-lead">La proporción, el material y el uso cotidiano orientan el diseño de esta pieza.</p></section>'+
 '<figure class="ed-case-image"><img src="../../'+esc(p.image)+'" alt="'+esc(p.alt)+'" fetchpriority="high" decoding="async"><figcaption>'+esc(p.title)+' · '+esc(p.material)+'</figcaption></figure>'+
 facts+'<div class="ed-case-focus"><span class="ed-ui-label">Documentación disponible</span><p>Esta ficha reproduce el material gráfico existente. Para conocer documentación técnica, variantes o detalles de producción, escribime desde el portfolio.</p></div>'+
 '<nav class="ed-case-nav"><a href="../"><small>← Archivo de diseño</small><strong>Todos los muebles</strong></a><a href="../'+esc(other.slug)+'/"><small>Siguiente pieza →</small><strong>'+esc(other.title)+'</strong></a></nav>'+
 '</main><footer class="ed-project-footer"><span>© Adrián Taberna · Mobiliario</span><a href="../../#contacto">Consulta de diseño ↗</a></footer></body></html>';
 writeFileSync(join(path,"index.html"),body);
 console.log("Ficha de mobiliario: "+p.title+" / imagen original sin recomprimir");
}
const before='<div class="ed-furniture-note">';
const pos=home.indexOf(before);
if(pos<0)throw Error("No se encontró la nota de mobiliario del diseño editorial");
const endNote=home.indexOf("</div>",pos);
if(endNote<0)throw Error("No se encontró fin de nota mobiliario");
home=home.slice(0,endNote)+
 '<a class="ed-furniture-catalogue-link" href="./diseno/">Explorar catálogo de mobiliario <span aria-hidden="true">↗</span></a>'+
 home.slice(endNote);
writeFileSync(homeFile,home);
console.log("Catálogo de mobiliario seleccionado: "+furniture.length+" piezas publicadas.");
