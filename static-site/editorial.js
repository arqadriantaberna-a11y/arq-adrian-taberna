/* ARQ. ADRIÁN TABERNA — INTERACCIONES EDITORIALES. Sin dependencias de terceros. */
(()=>{"use strict";
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const root=document.documentElement.dataset.editorialRoot||"./";
const projectList=Array.isArray(window.AT_PROJECTS)?window.AT_PROJECTS:[];
const $=(selector,ctx=document)=>ctx.querySelector(selector);
const $$=(selector,ctx=document)=>Array.from(ctx.querySelectorAll(selector));
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const siteUrl=path=>root+path.replace(/^\/+/,"");
const label=(str)=>String(str||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();

/* Accessible search: projects, editorial publication and actual approved furniture. */
function setupSearch(){
 if(!document.querySelector(".site-nav")&&!document.body.classList.contains("ed-project-template"))return;
 const nav=$(".site-nav .nav-inner");
 if(!nav)return;
 const trigger=document.createElement("button");
 trigger.type="button";trigger.className="ed-search-trigger";trigger.textContent="Explorar ⌕";
 trigger.setAttribute("aria-label","Buscar proyectos y publicaciones");
 const mobile=$(".mobile-menu",nav);
 nav.insertBefore(trigger,mobile||null);
 const dialog=document.createElement("dialog");dialog.className="ed-search-overlay";dialog.setAttribute("aria-label","Buscar contenido del portfolio");
 dialog.innerHTML='<div class="ed-search-surface"><div class="ed-search-top"><span>Adrián Taberna / Índice del sitio</span><button type="button" class="ed-search-close" aria-label="Cerrar búsqueda">×</button></div><h2>Explorar.</h2><label for="ed-search-input" class="ed-eyebrow">Proyectos, mobiliario y publicaciones</label><input class="ed-search-input" id="ed-search-input" type="search" placeholder="¿Qué te interesa conocer?" autocomplete="off"><div class="ed-search-results" aria-live="polite"></div></div>';
 document.body.appendChild(dialog);
 const input=$("#ed-search-input",dialog),results=$(".ed-search-results",dialog);
 const entries=projectList.map(p=>({title:p.title,subtitle:p.categoryLabel+" · "+p.status,href:"proyectos/"+p.id+"/",image:p.cover}));
 entries.push({title:"Mobiliario",subtitle:"Diseño y documentación técnica",href:"#mobiliario",image:null});
 entries.push({title:"Objetos de diseño",subtitle:"Objetos y materialidad",href:"#objetos",image:null});
 entries.push({title:"CALIGO N.º 002",subtitle:"El pasado sigue construyendo · Revista",href:"revista/caligo/n002/",image:"images/caligo/n002/p01.webp"});
 entries.push({title:"CALIGO N.º 001",subtitle:"¿Para quién construimos? · Revista",href:"revista/caligo/n001/",image:"images/caligo/n001/p01.webp"});
 entries.push({title:"Newsletter",subtitle:"Artículos sobre arquitectura y diseño",href:"#cuaderno",image:null});
 $$(".note-grid .note-card").forEach(a=>{
  const t=$("h3",a)?.textContent?.trim();if(t)entries.push({title:t,subtitle:"Newsletter / Artículo",href:a.getAttribute("href"),image:null});
 });
 function render(){
  const q=label(input.value.trim());
  const filtered=entries.filter(e=>!q||label(e.title+" "+e.subtitle).includes(q)).slice(0,14);
  results.innerHTML=filtered.length?filtered.map(e=>{
   const href=e.href.startsWith("#")?siteUrl(e.href):e.href.startsWith("./")?e.href:siteUrl(e.href);
   const thumb=e.image?'<img src="'+esc(siteUrl(e.image))+'" alt="" loading="lazy">':'<span aria-hidden="true" style="display:grid;place-items:center;background:#e4ded4;width:95px;height:80px">AT</span>';
   return '<a class="ed-search-result" href="'+esc(href)+'">'+thumb+'<div><h3>'+esc(e.title)+'</h3><p>'+esc(e.subtitle)+'</p></div><span class="ed-arrow" aria-hidden="true">↗</span></a>';
  }).join(""):'<p class="ed-search-noresult">No encontramos resultados. Probá con otra palabra.</p>';
 }
 const open=()=>{render();dialog.showModal();input.focus();};
 trigger.addEventListener("click",open);
 $(".ed-search-close",dialog).addEventListener("click",()=>dialog.close());
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close();});
 $$(".mobile-panel").forEach(panel=>{
   const b=document.createElement("button");b.className="ed-search-mobile-link";b.type="button";b.textContent="Buscar en el sitio ↗";b.addEventListener("click",()=>{const detail=panel.closest("details");if(detail)detail.open=false;open()});panel.appendChild(b);
 });
 input.addEventListener("input",render);
 results.addEventListener("click",()=>{dialog.close()});
}

/* Anchor compatibility with original full archive (collapsed until explicitly requested). */
function setupArchive(){
 const drawer=$(".ed-full-archive");if(!drawer)return;
 const openHash=()=>{
  const id=decodeURIComponent(location.hash.slice(1));
  const target=id?document.getElementById(id):null;
  if(target&&drawer.contains(target)){
    drawer.open=true;
    requestAnimationFrame(()=>target.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"}));
  }
 };
 window.addEventListener("hashchange",openHash);openHash();
 $$(".ed-full-archive .project").forEach(p=>{
   if($(".ed-project-direct",p))return;
   const link=document.createElement("a");
   link.className="ed-project-direct";link.href=siteUrl("proyectos/"+p.id+"/");
   link.textContent="Leer ficha editorial completa ↗";
   $(".project-summary",p)?.appendChild(link);
 });
}

/* Keep original approved furniture cards and their interaction. */
function setupFurniture(){
 const furniture=$("#mobiliario");if(!furniture)return;
 const grid=$(".design-grid",furniture);if(!grid)return;
 const cards=$$(".design-card",grid);
 for(const card of cards){
   const img=$("img",card);
   if(img){img.setAttribute("decoding","async");img.setAttribute("loading","lazy")}
 }
}

/* Reveal only if user has not requested reduced motion. */
function setupReveal(){
 if(reduced||!("IntersectionObserver"in window))return;
 const nodes=$$(".ed-work-card,.ed-crosslink");
 if(!nodes.length)return;
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add("ed-in-view");observer.unobserve(entry.target)}
 }),{threshold:.08,rootMargin:"0px 0px 55px 0px"});
 nodes.forEach(node=>observer.observe(node));
 document.body.classList.add("ed-motion-ready");
}

/* Image index and full-screen lightbox on dedicated project pages; sources unchanged. */
function setupCaseGallery(){
 const selector=document.body.classList.contains("ed-project-template")?".case-content figure img":document.body.classList.contains("ed-vacio-project")?".gallery-section figure img":null;
 if(!selector)return;
 const imgs=$$(selector).filter(img=>img.getAttribute("src"));
 if(!imgs.length)return;
 const index=$(".ed-image-index-list");
 imgs.forEach((img,i)=>{
   const fig=img.closest("figure");
   if(!fig)return;
   const id="ed-image-"+String(i+1).padStart(2,"0");
   fig.id=id;
   img.dataset.edGallery=String(i);
   img.setAttribute("tabindex","0");img.setAttribute("role","button");
   img.setAttribute("aria-label","Ampliar imagen "+(i+1)+": "+(img.alt||""));
   if(index){
     const b=document.createElement("button");b.type="button";
     const title=$("figcaption",fig)?.textContent?.replace(/\s+/g," ").trim()||img.alt||"Imagen";
     b.innerHTML='<span>'+String(i+1).padStart(2,"0")+'</span>'+esc(title.slice(0,105));
     b.addEventListener("click",()=>{fig.scrollIntoView({behavior:reduced?"auto":"smooth",block:"center"});img.focus({preventScroll:true});});
     index.appendChild(b);
   }
 });
 const dialog=document.createElement("dialog");dialog.className="ed-image-lightbox";dialog.setAttribute("aria-label","Visualizador de imágenes");
 dialog.innerHTML='<div class="ed-lightbox-top"><span class="ed-ui-label">Adrián Taberna · Documentación</span><button type="button" class="ed-lightbox-close" aria-label="Cerrar imagen">×</button></div><button type="button" class="ed-lightbox-prev" aria-label="Imagen anterior">‹</button><div class="ed-lightbox-stage"><img alt=""></div><button type="button" class="ed-lightbox-next" aria-label="Imagen siguiente">›</button><div class="ed-lightbox-caption" role="status"></div>';
 document.body.appendChild(dialog);
 let current=0,priorFocus=null;
 const big=$(".ed-lightbox-stage img",dialog),caption=$(".ed-lightbox-caption",dialog);
 const update=()=>{
  const img=imgs[current];if(!img)return;
  big.src=img.currentSrc||img.src;
  big.alt=img.alt||"Imagen de proyecto";
  const title=$("figcaption",img.closest("figure"))?.textContent?.replace(/\s+/g," ").trim()||img.alt||"";
  caption.textContent=(current+1)+" / "+imgs.length+" — "+title;
 };
 const step=n=>{current=(current+n+imgs.length)%imgs.length;update();};
 const open=i=>{current=i;priorFocus=document.activeElement;update();dialog.showModal();};
 imgs.forEach((img,i)=>{
   img.addEventListener("click",()=>open(i));
   img.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open(i);}});
 });
 $(".ed-lightbox-close",dialog).addEventListener("click",()=>dialog.close());
 $(".ed-lightbox-prev",dialog).addEventListener("click",()=>step(-1));
 $(".ed-lightbox-next",dialog).addEventListener("click",()=>step(1));
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
 dialog.addEventListener("close",()=>{big.removeAttribute("src");if(priorFocus?.focus)priorFocus.focus({preventScroll:true})});
 dialog.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();step(1)}else if(e.key==="ArrowLeft"){e.preventDefault();step(-1)}});
 const counter=$(".ed-gallery-counter");
 if(counter)counter.textContent=imgs.length+" imágenes";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
function init(){setupSearch();setupArchive();setupFurniture();setupCaseGallery();setupReveal();}
})();
