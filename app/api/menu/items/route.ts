import { createMenuItem } from "@/lib/menu-db";
import { normalizeMenuPriceInput } from "@/lib/menu";
import { requireAuthResponse } from "@/lib/require-auth";
import { revalidateMenuPages } from "@/lib/revalidate-menu";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function parseSubcategoryId(raw: unknown): number | null {
  if (raw === null || raw === undefined || raw === "") return null;
  const id = Number(raw);
  if (Number.isNaN(id) || id <= 0) return null;
  return id;
}

export async function POST(request: Request) {
  const authError = await requireAuthResponse();
  if (authError) return authError;

  try {
    const body = await request.json();
    const category_id = Number(body.category_id);
    const subcategory_id = parseSubcategoryId(body.subcategory_id);
    const name = String(body.name ?? "").trim();
    const ingredients_origin = String(
      body.ingredients_origin ?? body.ingredients ?? "",
    ).trim();
    const price = normalizeMenuPriceInput(body.price);

    if (!category_id || Number.isNaN(category_id)) {
      return NextResponse.json(
        { error: "category_id is required" },
        { status: 400 },
      );
    }
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (price === null) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    const item = await createMenuItem({
      category_id,
      subcategory_id,
      name,
      ingredients_origin,
      price,
    });

    revalidateMenuPages();
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error && error.message.includes("Subcategory")
        ? "Underkategorin hör inte till vald kategori"
        : "Failed to create menu item";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
