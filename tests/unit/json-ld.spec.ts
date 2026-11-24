import { test, expect } from "@playwright/test";
import { jsonLdScript } from "@/lib/json-ld";

// Regression test for finding xss:json-ld:script-tag-breakout
// (SECURITY_AUDIT_FINAL_REPORT.md, 2026-11-23). A CMS field containing a
// literal "</script>" must never be able to close the enclosing <script>
// element early.

test("jsonLdScript escapes a </script> breakout attempt", () => {
  const malicious = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    email: "x</script><script>alert(1)</script>",
  };

  const serialized = jsonLdScript(malicious);

  expect(serialized).not.toContain("</script>");
  expect(serialized).toContain("\\u003c/script>");

  // Must still be the exact same data once a browser's JSON parser reads it
  // back — only the <script>-breaking characters are allowed to change.
  const roundTrip = JSON.parse(serialized.replace(/\\u003c/g, "<"));
  expect(roundTrip).toEqual(malicious);
});

test("jsonLdScript leaves ordinary data untouched", () => {
  const benign = { "@type": "Question", name: "Wie lange dauert ein Termin?" };
  expect(jsonLdScript(benign)).toBe(JSON.stringify(benign));
});
