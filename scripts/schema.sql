CREATE TABLE IF NOT EXISTS menu_cards (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS menu_cards_sort_order_idx ON menu_cards (sort_order, id);
