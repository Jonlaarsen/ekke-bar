import { NextResponse } from "next/server";
import {
  createMenuCard,
  getNextSortOrder,
  listMenuCards,
} from "@/lib/menu-cards-db";
import { requireAuthResponse } from "@/lib/require-auth";
import { withDisplayImageUrl } from "@/lib/menu-image-url";
import { uploadMenuImage } from "@/lib/upload";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cards = (await listMenuCards()).map(withDisplayImageUrl);
    return NextResponse.json(cards);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to load menu cards" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authError = await requireAuthResponse();
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const title = String(formData.get("title") ?? "").trim();
    const file = formData.get("image");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );
    }

    const image_url = await uploadMenuImage(file);
    const sort_order = await getNextSortOrder();
    const card = await createMenuCard({ title, image_url, sort_order });

    return NextResponse.json(withDisplayImageUrl(card), { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create menu card" },
      { status: 500 },
    );
  }
}
