import {
  deleteMenuCard,
  getMenuCard,
  updateMenuCard,
} from "@/lib/menu-cards-db";
import { requireAuthResponse } from "@/lib/require-auth";
import { withDisplayImageUrl } from "@/lib/menu-image-url";
import { revalidateMenuPages } from "@/lib/revalidate-menu";
import { uploadMenuImage } from "@/lib/upload";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const card = await getMenuCard(Number(id));
    if (!card) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(withDisplayImageUrl(card));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load card" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const authError = await requireAuthResponse();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const cardId = Number(id);
    const formData = await request.formData();
    const title = formData.has("title")
      ? String(formData.get("title") ?? "").trim()
      : undefined;
    const sort_order = formData.has("sort_order")
      ? Number(formData.get("sort_order"))
      : undefined;
    const file = formData.get("image");

    const updates: {
      title?: string;
      image_url?: string;
      sort_order?: number;
    } = {};

    if (title !== undefined) updates.title = title;
    if (sort_order !== undefined && !Number.isNaN(sort_order)) {
      updates.sort_order = sort_order;
    }

    if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "File must be an image" },
          { status: 400 },
        );
      }
      updates.image_url = await uploadMenuImage(file);
    }

    const card = await updateMenuCard(cardId, updates);
    if (!card) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    revalidateMenuPages();

    return NextResponse.json(withDisplayImageUrl(card));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update menu card" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireAuthResponse();
  if (authError) return authError;

  try {
    const { id } = await context.params;
    const deleted = await deleteMenuCard(Number(id));
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    revalidateMenuPages();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete menu card" },
      { status: 500 },
    );
  }
}
