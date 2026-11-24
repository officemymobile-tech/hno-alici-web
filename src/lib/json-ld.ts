/**
 * Serializes a JSON-LD object for embedding inside a literal <script> element.
 * JSON.stringify never escapes "</script>", so CMS-controlled text containing
 * that substring would otherwise close the script tag early and let whatever
 * follows be parsed as new markup. Escaping "<" prevents that breakout.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
