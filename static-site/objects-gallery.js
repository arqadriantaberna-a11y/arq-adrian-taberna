(() => {
  const dialog = document.querySelector('#objects-dialog');
  const card = document.querySelector('.objects-card');
  if (!dialog || !card) return;

  const images = Array.from({ length: 6 }, (_, index) => `./objetos/cenicero-${String(index + 1).padStart(2, '0')}.webp`);
  const views = ['Vista principal', 'Ángulo opuesto', 'Vista superior', 'Vista lateral baja', 'Detalle funcional', 'Vista ambientada'];
  const image = dialog.querySelector('.furniture-dialog-media img');
  const dots = dialog.querySelector('.furniture-dialog-dots');
  const counter = dialog.querySelector('.furniture-dialog-count');
  let active = 0;

  function show(index) {
    active = (index + images.length) % images.length;
    image.src = images[active];
    image.alt = `${views[active]} del cenicero de hormigón claro, render ${active + 1} de ${images.length}`;
    counter.textContent = `${String(active + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
    dots.querySelectorAll('button').forEach((button, i) => {
      button.classList.toggle('is-active', i === active);
      if (i === active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  }

  for (let index = 0; index < images.length; index++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'furniture-dialog-dot';
    button.setAttribute('aria-label', `Mostrar ${views[index].toLowerCase()}`);
    button.addEventListener('click', () => show(index));
    dots.append(button);
  }

  const open = () => { show(0); dialog.showModal(); dialog.scrollTop = 0; };
  card.addEventListener('click', open);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
  });
  document.querySelector('.objects-open')?.addEventListener('click', open);
  dialog.querySelector('.furniture-dialog-arrow-prev').addEventListener('click', () => show(active - 1));
  dialog.querySelector('.furniture-dialog-arrow-next').addEventListener('click', () => show(active + 1));
  dialog.querySelector('.furniture-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
})();
