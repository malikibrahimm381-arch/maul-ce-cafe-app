"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { Mail, Phone, Plus, UsersRound } from "lucide-react";
import { useState } from "react";

const initialStaff = [
  ["Riski Maulana", "Admin", "Pagi", "Aktif"],
  ["Kasir Cafe", "Kasir", "Siang", "Aktif"],
  ["Dapur Utama", "Kitchen", "Malam", "Aktif"],
  ["Developer", "Developer", "Remote", "Aktif"]
];

export default function StaffPage() {
  return (
    <AuthGuard roles={["admin", "developer"]}>
      {(user) => <StaffWorkspace user={user} />}
    </AuthGuard>
  );
}

function StaffWorkspace({ user }) {
  const [staff, setStaff] = useState(initialStaff);

  function addStaff() {
    setStaff((current) => [...current, [`Pegawai ${current.length + 1}`, "Barista", "Pagi", "Aktif"]]);
  }

  return (
    <CafeShell
      user={user}
      title="Manajemen Pegawai"
      subtitle="Atur data pegawai, shift, dan hak akses"
      actions={<button type="button" onClick={addStaff} className="icon-button bg-[#0b3b28] px-4 text-white"><Plus size={17} />Tambah Pegawai</button>}
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {staff.map(([name, role, shift, status]) => (
          <article key={name} className="cafe-card p-5">
            <span className="grid size-12 place-items-center rounded-full bg-[#e3f4ea] text-[#0b3b28]">
              <UsersRound size={22} />
            </span>
            <h2 className="mt-4 text-lg font-black">{name}</h2>
            <p className="text-sm font-bold text-[#607066]">{role} - Shift {shift}</p>
            <span className="status-pill mt-4 bg-[#e3f4ea] text-[#096b3c]">{status}</span>
            <div className="mt-4 flex gap-2">
              <button className="grid size-9 place-items-center rounded-lg bg-[#eef4ee] text-[#0b3b28]"><Phone size={16} /></button>
              <button className="grid size-9 place-items-center rounded-lg bg-[#eef4ee] text-[#0b3b28]"><Mail size={16} /></button>
            </div>
          </article>
        ))}
      </section>
    </CafeShell>
  );
}
