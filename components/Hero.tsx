"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { projects } from "@/lib/content";
import { assetPath } from "@/lib/site-path";

const slides = projects.map((project, index) => ({ ...project, image: index === 0 ? "/images/hero-casa-patio.webp" : project.cover }));

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[active];

  return (
    <section className="hero" id="inicio" aria-label="Proyectos destacados">
      {slides.map((item, index) => (
        <Image key={item.slug} className={`hero-image ${index === active ? "is-active" : ""}`} src={assetPath(item.image)} alt={item.title} fill priority={index === 0} sizes="100vw" />
      ))}
      <div className="hero-shade" />
      <button className="hero-arrow prev" aria-label="Proyecto anterior" onClick={() => setActive((active - 1 + slides.length) % slides.length)}>‹</button>
      <button className="hero-arrow next" aria-label="Proyecto siguiente" onClick={() => setActive((active + 1) % slides.length)}>›</button>
      <div className="hero-copy">
        <h1>{slide.title}</h1>
        <p className="hero-meta">{slide.category}{slide.area ? ` · ${slide.area}` : ""}</p>
        <Link href={`/proyectos/${slide.slug}`}>Ver proyecto</Link>
        <p className="hero-note">{slide.statement}</p>
      </div>
      <div className="hero-dots">{slides.map((item, index) => <button key={item.slug} className={index === active ? "is-active" : ""} aria-label={`Mostrar ${item.title}`} onClick={() => setActive(index)} />)}</div>
    </section>
  );
}
