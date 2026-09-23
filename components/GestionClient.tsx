"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import styles from "@/app/gestion/gestion.module.css";

const FALLBACK_ADMIN_EMAIL = "arq.adrian.taberna@gmail.com";

type Notice = { tone: "error" | "success" | "neutral"; text: string } | null;

export default function GestionClient() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || FALLBACK_ADMIN_EMAIL;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [email, setEmail] = useState(adminEmail);
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setChecking(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setChecking(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !session?.user.email) return;
    if (session.user.email.toLowerCase() === adminEmail.toLowerCase()) return;

    supabase.auth.signOut();
    setNotice({ tone: "error", text: "Esta cuenta no tiene permiso para administrar el sitio." });
  }, [adminEmail, session, supabase]);

  async function requestMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    if (email.trim().toLowerCase() !== adminEmail.toLowerCase()) {
      setNotice({ tone: "error", text: "Usá el correo autorizado para administrar el sitio." });
      return;
    }

    setBusy(true);
    setNotice(null);

    const redirectTo = new URL(`${basePath}/gestion/`, window.location.origin).toString();
    const { error } = await supabase.auth.signInWithOtp({
      email: adminEmail,
      options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
    });

    setBusy(false);
    setNotice(
      error
        ? { tone: "error", text: "No pudimos enviar el acceso. Probá nuevamente en unos minutos." }
        : { tone: "success", text: "Te enviamos un enlace privado. Abrilo desde tu correo para entrar." },
    );
  }

  async function signOut() {
    if (!supabase) return;
    setBusy(true);
    await supabase.auth.signOut();
    setBusy(false);
    setNotice(null);
  }

  const isAdmin = session?.user.email?.toLowerCase() === adminEmail.toLowerCase();

  if (checking) {
    return <main className={styles.screen}><p className={styles.loading}>Comprobando acceso…</p></main>;
  }

  if (!supabase) {
    return (
      <main className={styles.screen}>
        <section className={styles.card}>
          <span className={styles.eyebrow}>Gestión privada</span>
          <h1>El acceso está preparado.</h1>
          <p>Falta activar la conexión segura con Supabase para habilitar el ingreso.</p>
          <a className={styles.backLink} href={`${basePath}/`}>Volver al sitio <span>↗</span></a>
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className={styles.screen}>
        <a className={styles.brand} href={`${basePath}/`}>Adrián Taberna <small>Arquitecto</small></a>
        <section className={styles.card}>
          <span className={styles.eyebrow}>Área reservada</span>
          <h1>Gestión del sitio</h1>
          <p>Ingresá mediante el enlace privado que enviaremos al correo autorizado.</p>
          <form onSubmit={requestMagicLink} className={styles.form}>
            <label htmlFor="gestion-email">Correo de acceso</label>
            <input id="gestion-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            <button type="submit" disabled={busy}>{busy ? "Enviando…" : "Enviar enlace privado"}</button>
          </form>
          {notice && <p className={`${styles.notice} ${styles[notice.tone]}`} role="status">{notice.text}</p>}
          <a className={styles.backLink} href={`${basePath}/`}>Volver al sitio <span>↗</span></a>
        </section>
        <footer className={styles.footer}>Acceso no listado · Buenos Aires, Argentina</footer>
      </main>
    );
  }

  return (
    <main className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <div><span className={styles.eyebrow}>Modo privado</span><h1>Gestión del sitio</h1></div>
        <div className={styles.headerActions}>
          <a href={`${basePath}/`} target="_blank" rel="noreferrer">Ver sitio <span>↗</span></a>
          <button onClick={signOut} disabled={busy}>Cerrar sesión</button>
        </div>
      </header>

      <section className={styles.welcome}>
        <p>Hola, Adri.</p>
        <h2>Tu portfolio está conectado y listo para administrar.</h2>
        <span>Los editores se habilitarán por etapas para conservar intacta la versión pública aprobada.</span>
      </section>

      <section className={styles.moduleGrid} aria-label="Módulos de gestión">
        <article><span>01</span><div><h3>Arquitectura</h3><p>Proyectos, relatos, datos técnicos y galerías.</p></div><small>Próxima etapa</small></article>
        <article><span>02</span><div><h3>Mobiliario</h3><p>Piezas, materiales, dimensiones y documentación.</p></div><small>Próxima etapa</small></article>
        <article><span>03</span><div><h3>Newsletter</h3><p>Artículos, borradores y publicación editorial.</p></div><small>Próxima etapa</small></article>
        <article><span>04</span><div><h3>SEO</h3><p>Títulos, descripciones, imágenes sociales e indexación.</p></div><small>Próxima etapa</small></article>
      </section>

      <section className={styles.statusBar}>
        <span><i /> Sesión segura activa</span>
        <span>Cuenta: {session.user.email}</span>
      </section>
    </main>
  );
}
