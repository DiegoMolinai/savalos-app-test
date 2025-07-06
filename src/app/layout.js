import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { AuthProviderWrapper } from "@/components/layout/AuthProviderWrapper"; // Puedes colocarlo en donde prefieras

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Savalos SPA",
  description: "Sistema de visitas",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
