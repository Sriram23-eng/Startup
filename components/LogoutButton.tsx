"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="rounded-xl border border-navy-700/12 bg-white px-4 py-2 text-sm font-semibold text-navy-700/70 transition hover:bg-red-50 hover:text-red-600"
    >
      Log out
    </button>
  );
}
