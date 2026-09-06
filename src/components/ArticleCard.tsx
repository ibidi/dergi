import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/data/articles";
import { categoryBySlug } from "@/data/articles";

function catName(slug: string) {
  return categoryBySlug(slug)?.name ?? slug;
}

export function primaryLink(a: Article) {
  return `/${a.categories[0]}/${a.slug}`;
}

export function ArticleCard({ article, size = "md" }: { article: Article; size?: "sm" | "md" | "lg" }) {
  const href = primaryLink(article);
  if (size === "lg") {
    return (
      <Link href={href} className="group relative block overflow-hidden rounded-2xl min-h-[420px] md:min-h-[520px]">
        <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition duration-700" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
        <div className="absolute bottom-0 p-6 md:p-10 max-w-2xl">
          <span className="inline-block bg-brand-500 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
            {catName(article.categories[0])}
          </span>
          <h2 className="text-white text-3xl md:text-5xl font-black leading-tight">{article.title}</h2>
          <p className="text-white/80 mt-3 line-clamp-2">{article.excerpt}</p>
          <p className="text-white/60 text-xs mt-3">{article.author} • {article.date} • {article.readTime} dk</p>
        </div>
      </Link>
    );
  }
  if (size === "sm") {
    return (
      <Link href={href} className="group flex gap-3">
        <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-xl">
          <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-500">{catName(article.categories[0])}</p>
          <h3 className="font-bold leading-snug line-clamp-2 text-[15px]">
            <span className="headline-underline">{article.title}</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-1">{article.date}</p>
        </div>
      </Link>
    );
  }
  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
      </div>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-brand-500">{catName(article.categories[0])}</p>
      <h3 className="mt-1 text-lg font-extrabold leading-snug">
        <span className="headline-underline">{article.title}</span>
      </h3>
      <p className="mt-1.5 text-sm text-neutral-600 line-clamp-2">{article.excerpt}</p>
      <p className="mt-2 text-xs text-neutral-400">{article.author} • {article.readTime} dk okuma</p>
    </Link>
  );
}
