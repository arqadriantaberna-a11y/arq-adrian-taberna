import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {join} from "node:path";
import {createHash} from "node:crypto";

/* Transform the assembled approved website at the end of the normal build.
   Images, project geometry, CALIGO readers and contact forms are untouched. */
const root="out";
const data=JSON.parse(readFileSync("static-site/editorial-data.json","utf8"));
const projects=data.projects;
const base="https://arqadriantaberna-a11y.github.io/arq-adrian-taberna/";
const editorial=join(root,"editorial");
mkdirSync(editorial,{recursive:true});
for(const file of ["editorial.css","editorial.js"]){
  writeFileSync(join(editorial,file),readFileSync("static-site/"+file,"utf8"));
}
writeFileSync(join(editorial,"projects.json"),JSON.stringify(data,null,2));
const path=join(root,"index.html");
let html=readFileSync(path,"utf8");
if(html.includes('id="ed-work-index"'))throw Error("La portada ya tiene el rediseño");
function once(oldText,newText,label){
  const count=html.split(oldText).length-1;
  if(count!==1)throw Error(label+" espera una coincidencia, encontró "+count);
  html=html.replace(oldText,newText);
}
function esc(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
const found=[...html.matchAll(/<article class="project[^"]*" id="([^"]+)">/g)].filter(m=>projects.some(p=>p.id===m[1]));
if(found.length!==projects.length)throw Error("Se esperaban 5 proyectos: "+found.map(x=>x[1]));
const styles=[...html.matchAll(/<style(?:\s[^>]*)?>[\s\S]*?<\/style>/gi)].map(x=>x[0]).join("\n");
if(!styles.includes(".project-grid"))throw Error("No se encontró el CSS existente");
function metadata(p){
  const list=[["Disciplina",p.categoryLabel],["Estado",p.status],["Tipología",p.type]];
  if(p.location)list.push(["Ubicación",p.location]);
  if(p.year)list.push(["Año",p.year]);
  list.push(["Autoría",p.author]);
  return list.map(x=>'<dl><dt>'+esc(x[0])+'</dt><dd>'+esc(x[1])+'</dd></dl>').join("");
}
function nextPrev(p){
  const i=projects.findIndex(x=>x.id===p.id);
  const previous=projects[(i+projects.length-1)%projects.length];
  const next=projects[(i+1)%projects.length];
  return '<nav class="ed-case-nav" aria-label="Otros proyectos"><a href="../'+esc(previous.id)+'/"><small>← Proyecto anterior</small><strong>'+esc(previous.title)+'</strong></a><a href="../'+esc(next.id)+'/"><small>Proyecto siguiente →</small><strong>'+esc(next.title)+'</strong></a></nav>';
}
function galleryIndex(){
  return '<details class="ed-project-image-index ed-case-image-index"><summary class="ed-image-index-toggle"><span>Índice fotográfico y documentación</span><span class="ed-gallery-counter">Ver índice ↓</span></summary><div class="ed-image-index-list"></div></details>';
}
const projectScripts='<script>window.AT_PROJECTS='+JSON.stringify(projects)+';window.AT_FURNITURE='+JSON.stringify(data.furniture||[])+';document.documentElement.dataset.editorialRoot="../../";</script><script src="../../editorial/editorial.js" defer></script>';
for(let i=0;i<4;i++){
 const p=projects[i],match=found.find(x=>x[1]===p.id),following=found.find(x=>x.index>match.index);
 const stop=following?following.index:html.indexOf("</main>",match.index);
 const fragment=html.slice(match.index,stop);
 const end=fragment.lastIndexOf("</article>");
 if(end<0)throw Error("Artículo no cerrado: "+p.id);
 let article=fragment.slice(0,end+"</article>".length);
 const images=(article.match(/<img\b/gi)||[]).length;
 if(images<20)throw Error("Faltan imágenes originales: "+p.id+" / "+images);
 if(!article.includes('<details class="case-file">'))throw Error("Falta case-file "+p.id);
 article=article.replace('<details class="case-file">','<section class="case-file ed-case-full">').replace(/<summary>[\s\S]*?<\/summary>/,'');
 const last=article.lastIndexOf("</details>");
 if(last<0)throw Error("Falta cierre de caso "+p.id);
 article=article.slice(0,last)+"</section>"+article.slice(last+"</details>".length);
 article=article.replaceAll('src="./images/','src="../../images/').replaceAll('href="./images/','href="../../images/').replaceAll('href="./proyectos/','href="../');
 if((article.match(/<img\b/gi)||[]).length!==images)throw Error("Perdida de imagenes "+p.id);
 const header='<header class="ed-project-header"><a class="ed-project-brand" href="../../">Adrián Taberna · Arquitecto</a><nav class="ed-project-header-links" aria-label="Secciones"><a href="../../#proyectos">Arquitectura</a><a href="../../#mobiliario">Mobiliario</a><a href="../../#revista">CALIGO</a><a href="../../#contacto">Contacto ↗</a></nav></header>';
 const intro='<main id="contenido" class="ed-case-wrap"><div class="ed-case-topline"><span>Archivo de arquitectura / '+String(i+1).padStart(2,"0")+' — 05</span><span>'+esc(p.categoryLabel)+'</span></div>'+
 '<section class="ed-case-intro"><div><p class="ed-eyebrow">'+esc(p.status)+' · '+esc(p.categoryLabel)+'</p><h1>'+esc(p.title)+'</h1></div><p class="ed-case-lead">'+esc(p.intro)+'</p></section>'+
 '<figure class="ed-case-image"><img src="../../'+esc(p.cover)+'" alt="Imagen principal de '+esc(p.title)+'" fetchpriority="high" decoding="async"><figcaption>Arquitectura · '+esc(p.title)+'</figcaption></figure>'+
 '<div class="ed-case-facts">'+metadata(p)+'</div>'+
 '<section class="ed-case-focus"><span class="ed-ui-label">Decisión de proyecto</span><p>'+esc(p.focus)+'</p></section>'+galleryIndex();
 const content='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>'+esc(p.title)+' — Arq. Adrián Taberna</title><meta name="description" content="'+esc(p.seo)+'"><meta name="theme-color" content="'+esc(data.design.paper)+'">'+
 '<meta property="og:type" content="article"><meta property="og:title" content="'+esc(p.title)+' — Arq. Adrián Taberna"><meta property="og:description" content="'+esc(p.seo)+'"><meta property="og:image" content="'+base+esc(p.cover)+'">'+
 '<link rel="canonical" href="'+base+'proyectos/'+esc(p.id)+'/">'+styles+
 '<link rel="stylesheet" href="../../editorial/editorial.css"></head>'+
 '<body class="ed-project-template"><a class="skip-link" href="#contenido">Saltar al contenido</a>'+header+intro+
 '<div class="project-grid shell">'+article+'</div>'+nextPrev(p)+'</main>'+
 '<footer class="ed-project-footer"><span>© Adrián Taberna · Arquitectura</span><a href="../../#contacto">Conversemos sobre tu proyecto ↗</a></footer>'+
 projectScripts+'</body></html>';
 const folder=join(root,"proyectos",p.id);mkdirSync(folder,{recursive:true});writeFileSync(join(folder,"index.html"),content);
 console.log("Ficha "+p.id+" · "+images+" imágenes preservadas");
}

/* The fifth project has its own carefully curated page: preserve it in full. */
{
 const p=projects[4],file=join(root,"proyectos",p.id,"index.html");
 if(!existsSync(file))throw Error("Falta la página de Habitar el Vacío");
 let content=readFileSync(file,"utf8");
 const figures=(content.match(/<figure\b/gi)||[]).length;
 if(figures<20)throw Error("No se encuentra el book completo de Habitar el Vacío");
 if(!content.includes('<body>')||!content.includes('<main class="page">'))throw Error("Estructura inesperada de Habitar el Vacío");
 content=content.replace('<body>','<body class="ed-vacio-project">')
  .replace('</head>','<link rel="stylesheet" href="../../editorial/editorial.css"></head>')
  .replace('<main class="page">','<main class="page" id="contenido">');
 const anchor='<section class="story reveal">';
 if(!content.includes(anchor))throw Error("Se perdió el comienzo del relato de Habitar el Vacío");
 content=content.replace(anchor,galleryIndex()+anchor).replace("</main>",nextPrev(p)+"</main>");
 content=content.replace("</body>",projectScripts+"</body>");
 if((content.match(/<figure\b/gi)||[]).length!==figures)throw Error("Error de integridad en Habitar el Vacío");
 writeFileSync(file,content);console.log("Habitar el Vacío · "+figures+" figuras intactas");
}

/* Homepage has a selected editorial catalogue, with old full archive intact. */
const cards=projects.map((p,i)=>{
 const index=String(i+1).padStart(2,"0");
 return '<article class="ed-work-card ed-reveal">'+
  '<a class="ed-work-image" href="./proyectos/'+esc(p.id)+'/" aria-label="Ver '+esc(p.title)+'"><img src="./'+esc(p.cover)+'" loading="'+(i===0?"eager":"lazy")+'" decoding="async" alt="'+esc(p.title)+' — '+esc(p.categoryLabel)+'"></a>'+
  '<div class="ed-work-meta"><span>'+index+' / '+esc(p.categoryLabel)+'</span><span class="ed-work-status">'+esc(p.status)+'</span></div>'+
  '<h3 class="ed-work-title"><a href="./proyectos/'+esc(p.id)+'/">'+esc(p.title)+'</a><span class="ed-arrow" aria-hidden="true">↗</span></h3>'+
  '<p class="ed-work-focus">'+esc(p.focus)+'</p><a class="ed-work-cta" href="./proyectos/'+esc(p.id)+'/">Explorar proyecto completo <span aria-hidden="true">↗</span></a></article>';
}).join("\n");
const index='<section class="ed-work-index" id="ed-work-index" aria-label="Proyectos seleccionados">'+
 '<div class="ed-work-topline"><span>Proyecto / Documento / Producción</span><span>05 proyectos seleccionados</span></div>'+
 '<div class="ed-work-grid">'+cards+'</div></section>';
once('    <div class="project-grid shell">',index+'\n<details class="ed-full-archive" id="archivo-extendido"><summary><span>Archivo extendido / Documentación de todos los proyectos</span><strong aria-hidden="true">+ 05</strong></summary>\n    <div class="project-grid shell">',"grilla de portada");
const mainEnd=html.indexOf("</main>",html.indexOf('<main id="proyectos">'));
if(mainEnd<0)throw Error("No se encontró sección arquitectura");
html=html.slice(0,mainEnd)+"</details>\n"+html.slice(mainEnd);
const designCategories=/<div class="design-categories"[^>]*>[\s\S]*?<\/div>/;
if(!designCategories.test(html))throw Error("No se encontró mobiliario");
html=html.replace(designCategories,match=>match+
 '<div class="ed-furniture-note"><span>Diseño / Taller / Documentación</span><p>De la proporción y el uso a la definición de materiales, piezas y despieces necesarios para producirlos.</p></div>');
const bridge='<section class="ed-crosslink ed-reveal" aria-label="Investigación y pensamiento"><div><span class="ed-ui-label">Investigación · Escritura · Proceso</span><h2>Una práctica.<br>Varias escalas.</h2></div><div><p>Los proyectos, el mobiliario y la investigación editorial no son actividades aisladas. Comparten la pregunta por cómo una decisión de diseño modifica la forma de habitar.</p><a href="./revista/caligo/">Explorar CALIGO, revista de arquitectura <span aria-hidden="true">↗</span></a></div></section>';
once('  <section class="notebook" id="cuaderno"',bridge+'\n  <section class="notebook" id="cuaderno"',"puente editorial");
for(const key of ["data-caligo-subscribe","real-form-handlers","caligo-archive-button",'class="notebook"','class="objects"','class="furniture"']){
 if(!html.includes(key))throw Error("Módulo preexistente faltante: "+key);
}
once("</head>",'<link rel="stylesheet" href="./editorial/editorial.css">\n</head>',"estilos portada");
const homeScripts='<script>window.AT_PROJECTS='+JSON.stringify(projects)+';window.AT_FURNITURE='+JSON.stringify(data.furniture||[])+';document.documentElement.dataset.editorialRoot="./";</script><script src="./editorial/editorial.js" defer></script>';
once("</body>",homeScripts+"</body>","funcionalidad portada");
/* Large inline images remain byte-for-byte identical, but become individually
   cacheable files instead of increasing homepage HTML transfer. */
const inlineDir=join(root,"images","editorial-inline");
mkdirSync(inlineDir,{recursive:true});
let inlineCount=0,inlineBytes=0;
html=html.replace(/src="data:image\/(webp|png|jpeg);base64,([A-Za-z0-9+/=]+)"/g,(whole,format,encoded)=>{
  const original=Buffer.from(encoded,"base64");
  if(original.byteLength<128)return whole;
  const ext=format==="jpeg"?"jpg":format;
  const filename=createHash("sha256").update(original).digest("hex").slice(0,20)+"."+ext;
  writeFileSync(join(inlineDir,filename),original);
  inlineCount++;inlineBytes+=encoded.length;
  return 'src="./images/editorial-inline/'+filename+'"';
});
writeFileSync(path,html);
console.log("Imágenes inline externalizadas sin recomprimir: "+inlineCount+" / "+inlineBytes+" caracteres de HTML liberados.");
console.log("Portada aprobada preservada, nuevo índice editorial publicado, cinco proyectos disponibles.");
