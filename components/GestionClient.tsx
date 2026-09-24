"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import styles from "@/app/gestion/gestion.module.css";

const FALLBACK_ADMIN_EMAIL = "cronos.el.harcore@gmail.com";

type Item = { id: string; kind: "architecture" | "furniture" | "article"; slug: string; title: string; summary: string; body: string; image_url: string; image_alt: string; published: boolean; sort_order: number };
const blankItem = (): Item => ({ id: "", kind: "architecture", slug: "", title: "", summary: "", body: "", image_url: "", image_alt: "", published: false, sort_order: 0 });

type Notice = { tone: "error" | "success" | "neutral"; text: string } | null;

function authMessage(code: string, description = "") {
  if (/rate.limit|too.many|email.send/i.test(`${code} ${description}`))
    return "Supabase limitó temporalmente el envío de correos. No pidas otro enlace por ahora; probá con el último correo recibido.";
  if (/expired|invalid|used/i.test(`${code} ${description}`))
    return "Ese enlace ya venció o fue usado. Los enlaces sirven una sola vez; cuando se habilite el envío, pedí uno nuevo y abrí sólo el más reciente.";
  if (/pkce|verifier|flow.state/i.test(`${code} ${description}`))
    return "El correo se abrió en otro navegador. Abrí el enlace en el mismo navegador donde solicitaste el acceso.";
  return `No se pudo iniciar sesión (${code || "error desconocido"}). ${description}`.trim();
}

export default function GestionClient() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || FALLBACK_ADMIN_EMAIL;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const [email, setEmail] = useState(adminEmail);
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<Item | null>(null);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return;
    }

    let active = true;
    const search = new URLSearchParams(window.location.search);
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const callbackError = search.get("error_code") || fragment.get("error_code") || search.get("error") || fragment.get("error");
    const callbackDescription = search.get("error_description") || fragment.get("error_description") || "";
    // Capture before the SDK initializes: it may clean the fragment on startup.
    const fallbackAccessToken = fragment.get("access_token");
    const fallbackRefreshToken = fragment.get("refresh_token");

    if (callbackError) {
      setNotice({ tone: "error", text: authMessage(callbackError, callbackDescription.replace(/\+/g, " ")) });
      window.history.replaceState(null, "", window.location.pathname);
    }

    supabase.auth.getSession().then(async ({ data, error }) => {
      if (!active) return;
      let nextSession = data.session;
      if (!nextSession && fallbackAccessToken && fallbackRefreshToken) {
        const recovered = await supabase.auth.setSession({ access_token: fallbackAccessToken, refresh_token: fallbackRefreshToken });
        nextSession = recovered.data.session;
        if (recovered.error && active) setNotice({ tone: "error", text: authMessage(recovered.error.code || "sesión", recovered.error.message) });
      }
      if (!active) return;
      setSession(nextSession);
      setChecking(false);
      if (error) setNotice({ tone: "error", text: authMessage(error.code || "sesión", error.message) });
      if (nextSession && window.location.hash) window.history.replaceState(null, "", window.location.pathname);
    }).catch(() => {
      if (!active) return;
      setChecking(false);
      setNotice({ tone: "error", text: "No se pudo comprobar la sesión. Recargá esta página una vez." });
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

  useEffect(() => {
    if (!supabase || session?.user.email?.toLowerCase() !== adminEmail.toLowerCase()) return;
    let active = true;
    supabase.from("portfolio_items").select("id,kind,slug,title,summary,body,image_url,image_alt,published,sort_order")
      .order("sort_order", { ascending: true }).then(({ data, error }) => {
        if (!active) return;
        setLoadingItems(false);
        if (error) setNotice({ tone: "error", text: "Todavía no se pudo leer el contenido. Revisá la tabla y sus permisos en Supabase." });
        else setItems((data || []) as Item[]);
      });
    setLoadingItems(true);
    return () => { active = false; };
  }, [adminEmail, session, supabase]);

  async function saveItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !editing) return;
    setBusy(true);
    setNotice(null);
    const { id, ...record } = editing;
    const query = id ? supabase.from("portfolio_items").update(record).eq("id", id) : supabase.from("portfolio_items").insert(record);
    const { data, error } = await query.select("id,kind,slug,title,summary,body,image_url,image_alt,published,sort_order").single();
    setBusy(false);
    if (error || !data) {
      setNotice({ tone: "error", text: "No se guardó. Comprobá el identificador y los permisos del proyecto." });
      return;
    }
    setItems((previous) => [...previous.filter((item) => item.id !== data.id), data as Item].sort((a, b) => a.sort_order - b.sort_order));
    setEditing(null);
    setNotice({ tone: "success", text: "Contenido guardado. Si está publicado, aparece en el archivo público." });
  }

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
    setNotice(error
      ? { tone: "error", text: authMessage(error.code || String(error.status || "envío"), error.message) }
      : { tone: "success", text: "Te enviamos un enlace privado. Abrí el más reciente desde tu correo para entrar." });
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
          <a href={`${basePath}/archivo/`} target="_blank" rel="noreferrer">Ver archivo <span>↗</span></a>
          <button onClick={signOut} disabled={busy}>Cerrar sesión</button>
        </div>
      </header>

      <section className={styles.welcome}>
        <p>Hola, Adri.</p>
        <h2>Administrá tu archivo editorial.</h2>
        <span>Creá borradores y publicá proyectos, muebles o artículos desde acá.</span>
      </section>

      <section className={styles.editor} aria-label="Archivo editable">
        <div className={styles.editorHead}><div><span className={styles.eyebrow}>Archivo</span><h2>Contenido</h2></div><button type="button" onClick={() => setEditing(blankItem())}>Agregar contenido</button></div>
        {notice && <p className={`${styles.notice} ${styles[notice.tone]}`} role="status">{notice.text}</p>}
        {loadingItems ? <p>Cargando…</p> : items.length === 0 ? <p>Tu archivo está vacío. Podés crear el primer borrador.</p> : <ul className={styles.itemList}>{items.map((item) => <li key={item.id}><div><small>{item.kind} · {item.published ? "Publicado" : "Borrador"}</small><strong>{item.title}</strong><span>/{item.slug}</span></div><button onClick={() => setEditing(item)}>Editar</button></li>)}</ul>}
        {editing && <form onSubmit={saveItem} className={styles.itemForm}>
          <div className={styles.formHeading}><h3>{editing.id ? "Editar contenido" : "Nuevo contenido"}</h3><button type="button" onClick={() => setEditing(null)}>Cerrar</button></div>
          <label>Sección<select value={editing.kind} onChange={(e) => setEditing({ ...editing, kind: e.target.value as Item["kind"] })}><option value="architecture">Arquitectura</option><option value="furniture">Mobiliario</option><option value="article">Artículos</option></select></label>
          <label>Título<input required value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></label>
          <label>Identificador de URL<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="casa-patio" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></label>
          <label>Resumen<textarea rows={3} value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} /></label>
          <label>Texto<textarea rows={8} value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} /></label>
          <label>URL de imagen<input type="url" value={editing.image_url} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></label>
          <label>Descripción de imagen<input value={editing.image_alt} onChange={(e) => setEditing({ ...editing, image_alt: e.target.value })} /></label>
          <label>Orden<input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></label>
          <label className={styles.check}><input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} /> Publicado</label>
          <button type="submit" disabled={busy}>{busy ? "Guardando…" : "Guardar contenido"}</button>
        </form>}
      </section>

      <section className={styles.statusBar}>
        <span><i /> Sesión segura activa</span>
        <span>Cuenta: {session.user.email}</span>
      </section>
    </main>
  );
}
