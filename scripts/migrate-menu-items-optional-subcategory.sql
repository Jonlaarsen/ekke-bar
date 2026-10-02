-- Run once if menu_items already exists without category_id / with required subcategory_id

ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES menu_categories(id) ON DELETE CASCADE;

UPDATE menu_items mi
SET category_id = sc.category_id
FROM menu_subcategories sc
WHERE mi.subcategory_id = sc.id
  AND mi.category_id IS NULL;

ALTER TABLE menu_items
  ALTER COLUMN category_id SET NOT NULL;

ALTER TABLE menu_items
  ALTER COLUMN subcategory_id DROP NOT NULL;

CREATE INDEX IF NOT EXISTS menu_items_category_idx
  ON menu_items (category_id, sort_order, id);
