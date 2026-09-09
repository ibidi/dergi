"use client";

import { useEffect, useState } from "react";
import { adminApi, errMsg, getToken, setToken, type AdminUser } from "@/lib/admin-api";
import { API_URL, DEFAULT_SETTINGS, type ArticleDTO, type Category, type Contact, type MenuLink, type SliderConfig } from "@/lib/content";

type Tab = "yazilar" | "slider" | "kategoriler" | "medya" | "menuler" | "kullanicilar";

const input =
  "w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black";
const btn =
  "rounded-xl bg-neutral-950 px-4 py-2 text-sm font-bold text-white hover:bg-black disabled:opacity-50";
const btnGhost =
  "rounded-xl border border-neutral-300 px-3 py-1.5 text-xs font-bold hover:border-black";
const label = "text-xs font-bold uppercase tracking-widest text-neutral-500";

export default function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [tab, setTab] = useState<Tab>("yazilar");
  const [err, setErr] = useState("");
  const [booting, setBooting] = useState<boolean>(() => Boolean(API_URL && getToken()));

  useEffect(() => {
    if (!booting) return;
    let live = true;
    adminApi
      .me()
      .then((d) => {
        if (live) setUser(d.user);
      })
      .catch(() => setToken(null))
      .finally(() => {
        if (live) setBooting(false);
      });
    return () => {
      live = false;
    };
  }, [booting]);

  if (!API_URL)
    return (
      <Shell>
        <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-sm">
          <p className="font-black">NEXT_PUBLIC_API_URL tanımlı değil.</p>
          <p className="mt-1">Proje köküne <code>.env.local</code> açıp şunu yazın:</p>
          <pre className="mt-2 rounded bg-black p-3 text-white">NEXT_PUBLIC_API_URL=https://dergi-api.&lt;hesabınız&gt;.workers.dev</pre>
        </div>
      </Shell>
    );

  if (booting) return <Shell><p className="text-sm text-neutral-500">Yükleniyor…</p></Shell>;
  if (!user) return <Shell><Login onOk={setUser} /></Shell>;

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <p className="text-xl font-black tracking-tight">İRTİBAT <span className="text-xs font-semibold tracking-[0.3em] text-neutral-400">ADMIN</span></p>
          <nav className="ml-6 flex flex-wrap gap-1 text-sm font-bold">
            {([["yazilar", "Yazılar"], ["slider", "Slider"], ["kategoriler", "Kategoriler"], ["medya", "Medya"], ["menuler", "Menüler"], ["kullanicilar", "Kullanıcılar"]] as [Tab, string][]).map(([t, l]) => (
              <button key={t} onClick={() => setTab(t)} className={`rounded-full px-4 py-1.5 ${tab === t ? "bg-neutral-950 text-white" : "hover:bg-neutral-200"}`}>{l}</button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span className="text-neutral-500">{user.name} <b className="text-neutral-800">({user.role})</b></span>
            <button className={btnGhost} onClick={() => { setToken(null); location.reload(); }}>Çıkış</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        {err && <p className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm">{err}</p>}
        {tab === "yazilar" && <Articles onErr={setErr} />}
        {tab === "slider" && <Slider onErr={setErr} />}
        {tab === "kategoriler" && <Categories onErr={setErr} isAdmin={user.role === "admin"} />}
        {tab === "medya" && <Media onErr={setErr} />}
        {tab === "menuler" && <Menus onErr={setErr} />}
        {tab === "kullanicilar" && <Users onErr={setErr} me={user} />}
      </main>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-4 text-neutral-900">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow">{children}</div>
    </div>
  );
}

function Login({ onOk }: { onOk: (u: AdminUser) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [sName, setSName] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sPass, setSPass] = useState("");

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    adminApi
      .login(email, password)
      .then((d) => {
        setToken(d.token);
        onOk(d.user);
      })
      .catch((err: unknown) => setMsg(errMsg(err)))
      .finally(() => setBusy(false));
  };

  const seed = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    adminApi
      .seed({ email: sEmail, name: sName, password: sPass })
      .then(() => setMsg("İlk admin oluşturuldu. Şimdi yukarıdan giriş yapın."))
      .catch((err: unknown) => setMsg(errMsg(err)))
      .finally(() => setBusy(false));
  };

  return (
    <div>
      <p className="text-2xl font-black">İRTİBAT Admin</p>
      <p className="mt-1 text-sm text-neutral-500">Yazı • slider • kategori • görsel yönetimi</p>
      <form onSubmit={login} className="mt-6 grid gap-3">
        <input className={input} placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={input} type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className={btn} disabled={busy}>Giriş yap</button>
      </form>
      {msg && <p className="mt-3 text-sm text-red-600">{msg}</p>}
      <details className="mt-6 rounded-2xl bg-neutral-50 p-4 text-sm">
        <summary className="cursor-pointer font-bold">İlk kurulum (hiç kullanıcı yoksa)</summary>
        <form onSubmit={seed} className="mt-3 grid gap-2">
          <input className={input} placeholder="Ad Soyad" value={sName} onChange={(e) => setSName(e.target.value)} />
          <input className={input} placeholder="E-posta" value={sEmail} onChange={(e) => setSEmail(e.target.value)} />
          <input className={input} type="password" placeholder="Şifre" value={sPass} onChange={(e) => setSPass(e.target.value)} />
          <button className={btn} disabled={busy}>İlk admini oluştur</button>
        </form>
      </details>
    </div>
  );
}

/* ================= YAZILAR ================= */
type ArticleForm = {
  slug: string; title: string; excerpt: string; author: string; date: string;
  readTime: number; image: string; featured: boolean; status: "draft" | "published";
  categories: string[]; content: string;
};

const emptyForm: ArticleForm = {
  slug: "", title: "", excerpt: "", author: "", date: "", readTime: 5,
  image: "", featured: false, status: "published", categories: [], content: "",
};

function Articles({ onErr }: { onErr: (s: string) => void }) {
  const [list, setList] = useState<ArticleDTO[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ArticleForm>({ ...emptyForm });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.all([adminApi.articles(), adminApi.categories()])
      .then(([a, c]) => {
        if (!live) return;
        setList(a.articles);
        setCats(c.categories);
      })
      .catch((e: unknown) => {
        if (live) onErr(errMsg(e));
      });
    return () => {
      live = false;
    };
  }, [onErr]);

  const reload = () => {
    let live = true;
    Promise.all([adminApi.articles(), adminApi.categories()])
      .then(([a, c]) => {
        if (!live) return;
        setList(a.articles);
        setCats(c.categories);
      })
      .catch((e: unknown) => onErr(errMsg(e)));
    return () => {
      live = false;
    };
  };

  const filtered = list.filter(
    (a) =>
      (!status || a.status === status) &&
      (!q || (a.title + a.excerpt + a.author).toLocaleLowerCase("tr").includes(q.toLocaleLowerCase("tr")))
  );

  const openNew = () => {
    setEditing("new");
    setForm({ ...emptyForm, date: new Date().toLocaleDateString("tr-TR") });
  };
  const openEdit = (a: ArticleDTO) => {
    setEditing(a.slug);
    setForm({ ...emptyForm, ...a, status: a.status, content: a.content.join("\n\n") });
  };

  const save = () => {
    if (!form.title || form.categories.length === 0) {
      onErr("Başlık ve en az bir kategori zorunlu.");
      return;
    }
    setBusy(true);
    const payload = {
      ...form,
      content: form.content.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
    };
    const done = editing === "new"
      ? adminApi.createArticle(payload)
      : adminApi.updateArticle(editing ?? "", payload);
    done
      .then(() => {
        setEditing(null);
        onErr("");
        reload();
      })
      .catch((e: unknown) => onErr(errMsg(e)))
      .finally(() => setBusy(false));
  };

  const del = (slug: string) => {
    if (!confirm("Bu yazı silinsin mi?")) return;
    adminApi
      .deleteArticle(slug)
      .then(() => reload())
      .catch((e: unknown) => onErr(errMsg(e)));
  };

  const uploadImage = (f: File) => {
    adminApi
      .uploadMedia(f)
      .then((d) => setForm((p) => ({ ...p, image: d.url })))
      .catch((e: unknown) => onErr(errMsg(e)));
  };

  if (editing) {
    return (
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black">{editing === "new" ? "Yeni yazı" : "Yazıyı düzenle"}</h2>
          <button className={`${btnGhost} ml-auto`} onClick={() => setEditing(null)}>← Listeye dön</button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="grid gap-3">
            <div><p className={label}>Başlık *</p><input className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><p className={label}>Slug (boşsa başlıktan üretilir)</p><input className={input} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} /></div>
            <div><p className={label}>Özet</p><textarea className={input} rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-2">
              <div><p className={label}>Yazar</p><input className={input} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} /></div>
              <div><p className={label}>Tarih</p><input className={input} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
              <div><p className={label}>Dk</p><input className={input} type="number" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: Number(e.target.value) })} /></div>
            </div>
            <div>
              <p className={label}>Görsel URL</p>
              <input className={input} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="/images/....jpg veya https://…" />
              <label className={`${btnGhost} mt-2 inline-block cursor-pointer`}>Görsel yükle (R2)<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); }} /></label>
              {form.image && <img src={form.image} alt="" className="mt-2 h-32 rounded-xl object-cover" />}
            </div>
          </div>
          <div className="grid gap-3">
            <div>
              <p className={label}>Kategoriler *</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {cats.map((c) => (
                  <label key={c.slug} className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-bold ${form.categories.includes(c.slug) ? "border-black bg-black text-white" : ""}`}>
                    <input type="checkbox" className="hidden" checked={form.categories.includes(c.slug)}
                      onChange={() => setForm((p) => ({ ...p, categories: p.categories.includes(c.slug) ? p.categories.filter((x) => x !== c.slug) : [...p.categories, c.slug] }))} />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-4 text-sm font-bold">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Öne çıkan</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.status === "published"} onChange={(e) => setForm({ ...form, status: e.target.checked ? "published" : "draft" })} /> Yayında</label>
            </div>
            <div><p className={label}>İçerik (paragrafları boş satırla ayırın)</p><textarea className={`${input} font-serif`} rows={14} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} /></div>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className={btn} disabled={busy} onClick={save}>{busy ? "Kaydediliyor…" : "Kaydet"}</button>
          <a className={btnGhost} target="_blank" rel="noreferrer" href={editing === "new" ? "/" : `/oku?slug=${editing}`}>Önizle ↗</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <input className={`${input} max-w-xs`} placeholder="Ara…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={input} style={{ maxWidth: 160 }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tümü</option><option value="published">Yayında</option><option value="draft">Taslak</option>
        </select>
        <button className={`${btn} ml-auto`} onClick={openNew}>+ Yeni yazı</button>
      </div>
      <div className="mt-4 overflow-hidden rounded-3xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead><tr className="border-b text-left text-xs uppercase tracking-widest text-neutral-400">
            <th className="p-3">Başlık</th><th className="p-3">Kategori</th><th className="p-3">Durum</th><th className="p-3 text-right">İşlem</th>
          </tr></thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.slug} className="border-b last:border-0 hover:bg-neutral-50">
                <td className="p-3"><b>{a.title}</b><br /><span className="text-xs text-neutral-400">{a.slug} • {a.author} • {a.date}</span></td>
                <td className="p-3 text-xs">{a.categories.join(", ")}</td>
                <td className="p-3">{a.status === "published" ? "🟢 Yayında" : "⚪ Taslak"}{a.featured ? " ⭐" : ""}</td>
                <td className="p-3 text-right">
                  <button className={btnGhost} onClick={() => openEdit(a)}>Düzenle</button>{" "}
                  <button className={btnGhost} onClick={() => del(a.slug)}>Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-sm text-neutral-500">Kayıt yok.</p>}
      </div>
    </div>
  );
}

/* ================= SLIDER ================= */
function Slider({ onErr }: { onErr: (s: string) => void }) {
  const [current, setCurrent] = useState<ArticleDTO[]>([]);
  const [all, setAll] = useState<ArticleDTO[]>([]);
  const [add, setAdd] = useState("");

  useEffect(() => {
    let live = true;
    Promise.all([adminApi.slider(), adminApi.articles("?status=published")])
      .then(([s, a]) => {
        if (!live) return;
        setCurrent(s.slider);
        setAll(a.articles);
      })
      .catch((e: unknown) => {
        if (live) onErr(errMsg(e));
      });
    return () => {
      live = false;
    };
  }, [onErr]);

  const save = (list: ArticleDTO[]) => {
    adminApi
      .saveSlider(list.map((a) => a.slug))
      .then(() => {
        setCurrent(list);
        onErr("");
      })
      .catch((e: unknown) => onErr(errMsg(e)));
  };
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= current.length) return;
    const next = [...current];
    [next[i], next[j]] = [next[j], next[i]];
    save(next);
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black">Hero slider sırası</h2>
      <p className="mt-1 text-sm text-neutral-500">Ana sayfadaki tam ekran slider. Sıralama yukarı/aşağı butonlarıyla değişir, otomatik kaydedilir.</p>
      <ol className="mt-4 grid gap-2">
        {current.map((a, i) => (
          <li key={a.slug} className="flex items-center gap-3 rounded-2xl border p-3 text-sm">
            <b className="w-8 text-xl text-neutral-300">{i + 1}</b>
            {a.image && <img src={a.image} alt="" className="h-12 w-20 rounded-lg object-cover" />}
            <b className="flex-1">{a.title}</b>
            <button className={btnGhost} onClick={() => move(i, -1)}>↑</button>
            <button className={btnGhost} onClick={() => move(i, 1)}>↓</button>
            <button className={btnGhost} onClick={() => save(current.filter((x) => x.slug !== a.slug))}>Çıkar</button>
          </li>
        ))}
      </ol>
      {current.length === 0 && <p className="mt-3 text-sm text-neutral-500">Slider boş — aşağıdan ekleyin.</p>}
      <div className="mt-4 flex gap-2">
        <select className={input} value={add} onChange={(e) => setAdd(e.target.value)}>
          <option value="">Yazı seç…</option>
          {all.filter((a) => !current.find((c) => c.slug === a.slug)).map((a) => (
            <option key={a.slug} value={a.slug}>{a.title}</option>
          ))}
        </select>
        <button className={btn} onClick={() => { const a = all.find((x) => x.slug === add); if (a) save([...current, a]); }}>Ekle</button>
      </div>
    </div>
  );
}

/* ================= KATEGORİLER ================= */
function Categories({ onErr, isAdmin }: { onErr: (s: string) => void; isAdmin: boolean }) {
  const [list, setList] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    let live = true;
    adminApi
      .categories()
      .then((c) => {
        if (live) setList(c.categories);
      })
      .catch((e: unknown) => {
        if (live) onErr(errMsg(e));
      });
    return () => {
      live = false;
    };
  }, [onErr]);

  const reload = () => {
    adminApi
      .categories()
      .then((c) => setList(c.categories))
      .catch((e: unknown) => onErr(errMsg(e)));
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black">Kategoriler</h2>
      <div className="mt-4 grid gap-2">
        {list.map((c) => (
          <RowEdit key={c.slug} c={c} isAdmin={isAdmin} reload={reload} onErr={onErr} />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <input className={`${input} max-w-52`} placeholder="Yeni kategori adı" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={`${input} max-w-80`} placeholder="Açıklama" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <button className={btn} onClick={() => {
          adminApi
            .createCategory({ name, description: desc })
            .then(() => {
              setName("");
              setDesc("");
              reload();
            })
            .catch((e: unknown) => onErr(errMsg(e)));
        }}>Ekle</button>
      </div>
    </div>
  );
}

function RowEdit({ c, isAdmin, reload, onErr }: { c: Category; isAdmin: boolean; reload: () => void; onErr: (s: string) => void }) {
  const [name, setName] = useState(c.name);
  const [desc, setDesc] = useState(c.description);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border p-3 text-sm">
      <code className="w-32 truncate text-xs text-neutral-400">/{c.slug}</code>
      <input className={`${input} max-w-52`} value={name} onChange={(e) => setName(e.target.value)} />
      <input className={`${input} flex-1`} value={desc} onChange={(e) => setDesc(e.target.value)} style={{ minWidth: 200 }} />
      <button className={btnGhost} onClick={() => {
        adminApi
          .updateCategory(c.slug, { name, description: desc })
          .then(() => reload())
          .catch((e: unknown) => onErr(errMsg(e)));
      }}>Kaydet</button>
      {isAdmin && <button className={btnGhost} onClick={() => {
        if (!confirm(`/${c.slug} silinsin mi?`)) return;
        adminApi
          .deleteCategory(c.slug)
          .then(() => reload())
          .catch((e: unknown) => onErr(errMsg(e)));
      }}>Sil</button>}
    </div>
  );
}

/* ================= MEDYA ================= */
function Media({ onErr }: { onErr: (s: string) => void }) {
  const [list, setList] = useState<{ id: number; key: string; url: string }[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let live = true;
    adminApi
      .media()
      .then((m) => {
        if (live) setList(m.media);
      })
      .catch((e: unknown) => {
        if (live) onErr(errMsg(e));
      });
    return () => {
      live = false;
    };
  }, [onErr]);

  const reload = () => {
    adminApi
      .media()
      .then((m) => setList(m.media))
      .catch((e: unknown) => onErr(errMsg(e)));
  };

  const up = (f: File) => {
    setBusy(true);
    adminApi
      .uploadMedia(f)
      .then(() => reload())
      .catch((e: unknown) => onErr(errMsg(e)))
      .finally(() => setBusy(false));
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url).catch((e: unknown) => onErr(errMsg(e)));
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-black">Medya (R2)</h2>
        <label className={`${btn} ml-auto cursor-pointer`}>{busy ? "Yükleniyor…" : "+ Yükle"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) up(f); }} />
        </label>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((m) => (
          <div key={m.id} className="overflow-hidden rounded-2xl border text-xs">
            <img src={m.url} alt="" className="aspect-video w-full object-cover" />
            <div className="p-2">
              <p className="truncate text-neutral-500">{m.key}</p>
              <div className="mt-1 flex gap-1">
                <button className={btnGhost} onClick={() => copy(m.url)}>URL kopyala</button>
                <button className={btnGhost} onClick={() => {
                  if (!confirm("Dosya silinsin mi?")) return;
                  adminApi
                    .deleteMedia(m.id)
                    .then(() => reload())
                    .catch((e: unknown) => onErr(errMsg(e)));
                }}>Sil</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="mt-3 text-sm text-neutral-500">Henüz görsel yok.</p>}
    </div>
  );
}

/* ================= MENÜLER & AYARLAR ================= */
function Menus({ onErr }: { onErr: (s: string) => void }) {
  const [header, setHeader] = useState<MenuLink[]>(DEFAULT_SETTINGS.header_menu);
  const [footer, setFooter] = useState<MenuLink[]>(DEFAULT_SETTINGS.footer_menu);
  const [socials, setSocials] = useState<MenuLink[]>(DEFAULT_SETTINGS.socials);
  const [contact, setContact] = useState<Contact>(DEFAULT_SETTINGS.contact);
  const [slider, setSlider] = useState<SliderConfig>(DEFAULT_SETTINGS.slider_config);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    let live = true;
    adminApi
      .settings()
      .then((d) => {
        if (!live) return;
        const s = d.settings;
        if (Array.isArray(s.header_menu) && s.header_menu.length) setHeader(s.header_menu);
        if (Array.isArray(s.footer_menu) && s.footer_menu.length) setFooter(s.footer_menu);
        if (Array.isArray(s.socials) && s.socials.length) setSocials(s.socials);
        if (s.contact) setContact({ ...DEFAULT_SETTINGS.contact, ...s.contact });
        if (s.slider_config) setSlider({ ...DEFAULT_SETTINGS.slider_config, ...s.slider_config });
      })
      .catch((e: unknown) => {
        if (live) onErr(errMsg(e));
      });
    return () => {
      live = false;
    };
  }, [onErr]);

  const save = (key: string, value: unknown, msg: string) => {
    adminApi
      .saveSetting(key, value)
      .then(() => {
        onErr("");
        setSaved(msg);
        setTimeout(() => setSaved(""), 2500);
      })
      .catch((e: unknown) => onErr(errMsg(e)));
  };

  return (
    <div className="grid gap-4">
      {saved && <p className="rounded-xl border border-green-300 bg-green-50 px-4 py-2 text-sm">✅ {saved}</p>}
      <LinkList title="Üst menü (Header)" desc="Sitenin en üstündeki menü. Sıralamayı oklarla değiştirin." links={header} setLinks={setHeader} onSave={() => save("header_menu", header, "Üst menü kaydedildi.")} />
      <LinkList title="Alt menü — Kurumsal (Footer)" desc="Sayfa altındaki Kurumsal sütunu." links={footer} setLinks={setFooter} onSave={() => save("footer_menu", footer, "Alt menü kaydedildi.")} />
      <LinkList title="Sosyal medya (Footer)" desc="Simge etikete göre seçilir: Instagram, X, TikTok, Facebook. Başka bir ad yazarsanız genel bağlantı simgesi çıkar." links={socials} setLinks={setSocials} onSave={() => save("socials", socials, "Sosyal medya kaydedildi.")} />

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">İletişim bilgileri (Footer)</h2>
        <div className="mt-4 grid gap-3 max-w-xl">
          <div><p className={label}>Adres</p><input className={input} value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} /></div>
          <div><p className={label}>Site</p><input className={input} value={contact.site} onChange={(e) => setContact({ ...contact, site: e.target.value })} /></div>
          <div><p className={label}>E-posta</p><input className={input} value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></div>
          <div><button className={btn} onClick={() => save("contact", contact, "İletişim bilgileri kaydedildi.")}>Kaydet</button></div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Slider davranışı</h2>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div><p className={label}>Geçiş süresi (saniye)</p><input className={`${input} max-w-32`} type="number" min={3} max={20} value={Math.round(slider.interval / 1000)} onChange={(e) => setSlider({ ...slider, interval: Math.max(3, Math.min(20, Number(e.target.value) || 6)) * 1000 })} /></div>
          <div><p className={label}>Slayt sayısı (en fazla)</p><input className={`${input} max-w-32`} type="number" min={1} max={10} value={slider.max} onChange={(e) => setSlider({ ...slider, max: Math.max(1, Math.min(10, Number(e.target.value) || 5)) })} /></div>
          <div><button className={btn} onClick={() => save("slider_config", slider, "Slider ayarları kaydedildi.")}>Kaydet</button></div>
        </div>
        <p className="mt-2 text-xs text-neutral-500">Hangi yazıların çıkacağı Slider sekmesinden seçilir; burası sadece hız ve adet.</p>
      </div>
    </div>
  );
}

function LinkList({ title, desc, links, setLinks, onSave }: {
  title: string; desc: string; links: MenuLink[];
  setLinks: (l: MenuLink[]) => void; onSave: () => void;
}) {
  const move = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= links.length) return;
    const next = [...links];
    [next[i], next[j]] = [next[j], next[i]];
    setLinks(next);
  };
  const edit = (i: number, patch: Partial<MenuLink>) =>
    setLinks(links.map((l, k) => (k === i ? { ...l, ...patch } : l)));
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black">{title}</h2>
      <p className="mt-1 text-sm text-neutral-500">{desc}</p>
      <div className="mt-4 grid gap-2">
        {links.map((l, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 rounded-2xl border p-2 text-sm">
            <input className={`${input} max-w-52`} value={l.label} onChange={(e) => edit(i, { label: e.target.value })} placeholder="Görünen ad" />
            <input className={`${input} flex-1`} value={l.href} onChange={(e) => edit(i, { href: e.target.value })} style={{ minWidth: 200 }} placeholder="/sayfa-adresi veya https://…" />
            <button className={btnGhost} onClick={() => move(i, -1)}>↑</button>
            <button className={btnGhost} onClick={() => move(i, 1)}>↓</button>
            <button className={btnGhost} onClick={() => setLinks(links.filter((_, k) => k !== i))}>Sil</button>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button className={btnGhost} onClick={() => setLinks([...links, { label: "Yeni bağlantı", href: "/" }])}>+ Ekle</button>
        <button className={btn} onClick={onSave}>Kaydet</button>
      </div>
    </div>
  );
}

/* ================= KULLANICILAR ================= */
function Users({ onErr, me }: { onErr: (s: string) => void; me: AdminUser }) {
  const [list, setList] = useState<AdminUser[]>([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [role, setRole] = useState("editor");
  const isAdmin = me.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    let live = true;
    adminApi
      .users()
      .then((u) => {
        if (live) setList(u.users);
      })
      .catch((e: unknown) => {
        if (live) onErr(errMsg(e));
      });
    return () => {
      live = false;
    };
  }, [isAdmin, onErr]);

  if (!isAdmin)
    return <p className="rounded-3xl bg-white p-6 text-sm shadow-sm">Kullanıcı yönetimi yalnızca <b>admin</b> rolünde görünür. Sizin rolünüz: <b>{me.role}</b></p>;

  const reload = () => {
    adminApi
      .users()
      .then((u) => setList(u.users))
      .catch((e: unknown) => onErr(errMsg(e)));
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black">Kullanıcılar</h2>
      <div className="mt-4 grid gap-2">
        {list.map((u) => (
          <div key={u.id} className="flex items-center gap-3 rounded-2xl border p-3 text-sm">
            <b>{u.name}</b><span className="text-neutral-500">{u.email}</span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-bold">{u.role}</span>
            <button className={`${btnGhost} ml-auto`} disabled={u.id === me.id} onClick={() => {
              if (!confirm(`${u.email} silinsin mi?`)) return;
              adminApi
                .deleteUser(u.id)
                .then(() => reload())
                .catch((e: unknown) => onErr(errMsg(e)));
            }}>Sil</button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <input className={`${input} max-w-44`} placeholder="Ad" value={name} onChange={(e) => setName(e.target.value)} />
        <input className={`${input} max-w-52`} placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className={`${input} max-w-40`} type="password" placeholder="Şifre" value={pass} onChange={(e) => setPass(e.target.value)} />
        <select className={input} style={{ maxWidth: 130 }} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="editor">editor</option><option value="admin">admin</option>
        </select>
        <button className={btn} onClick={() => {
          adminApi
            .createUser({ email, name, password: pass, role })
            .then(() => {
              setEmail("");
              setName("");
              setPass("");
              reload();
            })
            .catch((e: unknown) => onErr(errMsg(e)));
        }}>Ekle</button>
      </div>
    </div>
  );
}
