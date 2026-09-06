import type { Metadata } from "next";
import { ARTICLES } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";

export const metadata: Metadata = { title: "Yazarlar" };

export default function AuthorsPage() {
  const list = ARTICLES.filter((a) => a.categories.includes("yazarlar"));
  const authors = [...new Set(list.map((a) => a.author))];

  return (
    <div className="mx-auto max-w-7xl px-4 mt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-500">Ekibimiz</p>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-1">Yazarlar</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {authors.map((name) => (
          <span key={name} className="inline-flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-semibold">
            <span className="w-7 h-7 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xs font-black">{name.charAt(0)}</span>
            {name}
          </span>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
        {list.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
    </div>
  );
}
