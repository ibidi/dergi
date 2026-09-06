import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CATEGORIES, articlesByCategory } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ kategori: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ kategori: string }> }): Promise<Metadata> {
  const { kategori } = await params;
  const cat = CATEGORIES.find((c) => c.slug === kategori);
  return { title: cat ? `${cat.name} Haberleri` : "Kategori" };
}

export default async function CategoryPage({ params }: { params: Promise<{ kategori: string }> }) {
  const { kategori } = await params;
  const cat = CATEGORIES.find((c) => c.slug === kategori);
  if (!cat) notFound();
  const list = articlesByCategory(kategori);
  const [first, ...rest] = list;

  return (
    <div className="mx-auto max-w-7xl px-4 mt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-500">Kategori</p>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-1">{cat.name}</h1>
      <p className="text-neutral-600 mt-2 max-w-2xl">{cat.description}</p>

      {first && (
        <div className="mt-8">
          <ArticleCard article={first} size="lg" />
        </div>
      )}

      {rest.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          {rest.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      ) : (
        !first && <p className="mt-8 text-neutral-500">Bu kategoride henüz içerik yok.</p>
      )}
    </div>
  );
}
