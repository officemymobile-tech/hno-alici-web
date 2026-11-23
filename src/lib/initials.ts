/**
 * Derives a person-specific two-letter initials label from a display name,
 * stripping a single leading honorific ("Frau", "Herr", "Dr."). Used as a
 * tasteful placeholder wherever no verified real photo exists, instead of a
 * generic icon or an unrelated photo.
 */
export function nameInitials(fullName: string): string {
  const parts = fullName.replace(/^(Frau|Herr|Dr\.)\s+/i, "").split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts[parts.length - 1][0];
  return (parts.length > 1 ? first + last : first).toUpperCase();
}
