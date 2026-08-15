CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  step TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  match_score INTEGER NOT NULL DEFAULT 0,
  reason TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE measurements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'user-1',
  captured_at TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  oil_coverage INTEGER NOT NULL,
  oil_intensity INTEGER NOT NULL,
  t_zone_score INTEGER NOT NULL,
  u_zone_score INTEGER NOT NULL,
  oil_score INTEGER NOT NULL,
  confidence REAL NOT NULL,
  skin_type TEXT NOT NULL,
  skin_character TEXT NOT NULL
);

CREATE TABLE zone_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  measurement_id TEXT NOT NULL REFERENCES measurements(id) ON DELETE CASCADE,
  zone TEXT NOT NULL,
  oil_coverage INTEGER NOT NULL,
  oil_intensity INTEGER NOT NULL,
  score INTEGER NOT NULL
);

CREATE INDEX idx_zone_scores_measurement ON zone_scores(measurement_id);

CREATE TABLE routine_events (
  id TEXT PRIMARY KEY,
  measurement_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE wishlist (
  product_id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE guideline_images (
  id TEXT PRIMARY KEY,
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
