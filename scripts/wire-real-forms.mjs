import {readFileSync,writeFileSync} from "node:fs";
const css=readFileSync("static-site/real-forms.css","utf8");
const js=readFileSync("static-site/real-forms.js","utf8");

function replaceOne(html, before, after, label){
  if(html.split(before).length!==2) throw new Error("Formulario no coincide: "+label);
  return html.replace(before,after);
}
function stripLegacy(html,token,label){
 const start=html.indexOf(token);
 if(start<0)throw new Error("No se encuentra el código obsoleto: "+label);
 const open=html.lastIndexOf("<script>",start);
 const close=html.indexOf("</script>",start);
 if(open<0||close<0)throw new Error("No se identifica script: "+label);
 return html.slice(0,open)+html.slice(close+"</script>".length);
}
const hidden='<input class="site-honeypot" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" value="">';
const consentText={
 newsletter:'Quiero recibir por correo nuevas publicaciones del Newsletter.',
 caligo:'Quiero recibir por correo las novedades editoriales de CALIGO.'
};
function consent(kind) {
 return '<label class="site-consent"><input name="consent" type="checkbox" required><span>'+consentText[kind]+'</span></label>';
}
function injectEnd(html){
 if(html.includes('id="real-form-styles"'))throw new Error("Formulario real duplicado");
 return html.replace("</head>",'<style id="real-form-styles">\n'+css+'\n</style>\n</head>')
  .replace("</body>",'<script id="real-form-handlers">\n'+js+'\n</script>\n</body>');
}
const main="out/index.html";
let html=readFileSync(main,"utf8");
html=replaceOne(html,
 '<form class="subscribe-form" action="mailto:arq.adrian.taberna@gmail.com" method="post" enctype="text/plain">',
 '<form class="subscribe-form" action="#cuaderno" method="post">',"Newsletter action");
html=replaceOne(html,
 '<input id="newsletter-email" name="Correo para suscripción" type="email" autocomplete="email" placeholder="tu@email.com" required>',
 '<input id="newsletter-email" name="Correo para suscripción" type="email" autocomplete="email" placeholder="tu@email.com" maxlength="254" required>',"Newsletter email");
html=replaceOne(html,
 '<button type="submit">Quiero suscribirme →</button>\n        </form>',
 '<button type="submit">Quiero suscribirme →</button>'+hidden+consent("newsletter")+'\n        </form>',"Newsletter submit");
html=replaceOne(html,
 'Sin spam. Al enviar se abrirá tu aplicación de correo para confirmar la suscripción.',
 'Tus datos se guardan para enviarte nuevas entregas del Newsletter. Podés pedir la baja cuando quieras.',"Newsletter note");

html=replaceOne(html,
 '<form class="caligo-signup-form" data-caligo-subscribe>',
 '<form class="caligo-signup-form" action="#caligo-suscripcion" method="post" data-caligo-subscribe>',"CALIGO action");
html=replaceOne(html,
 '</div>\n          </form>\n          <p class="caligo-signup-note">',
 '</div>\n            '+hidden+consent("caligo")+'\n          </form>\n          <p class="caligo-signup-note">',"CALIGO consent");
html=replaceOne(html,
 'Al continuar se abrirá tu aplicación de correo con la solicitud preparada. Para enviarla, confirmá el mensaje. El alta no es automática.',
 'La suscripción queda registrada en nuestra lista de CALIGO. Tu correo solo se usará para las novedades de la revista.',"CALIGO note");

html=replaceOne(html,
 '<form class="contact-form" action="mailto:arq.adrian.taberna@gmail.com" method="post" enctype="text/plain">',
 '<form class="contact-form" action="#contacto" method="post">',"Contacto action");
html=replaceOne(html,
 '<textarea id="contact-message" name="Consulta" placeholder="Arquitectura, documentación, mobiliario o colaboración profesional" required></textarea>',
 '<textarea id="contact-message" name="Consulta" minlength="15" maxlength="4000" placeholder="Arquitectura, documentación, mobiliario o colaboración profesional" required></textarea>',"Contacto length");
html=replaceOne(html,
 '<button class="contact-submit" type="submit"><span>Enviar consulta</span><strong>↗</strong></button>',
 hidden+'<button class="contact-submit" type="submit"><span>Enviar consulta</span><strong>↗</strong></button>',"Contacto honeypot");
html=replaceOne(html,
 'Se abrirá tu aplicación de correo con el mensaje completo y listo para enviar.',
 'Tu consulta se registra de forma privada para que podamos responderte por correo. No se abre ninguna aplicación externa.',"Contacto note");
html=stripLegacy(html,
 "const form = document.querySelector('.contact-form');",
 "Contacto mailto");
html=stripLegacy(html,
 "document.querySelectorAll('form[data-caligo-subscribe]').forEach(form => {",
 "CALIGO mailto");
html=injectEnd(html);
writeFileSync(main,html);

for(const reader of ["out/revista/caligo/n001/index.html","out/revista/caligo/n002/index.html"]){
 let s=readFileSync(reader,"utf8");
 s=replaceOne(s,
  '<form data-caligo-subscribe class="caligo-reader-signup-form">',
  '<form data-caligo-subscribe class="caligo-reader-signup-form" action="#suscripcion" method="post">',"Lector action: "+reader);
 s=replaceOne(s,
  '</div>\n      </form>\n      <p class="caligo-reader-signup-note">',
  '</div>\n        '+hidden+consent("caligo")+'\n      </form>\n      <p class="caligo-reader-signup-note">',"Lector consent: "+reader);
 s=replaceOne(s,
  'Se abrirá tu aplicación de correo con la solicitud preparada. Confirmá el envío del mensaje; no es un alta automática.',
  'Tu suscripción queda registrada para recibir futuras novedades de CALIGO. Podés pedir la baja cuando quieras.',"Lector note: "+reader);
 s=stripLegacy(s,
  "document.querySelectorAll('form[data-caligo-subscribe]').forEach(form => {",
  "Lector mailto "+reader);
 s=injectEnd(s);
 writeFileSync(reader,s);
}
console.log("Formularios conectados a backend real: Newsletter, CALIGO (portada + lectores) y Contacto. Sin mailto.");
