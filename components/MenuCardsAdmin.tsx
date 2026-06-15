"use client";

import type { MenuCard } from "@/lib/menu-cards";
import { FormEvent, useCallback, useEffect, useState } from "react";

export default function MenuCardsAdmin() {
  const [cards, setCards] = useState<MenuCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadCards = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/menu-cards");
      if (!res.ok) throw new Error("Failed to load");
      setCards(await res.json());
    } catch {
      setError("Kunde inte ladda menykort. Kontrollera DATABASE_URL och schema.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const onUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);

      const res = await fetch("/api/menu-cards", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Upload failed");
      }

      setTitle("");
      setImage(null);
      (e.target as HTMLFormElement).reset();
      await loadCards();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Uppladdning misslyckades");
    } finally {
      setUploading(false);
    }
  };

  const onUpdateTitle = async (id: number, newTitle: string) => {
    const formData = new FormData();
    formData.append("title", newTitle);
    const res = await fetch(`/api/menu-cards/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (res.ok) await loadCards();
  };

  const onReplaceImage = async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`/api/menu-cards/${id}`, {
      method: "PUT",
      body: formData,
    });
    if (res.ok) await loadCards();
  };

  const onDelete = async (id: number) => {
    if (!confirm("Ta bort detta menykort?")) return;
    const res = await fetch(`/api/menu-cards/${id}`, { method: "DELETE" });
    if (res.ok) await loadCards();
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={onUpload}
        className="space-y-4 rounded-lg border border-primary/15 bg-white/50 p-6"
      >
        <h2 className="font-display text-2xl font-bold text-primary">
          Ladda upp menykort
        </h2>
        <p className="text-sm text-foreground/60">
          Ladda upp stående A4-bilder (menykort). De visas på menysidan.
        </p>

        <label className="block space-y-1">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary/70">
            Titel (valfritt)
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="t.ex. Öl, Vin, Snacks"
            className="w-full rounded-md border border-primary/20 bg-white px-3 py-2 outline-none focus:border-primary"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary/70">
            Bild
          </span>
          <input
            type="file"
            accept="image/*"
            required
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={uploading || !image}
          className="rounded-md bg-primary px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-secondary-bg disabled:opacity-60"
        >
          {uploading ? "Laddar upp…" : "Ladda upp"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-primary">
          Menykort ({cards.length})
        </h2>

        {loading ? (
          <p className="text-foreground/60">Laddar…</p>
        ) : cards.length === 0 ? (
          <p className="text-foreground/60">Inga menykort ännu.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {cards.map((card) => (
              <li
                key={card.id}
                className="space-y-3 rounded-lg border border-primary/15 bg-white/50 p-4"
              >
                <div className="mx-auto w-full max-w-[180px] overflow-hidden rounded-sm bg-white shadow-sm aspect-[210/297]">
                  <img
                    src={card.image_url}
                    alt={card.title || "Menykort"}
                    className="size-full object-cover"
                  />
                </div>

                <input
                  type="text"
                  defaultValue={card.title}
                  placeholder="Titel"
                  onBlur={(e) => {
                    if (e.target.value !== card.title) {
                      onUpdateTitle(card.id, e.target.value);
                    }
                  }}
                  className="w-full rounded-md border border-primary/20 bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                />

                <label className="block text-xs text-foreground/60">
                  Byt bild
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 w-full text-sm"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onReplaceImage(card.id, file);
                    }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => onDelete(card.id)}
                  className="text-xs font-medium uppercase tracking-[0.15em] text-red-600 hover:underline"
                >
                  Ta bort
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
