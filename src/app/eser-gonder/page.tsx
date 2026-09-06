"use client";

import { useState } from "react";
import { SendHorizonal, FileText, Image as ImageIcon, Info } from "lucide-react";

const TUR_ADIMLARI = ["Şiir", "Öykü", "Deneme", "İnceleme / Eleştiri", "Fotoğraf", "İllüstrasyon / Resim", "Diğer"];

export default function EserGonderPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 mt-8 mb-16">
      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-500">
        İrtibat&apos;a yazın
      </p>
      <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-1">Eser Gönder</h1>
      <p className="text-neutral-600 mt-3 leading-relaxed">
        Şiir, öykü, deneme, fotoğraf ve illüstrasyonlarınızı bekliyoruz. Gönderdiğiniz eserler
        yayın kurulunun değerlendirmesinden sonra yayımlanır. Özgün ve daha önce yayımlanmamış
        eserler önceliklidir.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm">
        {[
          { icon: FileText, baslik: "Yazı", metin: "Şiir, öykü, deneme (Word / metin)" },
          { icon: ImageIcon, baslik: "Görsel", metin: "Fotoğraf, resim (yüksek çözünürlük)" },
          { icon: Info, baslik: "Değerlendirme", metin: "Yayın kurulu incelemesi, 15 gün içinde dönüş" },
        ].map((k) => (
          <div key={k.baslik} className="rounded-2xl border bg-cream p-4">
            <k.icon size={18} className="text-brand-600" />
            <p className="mt-2 font-bold">{k.baslik}</p>
            <p className="text-neutral-600 text-[13px] mt-0.5">{k.metin}</p>
          </div>
        ))}
      </div>

      {sent ? (
        <div className="mt-8 rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
          <p className="text-2xl font-black">Eseriniz alındı!</p>
          <p className="mt-2 text-sm text-neutral-600">
            Teşekkürler. Yayın kurulumuz inceleyip 15 gün içinde e-posta ile dönüş yapacak.
          </p>
        </div>
      ) : (
        <form
          className="mt-8 grid gap-4 bg-cream border rounded-3xl p-6 md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1.5 text-sm font-semibold">
              Ad Soyad / Mahlas
              <input
                required
                className="rounded-xl border px-4 py-3 font-normal outline-none focus:border-brand-500 bg-white"
                placeholder="Adınız veya mahlasınız"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              E-posta
              <input
                required
                type="email"
                className="rounded-xl border px-4 py-3 font-normal outline-none focus:border-brand-500 bg-white"
                placeholder="ornek@eposta.com"
              />
            </label>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-1.5 text-sm font-semibold">
              Eser Türü
              <select className="rounded-xl border px-4 py-3 font-normal outline-none bg-white">
                {TUR_ADIMLARI.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Eser Başlığı
              <input
                required
                className="rounded-xl border px-4 py-3 font-normal outline-none focus:border-brand-500 bg-white"
                placeholder="Eserinizin başlığı"
              />
            </label>
          </div>
          <label className="grid gap-1.5 text-sm font-semibold">
            Eseriniz
            <textarea
              required
              rows={8}
              className="rounded-xl border px-4 py-3 font-normal outline-none focus:border-brand-500 bg-white"
              placeholder="Metninizi buraya yapıştırın… (Görsel eserler için açıklama + indirme bağlantısı ekleyin)"
            />
          </label>
          <label className="grid gap-1.5 text-sm font-semibold">
            Kısa Özgeçmiş (isteğe bağlı)
            <textarea
              rows={2}
              className="rounded-xl border px-4 py-3 font-normal outline-none focus:border-brand-500 bg-white"
              placeholder="2-3 cümleyle kendinizi tanıtın…"
            />
          </label>
          <label className="flex items-start gap-2 text-[13px] text-neutral-600">
            <input required type="checkbox" className="mt-1" />
            Eserin bana ait ve özgün olduğunu, daha önce başka bir yerde yayımlanmadıysa
            İrtibat Dergisi&apos;nde yayımlanmasını kabul ediyorum.
          </label>
          <button className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-full px-7 py-3 w-fit transition">
            <SendHorizonal size={16} /> Eseri Gönder
          </button>
        </form>
      )}

      <p className="mt-6 text-xs text-neutral-500 leading-relaxed">
        Not: Yazıların sorumluluğu yazarlarına aittir. Yayın kurulu, eserlerde dil ve imla
        düzeltmesi yapabilir. Uygun bulunmayan eserler iade edilmez, gerekçe bildirilmez.
      </p>
    </div>
  );
}
