import LoginForm from "@/components/LoginForm";
import { Suspense } from "react";

export const metadata = {
  title: "Logga in | Ekke Bar",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-primary/10 px-5 py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
