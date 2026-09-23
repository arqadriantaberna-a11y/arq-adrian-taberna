import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import SiteHeader from "@/components/SiteHeader";
import { furniture, projects } from "@/lib/content";
import { assetPath } from "@/lib/site-path";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <section className="manifesto section-shell">
          <span className="eyebrow">Práctica</span>
          <h2>Arquitectura, detalle <em>y producción.</em></h2>
          <div className="manifesto-copy"><p>Proyectos pensados desde el espacio hasta su materialización.</p><p>La experiencia en documentación, obra y mobiliario permite sostener una misma intención a través de distintas escalas.</p></div>
        </section>

        <section className="archive section-shell" id="arquitectura">
          <div className="section-heading"><span className="eyebrow">Arquitectura</span><h2>Proyectos seleccionados</h2></div>
          <div className="project-list">
            {projects.map((project, index) => (
              <Link className="project-card" href={`/proyectos/${project.slug}`} key={project.slug}>
                <div className="project-card-media"><Image src={assetPath(project.cover)} alt={project.title} fill sizes="(max-width: 760px) 100vw, 75vw" /></div>
                <div className="project-card-info"><span>{String(index + 1).padStart(2, "0")}</span><h3>{project.title}</h3><p>{project.category} · {project.status}</p></div>
              </Link>
            ))}
          </div>
        </section>

        <section className="design-archive" id="mobiliario">
          <div className="section-shell design-head"><span className="eyebrow">Diseño</span><h2>Mobiliario como una escala precisa de la arquitectura.</h2><p>Concepto, materialidad, documentación y coordinación de producción.</p></div>
          <div className="furniture-grid section-shell">
            {furniture.map((piece) => (
              <Link className="furniture-card" href={`/mobiliario/${piece.slug}`} key={piece.slug}>
                <div className="furniture-media"><Image src={assetPath(piece.cover)} alt={piece.title} fill sizes="(max-width: 700px) 100vw, 50vw" /></div>
                <h3>{piece.title}</h3><small>{piece.type}</small>
              </Link>
            ))}
          </div>
        </section>

        <section className="newsletter section-shell" id="newsletter">
          <span className="eyebrow">Newsletter</span>
          <div className="newsletter-grid"><h2>Ideas sobre cómo pensamos, dibujamos <em>y construimos.</em></h2><div><p>Notas breves sobre arquitectura, vivienda, mobiliario y las decisiones que convierten una idea en algo realizable.</p><form action="mailto:arq.adrian.taberna@gmail.com" method="post"><input aria-label="Correo electrónico" type="email" name="email" required placeholder="tu@email.com"/><button>Quiero suscribirme</button></form></div></div>
        </section>

        <section className="studio section-shell" id="estudio">
          <div className="portrait"><Image src={assetPath("/images/adrian-taberna-retrato.webp")} alt="Retrato de Adrián Taberna" fill sizes="(max-width: 760px) 100vw, 42vw" /></div>
          <div className="studio-copy"><span className="eyebrow">Estudio</span><h2>Mirada proyectual y capacidad de ejecución.</h2><p>Soy arquitecto y trabajo entre el diseño, la documentación y la producción. Mi experiencia en obra y mobiliario me permite tomar decisiones atendiendo tanto a la calidad espacial como a su resolución concreta.</p><ul><li>Buenos Aires · Argentina</li><li>Matrícula profesional 33.852</li><li>Arquitectura · Documentación · Mobiliario</li></ul></div>
        </section>
      </main>
      <footer id="contacto"><div className="section-shell"><span className="eyebrow">Contacto</span><h2>¿Tenés un proyecto <em>en mente?</em></h2><a href="mailto:arq.adrian.taberna@gmail.com">arq.adrian.taberna@gmail.com <span>↗</span></a><div className="footer-row"><span>Adrián Taberna · Arquitecto</span><span>Buenos Aires · Argentina</span></div></div></footer>
    </>
  );
}
