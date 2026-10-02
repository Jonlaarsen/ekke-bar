"use client";

import {
  countMenuItems,
  formatMenuPrice,
  type MenuCategory,
  type MenuItem,
  type MenuTree,
} from "@/lib/menu";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

const fieldClass =
  "w-full rounded-md border border-primary/20 bg-white px-3 py-2 outline-none focus:border-primary";
const labelClass =
  "text-xs font-medium uppercase tracking-[0.2em] text-primary/70";

export default function MenuItemsAdmin() {
  const [tree, setTree] = useState<MenuTree>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [categoryName, setCategoryName] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");

  const [itemCategoryId, setItemCategoryId] = useState("");
  const [itemSubcategoryId, setItemSubcategoryId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemIngredients, setItemIngredients] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  const loadMenu = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/menu");
      if (!res.ok) throw new Error("Failed to load");
      setTree(await res.json());
    } catch {
      setError(
        "Kunde inte ladda menyn. Kör scripts/schema.sql i Neon och kontrollera DATABASE_URL.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  const subcategoriesForItem = useMemo(() => {
    if (!itemCategoryId) return [];
    const cat = tree.find((c) => c.id === Number(itemCategoryId));
    return cat?.subcategories ?? [];
  }, [tree, itemCategoryId]);

  useEffect(() => {
    if (
      itemSubcategoryId &&
      !subcategoriesForItem.some((s) => s.id === Number(itemSubcategoryId))
    ) {
      setItemSubcategoryId("");
    }
  }, [subcategoriesForItem, itemSubcategoryId]);

  async function apiJson(
    url: string,
    init?: RequestInit,
  ): Promise<Response> {
    const res = await fetch(url, init);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.error ?? "Request failed");
    }
    return res;
  }

  const onAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    const name = categoryName.trim();
    if (!name) return;

    setSaving(true);
    setError("");
    try {
      await apiJson("/api/menu/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      setCategoryName("");
      await loadMenu();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte spara");
    } finally {
      setSaving(false);
    }
  };

  const onAddSubcategory = async (e: FormEvent) => {
    e.preventDefault();
    const category_id = Number(subCategoryId);
    const name = subcategoryName.trim();
    if (!category_id || !name) return;

    setSaving(true);
    setError("");
    try {
      await apiJson("/api/menu/subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category_id, name }),
      });
      setSubcategoryName("");
      await loadMenu();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte spara");
    } finally {
      setSaving(false);
    }
  };

  const onAddItem = async (e: FormEvent) => {
    e.preventDefault();
    const category_id = Number(itemCategoryId);
    if (!category_id || !itemName.trim()) return;

    setSaving(true);
    setError("");
    try {
      await apiJson("/api/menu/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id,
          subcategory_id: itemSubcategoryId ? Number(itemSubcategoryId) : null,
          name: itemName.trim(),
          ingredients_origin: itemIngredients.trim(),
          price: itemPrice.trim(),
        }),
      });
      setItemName("");
      setItemIngredients("");
      setItemPrice("");
      await loadMenu();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte spara");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteCategory = async (id: number) => {
    if (!confirm("Ta bort kategori och allt innehåll i den?")) return;
    setError("");
    try {
      await apiJson(`/api/menu/categories/${id}`, { method: "DELETE" });
      await loadMenu();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte ta bort");
    }
  };

  const onDeleteSubcategory = async (id: number) => {
    if (!confirm("Ta bort underkategori och alla rätter i den?")) return;
    setError("");
    try {
      await apiJson(`/api/menu/subcategories/${id}`, { method: "DELETE" });
      await loadMenu();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte ta bort");
    }
  };

  const onDeleteItem = async (id: number) => {
    if (!confirm("Ta bort denna rätt?")) return;
    setError("");
    try {
      await apiJson(`/api/menu/items/${id}`, { method: "DELETE" });
      await loadMenu();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte ta bort");
    }
  };

  const onUpdateCategory = async (id: number, name: string) => {
    setError("");
    try {
      await apiJson(`/api/menu/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      await loadMenu();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte spara");
      throw err;
    }
  };

  const onUpdateSubcategory = async (id: number, name: string) => {
    setError("");
    try {
      await apiJson(`/api/menu/subcategories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      await loadMenu();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte spara");
      throw err;
    }
  };

  const onUpdateItem = async (
    id: number,
    data: {
      category_id: number;
      subcategory_id: number | null;
      name: string;
      ingredients_origin: string;
      price: string;
    },
  ) => {
    setError("");
    try {
      await apiJson(`/api/menu/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: data.category_id,
          subcategory_id: data.subcategory_id,
          name: data.name,
          ingredients_origin: data.ingredients_origin,
          price: data.price,
        }),
      });
      await loadMenu();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunde inte spara");
      throw err;
    }
  };

  const itemCount = countMenuItems(tree);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={onAddCategory}
          className="space-y-4 rounded-lg border border-primary/15 bg-white/50 p-6"
        >
          <h2 className="font-display text-xl font-bold text-primary">
            Kategori
          </h2>
          <p className="text-sm text-foreground/60">
            t.ex. Vin, Mat, Öl, Cocktails
          </p>
          <label className="block space-y-1">
            <span className={labelClass}>Namn</span>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Vin"
              className={fieldClass}
            />
          </label>
          <button
            type="submit"
            disabled={saving || !categoryName.trim()}
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-secondary-bg disabled:opacity-60"
          >
            Lägg till kategori
          </button>
        </form>

        <form
          onSubmit={onAddSubcategory}
          className="space-y-4 rounded-lg border border-primary/15 bg-white/50 p-6"
        >
          <h2 className="font-display text-xl font-bold text-primary">
            Underkategori
          </h2>
          <p className="text-sm text-foreground/60">
            Valfritt — t.ex. Rött, Vitt, Rosé (under Vin)
          </p>
          <label className="block space-y-1">
            <span className={labelClass}>Kategori</span>
            <select
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              required
              className={fieldClass}
            >
              <option value="">Välj kategori…</option>
              {tree.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className={labelClass}>Namn</span>
            <input
              type="text"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              placeholder="Rött"
              className={fieldClass}
            />
          </label>
          <button
            type="submit"
            disabled={saving || !subCategoryId || !subcategoryName.trim()}
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-secondary-bg disabled:opacity-60"
          >
            Lägg till underkategori
          </button>
        </form>
      </div>

      <form
        onSubmit={onAddItem}
        className="space-y-4 rounded-lg border border-primary/15 bg-white/50 p-6"
      >
        <h2 className="font-display text-2xl font-bold text-primary">
          Lägg till rätt / dryck
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className={labelClass}>Kategori</span>
            <select
              value={itemCategoryId}
              onChange={(e) => {
                setItemCategoryId(e.target.value);
                setItemSubcategoryId("");
              }}
              required
              className={fieldClass}
            >
              <option value="">Välj kategori…</option>
              {tree.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className={labelClass}>Underkategori (valfritt)</span>
            <select
              value={itemSubcategoryId}
              onChange={(e) => setItemSubcategoryId(e.target.value)}
              disabled={!itemCategoryId}
              className={fieldClass}
            >
              <option value="">Ingen — direkt under kategori</option>
              {subcategoriesForItem.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block space-y-1">
          <span className={labelClass}>Namn</span>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Chianti Classico"
            required
            className={fieldClass}
          />
        </label>

        <label className="block space-y-1">
          <span className={labelClass}>Ingredienser / ursprung</span>
          <textarea
            value={itemIngredients}
            onChange={(e) => setItemIngredients(e.target.value)}
            placeholder="Toscana, Italien · Sangiovese"
            rows={2}
            className={fieldClass}
          />
        </label>

        <label className="block space-y-1">
          <span className={labelClass}>Pris</span>
          <input
            type="text"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
            placeholder="125 eller 85 / 120 (glas / flaska)"
            required
            className={fieldClass}
          />
          <p className="text-xs text-foreground/50">
            Enkelt pris eller flera med /, t.ex. 65 / 95 eller 9 cl / 15 cl
          </p>
        </label>

        <button
          type="submit"
          disabled={saving || !itemCategoryId || !itemName.trim()}
          className="rounded-md bg-primary px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-secondary-bg disabled:opacity-60"
        >
          {saving ? "Sparar…" : "Lägg till i menyn"}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-primary">
          Meny ({itemCount} poster)
        </h2>

        {loading ? (
          <p className="text-foreground/60">Laddar…</p>
        ) : tree.length === 0 ? (
          <p className="text-foreground/60">
            Inga kategorier ännu. Börja med att lägga till en kategori.
          </p>
        ) : (
          <div className="space-y-6">
            {tree.map((category) => (
              <CategoryBlock
                key={category.id}
                category={category}
                tree={tree}
                onDeleteCategory={onDeleteCategory}
                onDeleteSubcategory={onDeleteSubcategory}
                onDeleteItem={onDeleteItem}
                onUpdateCategory={onUpdateCategory}
                onUpdateSubcategory={onUpdateSubcategory}
                onUpdateItem={onUpdateItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryBlock({
  category,
  tree,
  onDeleteCategory,
  onDeleteSubcategory,
  onDeleteItem,
  onUpdateCategory,
  onUpdateSubcategory,
  onUpdateItem,
}: {
  category: MenuCategory;
  tree: MenuTree;
  onDeleteCategory: (id: number) => void;
  onDeleteSubcategory: (id: number) => void;
  onDeleteItem: (id: number) => void;
  onUpdateCategory: (id: number, name: string) => Promise<void>;
  onUpdateSubcategory: (id: number, name: string) => Promise<void>;
  onUpdateItem: (
    id: number,
    data: {
      category_id: number;
      subcategory_id: number | null;
      name: string;
      ingredients_origin: string;
      price: string;
    },
  ) => Promise<void>;
}) {
  const [editingCategory, setEditingCategory] = useState(false);
  const [categoryName, setCategoryName] = useState(category.name);
  const [savingCategory, setSavingCategory] = useState(false);

  useEffect(() => {
    setCategoryName(category.name);
  }, [category.name]);

  const saveCategory = async () => {
    const name = categoryName.trim();
    if (!name || name === category.name) {
      setEditingCategory(false);
      setCategoryName(category.name);
      return;
    }
    setSavingCategory(true);
    try {
      await onUpdateCategory(category.id, name);
      setEditingCategory(false);
    } catch {
      /* error shown by parent */
    } finally {
      setSavingCategory(false);
    }
  };

  return (
    <section className="rounded-lg border border-primary/15 bg-white/50 p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        {editingCategory ? (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className={`${fieldClass} max-w-xs`}
            />
            <button
              type="button"
              disabled={savingCategory}
              onClick={() => void saveCategory()}
              className="text-xs font-medium uppercase tracking-[0.12em] text-primary hover:underline"
            >
              Spara
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingCategory(false);
                setCategoryName(category.name);
              }}
              className="text-xs text-foreground/60 hover:underline"
            >
              Avbryt
            </button>
          </div>
        ) : (
          <h3 className="font-display text-2xl font-bold text-primary">
            {category.name}
          </h3>
        )}
        <div className="flex shrink-0 gap-3">
          {!editingCategory && (
            <button
              type="button"
              onClick={() => setEditingCategory(true)}
              className="text-xs font-medium uppercase tracking-[0.12em] text-primary hover:underline"
            >
              Redigera
            </button>
          )}
          <button
            type="button"
            onClick={() => onDeleteCategory(category.id)}
            className="text-xs font-medium uppercase tracking-[0.12em] text-red-600 hover:underline"
          >
            Ta bort
          </button>
        </div>
      </div>

      {category.items && category.items.length > 0 && (
        <ul className="mb-5 space-y-2">
          {category.items.map((item) => (
            <AdminItemRow
              key={item.id}
              item={item}
              tree={tree}
              onDeleteItem={onDeleteItem}
              onUpdateItem={onUpdateItem}
            />
          ))}
        </ul>
      )}

      {!category.subcategories?.length ? (
        !category.items?.length && (
          <p className="text-sm text-foreground/50">Inga poster ännu.</p>
        )
      ) : (
        <ul className="space-y-5">
          {category.subcategories.map((sub) => (
            <SubcategoryBlock
              key={sub.id}
              subcategory={sub}
              tree={tree}
              onDeleteSubcategory={onDeleteSubcategory}
              onDeleteItem={onDeleteItem}
              onUpdateSubcategory={onUpdateSubcategory}
              onUpdateItem={onUpdateItem}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function SubcategoryBlock({
  subcategory,
  tree,
  onDeleteSubcategory,
  onDeleteItem,
  onUpdateSubcategory,
  onUpdateItem,
}: {
  subcategory: NonNullable<MenuCategory["subcategories"]>[number];
  tree: MenuTree;
  onDeleteSubcategory: (id: number) => void;
  onDeleteItem: (id: number) => void;
  onUpdateSubcategory: (id: number, name: string) => Promise<void>;
  onUpdateItem: (
    id: number,
    data: {
      category_id: number;
      subcategory_id: number | null;
      name: string;
      ingredients_origin: string;
      price: string;
    },
  ) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(subcategory.name);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(subcategory.name);
  }, [subcategory.name]);

  const save = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === subcategory.name) {
      setEditing(false);
      setName(subcategory.name);
      return;
    }
    setSaving(true);
    try {
      await onUpdateSubcategory(subcategory.id, trimmed);
      setEditing(false);
    } catch {
      /* parent shows error */
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="border-t border-primary/10 pt-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        {editing ? (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${fieldClass} max-w-xs text-sm`}
            />
            <button
              type="button"
              disabled={saving}
              onClick={() => void save()}
              className="text-xs text-primary hover:underline"
            >
              Spara
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setName(subcategory.name);
              }}
              className="text-xs text-foreground/60 hover:underline"
            >
              Avbryt
            </button>
          </div>
        ) : (
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary/80">
            {subcategory.name}
          </h4>
        )}
        <div className="flex gap-3">
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs text-primary hover:underline"
            >
              Redigera
            </button>
          )}
          <button
            type="button"
            onClick={() => onDeleteSubcategory(subcategory.id)}
            className="text-xs text-red-600 hover:underline"
          >
            Ta bort
          </button>
        </div>
      </div>

      {!subcategory.items?.length ? (
        <p className="text-sm text-foreground/50">Inga poster.</p>
      ) : (
        <ul className="space-y-2">
          {subcategory.items.map((item) => (
            <AdminItemRow
              key={item.id}
              item={item}
              tree={tree}
              onDeleteItem={onDeleteItem}
              onUpdateItem={onUpdateItem}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function AdminItemRow({
  item,
  tree,
  onDeleteItem,
  onUpdateItem,
}: {
  item: MenuItem;
  tree: MenuTree;
  onDeleteItem: (id: number) => void;
  onUpdateItem: (
    id: number,
    data: {
      category_id: number;
      subcategory_id: number | null;
      name: string;
      ingredients_origin: string;
      price: string;
    },
  ) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categoryId, setCategoryId] = useState(String(item.category_id));
  const [subcategoryId, setSubcategoryId] = useState(
    item.subcategory_id ? String(item.subcategory_id) : "",
  );
  const [name, setName] = useState(item.name);
  const [ingredients, setIngredients] = useState(item.ingredients_origin);
  const [price, setPrice] = useState(item.price);

  const subcategories = useMemo(() => {
    if (!categoryId) return [];
    const cat = tree.find((c) => c.id === Number(categoryId));
    return cat?.subcategories ?? [];
  }, [tree, categoryId]);

  useEffect(() => {
    if (!editing) {
      setCategoryId(String(item.category_id));
      setSubcategoryId(item.subcategory_id ? String(item.subcategory_id) : "");
      setName(item.name);
      setIngredients(item.ingredients_origin);
      setPrice(item.price);
    }
  }, [item, editing]);

  useEffect(() => {
    if (
      subcategoryId &&
      !subcategories.some((s) => s.id === Number(subcategoryId))
    ) {
      setSubcategoryId("");
    }
  }, [subcategories, subcategoryId]);

  const save = async () => {
    const trimmedName = name.trim();
    if (!trimmedName || !categoryId) return;

    setSaving(true);
    try {
      await onUpdateItem(item.id, {
        category_id: Number(categoryId),
        subcategory_id: subcategoryId ? Number(subcategoryId) : null,
        name: trimmedName,
        ingredients_origin: ingredients.trim(),
        price: price.trim(),
      });
      setEditing(false);
    } catch {
      /* parent shows error */
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <li className="space-y-3 rounded-md border border-primary/20 bg-white px-3 py-3 text-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className={labelClass}>Kategori</span>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubcategoryId("");
              }}
              className={fieldClass}
            >
              {tree.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className={labelClass}>Underkategori</span>
            <select
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className={fieldClass}
            >
              <option value="">Ingen — direkt under kategori</option>
              {subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block space-y-1">
          <span className={labelClass}>Namn</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1">
          <span className={labelClass}>Ingredienser / ursprung</span>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={2}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1">
          <span className={labelClass}>Pris</span>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="85 / 120"
            className={fieldClass}
          />
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="text-xs font-medium uppercase tracking-[0.12em] text-primary hover:underline"
          >
            {saving ? "Sparar…" : "Spara"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-xs text-foreground/60 hover:underline"
          >
            Avbryt
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-start justify-between gap-4 rounded-md bg-white/80 px-3 py-2 text-sm">
      <div>
        <p className="font-medium text-foreground">{item.name}</p>
        {item.ingredients_origin && (
          <p className="text-foreground/60">{item.ingredients_origin}</p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-medium tabular-nums text-primary">
          {formatMenuPrice(item.price)}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs text-primary hover:underline"
          >
            Redigera
          </button>
          <button
            type="button"
            onClick={() => onDeleteItem(item.id)}
            className="text-xs text-red-600 hover:underline"
          >
            Ta bort
          </button>
        </div>
      </div>
    </li>
  );
}

