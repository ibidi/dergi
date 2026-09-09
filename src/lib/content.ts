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
  settings: SiteSettings;
};

export type MenuLink = { label: string; href: string };
export type Contact = { address: string; site: string; email: string };
export type SliderConfig = { interval: number; max: number };
export type SiteSettings = {
  header_menu: MenuLink[];
  footer_menu: MenuLink[];
  contact: Contact;
  socials: MenuLink[];
  slider_config: SliderConfig;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  header_menu: [
    { label: "Ana Sayfa", href: "/" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Künye", href: "/kunye" },
    { label: "Eser Gönder", href: "/eser-gonder" },
    { label: "Bu Ayki Önerilerimiz", href: "/oneriler" },
  ],
  footer_menu: [
    { label: "Ana Sayfa", href: "/" },
    { label: "Hakkımızda", href: "/hakkimizda" },
    { label: "Künye", href: "/kunye" },
    { label: "Eser Gönder", href: "/eser-gonder" },
    { label: "Bu Ayki Önerilerimiz", href: "/oneriler" },
    { label: "İletişim", href: "/iletisim" },
  ],
  contact: { address: "Afşin / KAHRAMANMARAŞ", site: "www.irtibatdergi.com", email: "irtibatdergi@gmail.com" },
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/irtibatdergi" },
    { label: "X", href: "https://x.com/irtibatdergi" },
    { label: "TikTok", href: "https://www.tiktok.com/@irtibatdergi" },
    { label: "Facebook", href: "https://www.facebook.com/irtibatdergi" },
  ],
  slider_config: { interval: 6000, max: 5 },
};

function normalizeSettings(raw: unknown): SiteSettings {
  const s = (raw ?? {}) as Partial<Record<keyof SiteSettings, unknown>>;
  const links = (v: unknown, fb: MenuLink[]): MenuLink[] =>
    Array.isArray(v) && v.length > 0
      ? (v as MenuLink[]).filter((x) => x && typeof x.label === "string" && typeof x.href === "string")
      : fb;
  const contact = (s.contact ?? {}) as Partial<Contact>;
  const cfg = (s.slider_config ?? {}) as Partial<SliderConfig>;
  return {
    header_menu: links(s.header_menu, DEFAULT_SETTINGS.header_menu),
    footer_menu: links(s.footer_menu, DEFAULT_SETTINGS.footer_menu),
    contact: {
      address: typeof contact.address === "string" ? contact.address : DEFAULT_SETTINGS.contact.address,
      site: typeof contact.site === "string" ? contact.site : DEFAULT_SETTINGS.contact.site,
      email: typeof contact.email === "string" ? contact.email : DEFAULT_SETTINGS.contact.email,
    },
    socials: links(s.socials, DEFAULT_SETTINGS.socials),
    slider_config: {
      interval: typeof cfg.interval === "number" && cfg.interval >= 2000 ? cfg.interval : 6000,
      max: typeof cfg.max === "number" && cfg.max >= 1 && cfg.max <= 10 ? Math.floor(cfg.max) : 5,
    },
  };
}

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://dergi-api.ihsanbakidogann.workers.dev"
).replace(/\/$/, "");

export function staticContent(): PublicContent {
  const featured: ArticleDTO[] = ARTICLES.filter((a) => a.featured).map((a) => ({ ...a, status: "published" as const }));
  const all: ArticleDTO[] = ARTICLES.map((a) => ({ ...a, status: "published" as const }));
  return {
    categories: CATEGORIES,
    articles: all,
    slider: featured.length >= 3 ? featured.slice(0, 5) : all.slice(0, 3),
    settings: DEFAULT_SETTINGS,
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
    data.settings = normalizeSettings((data as { settings?: unknown }).settings);
    return data;
  } catch {
    return null;
  }
}
