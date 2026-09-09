import { Hono, type Context } from "hono";

type Role = "admin" | "editor";

type Env = {
  DB: D1Database;
  R2?: R2Bucket;
  JWT_SECRET: string;
  R2_PUBLIC_URL?: string;
  ALLOWED_ORIGINS?: string;
  JWT_EXPIRES_HOURS?: string;
};

type JwtPayload = { sub: number; email: string; role: Role; exp: number };
type CtxVar = { user: JwtPayload };
type AppCtx = Context<{ Bindings: Env; Variables: CtxVar }>;

const app = new Hono<{ Bindings: Env; Variables: CtxVar }>();

/* ---------- CORS ---------- */
app.use("*", async (c, next) => {
  const allowed = (c.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const origin = c.req.header("Origin") ?? "";
  const allowOrigin =
    allowed.length === 0
      ? "*"
      : allowed.includes(origin)
        ? origin
        : allowed[0];

  if (c.req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }
  await next();
  c.header("Access-Control-Allow-Origin", allowOrigin);
  c.header("Vary", "Origin");
});

/* ---------- helpers ---------- */
const te = new TextEncoder();

function b64urlEncode(data: ArrayBuffer | Uint8Array | string): string {
  const bytes =
    typeof data === "string" ? te.encode(data) : data instanceof ArrayBuffer ? new Uint8Array(data) : data;
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(s: string): Uint8Array {
  const b = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b + "=".repeat((4 - (b.length % 4)) % 4));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function signJwt(payload: Omit<JwtPayload, "exp">, secret: string, hours: number): Promise<string> {
  const header = b64urlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = b64urlEncode(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + hours * 3600 }));
  const key = await crypto.subtle.importKey("raw", te.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, te.encode(`${header}.${body}`));
  return `${header}.${body}.${b64urlEncode(sig)}`;
}

async function verifyJwt(token: string, secret: string): Promise<JwtPayload | null> {
  try {
    const [h, b, s] = token.split(".");
    if (!h || !b || !s) return null;
    const key = await crypto.subtle.importKey("raw", te.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("HMAC", key, b64urlDecode(s), te.encode(`${h}.${b}`));
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(b))) as JwtPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function randomSalt(): string {
  return b64urlEncode(crypto.getRandomValues(new Uint8Array(16)));
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", te.encode(salt + ":" + password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt: te.encode(salt), iterations: 100_000 },
    key,
    256
  );
  return b64urlEncode(bits);
}

export function slugify(s: string): string {
  return s
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ç/g, "c")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || `yazi-${Date.now()}`;
}

async function requireAuth(c: AppCtx, roles?: Role[]): Promise<Response | null> {
  const header = c.req.header("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return c.json({ error: "Giriş gerekli" }, 401);
  const payload = await verifyJwt(token, c.env.JWT_SECRET);
  if (!payload) return c.json({ error: "Oturum geçersiz" }, 401);
  if (roles && !roles.includes(payload.role)) return c.json({ error: "Yetkisiz" }, 403);
  c.set("user", payload);
  return null;
}

/* ---------- article mapping ---------- */
type ArticleRow = {
  id: number; slug: string; title: string; excerpt: string; author: string;
  date: string; read_time: number; image: string; featured: number; status: string; content: string;
};

type UserRow = {
  id: number; email: string; name: string; password_hash: string; salt: string; role: Role;
};

type MediaRow = {
  id: number; key: string; url: string; mime: string; size: number; uploaded_by: number | null; created_at: string;
};

async function categoriesOf(db: D1Database, articleId: number): Promise<string[]> {
  const r = await db.prepare("SELECT category_slug FROM article_categories WHERE article_id = ?").bind(articleId).all<{ category_slug: string }>();
  return r.results.map((x) => x.category_slug);
}

async function articleJson(db: D1Database, row: ArticleRow) {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    categories: await categoriesOf(db, row.id),
    author: row.author,
    date: row.date,
    readTime: row.read_time,
    image: row.image,
    featured: row.featured === 1,
    status: row.status,
    content: JSON.parse(row.content || "[]") as string[],
  };
}

/* ---------- health ---------- */
app.get("/api/health", (c) => c.json({ ok: true, time: new Date().toISOString() }));

/* ---------- auth ---------- */
// İlk kurulum: users tablosu boşken ilk admini oluşturur. Sonra 403 verir.
app.post("/api/auth/seed", async (c) => {
  const { email, name, password } = await c.req.json().catch(() => ({}));
  if (!email || !password) return c.json({ error: "email ve password gerekli" }, 400);
  const count = await c.env.DB.prepare("SELECT COUNT(*) AS n FROM users").first<{ n: number }>();
  if ((count?.n ?? 0) > 0) return c.json({ error: "Sistemde zaten kullanıcı var" }, 403);
  const salt = randomSalt();
  const hash = await hashPassword(String(password), salt);
  await c.env.DB.prepare("INSERT INTO users (email, name, password_hash, salt, role) VALUES (?,?,?,?,'admin')")
    .bind(String(email).toLowerCase(), String(name || "Admin"), hash, salt).run();
  return c.json({ ok: true });
});

app.post("/api/auth/login", async (c) => {
  const { email, password } = await c.req.json().catch(() => ({}));
  if (!email || !password) return c.json({ error: "email ve password gerekli" }, 400);
  const row = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?")
    .bind(String(email).toLowerCase()).first<UserRow>();
  if (!row) return c.json({ error: "E-posta veya şifre hatalı" }, 401);
  const hash = await hashPassword(String(password), row.salt);
  if (hash !== row.password_hash) return c.json({ error: "E-posta veya şifre hatalı" }, 401);
  const hours = Number(c.env.JWT_EXPIRES_HOURS ?? "72");
  const token = await signJwt({ sub: row.id, email: row.email, role: row.role }, c.env.JWT_SECRET, hours);
  return c.json({ token, user: { id: row.id, email: row.email, name: row.name, role: row.role } });
});

app.get("/api/auth/me", async (c) => {
  const err = await requireAuth(c);
  if (err) return err;
  const u = c.get("user");
  const row = await c.env.DB.prepare("SELECT id, email, name, role FROM users WHERE id = ?").bind(u.sub).first();
  if (!row) return c.json({ error: "Kullanıcı bulunamadı" }, 404);
  return c.json({ user: row });
});

app.get("/api/auth/users", async (c) => {
  const err = await requireAuth(c, ["admin"]);
  if (err) return err;
  const r = await c.env.DB.prepare("SELECT id, email, name, role, created_at FROM users ORDER BY id").all();
  return c.json({ users: r.results });
});

app.post("/api/auth/users", async (c) => {
  const err = await requireAuth(c, ["admin"]);
  if (err) return err;
  const { email, name, password, role } = await c.req.json().catch(() => ({}));
  if (!email || !password) return c.json({ error: "email ve password gerekli" }, 400);
  const salt = randomSalt();
  const hash = await hashPassword(String(password), salt);
  try {
    await c.env.DB.prepare("INSERT INTO users (email, name, password_hash, salt, role) VALUES (?,?,?,?,?)")
      .bind(String(email).toLowerCase(), String(name || email), hash, salt, role === "admin" ? "admin" : "editor").run();
  } catch {
    return c.json({ error: "Bu e-posta zaten kayıtlı" }, 409);
  }
  return c.json({ ok: true });
});

app.delete("/api/auth/users/:id", async (c) => {
  const err = await requireAuth(c, ["admin"]);
  if (err) return err;
  const id = Number(c.req.param("id"));
  if (id === c.get("user").sub) return c.json({ error: "Kendinizi silemezsiniz" }, 400);
  await c.env.DB.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
  return c.json({ ok: true });
});

/* ---------- categories ---------- */
app.get("/api/categories", async (c) => {
  const r = await c.env.DB.prepare("SELECT slug, name, description, sort FROM categories ORDER BY sort, name").all();
  return c.json({ categories: r.results });
});

app.post("/api/categories", async (c) => {
  const err = await requireAuth(c);
  if (err) return err;
  const { slug, name, description } = await c.req.json().catch(() => ({}));
  if (!name) return c.json({ error: "name gerekli" }, 400);
  const s = slug ? slugify(String(slug)) : slugify(String(name));
  try {
    await c.env.DB.prepare("INSERT INTO categories (slug, name, description, sort) VALUES (?,?,?,?)")
      .bind(s, String(name), String(description ?? ""), 0).run();
  } catch {
    return c.json({ error: "Bu slug zaten var" }, 409);
  }
  return c.json({ ok: true, slug: s });
});

app.put("/api/categories/:slug", async (c) => {
  const err = await requireAuth(c);
  if (err) return err;
  const { name, description, sort } = await c.req.json().catch(() => ({}));
  await c.env.DB.prepare("UPDATE categories SET name = COALESCE(?,name), description = COALESCE(?,description), sort = COALESCE(?,sort) WHERE slug = ?")
    .bind(name ?? null, description ?? null, sort ?? null, c.req.param("slug")).run();
  return c.json({ ok: true });
});

app.delete("/api/categories/:slug", async (c) => {
  const err = await requireAuth(c, ["admin"]);
  if (err) return err;
  await c.env.DB.prepare("DELETE FROM article_categories WHERE category_slug = ?").bind(c.req.param("slug")).run();
  await c.env.DB.prepare("DELETE FROM categories WHERE slug = ?").bind(c.req.param("slug")).run();
  return c.json({ ok: true });
});

/* ---------- articles ---------- */
app.get("/api/articles", async (c) => {
  const status = c.req.query("status");
  const category = c.req.query("category");
  const q = (c.req.query("q") ?? "").trim();
  let sql = "SELECT * FROM articles";
  const conds: string[] = [];
  const binds: unknown[] = [];
  if (status) { conds.push("status = ?"); binds.push(status); }
  if (q) { conds.push("(title LIKE ? OR excerpt LIKE ? OR author LIKE ?)"); binds.push(`%${q}%`, `%${q}%`, `%${q}%`); }
  if (conds.length) sql += " WHERE " + conds.join(" AND ");
  sql += " ORDER BY id DESC LIMIT 200";
  const r = await c.env.DB.prepare(sql).bind(...binds).all<ArticleRow>();
  let rows = r.results;
  if (category) {
    const ids = await c.env.DB.prepare("SELECT article_id FROM article_categories WHERE category_slug = ?").bind(category).all<{ article_id: number }>();
    const set = new Set(ids.results.map((x) => x.article_id));
    rows = rows.filter((a) => set.has(a.id));
  }
  const out = [];
  for (const row of rows) out.push(await articleJson(c.env.DB, row));
  return c.json({ articles: out });
});

app.get("/api/articles/:slug", async (c) => {
  const row = await c.env.DB.prepare("SELECT * FROM articles WHERE slug = ?").bind(c.req.param("slug")).first<ArticleRow>();
  if (!row) return c.json({ error: "Bulunamadı" }, 404);
  return c.json({ article: await articleJson(c.env.DB, row) });
});

function validateArticleInput(b: { title?: unknown; categories?: unknown }): string | null {
  if (!b.title) return "title gerekli";
  if (!Array.isArray(b.categories) || b.categories.length === 0) return "en az bir kategori gerekli";
  return null;
}

app.post("/api/articles", async (c) => {
  const err = await requireAuth(c);
  if (err) return err;
  const b = await c.req.json().catch(() => ({}));
  const problem = validateArticleInput(b);
  if (problem) return c.json({ error: problem }, 400);
  const slug = b.slug ? slugify(String(b.slug)) : slugify(String(b.title));
  try {
    const r = await c.env.DB.prepare(
      "INSERT INTO articles (slug,title,excerpt,author,date,read_time,image,featured,status,content,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,datetime('now'))"
    ).bind(
      slug, String(b.title), String(b.excerpt ?? ""), String(b.author ?? ""),
      String(b.date ?? ""), Number(b.readTime ?? 5), String(b.image ?? ""),
      b.featured ? 1 : 0, b.status === "draft" ? "draft" : "published",
      JSON.stringify(Array.isArray(b.content) ? b.content : [])
    ).run();
    const articleId = Number(r.meta.last_row_id);
    for (const cat of b.categories as string[]) {
      await c.env.DB.prepare("INSERT OR IGNORE INTO article_categories (article_id, category_slug) VALUES (?,?)")
        .bind(articleId, cat).run();
    }
    return c.json({ ok: true, slug });
  } catch {
    return c.json({ error: "Bu slug zaten var" }, 409);
  }
});

app.put("/api/articles/:slug", async (c) => {
  const err = await requireAuth(c);
  if (err) return err;
  const b = await c.req.json().catch(() => ({}));
  const row = await c.env.DB.prepare("SELECT * FROM articles WHERE slug = ?").bind(c.req.param("slug")).first<ArticleRow>();
  if (!row) return c.json({ error: "Bulunamadı" }, 404);
  await c.env.DB.prepare(
    "UPDATE articles SET title=COALESCE(?,title), excerpt=COALESCE(?,excerpt), author=COALESCE(?,author), date=COALESCE(?,date), read_time=COALESCE(?,read_time), image=COALESCE(?,image), featured=COALESCE(?,featured), status=COALESCE(?,status), content=COALESCE(?,content), updated_at=datetime('now') WHERE id=?"
  ).bind(
    b.title ?? null, b.excerpt ?? null, b.author ?? null, b.date ?? null,
    b.readTime ?? null, b.image ?? null,
    typeof b.featured === "boolean" ? (b.featured ? 1 : 0) : null,
    b.status ?? null,
    Array.isArray(b.content) ? JSON.stringify(b.content) : null,
    row.id
  ).run();
  if (Array.isArray(b.categories)) {
    await c.env.DB.prepare("DELETE FROM article_categories WHERE article_id = ?").bind(row.id).run();
    for (const cat of b.categories as string[]) {
      await c.env.DB.prepare("INSERT OR IGNORE INTO article_categories (article_id, category_slug) VALUES (?,?)")
        .bind(row.id, cat).run();
    }
  }
  if (typeof b.slug === "string" && b.slug && b.slug !== row.slug) {
    const ns = slugify(b.slug);
    await c.env.DB.prepare("UPDATE articles SET slug = ? WHERE id = ?").bind(ns, row.id).run();
    return c.json({ ok: true, slug: ns });
  }
  return c.json({ ok: true, slug: row.slug });
});

app.delete("/api/articles/:slug", async (c) => {
  const err = await requireAuth(c);
  if (err) return err;
  const row = await c.env.DB.prepare("SELECT id FROM articles WHERE slug = ?").bind(c.req.param("slug")).first<{ id: number }>();
  if (!row) return c.json({ error: "Bulunamadı" }, 404);
  await c.env.DB.prepare("DELETE FROM slider_items WHERE article_id = ?").bind(row.id).run();
  await c.env.DB.prepare("DELETE FROM article_categories WHERE article_id = ?").bind(row.id).run();
  await c.env.DB.prepare("DELETE FROM articles WHERE id = ?").bind(row.id).run();
  return c.json({ ok: true });
});

/* ---------- slider ---------- */
app.get("/api/slider", async (c) => {
  const r = await c.env.DB.prepare(
    "SELECT a.* FROM slider_items s JOIN articles a ON a.id = s.article_id ORDER BY s.position, s.id"
  ).all<ArticleRow>();
  const out = [];
  for (const row of r.results) out.push(await articleJson(c.env.DB, row));
  return c.json({ slider: out });
});

app.put("/api/slider", async (c) => {
  const err = await requireAuth(c);
  if (err) return err;
  const { slugs } = await c.req.json().catch(() => ({}));
  if (!Array.isArray(slugs)) return c.json({ error: "slugs[] gerekli" }, 400);
  await c.env.DB.prepare("DELETE FROM slider_items").run();
  let pos = 0;
  for (const slug of slugs as string[]) {
    const row = await c.env.DB.prepare("SELECT id FROM articles WHERE slug = ?").bind(slug).first<{ id: number }>();
    if (!row) continue;
    await c.env.DB.prepare("INSERT INTO slider_items (article_id, position) VALUES (?,?)").bind(row.id, pos++).run();
  }
  return c.json({ ok: true });
});

/* ---------- media (R2) ---------- */
function publicUrl(c: AppCtx, key: string): string {
  const base = (c.env.R2_PUBLIC_URL as string | undefined)?.replace(/\/$/, "");
  if (base) return `${base}/${key}`;
  const url = new URL(c.req.url);
  return `${url.origin}/api/media/file/${key}`;
}

app.get("/api/media", async (c) => {
  const err = await requireAuth(c);
  if (err) return err;
  const r = await c.env.DB.prepare("SELECT * FROM media ORDER BY id DESC LIMIT 100").all();
  return c.json({ media: r.results });
});

app.get("/api/media/file/:key{.+$}", async (c) => {
  if (!c.env.R2) return c.json({ error: "R2 bağlı değil" }, 500);
  const key = c.req.param("key");
  const obj = await c.env.R2.get(key);
  if (!obj) return c.json({ error: "Bulunamadı" }, 404);
  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return new Response(obj.body, { headers });
});

app.post("/api/media/upload", async (c) => {
  const err = await requireAuth(c);
  if (err) return err;
  if (!c.env.R2) return c.json({ error: "R2 bağlı değil (wrangler.toml'a r2_buckets ekleyin)" }, 500);
  const form = await c.req.formData();
  const file = form.get("file") as unknown as File | null;
  if (!file || typeof file.arrayBuffer !== "function") return c.json({ error: "file gerekli" }, 400);
  if (file.size > 8 * 1024 * 1024) return c.json({ error: "Dosya 8MB'tan büyük olamaz" }, 400);
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().slice(0, 5);
  const key = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  await c.env.R2.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "image/jpeg" },
  });
  const url = publicUrl(c, key);
  await c.env.DB.prepare("INSERT INTO media (key, url, mime, size, uploaded_by) VALUES (?,?,?,?,?)")
    .bind(key, url, file.type || "", file.size, c.get("user").sub).run();
  return c.json({ ok: true, key, url });
});

app.delete("/api/media/:id", async (c) => {
  const err = await requireAuth(c, ["admin"]);
  if (err) return err;
  const row = await c.env.DB.prepare("SELECT * FROM media WHERE id = ?").bind(c.req.param("id")).first<MediaRow>();
  if (!row) return c.json({ error: "Bulunamadı" }, 404);
  if (c.env.R2) await c.env.R2.delete(row.key);
  await c.env.DB.prepare("DELETE FROM media WHERE id = ?").bind(c.req.param("id")).run();
  return c.json({ ok: true });
});

/* ---------- public aggregate (site bu endpoint'i okur) ---------- */
app.get("/api/public/content", async (c) => {
  const cats = await c.env.DB.prepare("SELECT slug, name, description, sort FROM categories ORDER BY sort, name").all();
  const arts = await c.env.DB.prepare("SELECT * FROM articles WHERE status='published' ORDER BY id DESC LIMIT 200").all<ArticleRow>();
  const articles = [];
  for (const row of arts.results) articles.push(await articleJson(c.env.DB, row));
  const sl = await c.env.DB.prepare(
    "SELECT a.* FROM slider_items s JOIN articles a ON a.id = s.article_id WHERE a.status='published' ORDER BY s.position, s.id"
  ).all<ArticleRow>();
  const slider = [];
  for (const row of sl.results) slider.push(await articleJson(c.env.DB, row));
  return c.json({ categories: cats.results, articles, slider, updatedAt: new Date().toISOString() });
});

export default app;
