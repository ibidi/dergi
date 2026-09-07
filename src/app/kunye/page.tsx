import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Künye",
  description:
    "İrtibat Dergisi künyesi: imtiyaz sahibi, yayın yönetmeni, editörler, yayın kurulu ve iletişim bilgileri.",
};

export default function KunyePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 mt-8 mb-16">
      <div className="bg-white px-6 py-12 md:px-16 md:py-16 text-center">
        {/* Başlık — görseldeki gibi */}
        <h1
          className="text-[28px] md:text-[40px] leading-tight tracking-normal text-black"
          style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
        >
          İRTİBAT DERGİSİ KÜNYE
        </h1>

        <div
          className="mt-8 space-y-5 text-[17px] md:text-[19px] leading-[1.6] text-black"
          style={{ fontFamily: '"Times New Roman", Times, Georgia, serif' }}
        >
          <div>
            <p>İmtiyaz Sahibi</p>
            <p>Ahmet DEMİR</p>
          </div>

          <div>
            <p>Genel Yayın Yönetmeni</p>
            <p>Ahmet DEMİR</p>
          </div>

          <div>
            <p>Editörler</p>
            <p>Eylem Hacer DEMİRCİ</p>
          </div>

          <div>
            <p>Yayın Koordinatörü</p>
            <p>Sencer Selim PUSAT</p>
          </div>

          <div>
            <p>Tasarım</p>
            <p>Mehmet Demir</p>
          </div>

          <div className="pt-5">
            <p>Görsel Sanat Yönetmeni</p>
            <p>Ayşegül KIR</p>
          </div>

          <div className="pt-5">
            <p>Yayın Kurulu</p>
            <p>Ahmet DEMİR</p>
            <p>Eylem Hacer DEMİRCİ</p>
            <p>Osman GÖKÇELİ</p>
            <p>Halil Haluk DURKAN</p>
            <p>Mehmet Can SALT</p>
          </div>

          <div className="pt-5">
            <p>Yayın Türü</p>
            <p>Süreli Yayın / Aylık</p>
          </div>

          <div>
            <p>Yayıncı</p>
            <p>İRTİBAT DERGİSİ</p>
          </div>

          <div>
            <p>Yönetim Yeri</p>
            <p>Afşin / KAHRAMANMARAŞ</p>
          </div>

          <div>
            <p>İletişim</p>
            <p>
              E-posta:{" "}
              <a href="mailto:irtibatdergi@gmail.com" className="underline">
                irtibatdergi@gmail.com
              </a>
            </p>
            <p>
              Web:{" "}
              <a
                href="https://www.irtibatdergi.com"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                www.irtibatdergi.com
              </a>
            </p>
          </div>

          <div>
            <p>Sosyal Medya</p>
            <p>
              Instagram:{" "}
              <a
                href="https://www.instagram.com/irtibatdergi"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                @irtibatdergi
              </a>
            </p>
            <p>
              X:{" "}
              <a
                href="https://x.com/irtibatdergi"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                @irtibatdergi
              </a>
            </p>
            <p>
              Tiktok:{" "}
              <a
                href="https://www.tiktok.com/@irtibatdergi"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                @irtibatdergi
              </a>
            </p>
            <p>
              Facebook:{" "}
              <a
                href="https://www.facebook.com/irtibatdergi"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                irtibatdergi
              </a>
            </p>
          </div>

          <div>
            <p>Telif Hakkı</p>
            <p className="mx-auto max-w-2xl">
              İrtibat Dergisi’nde yayımlanan yazı ve görsellerin tüm hakları saklıdır. Kaynak
              gösterilmeden alıntı yapılamaz. Yazıların sorumluluğu yazarlarına aittir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
