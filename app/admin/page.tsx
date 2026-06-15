import AdminLogout from "@/components/AdminLogout";
import MenuCardsAdmin from "@/components/MenuCardsAdmin";
import { SESSION_COOKIE, isValidSession } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin | Ekke Bar",
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  if (!isValidSession(session)) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-secondary-bg px-5 pt-34 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.35em] text-primary/70">
              Admin
            </p>
            <h1 className="font-display text-4xl font-bold text-primary sm:text-5xl">
              Ekke Bar
            </h1>
          </div>
          <AdminLogout />
        </div>

        <MenuCardsAdmin />
      </div>
    </main>
  );
}
