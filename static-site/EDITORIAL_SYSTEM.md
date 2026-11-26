# Sistema editorial · Arq. Adrián Taberna

Versión 1.0 · noviembre de 2026

## Objetivo

Construir una experiencia editorial de arquitectura y diseño inspirada en **principios de organización** de estudios multidisciplinares como Norm Architects, sin reproducir su marca, sus imágenes ni su código. La identidad, los proyectos, los textos, los libros y las galerías son de Adrián Taberna.

## Una sola práctica, distintas escalas

- Arquitectura: cinco proyectos desarrollados como casos completos, con tipología, estado, autoría, decisión de proyecto, documentación y galería. Los años y las superficies solo se muestran cuando hay datos comprobados.
- Mobiliario: diseño técnico, proporcional y productivo. Las piezas visibles y los archivos previamente aprobados no se alteran.
- Objetos: conservar las piezas originales. No crear colecciones ficticias.
- CALIGO: publicación editorial independiente, con número actual destacado, números anteriores, lectura online y archivo completo.
- Newsletter: artículos publicados y suscripción separada de CALIGO.
- Contacto: formularios reales ya conectados a un backend privado.

## Grilla editorial y jerarquía

- Anchura útil máxima: 1500 px.
- Márgenes laterales fluidos: entre 19 y 70 px según el módulo y viewport.
- Grilla de selección: 12 columnas conceptuales y separación de 14 a 30 px.
- Ritmo de los cinco proyectos: protagonista de 12 columnas; díptico 6+6; cierre asimétrico 7+5. En móvil, todas las tarjetas pasan a 1 columna.
- El contenido de cada caso conserva **todas** las imágenes y sus proporciones intrínsecas. Los recortes se reservan a las miniaturas de selección.
- El orden de las imágenes y los subtítulos de los books aprobados se mantienen.

## Diseño

| Token | Valor |
|---|---|
| Papel | `#f0ece5` |
| Tinta | `#24211e` |
| Texto secundario | `#746c62` |
| Separadores | `#b8ada2` |
| Acento | `#98624d` |
| Serif editorial | Georgia / Times New Roman como alternativas instaladas |
| Sans de interfaz | Arial / Helvetica / sistema |
| Transiciones | curva `cubic-bezier(.22,.61,.36,1)` |
| Movimiento | apariciones suaves, hover fotográfico, respetando `prefers-reduced-motion` |

Los valores son una **adaptación original**; no se presentan como medidas CSS exactas de Norm Architects.

## Componentes principales

1. Barra de navegación original con búsqueda contextual nueva.
2. Portada secuencial original de proyectos.
3. Selección editorial de cinco proyectos.
4. Archivo extendido nativo desplegable: conserva los datos aprobados de las antiguas fichas.
5. Plantilla de caso arquitectónico: encabezado, hero, datos, decisión, índice fotográfico, material completo, anterior/siguiente.
6. Galería ampliada: lightbox de imagen completa, navegación por teclado y cierre con Escape.
7. Catálogo de mobiliario y objetos sin categorías inventadas.
8. Puente de investigación hacia CALIGO y Newsletter.
9. Formularios y suscripciones originales conectados al backend.
10. Pie editorial.

## Contenidos y modelos

`static-site/editorial-data.json` centraliza los datos verificables de cada proyecto, identidad visual y navegación. Se usa al generar las tarjetas editoriales y páginas individuales. No se inventan fecha, fabricante, m² ni fotografías. Cuando un dato aún no está validado, se omite.

La salida de GitHub Pages se construye con `scripts/build-editorial-system.mjs` al final del pipeline, después de compilar los proyectos originales, CALIGO y los formularios. **No altera ni reescribe los fragmentos originales con control SHA.**

## Funcionalidad y accesibilidad

- El buscador funciona con datos publicados y no requiere servidor.
- Los enlaces del archivo histórico siguen funcionando; al navegar por anclas se abre el archivo original.
- Lectura de figuras en orden y opción de visualizador a tamaño completo.
- Estados foco, textos alternativos y etiquetas legibles.
- Animaciones canceladas cuando la configuración del sistema solicita movimiento reducido.
- Cargas diferidas de imágenes secundarias, respetando la prioridad de las portadas.

## Estrategia para futuras ediciones

Para agregar un proyecto nuevo: incorporarlo a `editorial-data.json`, mantener una versión aprobada de su contenido, actualizar la selección y regenerar. Las ediciones de CALIGO continúan con su propio sistema editorial y lectores; no se integran físicamente en los documentos de los proyectos.

## Límites de la ingeniería inversa

Las decisiones de navegación, ritmo, plantilla y composición están informadas por la observación de la web pública Norm Architects. No se han reproducido CSS privado, parámetros de animación no medidos, lógica de backend ni tipografías de licencia. El sistema es una adaptación técnica y visual original.
