"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/data/articles";
import { categoryBySlug } from "@/data/articles";
import { primaryLink } from "./ArticleCard";

function labels(a: Article) {
  return a.categories
    .map((c) => categoryBySlug(c)?.name ?? c)
    .join(", ")
    .toLocaleUpperCase("tr-TR");
}

export default function HeroSlider({
  slides,
  interval = 6000,
}: {
  slides: Article[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [paused, slides.length, interval]);

  const active = slides[index];

  return (
    <section
      className="relative w-full h-[94vh] min-h-[580px] max-h-[1020px] overflow-hidden bg-neutral-950 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* slayt görselleri */}
      {slides.map((s, i) => (
        <div
          key={s.slug}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
          aria-hidden={i !== index}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            priority={i === 0}
            className={`object-cover saturate-[1.25] contrast-[1.08] ${i === index ? "scale-100" : "scale-105"} transition-transform duration-[6000ms]`}
          />
        </div>
      ))}
      {/* okunabilirlik gradyanları */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black/35 to-transparent hidden lg:block" />

      {/* içerik */}
      <div className="absolute inset-0">
        <div className="mx-auto max-w-7xl px-4 h-full flex flex-col justify-end pb-12 md:pb-16">
          <div className="flex items-end justify-between gap-10">
            {/* büyük başlık */}
            <Link key={active.slug} href={primaryLink(active)} className="group max-w-2xl">
              <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.25em] text-white/70">
                {labels(active)}
              </p>
              <h1 className="mt-3 text-4xl md:text-6xl font-black leading-[1.05] tracking-tight drop-shadow-lg">
                {active.title}
              </h1>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/85 group-hover:text-white">
                Haberi Oku <span aria-hidden>→</span>
              </span>
            </Link>

            {/* sağ kapak listesi */}
            <div className="hidden lg:flex flex-col gap-7 w-72 shrink-0 border-l border-white/25 pl-7">
              {slides.map((s, i) => {
                const isActive = i === index;
                return (
                  <button
                    key={s.slug}
                    onClick={() => setIndex(i)}
                    className="text-left group cursor-pointer"
                  >
                    <p
                      className={`text-[11px] font-bold uppercase tracking-[0.2em] ${isActive ? "text-white" : "text-white/50 group-hover:text-white/80"}`}
                    >
                      {labels(s)}
                    </p>
                    <p
                      className={`mt-1.5 text-lg leading-snug font-medium ${isActive ? "text-white" : "text-white/50 group-hover:text-white/80"}`}
                    >
                      {s.title}
                    </p>
                    {isActive && (
                      <span className="mt-2 block h-[2px] bg-white/25 overflow-hidden">
                        <span
                          key={`bar-${index}`}
                          className="block h-full bg-white animate-hero-progress"
                          style={{ animationDuration: `${interval}ms` }}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* mobil noktalar */}
          <div className="flex lg:hidden gap-2 mt-6">
            {slides.map((s, i) => (
              <button
                key={s.slug}
                aria-label={s.title}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-10 bg-white" : "w-4 bg-white/40"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
