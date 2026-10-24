(() => {
  "use strict";
  const root = "https://adrian-taberna-formularios.floot.app/_api/";
  const forms = [
    ...Array.from(document.querySelectorAll("form.subscribe-form")).map(form => ({form, kind:"newsletter"})),
    ...Array.from(document.querySelectorAll("form[data-caligo-subscribe]")).map(form => ({form, kind:"caligo"})),
    ...Array.from(document.querySelectorAll("form.contact-form")).map(form => ({form, kind:"contact"}))
  ];
  for (const {form,kind} of forms) {
    if (form.dataset.realFormBound) continue;
    form.dataset.realFormBound = "true";
    const note = kind === "newsletter"
      ? form.parentElement.querySelector(".subscribe-note")
      : kind === "caligo"
        ? form.parentElement.querySelector(".caligo-signup-note, .caligo-reader-signup-note")
        : form.querySelector(".contact-form-note");
    const submit = form.querySelector('button[type="submit"]');
    if (note) {note.setAttribute("aria-live", "polite");note.setAttribute("role","status");}
    form.addEventListener("submit", async event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!form.reportValidity()) return;
      const email = form.querySelector('input[type="email"]')?.value.trim() ?? "";
      const hp = form.querySelector('input[name="website"]')?.value ?? "";
      const payload = kind === "contact"
        ? {
            fullName:form.querySelector("#contact-name")?.value.trim() ?? "",
            email,
            subject:"Consulta profesional desde el portfolio",
            message:form.querySelector("#contact-message")?.value.trim() ?? "",
            website:hp
          }
        : {
            email,
            publication:kind,
            consent:form.querySelector('input[name="consent"]')?.checked === true,
            website:hp,
            source:kind==="caligo"?(location.pathname.includes("/revista/")?"caligo-lector":"caligo-home"):"newsletter-home"
          };
      const originalText = submit?.textContent ?? "";
      if (submit) {submit.disabled=true;submit.setAttribute("aria-busy","true");}
      if (note) {note.classList.remove("site-note-ok","site-note-error");note.textContent="Registrando tu solicitud…";}
      try {
        const res = await fetch(root+(kind==="contact"?"contact":"subscribe"),{
          method:"POST",mode:"cors",credentials:"omit",cache:"no-store",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(payload)
        });
        const answer=await res.json();
        if (!res.ok || !answer.ok) throw new Error(answer.message || "No pudimos registrar la solicitud.");
        if (note) {note.textContent=answer.message;note.classList.add("site-note-ok");}
        form.reset();
      } catch(error) {
        if (note) {
          note.textContent = error instanceof Error && !(error instanceof TypeError)
            ? error.message : "No se pudo conectar. Verificá tu conexión e intentá nuevamente.";
          note.classList.add("site-note-error");
        }
      } finally {
        if (submit) {submit.disabled=false;submit.removeAttribute("aria-busy");}
      }
    }, {capture:true});
  }
})();