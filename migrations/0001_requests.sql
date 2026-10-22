-- Contact and Project Vega requests. Rows older than 12 months are deleted by the form handler.
CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  kind TEXT NOT NULL CHECK (kind IN ('contact', 'vega')),
  locale TEXT NOT NULL CHECK (locale IN ('da', 'en')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  organisation TEXT,
  topic TEXT,
  message TEXT NOT NULL,
  consent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ny',
  ip_hash TEXT
);

CREATE INDEX IF NOT EXISTS requests_created_at ON requests (created_at);
CREATE INDEX IF NOT EXISTS requests_ip_hash ON requests (ip_hash);
CREATE INDEX IF NOT EXISTS requests_kind_status ON requests (kind, status);
