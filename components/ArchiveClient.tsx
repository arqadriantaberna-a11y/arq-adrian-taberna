"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import styles from "@/app/archivo/archive.module.css";

type PublicItem = { id: string; kind: string; title: string; summary: string; body: string; image_url: string; image_alt: string };
const names: Record<string, string> = { architecture: "Arquitectura", furniture: "Mobiliario", article: "Artículos" };

export default function ArchiveClient() {
  const [items, setItems] = useState<PublicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setError(true); setLoading(false); return; }
    supabase.from("portfolio_items").select("id,kind,title,summary,body,image_url,image_alt")
      .eq("published", true).order("sort_order", { ascending: true })
      .then(({ data, error: requestError }) => {
        setItems((data || []) as PublicItem[]);
        setError(Boolean(requestError));
        setLoading(false);
      });
  }, []);

  return <main className={styles.page}>
    <header><a href={`${basePath}/`}>Adrián Taberna <small>Arquitecto</small></a><span>Archivo</span></header>
    <section className={styles.intro}><span>Proyectos y notas</span><h1>Archivo abierto.</h1><p>Arquitectura, objetos y procesos de trabajo.</p></section>
    {loading ? <p>Cargando archivo…</p> : error ? <p>No pudimos cargar el archivo. Intentá de nuevo en un momento.</p> : items.length === 0 ? <p>Próximamente, nuevos proyectos y notas.</p> :
      <section className={styles.grid} aria-label="Contenido publicado">{items.map((item) => <article key={item.id}>
        {item.image_url && <img src={item.image_url} alt={item.image_alt || item.title} loading="lazy" />}
        <div><small>{names[item.kind] || item.kind}</small><h2>{item.title}</h2><p>{item.summary}</p>{item.body && <p className={styles.body}>{item.body}</p>}</div>
      </article>)}</section>}
    <footer><a href={`${basePath}/`}>Volver al inicio →</a></footer>
  </main>;
}
