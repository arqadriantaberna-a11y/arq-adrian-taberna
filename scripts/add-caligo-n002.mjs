import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const mainPath = "out/index.html";
let html = readFileSync(mainPath, "utf8");
const sectionStart = html.indexOf('<section class="caligo-section" id="revista"');
const sectionEnd = html.indexOf('<section class="profile" id="perfil"', sectionStart);
if (sectionStart < 0 || sectionEnd < 0) throw new Error("Sección CALIGO no encontrada");

let section = html.slice(sectionStart, sectionEnd);
if (section.includes('caligo-archive')) throw new Error("El segundo número ya está incorporado");

function changeOnce(input, oldValue, newValue) {
  if (input.split(oldValue).length !== 2) throw new Error("Se esperaba exactamente una coincidencia: " + oldValue.slice(0, 95));
  return input.replace(oldValue, newValue);
}

section = changeOnce(section,
  'Revista de arquitectura · Primera edición',
  'Revista de arquitectura · Edición actual');
section = changeOnce(section,
  'N.º 001 &nbsp; / &nbsp; 2026 &nbsp; / &nbsp; 48 páginas',
  'N.º 002 &nbsp; / &nbsp; 2026 &nbsp; / &nbsp; 48 páginas');
section = changeOnce(section,
  '<h3 class="caligo-title">¿Para quién construimos?</h3>',
  '<h3 class="caligo-title">El pasado sigue construyendo</h3>');
section = changeOnce(section,
  '<p class="caligo-desc">Una revista para mirar la arquitectura más allá de su imagen. Su primera edición explora la escala humana, la vigencia del patio, la vegetación en las fachadas, la experiencia de los materiales y las estrategias pasivas que hacen posibles espacios más habitables.</p>',
  '<p class="caligo-desc">La historia de la arquitectura y las ideas que todavía organizan nuestros espacios. El segundo número recorre el patio como memoria colectiva, la estructura como posibilidad, el arte del umbral y la ciudad como obra compartida, hasta construir un atlas de las permanencias.</p>');

// Cambiar solo enlaces y portada de la edición destacada. El archivo histórico
// del N.º 001 se añade después y no sufrirá estas sustituciones.
section = section.replaceAll("./revista/caligo/n001/", "./revista/caligo/n002/");
section = section.replaceAll("CALIGO_N001_web.pdf", "CALIGO_N002_web.pdf");
section = changeOnce(section,
  'aria-label="Abrir CALIGO número 001 — ¿Para quién construimos?"',
  'aria-label="Abrir CALIGO número 002 — El pasado sigue construyendo"');
section = changeOnce(section, 'src="./images/caligo/n001/p01.webp"', 'src="./images/caligo/n002/p01.webp"');
section = changeOnce(section, 'width="1055" height="1491"', 'width="1024" height="1536"');
section = changeOnce(section,
  'alt="Portada de la revista CALIGO Nº 001: ¿Para quién construimos?"',
  'alt="Portada de la revista CALIGO Nº 002: El pasado sigue construyendo"');
section = changeOnce(section, '<span>Edición inaugural</span>', '<span>Segunda edición · 2026</span>');

const storiesStart=section.indexOf('<div class="caligo-stories">');
const storiesEnd=section.indexOf('</div>\n      </div>',storiesStart);
if (storiesStart<0||storiesEnd<0) throw new Error("No se encontró el índice del Nº 001");
const stories=[
  [1,6,"La modernidad también tiene memoria","Editorial"],
  [2,9,"El vacío tiene memoria","Investigación I"],
  [3,17,"La estructura y la libertad","Investigación II"],
  [4,25,"El arte del umbral","Investigación III"],
  [5,33,"La ciudad como obra colectiva","Investigación IV"],
  [6,40,"Atlas de las permanencias","Laboratorio CALIGO"]
];
const storyHtml='<div class="caligo-stories">\n'+stories.map(function(item) {
 const index=String(item[0]).padStart(2,'0'),pg=String(item[1]).padStart(2,'0');
 return '          <a class="caligo-story" href="./revista/caligo/n002/#p'+pg+'"><span class="caligo-story-num">'+index+'</span><span class="caligo-story-name">'+item[2]+'<small>'+item[3]+' · p. '+pg+'</small></span></a>';
}).join('\n')+'\n        ';
section=section.slice(0,storiesStart)+storyHtml+section.slice(storiesEnd);

const archive='      <div class="caligo-archive" aria-labelledby="caligo-archive-title">\n'+
'        <div class="caligo-archive-head"><p id="caligo-archive-title">Archivo de ediciones</p><span>Conservamos todos los números publicados</span></div>\n'+
'        <a class="caligo-archive-item" href="./revista/caligo/n001/" aria-label="Leer CALIGO número 001: ¿Para quién construimos?">\n'+
'          <img loading="lazy" decoding="async" src="./images/caligo/n001/p01.webp" width="1055" height="1491" alt="Portada de CALIGO número 001: ¿Para quién construimos?">\n'+
'          <span class="caligo-archive-details"><small>CALIGO · N.º 001 / 2026</small><strong>¿Para quién construimos?</strong><span>La escala humana, el patio, la materia y las estrategias pasivas para habitar.</span></span>\n'+
'          <span class="caligo-archive-action">Leer edición anterior ↗</span>\n'+
'        </a>\n'+
'      </div>\n';
section=changeOnce(section,
  '      <div class="caligo-signup" id="caligo-suscripcion"',
  archive+'      <div class="caligo-signup" id="caligo-suscripcion"');

// Botón de acceso al archivo completo, junto a la edición anterior.
// Preserva el N.º 002 como protagonista y el N.º 001 en formato pequeño.
section=changeOnce(section,
  '        </a>\n      </div>\n      <div class="caligo-signup"',
  '        </a>\n        <div class="caligo-archive-more"><a class="caligo-archive-button" href="./revista/caligo/" aria-label="Ver todos los ejemplares publicados de CALIGO">Ver todos los ejemplares <span aria-hidden="true">↗</span></a></div>\n      </div>\n      <div class="caligo-signup"');

html=html.slice(0,sectionStart)+section+html.slice(sectionEnd);
writeFileSync(mainPath,html);

let reader=readFileSync("static-site/caligo-reader.html","utf8");
const navStart=reader.indexOf('<nav class="toc-list" aria-label="Secciones del número">');
const navEnd=reader.indexOf('</nav>',navStart);
if(navStart<0||navEnd<0)throw new Error("No se encontró índice del lector CALIGO N.º 001");
const chapters=[
 [1,"Portada","Inicio"],[3,"Sumario y créditos","Editorial"],[6,"La modernidad también tiene memoria","Editorial"],
 [9,"El vacío tiene memoria","Investigación I"],[17,"La estructura y la libertad","Investigación II"],
 [25,"El arte del umbral","Investigación III"],[33,"La ciudad como obra colectiva","Investigación IV"],
 [40,"Atlas de las permanencias","Laboratorio CALIGO"],[47,"Colofón editorial","Cierre"]
];
const nav='<nav class="toc-list" aria-label="Secciones del número">\n'+chapters.map(function(item) {
  const pg=String(item[0]).padStart(2,'0');
  return '<a href="#p'+pg+'" data-page="'+item[0]+'"><span>'+pg+'</span><span>'+item[1]+'<small>'+item[2]+'</small></span></a>';
}).join('\n')+'\n';
reader=reader.slice(0,navStart)+nav+reader.slice(navEnd);
reader=reader.replaceAll("001","002").replaceAll("n001","n002");
reader=reader.replaceAll("¿Para quién construimos?","El pasado sigue construyendo");
reader=changeOnce(reader,
  'La escala humana frente a una arquitectura que muchas veces privilegia la imagen, la rentabilidad y el espectáculo. Una publicación para investigar la arquitectura más allá de su apariencia.',
  'La historia de la arquitectura y las ideas que todavía organizan nuestros espacios. Un recorrido por los patios, las estructuras, los umbrales y la ciudad para descubrir qué permanece cuando cambian las formas.');
reader=reader.replaceAll('Edición inaugural','Segunda edición');
reader=changeOnce(reader,'const chapters=[1,3,6,9,22,31,40,47];','const chapters=[1,3,6,9,17,25,33,40,47];');
reader=changeOnce(reader,'La arquitectura no empieza en la forma.','La memoria también construye el futuro.');
reader=changeOnce(reader,'Empieza en la vida que hace posible.','Toda forma tiene una historia. Ninguna arquitectura nace en el vacío.');
reader=reader.replaceAll('width="1055" height="1491"','width="1024" height="1536"');

if(!reader.includes('images/caligo/n002/p') || !reader.includes('CALIGO_N002_web.pdf'))throw new Error("Error en rutas del lector Nº 002");
if(reader.includes('CALIGO_N001_web.pdf'))throw new Error("Lector Nº 002 contiene enlaces al Nº 001");
const target="out/revista/caligo/n002/index.html";
mkdirSync("out/revista/caligo/n002",{recursive:true});
writeFileSync(target,reader);
console.log("CALIGO Nº 002 publicado como edición actual; Nº 001 preservado en archivo y lectores independientes.");
