import { deleteMenuCategory, updateMenuCategory } from "@/lib/menu-db";
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
    const sort_order =
      body.sort_order !== undefined ? Number(body.sort_order) : undefined;

    if (name === "") {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const category = await updateMenuCategory(Number(id), { name, sort_order });
    if (!category) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    revalidateMenuPages();
    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireAuthResponse();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const deleted = await deleteMenuCategory(Number(id));
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    revalidateMenuPages();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 },
    );
  }
}
