"use client";

import { useState } from "react";
import { MailCheck } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="rounded-3xl bg-neutral-950 text-white p-8 md:p-12 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="relative max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-100">İRTİBAT Bülten</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-black">Moda ve cemiyet gündemi her sabah kutunda.</h2>
        <p className="mt-3 text-white/70">Haftada bir e-posta. Spam yok, dilediğinde tek tıkla ayrıl.</p>
        {done ? (
          <p className="mt-6 inline-flex items-center gap-2 bg-white/10 rounded-full px-5 py-3 text-sm font-semibold">
            <MailCheck size={18} /> Teşekkürler! Aboneliğin alındı.
          </p>
        ) : (
          <form
            className="mt-6 flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) setDone(true);
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e-posta adresin"
              className="flex-1 rounded-full px-5 py-3 text-sm text-neutral-900 outline-none"
            />
            <button className="bg-brand-500 hover:bg-brand-600 transition rounded-full px-7 py-3 text-sm font-bold">
              Abone Ol
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
