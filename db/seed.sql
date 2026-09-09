-- İlk veriyi mevcut sitedeki içerikten doldurur.
-- Önce schema.sql'u çalıştırın, sonra:
-- npx wrangler d1 execute dergi-db --file=./db/seed.sql

INSERT OR IGNORE INTO categories (slug, name, description, sort) VALUES
  ('roportajlar','Röportaj','İlham veren isimlerle özel röportajlar',1),
  ('moda','Moda','Sezon trendleri, stil önerileri ve defileler',2),
  ('sanat','Sanat','Sergi, sinema, müzik ve sahne sanatları',3),
  ('davetler','Davet','Cemiyet hayatı, gala, açılış ve kutlamalar',4),
  ('yazarlar','Yazarlar','Köşe yazıları ve konuk yazarlar',5),
  ('gastronomi','Gastronomi','Şefler, restoranlar ve lezzet rotaları',6),
  ('saglik','Sağlık','İyi yaşam, bakım ve sağlıklı alışkanlıklar',7),
  ('gezi','Gezi','Şehir rehberleri ve seyahat rotaları',8),
  ('video','Video','Kamera arkası ve özel video içerikler',9),
  ('kapak-konusu','Kapak Konusu','Ayın kapak yıldızı ve çekim hikâyesi',10);
