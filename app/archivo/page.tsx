import type { Metadata } from "next";
import ArchiveClient from "@/components/ArchiveClient";

export const metadata: Metadata = {
  title: "Archivo",
  description: "Proyectos de arquitectura, mobiliario y artículos de Adrián Taberna.",
};

export default function ArchivePage() {
  return <ArchiveClient />;
}
