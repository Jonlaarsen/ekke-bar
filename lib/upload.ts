import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
}

export async function uploadMenuImage(file: File) {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(
      `menu/${Date.now()}-${sanitizeFilename(file.name)}`,
      file,
      { access: "public", token: process.env.BLOB_READ_WRITE_TOKEN },
    );
    return blob.url;
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const dir = path.join(process.cwd(), "public", "uploads", "menu");
  await mkdir(dir, { recursive: true });
  const filename = `${Date.now()}-${sanitizeFilename(file.name)}`;
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/menu/${filename}`;
}
