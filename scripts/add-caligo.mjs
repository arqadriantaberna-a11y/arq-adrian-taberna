import {readFileSync,writeFileSync} from 'node:fs';
const file='out/index.html';let html=readFileSync(file,'utf8');
if(html.includes('id="revista"')) throw new Error('CALIGO ya fue insertada');
if(!html.includes('<section class="notebook" id="cuaderno"'))throw new Error('Newsletter no encontrado: se cancela inserción');
if(!html.includes('<section class="profile" id="perfil"'))throw new Error('Perfil no encontrado: se cancela inserción');
const section=`
  <section class="caligo-section" id="revista" aria-labelledby="caligo-title">
    <div class="shell">
      <div class="caligo-topline"><span>Publicación digital independiente</span><span>Arquitectura · Diseño · Cultura</span></div>
      <div class="caligo-layout">
        <div class="caligo-copy">
          <p class="caligo-kicker">Revista de arquitectura · Primera edición</p>
          <h2 id="caligo-title" class="caligo-display">CALIGO</h2>
          <p class="caligo-issue">N.º 001 &nbsp; / &nbsp; 2026 &nbsp; / &nbsp; 48 páginas</p>
          <h3 class="caligo-title">¿Para quién construimos?</h3>
          <p class="caligo-desc">Una revista para mirar la arquitectura más allá de su imagen. Su primera edición explora la escala humana, la vigencia del patio, la vegetación en las fachadas, la experiencia de los materiales y las estrategias pasivas que hacen posibles espacios más habitables.</p>
          <div class="caligo-ctas">
            <a class="caligo-primary" href="./revista/caligo/n001/">Leer el número completo <span aria-hidden="true">↗</span></a>
            <a class="caligo-secondary" href="./revista/caligo/n001/CALIGO_N001_web.pdf" download>Descargar PDF <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div>
          <a class="caligo-coverlink" href="./revista/caligo/n001/" aria-label="Abrir CALIGO número 001 — ¿Para quién construimos?">
            <img class="caligo-cover" src="./images/caligo/n001/p01.webp" width="1055" height="1491" loading="lazy" decoding="async" alt="Portada de la revista CALIGO Nº 001: ¿Para quién construimos?">
          </a>
          <div class="caligo-covernote"><span>Edición inaugural</span><span>Dirección editorial · Arq. Adrian Taberna</span></div>
        </div>
      </div>
      <div class="caligo-bottom">
        <p class="caligo-bottomlabel">En este número<br>Exploraciones y lecturas</p>
        <div class="caligo-stories">
          <a class="caligo-story" href="./revista/caligo/n001/#p06"><span class="caligo-story-num">01</span><span class="caligo-story-name">¿Para quién construimos?<small>Editorial · p. 06</small></span></a>
          <a class="caligo-story" href="./revista/caligo/n001/#p09"><span class="caligo-story-num">02</span><span class="caligo-story-name">El patio no ha desaparecido. Ha cambiado de forma.<small>Investigación · p. 09</small></span></a>
          <a class="caligo-story" href="./revista/caligo/n001/#p22"><span class="caligo-story-num">03</span><span class="caligo-story-name">Cuando la vegetación se convierte en fachada.<small>Crítica · p. 22</small></span></a>
          <a class="caligo-story" href="./revista/caligo/n001/#p31"><span class="caligo-story-num">04</span><span class="caligo-story-name">La materia también construye experiencias.<small>Técnica · p. 31</small></span></a>
          <a class="caligo-story" href="./revista/caligo/n001/#p40"><span class="caligo-story-num">05</span><span class="caligo-story-name">Arquitectura antes del aire acondicionado.<small>Laboratorio CALIGO · p. 40</small></span></a>
        </div>
      </div>
      <div class="caligo-signup" id="caligo-suscripcion" aria-labelledby="caligo-signup-title">
        <div class="caligo-signup-intro">
          <p class="caligo-signup-kicker">CALIGO · Nuevas ediciones</p>
          <h3 id="caligo-signup-title">Recibí la revista en tu correo.</h3>
          <p>Enterate cuando publiquemos un nuevo número de CALIGO y recibí novedades editoriales sobre arquitectura, diseño y cultura.</p>
        </div>
        <div class="caligo-signup-side">
          <form class="caligo-signup-form" data-caligo-subscribe>
            <label for="caligo-email">Tu correo electrónico</label>
            <div class="caligo-signup-controls">
              <input id="caligo-email" name="email" type="email" autocomplete="email" placeholder="tu@email.com" maxlength="254" required>
              <button type="submit">Solicitar suscripción <span aria-hidden="true">↗</span></button>
            </div>
          </form>
          <p class="caligo-signup-note">Al continuar se abrirá tu aplicación de correo con la solicitud preparada. Para enviarla, confirmá el mensaje. El alta no es automática.</p>
        </div>
      </div>
    </div>
  </section>
`;
html=html.replace('<section class="profile" id="perfil"',section+'\n  <section class="profile" id="perfil"');
// desktop nav: add alongside Newsletter rather than replacing it
const desktop='<a href="#cuaderno">Newsletter</a>';
if(!html.includes(desktop))throw new Error('Nav Newsletter no encontrado');
html=html.replace(desktop, desktop+'\n        <a href="#revista">CALIGO</a>');
// mobile menu index, preserve newsletter and other navigation
const mobile='<a href="#cuaderno">• Newsletter</a>';
if(!html.includes(mobile))throw new Error('Navegación móvil no encontrada');
html=html.replace(mobile,mobile+'<a href="#revista">• Revista CALIGO</a>');
const css=readFileSync('static-site/caligo.css','utf8');
if(!html.includes('id="caligo-styles"'))html=html.replace('</head>',`<style id="caligo-styles">\n${css}\n</style>\n</head>`);

const caligoSignupScript = `<script>
document.querySelectorAll('form[data-caligo-subscribe]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const email = form.querySelector('input[type="email"]').value.trim();
    if (!email) return;
    const subject = encodeURIComponent('CALIGO - Solicitud de suscripción por correo');
    const body = encodeURIComponent('Hola, quiero recibir las nuevas ediciones y novedades de CALIGO por correo electrónico.\\n\\nMi dirección es: ' + email + '\\n\\nGracias.');
    window.location.href = 'mailto:arq.adrian.taberna@gmail.com?subject=' + subject + '&body=' + body;
  });
});
</script>`;
html=html.replace('</body>',caligoSignupScript+'\n</body>');

writeFileSync(file,html);
console.log('CALIGO N.º 001 añadida como sección independiente del Newsletter, con enlaces y portada.');
