"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="rounded-md border border-primary/25 px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-primary transition-colors hover:bg-primary/5 disabled:opacity-60"
    >
      {loading ? "Loggar ut…" : "Logga ut"}
    </button>
  );
}
