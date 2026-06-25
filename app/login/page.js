"use client";

import Header from "@/app/components/Header";
import { Coffee, KeyRound, LogIn, UserRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const roleHome = {
  cashier: "/kasir",
  admin: "/admin",
  developer: "/developer"
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Login gagal.");

      const next = searchParams.get("next") || roleHome[data.user.role] || "/";
      router.replace(next);
      router.refresh();
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={login} className="soft-panel animate__animated animate__fadeInUp w-full max-w-md rounded-lg p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-lg bg-[#2f6f66] text-white">
          <Coffee size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#253431]">Login Staff</h1>
          <p className="text-sm font-semibold text-[#69736e]">Kasir, admin, dan developer.</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-sm font-black text-[#31413d]">
            <UserRound size={16} />
            Username
          </span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} className="field" autoComplete="username" />
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-sm font-black text-[#31413d]">
            <KeyRound size={16} />
            Password
          </span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="field"
            type="password"
            autoComplete="current-password"
          />
        </label>
      </div>

      {error ? <p className="mt-4 rounded-lg bg-[#f2d7d2] p-3 text-sm font-bold text-[#7c2f25]">{error}</p> : null}

      <button type="submit" disabled={loading} className="icon-button mt-5 w-full bg-[#2f6f66] text-white shadow-lg shadow-[#2f6f6626]">
        <LogIn size={18} />
        <span>{loading ? "Memproses" : "Masuk"}</span>
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="app-shell grid min-h-[calc(100vh-80px)] place-items-center py-10">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
