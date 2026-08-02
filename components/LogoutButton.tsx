"use client";

export default function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    // Full load for the same reason as signing in — the root layout has to be
    // re-rendered by the server before the menu reflects the dropped session.
    window.location.assign("/");
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
