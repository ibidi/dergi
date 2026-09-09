// Admin paneli -> Worker API istemcisi (token localStorage'da tutulur).
import { API_URL, type ArticleDTO, type Category } from "./content";

export type AdminUser = { id: number; email: string; name: string; role: "admin" | "editor" };
export type MediaItem = { id: number; key: string; url: string; mime: string; size: number; created_at: string };
export type NewArticle = {
  slug?: string; title: string; excerpt: string; author: string; date: string;
  readTime: number; image: string; featured: boolean; status: "draft" | "published";
  categories: string[]; content: string[];
};
export type ArticlePatch = Partial<NewArticle>;

export function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

const KEY = "dergi_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}
export function setToken(t: string | null) {
  if (typeof window === "undefined") return;
  if (t) localStorage.setItem(KEY, t);
  else localStorage.removeItem(KEY);
}

async function req<T>(path: string, opts: RequestInit = {}, auth = true): Promise<T> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL tanımlı değil (.env.local'e bakın)");
  const headers: Record<string, string> = { ...(opts.headers as Record<string, string>) };
  if (!(opts.body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (auth) {
    const t = getToken();
    if (t) headers["Authorization"] = `Bearer ${t}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...opts, headers });
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new Error(data.error || `İstek başarısız (${res.status})`);
  return data as unknown as T;
}

export const adminApi = {
  seed: (p: { email: string; name: string; password: string }) =>
    req<{ ok: boolean }>("/api/auth/seed", { method: "POST", body: JSON.stringify(p) }, false),
  login: (email: string, password: string) =>
    req<{ token: string; user: AdminUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }, false),
  me: () => req<{ user: AdminUser }>("/api/auth/me"),
  users: () => req<{ users: AdminUser[] }>("/api/auth/users"),
  createUser: (p: { email: string; name: string; password: string; role: string }) =>
    req<{ ok: boolean }>("/api/auth/users", { method: "POST", body: JSON.stringify(p) }),
  deleteUser: (id: number) => req<{ ok: boolean }>(`/api/auth/users/${id}`, { method: "DELETE" }),

  categories: () => req<{ categories: Category[] }>("/api/categories"),
  createCategory: (p: { name: string; description?: string; slug?: string }) =>
    req<{ ok: boolean; slug: string }>("/api/categories", { method: "POST", body: JSON.stringify(p) }),
  updateCategory: (slug: string, p: { name?: string; description?: string; sort?: number }) =>
    req<{ ok: boolean }>(`/api/categories/${slug}`, { method: "PUT", body: JSON.stringify(p) }),
  deleteCategory: (slug: string) => req<{ ok: boolean }>(`/api/categories/${slug}`, { method: "DELETE" }),

  articles: (q = "") => req<{ articles: ArticleDTO[] }>(`/api/articles${q}`),
  getArticle: (slug: string) => req<{ article: ArticleDTO }>(`/api/articles/${slug}`),
  createArticle: (p: NewArticle) =>
    req<{ ok: boolean; slug: string }>("/api/articles", { method: "POST", body: JSON.stringify(p) }),
  updateArticle: (slug: string, p: ArticlePatch) =>
    req<{ ok: boolean; slug: string }>(`/api/articles/${slug}`, { method: "PUT", body: JSON.stringify(p) }),
  deleteArticle: (slug: string) => req<{ ok: boolean }>(`/api/articles/${slug}`, { method: "DELETE" }),

  slider: () => req<{ slider: ArticleDTO[] }>("/api/slider"),
  saveSlider: (slugs: string[]) =>
    req<{ ok: boolean }>("/api/slider", { method: "PUT", body: JSON.stringify({ slugs }) }),

  media: () => req<{ media: MediaItem[] }>("/api/media"),
  uploadMedia: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return req<{ ok: boolean; key: string; url: string }>("/api/media/upload", { method: "POST", body: fd });
  },
  deleteMedia: (id: number) => req<{ ok: boolean }>(`/api/media/${id}`, { method: "DELETE" }),
};
