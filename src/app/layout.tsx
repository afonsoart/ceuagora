import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Céu Agora - Previsão do Tempo em Tempo Real",
  description: "Aplicativo de clima com previsão do tempo em tempo real. Descubra a temperatura, umidade, velocidade do vento e muito mais para qualquer cidade do mundo.",
  keywords: ["clima", "tempo", "previsão", "weather", "temperatura", "meteorologia"],
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "SkyNow - Previsão do Tempo",
    description: "Consulte a previsão do tempo em tempo real para qualquer cidade",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
