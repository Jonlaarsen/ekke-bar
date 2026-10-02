import { hasDatabase, getSql } from "@/lib/db";
import type {
  MenuCategory,
  MenuItem,
  MenuSubcategory,
  MenuTree,
} from "@/lib/menu";
import { unstable_noStore as noStore } from "next/cache";

function mapCategory(row: Record<string, unknown>): MenuCategory {
  return {
    id: Number(row.id),
    name: String(row.name),
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapSubcategory(row: Record<string, unknown>): MenuSubcategory {
  return {
    id: Number(row.id),
    category_id: Number(row.category_id),
    name: String(row.name),
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function mapItem(row: Record<string, unknown>): MenuItem {
  const subcategoryId = row.subcategory_id;
  return {
    id: Number(row.id),
    category_id: Number(row.category_id),
    subcategory_id:
      subcategoryId === null || subcategoryId === undefined
        ? null
        : Number(subcategoryId),
    name: String(row.name),
    ingredients_origin: String(row.ingredients_origin ?? ""),
    price: String(row.price),
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

async function assertSubcategoryInCategory(
  categoryId: number,
  subcategoryId: number | null,
) {
  if (subcategoryId === null) return;
  const sql = getSql();
  const rows = await sql`
    SELECT id FROM menu_subcategories
    WHERE id = ${subcategoryId} AND category_id = ${categoryId}
    LIMIT 1
  `;
  if (!rows[0]) {
    throw new Error("Subcategory does not belong to category");
  }
}

export async function getMenuTree(): Promise<MenuTree> {
  noStore();
  if (!hasDatabase()) return [];

  const sql = getSql();

  const categories = (
    await sql`
      SELECT id, name, sort_order, created_at, updated_at
      FROM menu_categories
      ORDER BY sort_order ASC, id ASC
    `
  ).map((row) => mapCategory(row as Record<string, unknown>));

  if (categories.length === 0) return [];

  const subcategories = (
    await sql`
      SELECT id, category_id, name, sort_order, created_at, updated_at
      FROM menu_subcategories
      ORDER BY sort_order ASC, id ASC
    `
  ).map((row) => mapSubcategory(row as Record<string, unknown>));

  const items = (
    await sql`
      SELECT id, category_id, subcategory_id, name, ingredients_origin, price, sort_order, created_at, updated_at
      FROM menu_items
      ORDER BY sort_order ASC, id ASC
    `
  ).map((row) => mapItem(row as Record<string, unknown>));

  const itemsBySub = new Map<number, MenuItem[]>();
  const itemsByCat = new Map<number, MenuItem[]>();
  for (const item of items) {
    if (item.subcategory_id === null) {
      const list = itemsByCat.get(item.category_id) ?? [];
      list.push(item);
      itemsByCat.set(item.category_id, list);
    } else {
      const list = itemsBySub.get(item.subcategory_id) ?? [];
      list.push(item);
      itemsBySub.set(item.subcategory_id, list);
    }
  }

  const subsByCat = new Map<number, MenuSubcategory[]>();
  for (const sub of subcategories) {
    const withItems: MenuSubcategory = {
      ...sub,
      items: itemsBySub.get(sub.id) ?? [],
    };
    const list = subsByCat.get(sub.category_id) ?? [];
    list.push(withItems);
    subsByCat.set(sub.category_id, list);
  }

  return categories.map((cat) => ({
    ...cat,
    items: itemsByCat.get(cat.id) ?? [],
    subcategories: subsByCat.get(cat.id) ?? [],
  }));
}

async function nextCategorySortOrder() {
  const sql = getSql();
  const rows = await sql`
    SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order FROM menu_categories
  `;
  return Number((rows[0] as { next_order: number }).next_order ?? 0);
}

async function nextSubcategorySortOrder(categoryId: number) {
  const sql = getSql();
  const rows = await sql`
    SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order
    FROM menu_subcategories
    WHERE category_id = ${categoryId}
  `;
  return Number((rows[0] as { next_order: number }).next_order ?? 0);
}

async function nextItemSortOrder(
  categoryId: number,
  subcategoryId: number | null,
) {
  const sql = getSql();
  const rows =
    subcategoryId === null
      ? await sql`
          SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order
          FROM menu_items
          WHERE category_id = ${categoryId} AND subcategory_id IS NULL
        `
      : await sql`
          SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order
          FROM menu_items
          WHERE subcategory_id = ${subcategoryId}
        `;
  return Number((rows[0] as { next_order: number }).next_order ?? 0);
}

export async function createMenuCategory(name: string) {
  const sql = getSql();
  const sort_order = await nextCategorySortOrder();
  const rows = await sql`
    INSERT INTO menu_categories (name, sort_order)
    VALUES (${name}, ${sort_order})
    RETURNING id, name, sort_order, created_at, updated_at
  `;
  return mapCategory(rows[0] as Record<string, unknown>);
}

export async function updateMenuCategory(
  id: number,
  input: { name?: string; sort_order?: number },
) {
  const sql = getSql();
  const existing = await sql`
    SELECT id, name, sort_order, created_at, updated_at
    FROM menu_categories WHERE id = ${id} LIMIT 1
  `;
  if (!existing[0]) return null;
  const cur = mapCategory(existing[0] as Record<string, unknown>);

  const rows = await sql`
    UPDATE menu_categories
    SET
      name = ${input.name ?? cur.name},
      sort_order = ${input.sort_order ?? cur.sort_order},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, name, sort_order, created_at, updated_at
  `;
  return mapCategory(rows[0] as Record<string, unknown>);
}

export async function deleteMenuCategory(id: number) {
  const sql = getSql();
  const rows = await sql`
    DELETE FROM menu_categories WHERE id = ${id} RETURNING id
  `;
  return rows.length > 0;
}

export async function createMenuSubcategory(categoryId: number, name: string) {
  const sql = getSql();
  const sort_order = await nextSubcategorySortOrder(categoryId);
  const rows = await sql`
    INSERT INTO menu_subcategories (category_id, name, sort_order)
    VALUES (${categoryId}, ${name}, ${sort_order})
    RETURNING id, category_id, name, sort_order, created_at, updated_at
  `;
  return mapSubcategory(rows[0] as Record<string, unknown>);
}

export async function updateMenuSubcategory(
  id: number,
  input: { name?: string; sort_order?: number; category_id?: number },
) {
  const sql = getSql();
  const existing = await sql`
    SELECT id, category_id, name, sort_order, created_at, updated_at
    FROM menu_subcategories WHERE id = ${id} LIMIT 1
  `;
  if (!existing[0]) return null;
  const cur = mapSubcategory(existing[0] as Record<string, unknown>);

  const rows = await sql`
    UPDATE menu_subcategories
    SET
      category_id = ${input.category_id ?? cur.category_id},
      name = ${input.name ?? cur.name},
      sort_order = ${input.sort_order ?? cur.sort_order},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, category_id, name, sort_order, created_at, updated_at
  `;
  return mapSubcategory(rows[0] as Record<string, unknown>);
}

export async function deleteMenuSubcategory(id: number) {
  const sql = getSql();
  const rows = await sql`
    DELETE FROM menu_subcategories WHERE id = ${id} RETURNING id
  `;
  return rows.length > 0;
}

export async function createMenuItem(input: {
  category_id: number;
  subcategory_id: number | null;
  name: string;
  ingredients_origin: string;
  price: string;
}) {
  await assertSubcategoryInCategory(input.category_id, input.subcategory_id);

  const sql = getSql();
  const sort_order = await nextItemSortOrder(
    input.category_id,
    input.subcategory_id,
  );
  const rows = await sql`
    INSERT INTO menu_items (category_id, subcategory_id, name, ingredients_origin, price, sort_order)
    VALUES (
      ${input.category_id},
      ${input.subcategory_id},
      ${input.name},
      ${input.ingredients_origin},
      ${input.price},
      ${sort_order}
    )
    RETURNING id, category_id, subcategory_id, name, ingredients_origin, price, sort_order, created_at, updated_at
  `;
  return mapItem(rows[0] as Record<string, unknown>);
}

export async function updateMenuItem(
  id: number,
  input: {
    category_id?: number;
    subcategory_id?: number | null;
    name?: string;
    ingredients_origin?: string;
    price?: string;
    sort_order?: number;
  },
) {
  const sql = getSql();
  const existing = await sql`
    SELECT id, category_id, subcategory_id, name, ingredients_origin, price, sort_order, created_at, updated_at
    FROM menu_items WHERE id = ${id} LIMIT 1
  `;
  if (!existing[0]) return null;
  const cur = mapItem(existing[0] as Record<string, unknown>);

  const category_id = input.category_id ?? cur.category_id;
  const subcategory_id =
    input.subcategory_id !== undefined
      ? input.subcategory_id
      : cur.subcategory_id;

  await assertSubcategoryInCategory(category_id, subcategory_id);

  const rows = await sql`
    UPDATE menu_items
    SET
      category_id = ${category_id},
      subcategory_id = ${subcategory_id},
      name = ${input.name ?? cur.name},
      ingredients_origin = ${input.ingredients_origin ?? cur.ingredients_origin},
      price = ${input.price ?? cur.price},
      sort_order = ${input.sort_order ?? cur.sort_order},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, category_id, subcategory_id, name, ingredients_origin, price, sort_order, created_at, updated_at
  `;
  return mapItem(rows[0] as Record<string, unknown>);
}

export async function deleteMenuItem(id: number) {
  const sql = getSql();
  const rows = await sql`
    DELETE FROM menu_items WHERE id = ${id} RETURNING id
  `;
  return rows.length > 0;
}
