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
          <div className="manifesto-grid">
            <span className="eyebrow">Enfoque</span>
            <div>
              <h2>Una idea no termina en la imagen. <em>Empieza a comprobarse en el detalle.</em></h2>
              <div className="manifesto-copy">
                <p className="large">Arquitectura y precisión técnica como partes de un mismo proceso.</p>
                <p>Cada proyecto se desarrolla atendiendo al uso, la luz, la materialidad y la ejecución. Diseñar con sensibilidad sin perder de vista cómo se construye.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="archive section-shell" id="arquitectura">
          <div className="archive-head">
            <span className="eyebrow">Archivo seleccionado</span>
            <h2>Arquitectura</h2>
            <p>Proyectos residenciales, colectivos y de salud. Cada ficha reúne concepto, información técnica y proceso.</p>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <Link className="project-card" href={`/proyectos/${project.slug}`} key={project.slug}>
                <div className="project-card-media"><Image src={assetPath(project.cover)} alt={project.title} fill sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw" /></div>
                <div className="project-card-info">
                  <h3>{project.title}</h3>
                  <p>{project.category} · {project.status}</p>
                  <span>{project.statement}</span>
                  <small>{project.location ?? project.area ?? project.role}</small>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <aside className="mid-cta">
          <div className="section-shell mid-cta-inner">
            <div><span className="eyebrow">Nuevos proyectos</span><h2>¿Tenés una idea, un espacio o una pieza para desarrollar?</h2></div>
            <a href="#contacto">Conversemos <span>→</span></a>
          </div>
        </aside>

        <section className="design-archive section-shell" id="mobiliario">
          <div className="design-archive-head">
            <div><span className="eyebrow">Archivo de diseño</span><h2>Mobiliario</h2></div>
            <p>Piezas y sistemas desarrollados desde la proporción y el uso hasta la documentación necesaria para producirlos.</p>
          </div>
          <div className="design-categories"><span>Guardado</span><span>Mesas</span><span>Dormitorio</span><span>Escritorios</span><span>Sistemas integrados</span></div>
          <div className="furniture-grid">
            {furniture.map((piece) => (
              <Link className="furniture-card" href={`/mobiliario/${piece.slug}`} key={piece.slug}>
                <div className="furniture-media"><Image src={assetPath(piece.cover)} alt={piece.title} fill sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw" /></div>
                <h3>{piece.title}</h3><small>{piece.type}</small>
              </Link>
            ))}
          </div>
        </section>

        <section className="newsletter" id="newsletter">
          <div className="section-shell">
            <div className="newsletter-head"><span className="eyebrow">Newsletter</span><h2>Ideas sobre cómo pensamos, dibujamos <em>y construimos.</em></h2></div>
            <div className="newsletter-intro"><p>Notas breves sobre arquitectura, vivienda, mobiliario y las decisiones que convierten una idea en algo realizable.</p><p>Un registro de procesos, referencias, detalles y aprendizajes de obra y taller.</p></div>
            <div className="note-grid">
              <article><small>01 · Diseño de mobiliario</small><div><h3>Imaginar el uso antes de dibujar el objeto</h3><p>Observar gestos cotidianos para definir proporción, ergonomía y carácter.</p></div></article>
              <article><small>02 · Documentación</small><div><h3>El detalle no aparece al final del proyecto</h3><p>Dibujar para fabricar también transforma y mejora la idea inicial.</p></div></article>
              <article><small>03 · Arquitectura</small><div><h3>Umbrales que construyen comunidad</h3><p>El espacio entre la calle y la vivienda puede cambiar cómo habitamos juntos.</p></div></article>
            </div>
            <div className="subscribe"><div><span className="eyebrow">Recibir nuevas entregas</span><h3>Una lectura breve, directamente en tu correo.</h3></div><form action="mailto:arq.adrian.taberna@gmail.com" method="post"><input aria-label="Correo electrónico" type="email" name="email" required placeholder="tu@email.com"/><button>Quiero suscribirme →</button></form></div>
          </div>
        </section>

        <section className="credibility"><div className="section-shell credibility-grid"><p><small>Registro profesional</small>Matrícula 33.852</p><p><small>Experiencia</small>Proyecto · Obra · Producción</p><p><small>Base</small>Buenos Aires · Argentina</p></div></section>

        <section className="studio section-shell" id="estudio">
          <div className="portrait"><Image src={assetPath("/images/adrian-taberna-retrato.webp")} alt="Retrato de Adrián Taberna" fill sizes="(max-width: 760px) 100vw, 42vw" /></div>
          <div className="studio-copy"><span className="eyebrow">Perfil</span><h2>Mirada proyectual y capacidad de ejecución.</h2><p>Soy arquitecto y trabajo entre el diseño, la documentación y la producción. Mi experiencia en obra y mobiliario me permite tomar decisiones atendiendo tanto a la calidad espacial como a su resolución concreta.</p><ul><li>Buenos Aires · Argentina</li><li>Matrícula profesional 33.852</li><li>AutoCAD · Revit · SketchUp</li><li>V-Ray · Photoshop · Excel</li></ul></div>
        </section>
      </main>

      <footer id="contacto"><div className="section-shell"><div className="contact-grid"><div><span className="eyebrow">Contacto</span><h2>Conversemos <em>sobre tu proyecto.</em></h2></div><div className="contact-links"><a href="mailto:arq.adrian.taberna@gmail.com">Enviar un correo <span>↗</span></a><a href="https://www.linkedin.com/in/adrian-taberna-/" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a><a href="#inicio">Volver arriba <span>↑</span></a></div></div><div className="footer-row"><span>Adrián Taberna · Arquitecto</span><span>Buenos Aires · Argentina</span></div></div></footer>
    </>
  );
}
