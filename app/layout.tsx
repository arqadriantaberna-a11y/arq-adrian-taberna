import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://arqadriantaberna-a11y.github.io/arq-adrian-taberna/"),
  title: { default: "Adrián Taberna · Arquitecto", template: "%s · Adrián Taberna" },
  description: "Arquitectura, documentación técnica y diseño de mobiliario en Buenos Aires.",
  openGraph: {
    title: "Adrián Taberna · Arquitecto",
    description: "Arquitectura, detalle y producción.",
    type: "website",
    locale: "es_AR",
    images: [{ url: "/images/hero-casa-patio.webp", width: 1536, height: 976 }]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
