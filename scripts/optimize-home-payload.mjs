/* Remove embedded furniture gallery image payloads from the homepage JS.
   Keep each image BYTE-FOR-BYTE identical, cacheable, and lazy until gallery use.
   Preserve execution order by replacing the original inline classic script
   with a classic external script at exactly the same DOM location. */
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {join} from "node:path";
import {createHash} from "node:crypto";

const root="out";
const homepage=join(root,"index.html");
const imageDir=join(root,"images","editorial-inline");
const jsFile=join(root,"editorial","legacy-home.js");
let html=readFileSync(homepage,"utf8");
if(html.includes('src="./editorial/legacy-home.js"'))throw Error("Optimización de script ya aplicada");
const oldSize=Buffer.byteLength(html,"utf8");

/* The approved site has exactly one large inline gallery/controller script.
   Other scripts (forms, SEO, structured data and editorials) are untouched. */
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
const large=scripts.filter(m=>m[1].length>1000000&&m[1].includes("data:image/webp;base64,"));
if(large.length!==1)throw Error("No se encontró un único controlador original: "+large.length);
const original=large[0],javascript=original[1];
const images=javascript.match(/data:image\/(?:webp|png|jpeg);base64,[A-Za-z0-9+/=]+/g)||[];
if(images.length!==22)throw Error("Se esperaban 22 imágenes existentes en galerías: "+images.length);
mkdirSync(imageDir,{recursive:true});
let files=0,bytes=0;
const altered=javascript.replace(/data:image\/(webp|png|jpeg);base64,([A-Za-z0-9+/=]+)/g,(_,fmt,encoded)=>{
 const buffer=Buffer.from(encoded,"base64");
 if(buffer.length<200)throw Error("Imagen demasiado pequeña: "+fmt);
 const ext=fmt==="jpeg"?"jpg":fmt;
 const sha=createHash("sha256").update(buffer).digest("hex");
 const name=sha.slice(0,20)+"."+ext;
 writeFileSync(join(imageDir,name),buffer);
 files++;bytes+=buffer.length;
 return "./images/editorial-inline/"+name;
});
if(files!==images.length||altered.includes("data:image/"))throw Error("No se extrajeron todas las galerías");
if(altered.length>50000||altered.length<12000)throw Error("El controlador optimizado tiene una longitud inesperada: "+altered.length);
writeFileSync(jsFile,altered);
html=html.replace(original[0],'<script src="./editorial/legacy-home.js"></script>');
if(html.includes("data:image/webp;base64,"))throw Error("Quedaron imágenes embebidas en HTML");
const newSize=Buffer.byteLength(html,"utf8");
const delta=oldSize-newSize;
if(delta<2000000||newSize>350000)throw Error("Reducción insuficiente de la portada: "+oldSize+" → "+newSize);
for(const fragment of ['id="ed-work-index"','id="real-form-handlers"','class="furniture"','id="mobiliario"','id="revista"','id="cuaderno"']){
 if(!html.includes(fragment))throw Error("No se conservó el módulo "+fragment);
}
writeFileSync(homepage,html);
console.log("OPTIMIZACIÓN HTML inicial "+oldSize+" → "+newSize+" bytes; ahorro "+delta+" bytes ("+Math.round(delta/oldSize*100)+"%).");
console.log("Galerías de mobiliario: "+files+" imágenes en archivos sin recomprimir; "+bytes+" bytes de originales preservados.");
console.log("Controlador externo "+Buffer.byteLength(altered,"utf8")+" bytes; posición de ejecución original conservada.");
