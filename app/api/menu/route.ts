import { getMenuTree } from "@/lib/menu-db";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const tree = await getMenuTree();
    return NextResponse.json(tree);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load menu" }, { status: 500 });
  }
}
