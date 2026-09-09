-- 2. kurulum: site ayarları (menüler, iletişim, slider)
-- npx wrangler d1 execute dergi-db --remote --file=./db/migration2.sql

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO settings (key, value) VALUES
('header_menu', '[{"label":"Ana Sayfa","href":"/"},{"label":"Hakkımızda","href":"/hakkimizda"},{"label":"Künye","href":"/kunye"},{"label":"Eser Gönder","href":"/eser-gonder"},{"label":"Bu Ayki Önerilerimiz","href":"/oneriler"}]'),
('footer_menu', '[{"label":"Ana Sayfa","href":"/"},{"label":"Hakkımızda","href":"/hakkimizda"},{"label":"Künye","href":"/kunye"},{"label":"Eser Gönder","href":"/eser-gonder"},{"label":"Bu Ayki Önerilerimiz","href":"/oneriler"},{"label":"İletişim","href":"/iletisim"}]'),
('contact', '{"address":"Afşin / KAHRAMANMARAŞ","site":"www.irtibatdergi.com","email":"irtibatdergi@gmail.com"}'),
('socials', '[{"label":"Instagram","href":"https://www.instagram.com/irtibatdergi"},{"label":"X","href":"https://x.com/irtibatdergi"},{"label":"TikTok","href":"https://www.tiktok.com/@irtibatdergi"},{"label":"Facebook","href":"https://www.facebook.com/irtibatdergi"}]'),
('slider_config', '{"interval":6000,"max":5}');
