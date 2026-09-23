import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { furniture, getFurniture } from "@/lib/content";

export function generateStaticParams() { return furniture.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const piece = getFurniture((await params).slug); return piece ? { title: piece.title, description: piece.description, openGraph: { images: [piece.cover] } } : {}; }

export default async function FurniturePage({ params }: { params: Promise<{ slug: string }> }) {
  const piece = getFurniture((await params).slug); if (!piece) notFound();
  const next = furniture[(furniture.findIndex((item) => item.slug === piece.slug) + 1) % furniture.length];
  return <><SiteHeader /><main className="furniture-detail"><section className="furniture-copy"><Link href="/#mobiliario">← Diseño</Link><div><h1>{piece.title}</h1><p className="furniture-type">Diseño&nbsp;&nbsp;|&nbsp;&nbsp;Mobiliario&nbsp;&nbsp;|&nbsp;&nbsp;Adrián Taberna</p></div><p className="furniture-description">{piece.description}</p><dl><div><dt>Materiales</dt><dd>{piece.materials}</dd></div><div><dt>Dimensiones</dt><dd>{piece.dimensions}</dd></div></dl><Link className="furniture-next" href={`/mobiliario/${next.slug}`}>Siguiente · {next.title} →</Link></section><section className="furniture-image"><Image src={piece.cover} alt={piece.title} fill priority sizes="(max-width: 800px) 100vw, 50vw" /></section></main></>;
}
