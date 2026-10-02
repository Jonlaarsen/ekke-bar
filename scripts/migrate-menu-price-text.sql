-- Allow text prices e.g. "85 / 120" or "glas / flaska"

ALTER TABLE menu_items
  ALTER COLUMN price TYPE TEXT USING TRIM(price::text);
