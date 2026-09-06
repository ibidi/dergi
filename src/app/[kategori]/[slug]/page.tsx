import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ARTICLES, getArticle, categoryBySlug, articlesByCategory } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";
import Newsletter from "@/components/Newsletter";

export function generateStaticParams() {
  return ARTICLES.flatMap((a) => a.categories.map((kategori) => ({ kategori, slug: a.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ kategori: string; slug: string }> }): Promise<Metadata> {
  const { kategori, slug } = await params;
  const a = getArticle(kategori, slug);
  if (!a) return { title: "Bulunamadı" };
  return { title: a.title, description: a.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ kategori: string; slug: string }> }) {
  const { kategori, slug } = await params;
  const article = getArticle(kategori, slug);
  if (!article) notFound();

  const related = articlesByCategory(article.categories[0]).filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-4 mt-8">
      <div className="flex flex-wrap gap-2">
        {article.categories.map((c) => (
          <Link key={c} href={`/${c}`} className="text-[11px] font-bold uppercase tracking-widest bg-brand-50 text-brand-600 rounded-full px-3 py-1">
            {categoryBySlug(c)?.name ?? c}
          </Link>
        ))}
      </div>
      <h1 className="mt-3 text-3xl md:text-5xl font-black leading-tight tracking-tight">{article.title}</h1>
      <p className="mt-3 text-lg text-neutral-600">{article.excerpt}</p>
      <p className="mt-4 text-sm text-neutral-500">{article.author} • {article.date} • {article.readTime} dk okuma</p>

      <div className="relative aspect-[16/9] mt-6 overflow-hidden rounded-3xl">
        <Image src={article.image} alt={article.title} fill className="object-cover" priority />
      </div>

      <div className="mt-8 space-y-5 text-[17px] leading-8 text-neutral-800">
        {article.content.map((p, i) => (
          <p key={i} className={i === 0 ? "font-serif-display text-xl leading-9" : undefined}>{p}</p>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-4 border-y py-5">
        <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center font-black">
          {article.author.charAt(0)}
        </div>
        <div>
          <p className="font-bold">{article.author}</p>
          <p className="text-sm text-neutral-500">İrtibat Yazarı</p>
        </div>
        <Link href="/yazarlar" className="ml-auto text-sm font-bold text-brand-600">Tüm yazarlar →</Link>
      </div>

      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-black mb-5">İlgili Haberler</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <Newsletter />
      </div>
    </article>
  );
}
