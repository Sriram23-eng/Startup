import { redirect } from "next/navigation";

// The About content now lives on the home page (the "who we are" section
// onward). This page is kept only so old links and bookmarks to /about still
// resolve — it redirects to the home page's about section.
export default function AboutPage() {
  redirect("/#who-we-are");
}
