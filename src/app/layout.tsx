import type { Metadata } from "next";
import localFont from "next/font/local";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

// Carga las fuentes locales
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadatos con favicon y Open Graph
export const metadata: Metadata = {
  title: "El Sabrasito",
  description: "Descripción de tu página web",
  icons: {
    icon: "/og-image.png",
  },
  openGraph: {
    type: "website",
    url: "https://www.elsabrasito.com",
    title: "El Sabrasito",
    description: "Somos una empresa peruana con más de 10 años de experiencia, con un sabor ya muy conocido por nuestros clientes.",
    images: [
      {
        url: "https://www.elsabrasito.com/og-image.png", // Asegúrate de usar la URL completa
        width: 1200,
        height: 630,
        alt: "Descripción de la imagen de previsualización",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Favicon */}
        <link rel="icon" href="/og-image.png" />

        {/* Meta etiquetas Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.elsabrasito.com" />
        <meta property="og:title" content="El Sabrasito" />
        <meta
          property="og:description"
          content="Somos una empresa peruana con más de 10 años de experiencia, con un sabor ya muy conocido por nuestros clientes."
        />
        <meta property="og:image" content="https://www.elsabrasito.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
