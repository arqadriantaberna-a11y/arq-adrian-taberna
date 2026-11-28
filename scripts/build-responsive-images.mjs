/* Create responsive derivatives from the EXISTING site images.
   Original images are never overwritten or re-encoded.
   Responsive images preserve their source aspect ratio and composition. */
import {readFileSync,writeFileSync,mkdirSync,existsSync} from "node:fs";
import {join,dirname,basename,extname} from "node:path";
import sharp from "sharp";

const out="out";
const data=JSON.parse(readFileSync("static-site/editorial-data.json","utf8"));
const sources=[
 {name:"portada-casa-patio",path:"images/casa-patio-new/casa-10.jpeg"},
 ...data.projects.map(p=>({name:p.id,path:p.cover}))
];
const optimized=new Map();
const target=join(out,"images","editorial-responsive");
mkdirSync(target,{recursive:true});
let originalBytes=0,derivedBytes=0,generated=0;
for(const item of sources){
 const input=join(out,item.path);
 if(!existsSync(input))throw Error("No se encontró imagen original: "+item.path);
 const metadata=await sharp(input).metadata();
 if(!metadata.width||!metadata.height)throw Error("Imagen sin dimensiones: "+item.path);
 const fs=await import("node:fs");
 originalBytes+=fs.statSync(input).size;
 const widths=[...new Set([480,960,metadata.width])].filter(w=>w<=metadata.width).sort((a,b)=>a-b);
 const variants=[];
 for(const width of widths){
  const filename=item.name+"-w"+width+".webp";
  const file=join(target,filename);
  await sharp(input).rotate().resize({width,fit:"inside",withoutEnlargement:true}).webp({quality:84,effort:5}).toFile(file);
  const created=await sharp(file).metadata();
  if(created.width!==width)throw Error("El derivado no coincide con la dimensión esperada: "+filename);
  const expectedRatio=metadata.width/metadata.height;
  if(Math.abs((created.width/created.height)-expectedRatio)>.01)throw Error("La imagen perdió su proporción: "+filename);
  derivedBytes+=fs.statSync(file).size;generated++;
  variants.push("./images/editorial-responsive/"+filename+" "+width+"w");
 }
 optimized.set("./"+item.path,{srcset:variants.join(", "),sizes:"(max-width:780px) calc(100vw - 38px), (max-width:1100px) 50vw, 100vw",width:metadata.width,height:metadata.height});
 console.log("Imagen "+item.name+": "+metadata.width+"×"+metadata.height+" · "+widths.join(", ")+" px");
}
let home=readFileSync(join(out,"index.html"),"utf8");
let inserted=0;
home=home.replace(/<img\b[^>]*>/g,tag=>{
 const source=tag.match(/\bsrc="([^"]+)"/)?.[1];
 const item=optimized.get(source);
 if(!item)return tag;
 if(/\bsrcset=/.test(tag))throw Error("srcset ya existe: "+source);
 const sizes=source.includes("casa-10.jpeg")?"100vw":item.sizes;
 const insert=' srcset="'+item.srcset+'" sizes="'+sizes+'"';
 inserted++;
 return tag.replace(/>$/,insert+'>');
});
if(inserted<6)throw Error("No se añadieron suficientes srcset al HTML: "+inserted);
writeFileSync(join(out,"index.html"),home);
const jsPath=join(out,"editorial","legacy-home.js");
let js=readFileSync(jsPath,"utf8");
const from1='return {...item,src:item.src || image?.src,alt:item.alt || image?.alt || item.title};';
const to1='return {...item,src:item.src || image?.src,srcset:item.selector ? image?.getAttribute("srcset") : originalHero?.getAttribute("srcset"),alt:item.alt || image?.alt || item.title};';
if(js.split(from1).length!==2)throw Error("No se reconoció el origen de las diapositivas");
js=js.replace(from1,to1);
const from2='          image.src = item.src;\n          image.alt = item.alt;';
const to2='          if(item.srcset){image.srcset=item.srcset;image.sizes="100vw";}\n          image.src = item.src;\n          image.alt = item.alt;';
if(js.split(from2).length!==2)throw Error("No se encontró inicialización del carrusel");
js=js.replace(from2,to2);
writeFileSync(jsPath,js);
console.log("IMÁGENES RESPONSIVE: "+generated+" derivados / "+inserted+" etiquetas srcset / originales: "+originalBytes+" bytes / nuevos: "+derivedBytes+" bytes.");
