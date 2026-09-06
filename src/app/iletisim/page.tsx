"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-3xl px-4 mt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-500">Bize ulaşın</p>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-1">İletişim</h1>
      <p className="text-neutral-600 mt-3">Reklam, iş birliği ve editoryal öneriler için formu doldurun; 2 iş günü içinde dönelim.</p>
      <form
        className="mt-8 grid gap-4 bg-cream border rounded-3xl p-6 md:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-1.5 text-sm font-semibold">Ad Soyad
            <input required className="rounded-xl border px-4 py-3 font-normal outline-none focus:border-brand-500" placeholder="Adınız" />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">E-posta
            <input required type="email" className="rounded-xl border px-4 py-3 font-normal outline-none focus:border-brand-500" placeholder="ornek@eposta.com" />
          </label>
        </div>
        <label className="grid gap-1.5 text-sm font-semibold">Konu
          <select className="rounded-xl border px-4 py-3 font-normal outline-none">
            <option>Reklam</option>
            <option>Editoryal öneri</option>
            <option>Davet / etkinlik</option>
            <option>Diğer</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm font-semibold">Mesajınız
          <textarea required rows={5} className="rounded-xl border px-4 py-3 font-normal outline-none focus:border-brand-500" placeholder="Mesajınızı yazın…" />
        </label>
        <button className="bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-full px-7 py-3 w-fit transition">Gönder</button>
        {sent && <p className="text-sm font-semibold text-green-700">Mesajınız alındı, teşekkürler!</p>}
      </form>
      <div className="mt-6 text-sm text-neutral-600 space-y-1">
        <p><strong>Adres:</strong> Uğur Mumcu Cad. No:33, Çankaya – Ankara</p>
        <p><strong>Telefon:</strong> 0312 428 0 444</p>
        <p><strong>E-posta:</strong> info@irtibatdergi.com</p>
      </div>
    </div>
  );
}
