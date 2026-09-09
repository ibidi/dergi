"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticle } from "@/data/articles";
import { API_URL, type ArticleDTO } from "@/lib/content";
import { errMsg } from "@/lib/admin-api";
import Newsletter from "@/components/Newsletter";

function OkuInner() {
  const sp = useSearchParams();
  const slug = sp.get("slug") ?? "";
  const staticArticle = slug ? (getArticle("", slug) ?? null) : null;

  const [remote, setRemote] = useState<ArticleDTO | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState<boolean>(() => Boolean(API_URL && slug && !staticArticle));

  useEffect(() => {
    if (!slug || staticArticle || !API_URL) return;
    let live = true;
    fetch(`${API_URL}/api/articles/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: unknown) => {
        if (!live) return;
        const article = (d as { article?: ArticleDTO } | null)?.article ?? null;
        setRemote(article);
        if (!article) setFailed(true);
      })
      .catch((e: unknown) => {
        if (!live) return;
        setFailed(true);
        console.error(errMsg(e));
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [slug, staticArticle]);

  if (!slug)
    return (
      <p className="mx-auto max-w-3xl px-4 mt-16 text-neutral-500">
        Okunacak yazı seçilmedi. <Link href="/" className="text-brand-600 font-bold">Ana sayfaya dön →</Link>
      </p>
    );
  if (loading) return <p className="mx-auto max-w-3xl px-4 mt-16">Yükleniyor…</p>;

  const article = staticArticle ?? remote;
  if (!article)
    return (
      <p className="mx-auto max-w-3xl px-4 mt-16 text-neutral-500">
        {failed ? "Yazı yüklenemedi." : "Yazı bulunamadı."}{" "}
        <Link href="/" className="text-brand-600 font-bold">Ana sayfaya dön →</Link>
      </p>
    );

  return (
    <article className="mx-auto max-w-4xl px-4 mt-8">
      <div className="flex flex-wrap gap-2">
        {article.categories.map((c) => (
          <Link key={c} href={`/${c}`} className="text-[11px] font-bold uppercase tracking-widest bg-brand-50 text-brand-600 rounded-full px-3 py-1">
            {c}
          </Link>
        ))}
      </div>
      <h1 className="mt-3 text-3xl md:text-5xl font-black leading-tight tracking-tight">{article.title}</h1>
      <p className="mt-3 text-lg text-neutral-600">{article.excerpt}</p>
      <p className="mt-4 text-sm text-neutral-500">{article.author} • {article.date} • {article.readTime} dk okuma</p>
      {article.image && (
        <div className="relative aspect-[16/9] mt-6 overflow-hidden rounded-3xl">
          <Image src={article.image} alt={article.title} fill className="object-cover" />
        </div>
      )}
      <div className="mt-8 space-y-5 text-[17px] leading-8 text-neutral-800">
        {article.content.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="mt-10">
        <Newsletter />
      </div>
    </article>
  );
}

export default function OkuPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-3xl px-4 mt-16">Yükleniyor…</p>}>
      <OkuInner />
    </Suspense>
  );
}
