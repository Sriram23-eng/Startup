import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getCurrentUser } from "@/lib/auth";
import { isGoogleConfigured } from "@/lib/google";

export const metadata: Metadata = {
  title: "Login or Register",
  description:
    "Sign in to your Elektron Nexus account to access orders, downloads, courses, internships and certificates.",
};

export default async function LoginPage() {
  // Already signed in? Don't show the login page.
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  const googleEnabled = isGoogleConfigured();

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
