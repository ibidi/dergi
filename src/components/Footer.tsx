import Link from "next/link";
import { Camera, Globe, AtSign, Clapperboard, MapPin, Phone, Mail } from "lucide-react";
import { CATEGORIES } from "@/data/articles";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-300 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <p className="text-3xl font-black text-white tracking-tighter">İRTİBAT <span className="text-sm font-semibold tracking-[0.35em] text-neutral-400">DERGİ</span></p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Moda, sanat, röportaj ve cemiyet hayatının nabzını tutan aylık yaşam rehberi.
          </p>
          <div className="mt-4 flex gap-3">
            {[Camera, Globe, AtSign, Clapperboard].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-brand-500 hover:border-brand-500 hover:text-white transition">
                <Icon size={16} />
              </a>
            ))}
          </div>
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
            <li className="flex gap-2"><Phone size={16} className="shrink-0 mt-0.5" /> www.irtibatdergi.com</li>
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
