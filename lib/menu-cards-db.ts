import { hasDatabase, getSql } from "@/lib/db";
import type { MenuCard, MenuCardInput } from "@/lib/menu-cards";

function mapRow(row: Record<string, unknown>): MenuCard {
  return {
    id: Number(row.id),
    title: String(row.title ?? ""),
    image_url: String(row.image_url),
    sort_order: Number(row.sort_order ?? 0),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function listMenuCards(): Promise<MenuCard[]> {
  if (!hasDatabase()) return [];
  const sql = getSql();
  const rows = await sql`
    SELECT id, title, image_url, sort_order, created_at, updated_at
    FROM menu_cards
    ORDER BY sort_order ASC, id ASC
  `;
  return rows.map((row) => mapRow(row as Record<string, unknown>));
}

export async function getMenuCard(id: number): Promise<MenuCard | null> {
  if (!hasDatabase()) return null;
  const sql = getSql();
  const rows = await sql`
    SELECT id, title, image_url, sort_order, created_at, updated_at
    FROM menu_cards
    WHERE id = ${id}
    LIMIT 1
  `;
  const row = rows[0];
  return row ? mapRow(row as Record<string, unknown>) : null;
}

export async function createMenuCard(input: MenuCardInput): Promise<MenuCard> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO menu_cards (title, image_url, sort_order)
    VALUES (
      ${input.title},
      ${input.image_url},
      ${input.sort_order ?? 0}
    )
    RETURNING id, title, image_url, sort_order, created_at, updated_at
  `;
  return mapRow(rows[0] as Record<string, unknown>);
}

export async function updateMenuCard(
  id: number,
  input: Partial<MenuCardInput>,
): Promise<MenuCard | null> {
  const existing = await getMenuCard(id);
  if (!existing) return null;

  const sql = getSql();
  const rows = await sql`
    UPDATE menu_cards
    SET
      title = ${input.title ?? existing.title},
      image_url = ${input.image_url ?? existing.image_url},
      sort_order = ${input.sort_order ?? existing.sort_order},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, title, image_url, sort_order, created_at, updated_at
  `;
  return mapRow(rows[0] as Record<string, unknown>);
}

export async function deleteMenuCard(id: number): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    DELETE FROM menu_cards
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}

export async function getNextSortOrder(): Promise<number> {
  const sql = getSql();
  const rows = await sql`
    SELECT COALESCE(MAX(sort_order), -1) + 1 AS next_order
    FROM menu_cards
  `;
  return Number((rows[0] as { next_order: number }).next_order ?? 0);
}
