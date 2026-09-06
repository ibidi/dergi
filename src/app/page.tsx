import Image from "next/image";
import Link from "next/link";
import { Play, Flame } from "lucide-react";
import { ARTICLES, articlesByCategory, trending, categoryBySlug } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";
import HeroSlider from "@/components/HeroSlider";
import SectionHeading from "@/components/SectionHeading";
import Newsletter from "@/components/Newsletter";

function bySlug(slug: string) {
  return ARTICLES.find((a) => a.slug === slug)!;
}

export default function Home() {
  const heroSlides = [
    bySlug("heyecanli-tutkulu-merakli-selin-aras"),
    bySlug("derya-aksoy"),
    bySlug("kaan-yildirim"),
  ];
  const interviews = articlesByCategory("roportajlar").filter((a) => !heroSlides.includes(a)).slice(0, 6);
  const fashion = articlesByCategory("moda").slice(0, 4);
  const invites = articlesByCategory("davetler").slice(0, 3);
  const videos = articlesByCategory("video");
  const covers = articlesByCategory("kapak-konusu").slice(0, 3);

  return (
    <>
      {/* HERO — tam ekran kapak slider */}
      <HeroSlider slides={heroSlides} />

      <div className="mx-auto max-w-7xl px-4">

      {/* Röportajlar */}
      <section className="mt-14">
        <SectionHeading title="Röportajlar" href="/roportajlar" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {interviews.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      {/* Davet + Moda bandı */}
      <section className="mt-14 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeading title="Davet • Moda" href="/davetler" />
          <div className="grid gap-6 sm:grid-cols-2">
            {[...invites, ...fashion.slice(0, 1)].map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
        <aside className="rounded-3xl bg-cream border p-6 h-fit lg:sticky lg:top-36">
          <h3 className="flex items-center gap-2 font-black text-lg"><Flame size={18} className="text-brand-500" /> Trend Olanlar</h3>
          <ol className="mt-4 space-y-4">
            {trending.map((a, i) => (
              <li key={a.slug} className="flex gap-3">
                <span className="font-serif-display text-3xl font-black text-neutral-300 w-8 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <Link href={`/${a.categories[0]}/${a.slug}`} className="group">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-brand-500">{categoryBySlug(a.categories[0])?.name}</p>
                  <p className="font-bold leading-snug text-[15px]"><span className="headline-underline">{a.title}</span></p>
                </Link>
              </li>
            ))}
          </ol>
        </aside>
      </section>

      {/* Video */}
      <section className="mt-14">
        <SectionHeading title="Video" href="/video" />
        <div className="grid gap-6 md:grid-cols-2">
          {videos.map((a) => (
            <Link key={a.slug} href={`/${a.categories[0]}/${a.slug}`} className="group relative block overflow-hidden rounded-2xl aspect-video">
              <Image src={a.image} alt={a.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
              <span className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition" />
              <span className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/95 flex items-center justify-center">
                <Play size={20} className="ml-0.5 text-brand-600" />
              </span>
              <span className="absolute bottom-0 p-5 text-white font-extrabold text-lg drop-shadow">{a.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Moda grid */}
      <section className="mt-14">
        <SectionHeading title="Moda" href="/moda" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {articlesByCategory("moda").slice(0, 4).map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      {/* Kapak konuları */}
      <section className="mt-14">
        <SectionHeading title="Kapak Konuları" href="/kapak-konusu" />
        <div className="grid gap-6 md:grid-cols-3">
          {covers.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>

      <div className="mt-14">
        <Newsletter />
      </div>
      </div>
    </>
  );
}
