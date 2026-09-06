import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "İrtibat Dergi | Özgün İçerikli Pozitif Yaşam Rehberi",
    template: "%s | İrtibat Dergi",
  },
  description:
    "Röportaj, moda, sanat, davet, gastronomi ve yaşam tarzı: ayın kapak konusu, trendler ve özel çekimler.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
