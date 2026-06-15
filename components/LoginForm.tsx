"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("Fel användarnamn eller lösenord.");
        return;
      }

      const from = searchParams.get("from");
      router.push(from?.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Något gick fel. Försök igen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-sm space-y-6 rounded-lg bg-secondary-bg p-8 shadow-sm"
    >
      <div className="space-y-2 text-center">
        <h1 className="font-display text-3xl font-bold text-primary">Logga in</h1>
        <p className="text-sm text-foreground/60">Admin för Ekke Bar</p>
      </div>

      <div className="space-y-4">
        <label className="block space-y-1">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary/70">
            Användarnamn
          </span>
          <input
            type="text"
            name="username"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-primary/20 bg-white px-3 py-2 text-foreground outline-none focus:border-primary"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary/70">
            Lösenord
          </span>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-primary/20 bg-white px-3 py-2 text-foreground outline-none focus:border-primary"
          />
        </label>
      </div>

      {error && (
        <p className="text-center text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium uppercase tracking-[0.15em] text-secondary-bg transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Loggar in…" : "Logga in"}
      </button>
    </form>
  );
}
