import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Login or Register",
  description:
    "Sign in to your Elektron Nexus account to access orders, downloads, courses, internships and certificates.",
};

export default async function LoginPage() {
  // Already signed in? Don't show the login page.
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  // Button forced visible for preview. It becomes fully functional the
  // moment GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are set in Vercel; until
  // then a click shows a friendly "not set up yet" message. To hide it again,
  // restore: const googleEnabled = isGoogleConfigured();
  const googleEnabled = true;

  return (
    <section className="relative overflow-hidden bg-[#f7f9fd]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-24 h-96 w-96 rounded-full bg-brand-400/20 blur-[130px]" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-accent/20 blur-[130px]" />
      </div>
      <div className="container-x relative grid min-h-[80vh] place-items-center py-14">
        <div className="w-full max-w-4xl">
          <Suspense>
            <AuthForm googleEnabled={googleEnabled} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
