import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import { APP_NAME } from "@/config/env";

// Configuración de la fuente global
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta name="description" content="A small, self-hosted bug tracker." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Aplicamos la tipografía e inyectamos la variable CSS */}
      <div className={`${inter.className} ${inter.variable} min-h-screen bg-surface-50 antialiased font-sans`}>
        <Navbar />
        <Component {...pageProps} />
      </div>
    </>
  );
}