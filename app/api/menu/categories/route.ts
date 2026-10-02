import { createMenuCategory } from "@/lib/menu-db";
import { requireAuthResponse } from "@/lib/require-auth";
import { revalidateMenuPages } from "@/lib/revalidate-menu";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authError = await requireAuthResponse();
  if (authError) return authError;

  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const category = await createMenuCategory(name);
    revalidateMenuPages();
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 },
    );
  }
}
