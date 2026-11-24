import { test, expect } from "@playwright/test";
import { renderToStaticMarkup } from "react-dom/server";
import { LegalDocument } from "@/components/legal/LegalDocument";
import type { LegalDocument as LegalDocumentType } from "@/content/legal/types";

// Regression test for finding xss:legal-document:raw-html-paragraphs
// (SECURITY_AUDIT_FINAL_REPORT.md, 2026-11-23).
//
// Real production content (confirmed by inspecting live Sanity documents
// during the 2026-11-24 restore) uses "strong"/"br"/"a" inline formatting
// in these exact fields — plain-escaped-text rendering (the first version
// of this fix) would turn that into visible tag soup, a content/design
// regression. The fix instead sanitizes with a strict allowlist
// (src/lib/sanitize-legal-html.ts): those 3 tags render as real HTML,
// everything else is stripped outright, never escaped-and-displayed.

function render(paragraphs: string[], list?: string[]) {
  const doc: LegalDocumentType = {
    title: "Impressum",
    updated: "2026-11-24",
    sections: [{ id: "test", title: "Testabschnitt", paragraphs, list }],
  };
  return renderToStaticMarkup(LegalDocument({ document: doc }));
}

test("real-world formatting (strong/br/a) renders as live HTML, not text", () => {
  const html = render(['<strong>Dr. Ümit Alici</strong><br>Facharzt <a href="https://hno-alici.at/">Website</a>']);
  expect(html).toContain("<strong>Dr. Ümit Alici</strong>");
  expect(html).toContain("<br");
  expect(html).toContain('<a href="https://hno-alici.at/">Website</a>');
});

test("a disallowed tag (img/onerror) is stripped entirely, not escaped-and-shown", () => {
  const html = render(['<img src=x onerror="window.__xss=1">']);
  expect(html).not.toContain("onerror");
  expect(html).not.toContain("&lt;img");
  expect(html).not.toContain("<img");
});

test("a disallowed tag in a list item (svg/onload) is stripped entirely", () => {
  const html = render(["safe text"], ['<svg onload="window.__xss=2">']);
  expect(html).not.toContain("onload");
  expect(html).not.toContain("&lt;svg");
  expect(html).not.toContain("<svg");
});

test("a javascript: URI on an allowed <a> tag is stripped, the link tag survives without it", () => {
  const html = render(['<a href="javascript:alert(1)">bad link</a>']);
  expect(html).not.toContain("javascript:");
  expect(html).toContain("bad link");
});

test("script tag inside an allowed-tag payload is stripped, not executed or shown", () => {
  const html = render(["<strong>bold</strong><script>alert(1)</script>"]);
  expect(html).toContain("<strong>bold</strong>");
  expect(html).not.toContain("<script>");
  expect(html).not.toContain("alert(1)");
});
