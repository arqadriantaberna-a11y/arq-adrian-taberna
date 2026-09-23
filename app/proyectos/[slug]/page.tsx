import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { getProject, projects } from "@/lib/content";
import { assetPath } from "@/lib/site-path";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.title, description: project.statement, openGraph: { images: [project.cover] } } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return (
    <><SiteHeader /><main className="detail-page">
      <header className="detail-intro section-shell"><Link href="/#arquitectura">← Arquitectura</Link><h1>{project.title}</h1><p>{project.statement}</p><div className="detail-meta"><span>{project.category}</span><span>{project.location || "Buenos Aires · Argentina"}</span><span>{project.area || project.status}</span><span>{project.role}</span></div></header>
      <div className="detail-hero"><Image src={assetPath(project.cover)} alt={project.title} fill priority sizes="100vw" /></div>
      <section className="project-story section-shell"><div><span className="eyebrow">Problema</span><p>{project.problem}</p></div><div><span className="eyebrow">Respuesta</span><p>{project.response}</p></div></section>
      <section className="project-flow section-shell">
        {project.images.slice(1).map((image, index) => <figure className={`${image.kind === "wide" ? "wide" : "technical"} flow-${index % 3}`} key={image.src}><div><Image src={assetPath(image.src)} alt={image.alt} fill sizes={image.kind === "wide" ? "100vw" : "60vw"}/></div>{image.caption && <figcaption>{image.caption}</figcaption>}</figure>)}
      </section>
      <nav className="detail-next section-shell"><Link href={`/proyectos/${projects[(projects.findIndex((item) => item.slug === project.slug) + 1) % projects.length].slug}`}>Siguiente proyecto <span>→</span></Link></nav>
    </main></>
  );
}
