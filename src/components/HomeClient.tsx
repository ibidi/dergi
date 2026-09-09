"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Flame } from "lucide-react";
import { ARTICLES, articlesByCategory, trending, categoryBySlug, type Article } from "@/data/articles";
import { fetchPublicContent, type PublicContent } from "@/lib/content";
import { ArticleCard } from "@/components/ArticleCard";
import HeroSlider from "@/components/HeroSlider";
import SectionHeading from "@/components/SectionHeading";
import Newsletter from "@/components/Newsletter";

function bySlug<T extends Article>(list: T[], slug: string): T | undefined {
  return list.find((a) => a.slug === slug);
}

export default function HomeClient() {
  const [remote, setRemote] = useState<PublicContent | null>(null);

  useEffect(() => {
    fetchPublicContent().then((d) => {
      if (d && d.articles.length > 0) setRemote(d);
    });
  }, []);

  const data = useMemo(() => {
    if (!remote) return null;
    const list = remote.articles;
    const inCat = (slug: string) => list.filter((a) => a.categories.includes(slug));
    const hero =
      remote.slider.length >= 3
        ? remote.slider.slice(0, 5)
        : [
            bySlug(list, "heyecanli-tutkulu-merakli-selin-aras"),
            bySlug(list, "derya-aksoy"),
            bySlug(list, "kaan-yildirim"),
          ].filter((x): x is (typeof list)[number] => Boolean(x));
    return {
      hero: hero.length ? hero : list.slice(0, 3),
      interviews: inCat("roportajlar").filter((a) => !hero.includes(a)).slice(0, 6),
      fashion: inCat("moda").slice(0, 4),
      invites: inCat("davetler").slice(0, 3),
      videos: inCat("video"),
      covers: inCat("kapak-konusu").slice(0, 3),
        trending: list.slice(0, 7),
      catName: (s: string) => remote.categories.find((c) => c.slug === s)?.name ?? categoryBySlug(s)?.name ?? s,
    };
  }, [remote]);

  // remote yoksa statik derleme içeriği
  if (!data) {
    const heroSlides = [
      ARTICLES.find((a) => a.slug === "heyecanli-tutkulu-merakli-selin-aras")!,
      ARTICLES.find((a) => a.slug === "derya-aksoy")!,
      ARTICLES.find((a) => a.slug === "kaan-yildirim")!,
    ];
    const interviews = articlesByCategory("roportajlar").filter((a) => !heroSlides.includes(a)).slice(0, 6);
    const fashion = articlesByCategory("moda").slice(0, 4);
    const invites = articlesByCategory("davetler").slice(0, 3);
    const videos = articlesByCategory("video");
    const covers = articlesByCategory("kapak-konusu").slice(0, 3);
    return (
      <HomeView
        hero={heroSlides}
        interviews={interviews}
        fashion={fashion}
        invites={invites}
        videos={videos}
        covers={covers}
        trendingList={trending}
        catName={(s: string) => categoryBySlug(s)?.name ?? s}
      />
    );
  }

  return (
    <HomeView
      hero={data.hero}
      interviews={data.interviews}
      fashion={data.fashion}
      invites={data.invites}
      videos={data.videos}
      covers={data.covers}
      trendingList={data.trending}
      catName={data.catName}
    />
  );
}

type HomeViewProps = {
  hero: Article[];
  interviews: Article[];
  fashion: Article[];
  invites: Article[];
  videos: Article[];
  covers: Article[];
  trendingList: Article[];
  catName: (s: string) => string;
};

function HomeView({ hero, interviews, fashion, invites, videos, covers, trendingList, catName }: HomeViewProps) {
  return (
    <>
      <HeroSlider slides={hero} />
      <div className="mx-auto max-w-7xl px-4">
        <section className="mt-14">
          <SectionHeading title="Röportajlar" href="/roportajlar" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {interviews.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>

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
            <h3 className="flex items-center gap-2 font-black text-lg">
              <Flame size={18} className="text-brand-500" /> Trend Olanlar
            </h3>
            <ol className="mt-4 space-y-4">
              {trendingList.map((a, i) => (
                <li key={a.slug} className="flex gap-3">
                  <span className="font-serif-display text-3xl font-black text-neutral-300 w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link href={`/${a.categories[0]}/${a.slug}`} className="group">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-brand-500">{catName(a.categories[0])}</p>
                    <p className="font-bold leading-snug text-[15px]">
                      <span className="headline-underline">{a.title}</span>
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </section>

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

        <section className="mt-14">
          <SectionHeading title="Moda" href="/moda" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fashion.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>

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
