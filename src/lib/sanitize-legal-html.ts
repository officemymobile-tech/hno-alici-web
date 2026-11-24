import DOMPurify from "isomorphic-dompurify";

/**
 * Real legal-document content from Sanity uses a small set of inline
 * formatting tags (confirmed by inspecting live content: "strong", "br",
 * "a") — rendering these fields as plain escaped text (the first fix for
 * the xss:legal-document:raw-html-paragraphs finding) breaks that
 * formatting into visible tag soup. This sanitizes instead: the same 3
 * tags are allowed through, everything else (script/img/svg/event
 * handlers/javascript: URIs) is stripped, never just escaped-and-shown.
 */
export function sanitizeLegalHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["strong", "br", "a"],
    ALLOWED_ATTR: ["href"],
  });
}
