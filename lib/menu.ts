export type MenuItem = {
  id: number;
  category_id: number;
  subcategory_id: number | null;
  name: string;
  ingredients_origin: string;
  price: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type MenuSubcategory = {
  id: number;
  category_id: number;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  items?: MenuItem[];
};

export type MenuCategory = {
  id: number;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  items?: MenuItem[];
  subcategories?: MenuSubcategory[];
};

export type MenuTree = MenuCategory[];

export function countMenuItems(tree: MenuTree) {
  return tree.reduce(
    (n, cat) =>
      n +
      (cat.items?.length ?? 0) +
      (cat.subcategories?.reduce(
        (m, sub) => m + (sub.items?.length ?? 0),
        0,
      ) ?? 0),
    0,
  );
}

/** Display price: format plain numbers as SEK; keep text like "85 / 120" as entered. */
export function formatMenuPrice(price: string | number) {
  const raw = String(price).trim();
  if (!raw) return raw;

  const normalized = raw.replace(",", ".");
  if (/^\d+(\.\d+)?$/.test(normalized)) {
    const value = Number(normalized);
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: "SEK",
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
  }

  return raw;
}

export function normalizeMenuPriceInput(raw: unknown) {
  const price = String(raw ?? "").trim();
  if (!price) return null;
  if (price.length > 120) return null;
  return price;
}
