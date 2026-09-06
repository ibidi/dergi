export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  categories: string[];
  author: string;
  date: string;
  readTime: number;
  image: string;
  featured?: boolean;
  content: string[];
};

export const CATEGORIES: Category[] = [
  { slug: "roportajlar", name: "Röportaj", description: "İlham veren isimlerle özel röportajlar" },
  { slug: "moda", name: "Moda", description: "Sezon trendleri, stil önerileri ve defileler" },
  { slug: "sanat", name: "Sanat", description: "Sergi, sinema, müzik ve sahne sanatları" },
  { slug: "davetler", name: "Davet", description: "Cemiyet hayatı, gala, açılış ve kutlamalar" },
  { slug: "yazarlar", name: "Yazarlar", description: "Köşe yazıları ve konuk yazarlar" },
  { slug: "gastronomi", name: "Gastronomi", description: "Şefler, restoranlar ve lezzet rotaları" },
  { slug: "saglik", name: "Sağlık", description: "İyi yaşam, bakım ve sağlıklı alışkanlıklar" },
  { slug: "gezi", name: "Gezi", description: "Şehir rehberleri ve seyahat rotaları" },
  { slug: "video", name: "Video", description: "Kamera arkası ve özel video içerikler" },
  { slug: "kapak-konusu", name: "Kapak Konusu", description: "Ayın kapak yıldızı ve çekim hikâyesi" },
];

const img = (seed: string, w = 800, h = 600) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

const body = (topic: string): string[] => [
  `${topic} — İrtibat tarzı bir dergi haberi nasıl yazılır, onun tadında bir giriş paragrafı. Şehrin temposu, stilin detayları ve merak edilen isimlerin dünyasına yakından bir bakış sunuyoruz.`,
  "Çekim günü sabah erken saatlerde başladı. Stil ekibi son dokunuşları yaparken, röportaj için hazırlanan sorular da masadaki yerini aldı. Ortamda heyecanlı ama bir o kadar da keyifli bir enerji vardı.",
  "“Benim için en önemli şey samimi kalmak. Ne yaparsam yapayım, içime sinmeyen hiçbir işin içinde olmam,” sözleriyle sohbete başlıyor. Kariyerinin dönüm noktalarını anlatırken gözlerinin içi gülüyor.",
  "Modadan sanata, gastronomiden seyahate uzanan geniş bir sohbetin ardından kapanışı geleceğe dair planlarla yapıyoruz. Yeni projeler yolda; takipte kalın.",
];

export const ARTICLES: Article[] = [
  {
    slug: "heyecanli-tutkulu-merakli-selin-aras",
    title: "Heyecanlı, Tutkulu, Meraklı Selin Aras",
    excerpt: "Ankara'dan İstanbul'a uzanan cesur bir yolculuk; değişim, hayaller ve aşk üzerine samimi bir kapak röportajı.",
    categories: ["kapak-konusu", "roportajlar"],
    author: "İpek Sönmez",
    date: "5 Eylül 2026",
    readTime: 8,
    image: img("irtibat-cover", 1600, 900),
    featured: true,
    content: body("Eylül kapağımız"),
  },
  {
    slug: "derya-aksoy",
    title: "Derya Aksoy",
    excerpt: "Gerçek ve samimi kalmak üzerine: sahneden hayata uzanan bir sohbet.",
    categories: ["roportajlar"],
    author: "İrtibat Ekibi",
    date: "4 Eylül 2026",
    readTime: 6,
    image: img("irtibat-derya", 1600, 900),
    featured: true,
    content: body("Derya Aksoy röportajı"),
  },
  {
    slug: "kaan-yildirim",
    title: "Kaan Yıldırım",
    excerpt: "Yeni nesil oyunculuğun yükselen ismiyle kariyer ve ilham üzerine.",
    categories: ["roportajlar"],
    author: "İrtibat Ekibi",
    date: "4 Eylül 2026",
    readTime: 5,
    image: img("irtibat-kaan", 1600, 900),
    featured: true,
    content: body("Kaan Yıldırım röportajı"),
  },
  {
    slug: "ruhun-ve-lezzetin-kesisim-noktasi",
    title: "Ruhun ve Lezzetin Kesişim Noktası",
    excerpt: "Şef Kerem Soylu ile mutfakta felsefe, ateş ve sadelik üzerine konuştuk.",
    categories: ["roportajlar", "gastronomi"],
    author: "İrtibat Ekibi",
    date: "3 Eylül 2026",
    readTime: 6,
    image: img("irtibat-chef", 800, 600),
    featured: true,
    content: body("Şefle buluşma"),
  },
  {
    slug: "ipek-keten-el-isciligi",
    title: "İpek, Keten, Renkler ve El İşçiliği",
    excerpt: "Sürdürülebilir tekstilin yükselen yıldızı olan yerel atölyede bir gün geçirdik.",
    categories: ["roportajlar", "moda"],
    author: "Zeynep Uslu",
    date: "3 Eylül 2026",
    readTime: 5,
    image: img("irtibat-atelier"),
    content: body("Atölye ziyareti"),
  },
  {
    slug: "evde-hayati-kolaylastiran-teknoloji",
    title: "Evde Hayatı Kolaylaştıran Teknoloji",
    excerpt: "Akıllı ev ekosistemleri gerçekten hayatı kolaylaştırıyor mu? Denedik, yazdık.",
    categories: ["roportajlar"],
    author: "İrtibat Ekibi",
    date: "2 Eylül 2026",
    readTime: 4,
    image: img("irtibat-tech"),
    content: body("Teknoloji dosyası"),
  },
  {
    slug: "academic-chic",
    title: "Academic Chic: Kampüsten Sokağa",
    excerpt: "Blazer'lar, pilili etekler ve loafer'lar… Sonbaharın en akıllı trendi.",
    categories: ["moda"],
    author: "Merve Tunç",
    date: "2 Eylül 2026",
    readTime: 4,
    image: img("irtibat-fashion"),
    featured: true,
    content: body("Moda çekimi"),
  },
  {
    slug: "sessiz-luksun-tatildeki-yorumu",
    title: "Sessiz Lüksün Tatildeki Zarif Yorumu",
    excerpt: "Logosuz şıklık, keten takımlar ve hasır detaylar: Bodrum'da minimal zarafet.",
    categories: ["moda", "gezi"],
    author: "Ece Yıldız",
    date: "28 Ağustos 2026",
    readTime: 5,
    image: img("irtibat-quiet-luxury"),
    content: body("Tatil stili"),
  },
  {
    slug: "bogazda-moda-ve-kultur",
    title: "Boğaz'da Moda ve Kültür Buluşması",
    excerpt: "Tarihi bir yalıda gerçekleşen defilede moda ile çağdaş sanat aynı podyumdaydı.",
    categories: ["sanat", "moda"],
    author: "İrtibat Ekibi",
    date: "25 Ağustos 2026",
    readTime: 6,
    image: img("irtibat-bosphorus"),
    content: body("Defile gecesi"),
  },
  {
    slug: "bodrumda-renklerin-hafiza-yolculugu",
    title: "Bodrum'da Renklerin Hafıza Yolculuğu",
    excerpt: "Yaz sezonunun en çok konuşulan sergisi Ege'nin ışığını tuvale taşıyor.",
    categories: ["sanat"],
    author: "Deniz Ar",
    date: "20 Ağustos 2026",
    readTime: 4,
    image: img("irtibat-gallery"),
    content: body("Sergi turu"),
  },
  {
    slug: "brandroomda-renkli-bulusma",
    title: "Brandroom'da Renkli Buluşma",
    excerpt: "Cemiyet hayatının sevilen isimleri yeni sezon tanıtımında bir araya geldi.",
    categories: ["davetler"],
    author: "İrtibat Ekibi",
    date: "1 Eylül 2026",
    readTime: 3,
    image: img("irtibat-party"),
    content: body("Davet gecesi"),
  },
  {
    slug: "tersane-istanbulda-gorkemli-dugun",
    title: "Tersane İstanbul'da Görkemli Düğün",
    excerpt: "Haliç'e karşı masalsı bir gece: detaylarıyla konuşulan düğünden kareler.",
    categories: ["davetler", "yazarlar"],
    author: "İrtibat Özel",
    date: "30 Ağustos 2026",
    readTime: 5,
    image: img("irtibat-wedding"),
    featured: true,
    content: body("Düğün özel"),
  },
  {
    slug: "gaziantepte-unutulmaz-gece",
    title: "Gaziantep'te Unutulmaz Bir Gece",
    excerpt: "Geleneksel motifler modern düğün tasarımıyla buluştu.",
    categories: ["davetler", "yazarlar"],
    author: "İrtibat Özel",
    date: "15 Ağustos 2026",
    readTime: 4,
    image: img("irtibat-gaziantep"),
    content: body("Anadolu düğünü"),
  },
  {
    slug: "kum-saati",
    title: "Kum Saati",
    excerpt: "Zamanın ruhunu yakalayan silüetler: 2026 sonbaharının feminen dönüşü.",
    categories: ["yazarlar", "moda"],
    author: "Zeynep Uslu",
    date: "4 Eylül 2026",
    readTime: 3,
    image: img("irtibat-kumsaati"),
    content: body("Köşe yazısı"),
  },
  {
    slug: "derin-mavi",
    title: "Derin Mavi",
    excerpt: "Lacivertin tonlarında bir stil manifestosu.",
    categories: ["yazarlar"],
    author: "Zeynep Uslu",
    date: "3 Eylül 2026",
    readTime: 3,
    image: img("irtibat-derinmavi"),
    content: body("Stil yazısı"),
  },
  {
    slug: "sonbaharda-makyaj-trendi",
    title: "Bu Sonbaharda Makyaj Trendi Nasıl Değişiyor?",
    excerpt: "Işıltılı ten, bordo dudaklar ve yumuşak smokey gözler geri döndü.",
    categories: ["yazarlar", "saglik"],
    author: "Ece Yıldız",
    date: "1 Eylül 2026",
    readTime: 4,
    image: img("irtibat-makeup"),
    content: body("Güzellik dosyası"),
  },
  {
    slug: "dogadan-ilham-alan-gastronomi",
    title: "Doğadan İlham Alan Gastronomi Deneyimi",
    excerpt: "Alaçatı'da tarladan tabağa uzanan bir şef restoranı hikâyesi.",
    categories: ["gastronomi", "gezi"],
    author: "İrtibat Ekibi",
    date: "22 Ağustos 2026",
    readTime: 5,
    image: img("irtibat-farm"),
    content: body("Lezzet rotası"),
  },
  {
    slug: "saglikli-gulusun-sirlari",
    title: "Sağlıklı Gülüşün Sırları",
    excerpt: "Uzman diş hekimiyle ağız sağlığında gözden kaçan detayları konuştuk.",
    categories: ["saglik", "roportajlar"],
    author: "Uzm. Dt. Elif Kaya",
    date: "21 Ağustos 2026",
    readTime: 5,
    image: img("irtibat-smile"),
    content: body("Sağlık röportajı"),
  },
  {
    slug: "color-pop-y2k",
    title: "Color Pop ve Y2K Sportifliği",
    excerpt: "Neon renkler, kargo pantolonlar ve spor şıklık sokaklara döndü.",
    categories: ["moda"],
    author: "Merve Tunç",
    date: "18 Ağustos 2026",
    readTime: 3,
    image: img("irtibat-y2k"),
    content: body("Sokak stili"),
  },
  {
    slug: "kapak-cekimi-kamera-arkasi",
    title: "Melis Anıl ile Kapak Çekimi Kamera Arkası",
    excerpt: "Ayın en çok izlenen videosu: kahkaha dolu bir çekim günü.",
    categories: ["video"],
    author: "İrtibat TV",
    date: "10 Ağustos 2026",
    readTime: 2,
    image: img("irtibat-video1", 1100, 550),
    content: body("Video özel"),
  },
  {
    slug: "stil-uzerine-sohbet",
    title: "Lara Su ile Stil Üzerine",
    excerpt: "Kırmızı halı sırları ve favori tasarımcılar üzerine keyifli sohbet.",
    categories: ["video"],
    author: "İrtibat TV",
    date: "5 Ağustos 2026",
    readTime: 2,
    image: img("irtibat-video2", 1100, 550),
    content: body("Video sohbet"),
  },
];

export const categoryBySlug = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug);

export const articlesByCategory = (slug: string) =>
  ARTICLES.filter((a) => a.categories.includes(slug));

export const getArticle = (kategori: string, slug: string) =>
  ARTICLES.find((a) => a.slug === slug && a.categories.includes(kategori)) ??
  ARTICLES.find((a) => a.slug === slug);

export const trending = ARTICLES.slice(0, 7);
