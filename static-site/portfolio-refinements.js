(() => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const name = String(data.get('Nombre') || '').trim();
    const email = String(data.get('Correo') || '').trim();
    const message = String(data.get('Consulta') || '').trim();
    const subject = `Consulta desde el portfolio · ${name}`;
    const body = [
      `Nombre: ${name}`,
      `Correo: ${email}`,
      '',
      'Proyecto o consulta:',
      message,
    ].join('\n');

    window.location.href = `mailto:arq.adrian.taberna@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();
