import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PetCare Agenda",
  description: "Sistema de agendamento para banho e tosa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

