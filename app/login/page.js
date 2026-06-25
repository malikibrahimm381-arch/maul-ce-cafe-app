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
    <form onSubmit={login} className="cafe-card animate__animated animate__fadeInUp w-full max-w-md p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-lg bg-[#0b3b28] text-[#8bd46c]">
          <Coffee size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#0e1713]">Login Staff</h1>
          <p className="text-sm font-semibold text-[#607066]">Kasir, admin, dan developer.</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-sm font-black text-[#0e1713]">
            <UserRound size={16} className="text-[#1f8a58]" />
            Username
          </span>
          <input value={username} onChange={(event) => setUsername(event.target.value)} className="field" autoComplete="username" />
        </label>

        <label className="block">
          <span className="mb-1.5 flex items-center gap-2 text-sm font-black text-[#0e1713]">
            <KeyRound size={16} className="text-[#1f8a58]" />
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

      {error ? <p className="mt-4 rounded-lg bg-[#ffe0e0] p-3 text-sm font-bold text-[#bc3131]">{error}</p> : null}

      <button type="submit" disabled={loading} className="icon-button mt-5 w-full bg-[#0b3b28] text-white shadow-lg shadow-[#0b3b2826]">
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
      <main className="grid min-h-[calc(100vh-80px)] place-items-center bg-[#f7f6f1] px-4 py-10">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </main>
    </>
  );
}
