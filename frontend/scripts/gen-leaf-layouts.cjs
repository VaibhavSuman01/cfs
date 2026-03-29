const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const txt = fs.readFileSync(path.join(root, "lib", "seo-pages.ts"), "utf8");
const keys = [...txt.matchAll(/\n  "(\/[^"]+)": \{/g)]
  .map((m) => m[1])
  .filter((p) => p.split("/").filter(Boolean).length >= 2);

const tmpl = (p) => `import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata: Metadata = pageMetadata("${p}");

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;

for (const p of keys) {
  const segs = p.split("/").filter(Boolean);
  const dir = path.join(root, "app", ...segs);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "layout.tsx"), tmpl(p), "utf8");
}

console.log("wrote", keys.length, "leaf layouts");
