/* Public SEO metadata & sitemap. Run AFTER all other build steps.
   Preserves contents, photos, articles, CALIGO readers and original design. */
import {readdirSync,readFileSync,writeFileSync} from "node:fs";
import {join,relative} from "node:path";

const dist="out";
const origin="https://arqadriantaberna-a11y.github.io";
const sitePath="/arq-adrian-taberna/";
const base=origin+sitePath;
const defaultCover=base+"images/casa-patio-new/casa-10.jpeg";
const caligoCover=base+"images/caligo/n002/p01.webp";
const defaultImages={
 "/":defaultCover,
 "/revista/caligo/":caligoCover,
 "/revista/caligo/n001/":base+"images/caligo/n001/p01.webp",
 "/revista/caligo/n002/":caligoCover
};
const xmlEsc=s=>String(s).replace(/[<>&"']/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&apos;"}[c]));
const htmlEsc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

const files=[];
function walk(dir){
 for(const item of readdirSync(dir,{withFileTypes:true})){
  if(item.name.startsWith(".")||["_next","node_modules"].includes(item.name))continue;
  const filename=join(dir,item.name);
  if(item.isDirectory())walk(filename);
  else if(item.isFile()&&item.name.endsWith(".html")&&!["404.html","500.html"].includes(item.name))files.push(filename);
 }
}
walk(dist);
if(files.length<15)throw Error("El sitio tiene menos de 15 documentos HTML: "+files.length);
function pathFor(filename){
 const raw=relative(dist,filename).replace(/\\/g,"/");
 if(raw==="index.html")return "/";
 if(raw.endsWith("/index.html"))return "/"+raw.slice(0,-"index.html".length);
 return "/"+raw;
}
function findTag(html,tagName,attr,value){
 const tags=html.match(new RegExp("<"+tagName+"\\b[^>]*>","gi"))||[];
 return tags.find(tag=>new RegExp("\\b"+attr+"\\s*=\\s*[\\\"']"+value+"[\\\"']","i").test(tag))||null;
}
function findMeta(html,attr,value){
 const tag=findTag(html,"meta",attr,value);
 return tag?.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1]||null;
}
function updateMeta(html,attr,name,value){
 const tag='<meta '+attr+'="'+htmlEsc(name)+'" content="'+htmlEsc(value)+'">';
 const existing=findTag(html,"meta",attr,name);
 return existing?html.replace(existing,tag):html.replace("</head>",tag+"\n</head>");
}
function updateCanonical(html,url){
 const tag='<link rel="canonical" href="'+htmlEsc(url)+'">';
 const existing=findTag(html,"link","rel","canonical");
 return existing?html.replace(existing,tag):html.replace("</head>",tag+"\n</head>");
}

const pages=[];
for(const filename of files.sort()){
 let html=readFileSync(filename,"utf8");
 const pathname=pathFor(filename);
 if(!html.includes("</head>")||!/<html\b/i.test(html))throw Error("Documento incompleto: "+filename);
 const technical= /^\/(?:404|_not-found|gestion|archivo)\/$/.test(pathname);
 const legacyFurniture=pathname.match(/^\/mobiliario\/([a-z0-9-]+)\/$/);
 const url=legacyFurniture?base+"diseno/"+legacyFurniture[1]+"/":base+pathname.slice(1);
 const title=html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g,"").trim();
 if(!title)throw Error("Documento sin título: "+pathname);
 const description=findMeta(html,"name","description");
 if(!description)throw Error("Documento sin descripción: "+pathname);
 let image=defaultImages[pathname]||findMeta(html,"property","og:image")||defaultCover;
 if(image.startsWith("./")||image.startsWith("../"))image=new URL(image,url).href;
 else if(image.startsWith("/"))image=origin+image;
 if(!image.startsWith("https://"))throw Error("Imagen social inválida: "+pathname);
 html=updateCanonical(html,url);
 html=updateMeta(html,"property","og:url",url);
 html=updateMeta(html,"property","og:image",image);
 html=updateMeta(html,"name","twitter:card","summary_large_image");
 html=updateMeta(html,"name","twitter:image",image);
 if(!findMeta(html,"property","og:title"))html=updateMeta(html,"property","og:title",title);
 if(!findMeta(html,"property","og:description"))html=updateMeta(html,"property","og:description",description);
 if(!findMeta(html,"property","og:site_name"))html=updateMeta(html,"property","og:site_name","Adrián Taberna · Arquitecto");
 if(!findMeta(html,"property","og:locale"))html=updateMeta(html,"property","og:locale","es_AR");
 if(technical)html=updateMeta(html,"name","robots",
  pathname==="/gestion/"?"noindex, nofollow, noarchive":"noindex, follow");
 writeFileSync(filename,html);
 if(!technical&&!legacyFurniture)pages.push({pathname,url,image});
}
const expected=[
 "/","/diseno/","/revista/caligo/","/revista/caligo/n001/","/revista/caligo/n002/",
 ...["casa-patio","centro-ambulatorio","torre-residencial","habitar-el-umbral","habitar-el-vacio"].map(x=>"/proyectos/"+x+"/"),
 ...["comoda-blanca-paraiso","mesa-comedor-paraiso","mesa-paraiso-blanca","cama-plataforma-biblioteca"].map(x=>"/diseno/"+x+"/"),
 ...["imaginar-el-uso","el-detalle-no-aparece","umbrales-que-construyen-comunidad"].map(x=>"/newsletter/"+x+"/")
];
for(const page of expected)if(!pages.some(p=>p.pathname===page))throw Error("Página pública faltante en sitemap: "+page);
const urls=new Set(pages.map(p=>p.url));
if(urls.size!==pages.length)throw Error("URLs duplicadas en sitemap");
writeFileSync(join(dist,"sitemap.xml"),
 '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+
 pages.map(p=>'  <url><loc>'+xmlEsc(p.url)+'</loc></url>').join("\n")+'\n</urlset>\n');
writeFileSync(join(dist,"robots.txt"),
 'User-agent: *\nAllow: /\n\nSitemap: '+base+'sitemap.xml\n');
for(const word of ['rel="canonical"','property="og:url"','property="og:image"','name="twitter:image"']){
 if(!readFileSync(join(dist,"index.html"),"utf8").includes(word))throw Error("Falta metadato principal: "+word);
}
console.log("SEO: "+pages.length+" páginas indexables y metadatos completos.");
console.log("URL del sitemap: "+base+"sitemap.xml");
console.log(pages.map(p=>p.pathname).join(", "));
