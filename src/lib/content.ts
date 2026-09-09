// Site -> Worker API okuma katmanı.
// API yoksa / erişilemiyorsa statik fallback (src/data/articles.ts) kullanılır,
// böylece site her durumda açılır.

import { ARTICLES, CATEGORIES, type Article, type Category } from "@/data/articles";

export type { Article, Category };

/** API'den gelen yazı: statik Article + yayın durumu */
export type ArticleDTO = Article & { status: "draft" | "published" };

export type PublicContent = {
  categories: Category[];
  articles: ArticleDTO[];
  slider: ArticleDTO[];
};

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export function staticContent(): PublicContent {
  const featured: ArticleDTO[] = ARTICLES.filter((a) => a.featured).map((a) => ({ ...a, status: "published" as const }));
  const all: ArticleDTO[] = ARTICLES.map((a) => ({ ...a, status: "published" as const }));
  return {
    categories: CATEGORIES,
    articles: all,
    slider: featured.length >= 3 ? featured.slice(0, 5) : all.slice(0, 3),
  };
}

export async function fetchPublicContent(): Promise<PublicContent | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}/api/public/content`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as PublicContent;
    if (!Array.isArray(data.articles)) return null;
    // slider boşsa featured'lardan türet
    if (!Array.isArray(data.slider) || data.slider.length === 0) {
      const f = data.articles.filter((a) => a.featured);
      data.slider = (f.length >= 3 ? f : data.articles).slice(0, 5);
    }
    return data;
  } catch {
    return null;
  }
}
