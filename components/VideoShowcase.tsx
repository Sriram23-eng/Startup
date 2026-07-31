"use client";

import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  A framed screen-recording that autoplays (muted, looped) only when  */
/*  scrolled into view and pauses when it leaves — so the ~12MB clip     */
/*  never downloads until the visitor actually reaches it.               */
/* ------------------------------------------------------------------ */
export default function VideoShowcase({
  src,
  label,
}: {
  src: string;
  label?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className="lift overflow-hidden rounded-2xl border border-line bg-navy-900 shadow-lift">
      {/* faux browser chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 bg-navy-800 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-brand-400" />
        {label && (
          <span className="ml-3 truncate rounded-md bg-white/5 px-3 py-1 text-xs font-medium text-brand-100/60">
            {label}
          </span>
        )}
      </div>
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        controls
        className="block w-full bg-navy-950"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
