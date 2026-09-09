"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Menu, X } from "lucide-react";
import { fetchPublicContent } from "@/lib/content";

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
function XIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function TikTokIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}
function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const NAV = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/kunye", label: "Künye" },
  { href: "/eser-gonder", label: "Eser Gönder" },
  { href: "/oneriler", label: "Bu Ayki Önerilerimiz" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();
  // Ana sayfada hero slider'ın üstüne binen transparan dergi kapağı menüsü
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [nav, setNav] = useState(NAV);

  useEffect(() => {
    fetchPublicContent().then((d) => {
      if (d && d.settings.header_menu.length > 0) setNav(d.settings.header_menu);
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ana sayfada aşağı inince transparan header opak beyaza dönüşür (sticky hissi)
  const solid = !overlay || scrolled;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={
        overlay
          ? `fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${solid ? "bg-white/95 backdrop-blur border-b text-neutral-900 shadow-sm" : "text-white"}`
          : "sticky top-0 z-50 bg-white/95 backdrop-blur border-b text-neutral-900"
      }
    >
      {/* üst bar — sadece iç sayfalarda */}
      {!overlay && (
        <div className="hidden md:block bg-neutral-950 text-neutral-200 text-xs">
          <div className="mx-auto max-w-7xl px-4 h-9 flex items-center justify-between">
            <p className="tracking-wide">Bakmak yetmez. Görmek için irtibatta kal — Eylül 2026 sayısı yayında</p>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/irtibatdergi" target="_blank" rel="noreferrer" aria-label="Instagram — @irtibatdergi" className="hover:text-white"><InstagramIcon size={14} /></a>
              <a href="https://x.com/irtibatdergi" target="_blank" rel="noreferrer" aria-label="X — @irtibatdergi" className="hover:text-white"><XIcon size={14} /></a>
              <a href="https://www.tiktok.com/@irtibatdergi" target="_blank" rel="noreferrer" aria-label="TikTok — @irtibatdergi" className="hover:text-white"><TikTokIcon size={14} /></a>
              <a href="https://www.facebook.com/irtibatdergi" target="_blank" rel="noreferrer" aria-label="Facebook — irtibatdergi" className="hover:text-white"><FacebookIcon size={14} /></a>
              <Link href="/iletisim" className="ml-2 border-l border-white/20 pl-3 hover:text-white">İletişim</Link>
            </div>
          </div>
        </div>
      )}

      {/* logo + nav */}
      <div className="mx-auto max-w-7xl px-4 pt-5 pb-4 flex items-center gap-6">
        <Link href="/" className="flex items-baseline gap-2 leading-none select-none shrink-0">
          <span className="text-4xl font-black tracking-tight">İRTİBAT</span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.35em] opacity-70">Dergi</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 xl:gap-6 text-[12px] xl:text-[13px] font-semibold uppercase tracking-[0.14em]">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive(item.href)
                  ? "text-brand-500"
                  : !solid
                    ? "text-white/85 hover:text-white transition"
                    : "hover:text-brand-500 transition"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <form
            className={`hidden md:flex items-center gap-2 rounded-full px-3 py-2 w-44 focus-within:w-64 transition-all ${!solid ? "focus-within:bg-white/10" : "border focus-within:border-brand-500"}`}
            onSubmit={(e) => e.preventDefault()}
          >
            <Search size={18} className={!solid ? "text-white/80" : "text-neutral-400"} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara…"
              className={`w-full text-sm outline-none bg-transparent ${!solid ? "placeholder:text-white/50 text-white" : ""}`}
            />
          </form>
          <button className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menü">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* açılır menü — sadece mobil */}
      {open && (
        <nav
          className={`md:hidden border-t px-4 py-3 grid gap-1 ${
            !solid ? "bg-neutral-950/90 backdrop-blur border-white/10 text-white" : "bg-white"
          }`}
        >
          <form
            className={`flex md:hidden items-center gap-2 rounded-full px-3 py-2.5 mb-2 border ${!solid ? "border-white/15" : ""}`}
            onSubmit={(e) => e.preventDefault()}
          >
            <Search size={18} className={!solid ? "text-white/80" : "text-neutral-400"} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ara…"
              className={`w-full text-sm outline-none bg-transparent ${!solid ? "placeholder:text-white/50 text-white" : ""}`}
            />
          </form>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`py-2.5 border-b border-white/10 text-sm font-semibold uppercase tracking-wider ${isActive(item.href) ? "text-brand-500" : ""}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/iletisim"
            onClick={() => setOpen(false)}
            className="py-2.5 text-sm font-semibold uppercase tracking-wider text-neutral-500"
          >
            İletişim
          </Link>
        </nav>
      )}

    </header>
  );
}
