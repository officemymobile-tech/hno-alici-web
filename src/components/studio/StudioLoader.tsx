"use client";

import dynamic from "next/dynamic";

// next/dynamic's ssr:false option is only allowed inside a Client Component
// in this Next.js version (confirmed via the actual build error, not assumed
// — see AGENTS.md's warning about breaking changes) — so this one-line
// wrapper exists purely to hold it; the page.tsx Server Component stays a
// Server Component for generateStaticParams/metadata.
const Studio = dynamic(() => import("./Studio"), { ssr: false });

export default function StudioLoader() {
  return <Studio />;
}
