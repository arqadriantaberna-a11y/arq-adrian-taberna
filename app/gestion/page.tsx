import type { Metadata } from "next";
import GestionClient from "@/components/GestionClient";

export const metadata: Metadata = {
  title: "Gestión privada",
  description: "Área privada de administración.",
  robots: { index: false, follow: false, nocache: true },
};

export default function GestionPage() {
  return <GestionClient />;
}
