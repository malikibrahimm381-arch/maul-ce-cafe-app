"use client";

import Link from "next/link";
import { Loader2, LockKeyhole } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ roles, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState({ loading: true, user: null });

  useEffect(() => {
    let mounted = true;

    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => {
        if (!mounted) return;

        if (!data.user) {
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
          return;
        }

        setState({ loading: false, user: data.user });
      })
      .catch(() => {
        if (mounted) setState({ loading: false, user: null });
      });

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  if (state.loading) {
    return (
      <main className="app-shell grid min-h-[70vh] place-items-center">
        <div className="soft-panel flex items-center gap-3 rounded-lg p-5 font-semibold text-[#42524e]">
          <Loader2 className="animate-spin" size={20} />
          Memeriksa akses
        </div>
      </main>
    );
  }

  if (!state.user || !roles.includes(state.user.role)) {
    return (
      <main className="app-shell grid min-h-[70vh] place-items-center py-12">
        <section className="soft-panel max-w-md rounded-lg p-7 text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-lg bg-[#f2d7d2] text-[#7c2f25]">
            <LockKeyhole size={26} />
          </div>
          <h1 className="text-2xl font-black text-[#253431]">Akses ditolak</h1>
          <p className="mt-2 text-sm leading-6 text-[#69736e]">Role akun ini belum memiliki izin untuk halaman tersebut.</p>
          <Link href="/" className="icon-button mt-5 bg-[#2f6f66] text-white">
            Kembali
          </Link>
        </section>
      </main>
    );
  }

  return children(state.user);
}
