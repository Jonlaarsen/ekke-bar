import { deleteMenuItem, updateMenuItem } from "@/lib/menu-db";
import { normalizeMenuPriceInput } from "@/lib/menu";
import { requireAuthResponse } from "@/lib/require-auth";
import { revalidateMenuPages } from "@/lib/revalidate-menu";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const authError = await requireAuthResponse();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const body = await request.json();
    const name =
      body.name !== undefined ? String(body.name).trim() : undefined;
    const ingredients_origin =
      body.ingredients_origin !== undefined
        ? String(body.ingredients_origin).trim()
        : body.ingredients !== undefined
          ? String(body.ingredients).trim()
          : undefined;
    const category_id =
      body.category_id !== undefined ? Number(body.category_id) : undefined;
    let subcategory_id: number | null | undefined;
    if (body.subcategory_id !== undefined) {
      if (body.subcategory_id === null || body.subcategory_id === "") {
        subcategory_id = null;
      } else {
        subcategory_id = Number(body.subcategory_id);
      }
    }
    const price =
      body.price !== undefined ? normalizeMenuPriceInput(body.price) : undefined;

    if (name === "" || price === null) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const item = await updateMenuItem(Number(id), {
      name,
      ingredients_origin,
      category_id,
      subcategory_id,
      price,
    });
    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    revalidateMenuPages();
    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update menu item" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireAuthResponse();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const deleted = await deleteMenuItem(Number(id));
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    revalidateMenuPages();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete menu item" },
      { status: 500 },
    );
  }
}
