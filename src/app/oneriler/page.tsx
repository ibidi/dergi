import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { ARTICLES } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Bu Ayki Önerilerimiz",
  description:
    "İrtibat Dergisi editörlerinin bu ayki önerileri: okunacak yazılar, izlenecek videolar ve ayın seçkisi.",
};

function bySlug(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export default function OnerilerPage() {
  const picks = [
    bySlug("heyecanli-tutkulu-merakli-selin-aras"),
    bySlug("ruhun-ve-lezzetin-kesisim-noktasi"),
    bySlug("academic-chic"),
    bySlug("bodrumda-renklerin-hafiza-yolculugu"),
    bySlug("dogadan-ilham-alan-gastronomi"),
    bySlug("kapak-cekimi-kamera-arkasi"),
  ].filter((a): a is NonNullable<typeof a> => Boolean(a));

  const ayinOneCikani = picks[0];
  const digerleri = picks.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 mt-8 mb-16">
      <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.3em] text-brand-500">
        <Sparkles size={14} /> Editörün seçtikleri — Eylül 2026
      </p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          Bu Ayki Önerilerimiz
        </h1>
        <Link
          href="/eser-gonder"
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 text-white text-sm font-bold px-5 py-2.5 hover:bg-brand-600 transition"
        >
          Sen de yaz <ArrowRight size={15} />
        </Link>
      </div>
      <p className="text-neutral-600 mt-3 max-w-2xl">
        Bu ay mutfakta felsefe, Ege&apos;de renkler, tarladan tabağa lezzetler ve kamera arkası
        kahkahalar var. Editörlerimizin &ldquo;önce bunu oku&rdquo; dediği seçki:
      </p>

      {ayinOneCikani && (
        <div className="mt-8">
          <ArticleCard article={ayinOneCikani} size="lg" />
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {digerleri.map((a, i) => (
          <div key={a.slug} className="relative">
            <span className="absolute -top-3 -left-1 z-10 font-serif-display text-5xl font-black text-brand-500/20 select-none">
              {String(i + 2).padStart(2, "0")}
            </span>
            <ArticleCard article={a} />
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl bg-cream border p-8 text-center">
        <p className="font-serif-display text-2xl font-bold">Önerin mi var?</p>
        <p className="mt-1 text-sm text-neutral-600">
          Okuduğun, izlediğin, gezdiğin bir şeyi İrtibat okurlarıyla paylaşmak istersen eserini gönder.
        </p>
        <Link
          href="/eser-gonder"
          className="mt-4 inline-block rounded-full bg-brand-500 text-white text-sm font-bold px-6 py-2.5 hover:bg-brand-600 transition"
        >
          Eser Gönder
        </Link>
      </div>
    </div>
  );
}
