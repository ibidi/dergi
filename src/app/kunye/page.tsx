import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Globe, MapPin, AtSign, BookOpen, Users, Printer } from "lucide-react";

export const metadata: Metadata = {
  title: "Künye",
  description:
    "İrtibat Dergisi künyesi: imtiyaz sahibi, yayın yönetmeni, editörler, yayın kurulu ve iletişim bilgileri.",
};

const ekip = [
  { gorev: "İmtiyaz Sahibi", isimler: ["Ahmet DEMİR"] },
  { gorev: "Genel Yayın Yönetmeni", isimler: ["Ahmet DEMİR"] },
  { gorev: "Editörler", isimler: ["Eylem Hacer DEMİRCİ"] },
  { gorev: "Yayın Koordinatörü", isimler: ["Sencer Selim PUSAT"] },
  { gorev: "Tasarım", isimler: ["Mehmet Demir"] },
  { gorev: "Görsel Sanat Yönetmeni", isimler: ["Ayşegül KIR"] },
];

const yayinKurulu = [
  "Ahmet DEMİR",
  "Eylem Hacer DEMİRCİ",
  "Osman GÖKÇELİ",
  "Halil Haluk DURKAN",
  "Mehmet Can SALT",
];

export default function KunyePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 mt-8 mb-16">
      {/* Üst başlık — dergi kapağı hissi */}
      <div className="text-center border-y-4 border-double border-neutral-950 py-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand-500">
          Süreli Yayın / Aylık
        </p>
        <h1 className="mt-2 text-5xl md:text-7xl font-black tracking-tighter leading-none">
          İRTİBAT
        </h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.5em] text-neutral-500">
          Dergisi &nbsp;•&nbsp; Künye
        </p>
      </div>

      {/* Ekip grid */}
      <section className="mt-10 grid gap-px overflow-hidden rounded-3xl border bg-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
        {ekip.map((k) => (
          <div key={k.gorev} className="bg-white p-6 text-center hover:bg-cream transition">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-500">
              {k.gorev}
            </p>
            {k.isimler.map((isim) => (
              <p key={isim} className="font-serif-display mt-2 text-xl font-bold tracking-tight">
                {isim}
              </p>
            ))}
          </div>
        ))}
      </section>

      {/* Yayın kurulu + yayın bilgileri */}
      <section className="mt-6 grid gap-6 md:grid-cols-5">
        <div className="rounded-3xl bg-neutral-950 text-white p-8 md:col-span-3">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-neutral-400">
            <Users size={16} /> Yayın Kurulu
          </h2>
          <ul className="mt-5 space-y-3">
            {yayinKurulu.map((isim, i) => (
              <li
                key={isim}
                className="flex items-baseline gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0"
              >
                <span className="font-serif-display text-sm font-black text-brand-100/60 w-7">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-serif-display text-lg font-bold">{isim}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl bg-cream border p-8 md:col-span-2">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-brand-600">
            <BookOpen size={16} /> Yayın Bilgileri
          </h2>
          <dl className="mt-5 space-y-4 text-[15px]">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                Yayın Türü
              </dt>
              <dd className="font-bold">Süreli Yayın / Aylık</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                Yayıncı
              </dt>
              <dd className="font-bold">İRTİBAT DERGİSİ</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
                Yönetim Yeri
              </dt>
              <dd className="font-bold">Afşin / KAHRAMANMARAŞ</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* İletişim şeridi */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <a
          href="mailto:irtibatdergi@gmail.com"
          className="group flex items-center gap-3 rounded-2xl border p-5 hover:border-brand-500 hover:bg-brand-50 transition"
        >
          <span className="w-10 h-10 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0 group-hover:bg-brand-500 transition">
            <Mail size={17} />
          </span>
          <span>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-neutral-500">
              E-posta
            </span>
            <span className="block text-sm font-bold break-all">irtibatdergi@gmail.com</span>
          </span>
        </a>
        <a
          href="https://www.irtibatdergi.com"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-3 rounded-2xl border p-5 hover:border-brand-500 hover:bg-brand-50 transition"
        >
          <span className="w-10 h-10 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0 group-hover:bg-brand-500 transition">
            <Globe size={17} />
          </span>
          <span>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-neutral-500">
              Web
            </span>
            <span className="block text-sm font-bold">www.irtibatdergi.com</span>
          </span>
        </a>
        <div className="flex items-center gap-3 rounded-2xl border p-5">
          <span className="w-10 h-10 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0">
            <MapPin size={17} />
          </span>
          <span>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-neutral-500">
              Yönetim Yeri
            </span>
            <span className="block text-sm font-bold">Afşin / KAHRAMANMARAŞ</span>
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border p-5">
          <span className="w-10 h-10 rounded-full bg-neutral-950 text-white flex items-center justify-center shrink-0">
            <AtSign size={17} />
          </span>
          <span>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-neutral-500">
              Sosyal Medya
            </span>
            <span className="block text-sm font-bold">@irtibatdergi</span>
          </span>
        </div>
      </section>

      {/* Telif */}
      <section className="mt-6 rounded-3xl border border-dashed p-8 text-center bg-white">
        <p className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-neutral-400">
          <Printer size={14} /> Telif Hakkı
        </p>
        <p className="font-serif-display mx-auto mt-3 max-w-2xl text-lg leading-relaxed italic text-neutral-700">
          “İrtibat Dergisi’nde yayımlanan yazı ve görsellerin tüm hakları saklıdır. Kaynak
          gösterilmeden alıntı yapılamaz. Yazıların sorumluluğu yazarlarına aittir.”
        </p>
        <p className="mt-4 text-xs text-neutral-400">© 2026 İrtibat Dergisi</p>
      </section>

      <div className="mt-8 flex justify-center gap-3 text-sm font-bold">
        <Link
          href="/hakkimizda"
          className="rounded-full border px-6 py-2.5 hover:border-brand-500 hover:text-brand-600 transition"
        >
          Hakkımızda
        </Link>
        <Link
          href="/iletisim"
          className="rounded-full bg-neutral-950 text-white px-6 py-2.5 hover:bg-brand-600 transition"
        >
          İletişim
        </Link>
      </div>
    </div>
  );
}
