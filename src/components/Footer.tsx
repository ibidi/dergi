"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Globe, Mail } from "lucide-react";
import { CATEGORIES } from "@/data/articles";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}
function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/irtibatdergi", Icon: InstagramIcon },
  { label: "X", href: "https://x.com/irtibatdergi", Icon: XIcon },
  { label: "TikTok", href: "https://www.tiktok.com/@irtibatdergi", Icon: TikTokIcon },
  { label: "Facebook", href: "https://www.facebook.com/irtibatdergi", Icon: FacebookIcon },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <footer className="bg-neutral-950 text-neutral-300 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <p className="text-3xl font-black text-white tracking-tighter">İRTİBAT <span className="text-sm font-semibold tracking-[0.35em] text-neutral-400">DERGİ</span></p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Moda, sanat, röportaj ve cemiyet hayatının nabzını tutan aylık yaşam rehberi.
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={`${label} — @irtibatdergi`} className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 hover:text-white transition">
                <Icon size={16} />
              </a>
            ))}
          </div>
          <p className="mt-3 text-xs text-neutral-500">@irtibatdergi</p>
        </div>
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-4">Kategoriler</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {CATEGORIES.slice(0, 10).map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-4">Kurumsal</h4>
          <ul className="space-y-2 text-sm">
            {["Ana Sayfa|/", "Hakkımızda|/hakkimizda", "Künye|/kunye", "Eser Gönder|/eser-gonder", "Bu Ayki Önerilerimiz|/oneriler", "İletişim|/iletisim"].map((x) => {
              const [label, href] = x.split("|");
              return <li key={label}><Link href={href} className="hover:text-white">{label}</Link></li>;
            })}
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-4">İletişim</h4>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li className="flex gap-2"><MapPin size={16} className="shrink-0 mt-0.5" /> Afşin / KAHRAMANMARAŞ</li>
            <li className="flex gap-2"><Globe size={16} className="shrink-0 mt-0.5" /> www.irtibatdergi.com</li>
            <li className="flex gap-2"><Mail size={16} className="shrink-0 mt-0.5" /> irtibatdergi@gmail.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-neutral-500 flex flex-col sm:flex-row gap-2 justify-between">
          <span>© 2026 İrtibat Dergi. Tüm hakları saklıdır.</span>
          <span>Özgün içerikli pozitif yaşam rehberi.</span>
        </div>
      </div>
    </footer>
  );
}
