"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { assetPath } from "@/lib/site-path";

const panels = [
  { href: "/#arquitectura", title: "Arquitectura", note: "Proyectos", image: "/images/habitar-umbral-exterior.webp" },
  { href: "/#mobiliario", title: "Diseño", note: "Mobiliario", image: "/images/mesa-comedor-paraiso.webp", contain: true },
  { href: "/#newsletter", title: "Newsletter", note: "Ideas y procesos", image: "/images/casa-patio-exterior.webp" },
  { href: "/#estudio", title: "Estudio", note: "Perfil", image: "/images/adrian-taberna-retrato.webp" }
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/">Adrián Taberna · Arquitecto</Link>
        <button className={`menu-button ${open ? "is-open" : ""}`} type="button" aria-expanded={open} aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen((value) => !value)}>
          <i /><i /><i />
        </button>
      </header>
      <div className={`menu-overlay ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <aside className="menu-index">
          <span className="menu-search">⌕&nbsp;&nbsp; Explorar</span>
          <div><strong>Arquitectura</strong><Link href="/#arquitectura" onClick={() => setOpen(false)}>• Proyectos</Link><Link href="/proyectos/casa-patio" onClick={() => setOpen(false)}>• Residencial</Link><Link href="/proyectos/centro-ambulatorio" onClick={() => setOpen(false)}>• Salud</Link></div>
          <div><strong>Diseño</strong><Link href="/#mobiliario" onClick={() => setOpen(false)}>• Mobiliario</Link><Link href="/mobiliario/mesa-comedor-paraiso" onClick={() => setOpen(false)}>• Piezas seleccionadas</Link></div>
          <div><strong>Contenido</strong><Link href="/#newsletter" onClick={() => setOpen(false)}>• Newsletter</Link></div>
          <div><strong>Estudio</strong><Link href="/#estudio" onClick={() => setOpen(false)}>• Perfil</Link><Link href="/#contacto" onClick={() => setOpen(false)}>• Contacto</Link></div>
        </aside>
        <nav className="menu-panels" aria-label="Secciones principales">
          {panels.map((panel) => (
            <Link href={panel.href} className={`menu-panel ${panel.contain ? "is-contain" : ""}`} key={panel.title} onClick={() => setOpen(false)}>
              <Image src={assetPath(panel.image)} alt="" fill sizes="(max-width: 680px) 100vw, 25vw" />
              <span>{panel.title}</span><small>{panel.note}</small>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
