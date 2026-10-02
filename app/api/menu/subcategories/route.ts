import { createMenuSubcategory } from "@/lib/menu-db";
import { requireAuthResponse } from "@/lib/require-auth";
import { revalidateMenuPages } from "@/lib/revalidate-menu";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authError = await requireAuthResponse();
  if (authError) return authError;

  try {
    const body = await request.json();
    const category_id = Number(body.category_id);
    const name = String(body.name ?? "").trim();

    if (!category_id || Number.isNaN(category_id)) {
      return NextResponse.json(
        { error: "category_id is required" },
        { status: 400 },
      );
    }
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const subcategory = await createMenuSubcategory(category_id, name);
    revalidateMenuPages();
    return NextResponse.json(subcategory, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create subcategory" },
      { status: 500 },
    );
  }
}
