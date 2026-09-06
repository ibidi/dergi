"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Camera, Globe, AtSign, Clapperboard } from "lucide-react";

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
              <a href="#" aria-label="Instagram" className="hover:text-white"><Camera size={14} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-white"><Globe size={14} /></a>
              <a href="#" aria-label="Twitter" className="hover:text-white"><AtSign size={14} /></a>
              <a href="#" aria-label="Youtube" className="hover:text-white"><Clapperboard size={14} /></a>
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
          {NAV.map((item) => (
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
          {NAV.map((item) => (
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
