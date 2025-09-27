import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono, Orbitron, Comic_Neue } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { IocProvider } from "@/contexts/IocContext";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "JAL Virtual Event Booking Portal",
  description: "Japan Airlines Virtual Event Booking Portal - Premium Aviation Events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} ${orbitron.variable} ${comicNeue.variable} antialiased`}
      >
        <ThemeProvider>
          <IocProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </IocProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
