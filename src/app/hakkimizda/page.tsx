import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Feather, Camera, Palette, Landmark, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "İrtibat: bakmakla yetinmeyenlerin, gördüğünün ardındaki anlamı arayanların dergisi. Edebiyat, sanat, kültür, tarih ve fotoğraf.",
};

const ilkeler = [
  {
    icon: Feather,
    baslik: "Edebiyat",
    metin: "Kelimelerle insanın dünyayla kurduğu bağı yeniden düşünmek.",
  },
  {
    icon: Palette,
    baslik: "Sanat",
    metin: "Renklerle ve eserlerle başka duygulara açılan kapılar.",
  },
  {
    icon: Landmark,
    baslik: "Kültür & Tarih",
    metin: "Biriktirdiklerimizle ve hafızamızla anlamı aramak.",
  },
  {
    icon: Camera,
    baslik: "Fotoğraf",
    metin: "Sessiz dille hatıralara ve insana odaklanmak.",
  },
];

export default function HakkimizdaPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 mt-8 mb-16">
      {/* Manşet */}
      <div className="text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-brand-500">
          İrtibat Hakkında
        </p>
        <h1 className="font-serif-display mt-3 text-4xl md:text-6xl font-black leading-[1.05] tracking-tight">
          Bakmak yetmez.
          <br />
          <span className="italic font-normal">Görmek için irtibatta kal.</span>
        </h1>
        <div className="mx-auto mt-6 h-1 w-24 bg-brand-500" />
      </div>

      {/* Manifesto */}
      <div className="mt-10 rounded-3xl bg-neutral-950 text-white p-8 md:p-12">
        <Eye size={28} className="text-brand-100/70" />
        <p className="font-serif-display mt-4 text-xl md:text-2xl leading-relaxed">
          <span className="float-left mr-3 text-6xl md:text-7xl font-black leading-[0.85] text-brand-500">
            İ
          </span>
          RTİBAT, dünyaya yalnızca bakmakla yetinmeyenlerin; gördüğünün ardındaki anlamı
          arayanların dergisidir.
        </p>
        <p className="mt-6 leading-relaxed text-neutral-300">
          Edebiyatın kelimeleriyle, sanatın renkleriyle, kültürün biriktirdikleriyle, tarihin
          hafızasıyla ve fotoğrafın sessiz diliyle insanın dünyayla kurduğu bağı yeniden
          düşünmek için yola çıktık.
        </p>
        <p className="mt-4 leading-relaxed text-neutral-300">
          Bizce her kelime bir insana, her fotoğraf bir hatıraya, her sanat eseri başka bir
          duyguya açılan kapıdır. Çünkü insan, ancak merak ettiği, düşündüğü ve anlamaya
          çalıştığı şeylerle gerçekten irtibat kurar.
        </p>
        <p className="font-serif-display mt-6 border-l-2 border-brand-500 pl-4 text-lg italic text-white">
          İRTİBAT; biraz durmak, biraz düşünmek, biraz da baktıklarımızın ötesini görmek
          için var.
        </p>
      </div>

      {/* Değerler */}
      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {ilkeler.map((ilke) => (
          <div
            key={ilke.baslik}
            className="group rounded-3xl border bg-cream p-6 hover:bg-white hover:border-brand-500 hover:shadow-lg transition"
          >
            <span className="w-11 h-11 rounded-2xl bg-neutral-950 text-white flex items-center justify-center group-hover:bg-brand-500 transition">
              <ilke.icon size={19} />
            </span>
            <h2 className="mt-4 font-black text-lg">{ilke.baslik}</h2>
            <p className="mt-1 text-sm leading-relaxed text-neutral-600">{ilke.metin}</p>
          </div>
        ))}
      </section>

      {/* Kapanış */}
      <div className="mt-10 text-center rounded-3xl border border-dashed p-8">
        <p className="font-serif-display text-2xl md:text-3xl font-bold tracking-tight">
          Merak et. Düşün. Anlamaya çalış.
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Her sayıda kelimeler, renkler, hatıralar ve duygularla yeniden irtibat kuruyoruz.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-bold">
          <Link
            href="/kunye"
            className="inline-flex items-center gap-1.5 rounded-full border px-6 py-2.5 hover:border-brand-500 hover:text-brand-600 transition"
          >
            Künyemiz <ArrowRight size={15} />
          </Link>
          <Link
            href="/iletisim"
            className="rounded-full bg-brand-500 text-white px-6 py-2.5 hover:bg-brand-600 transition"
          >
            Bize Yazın
          </Link>
        </div>
      </div>
    </div>
  );
}
