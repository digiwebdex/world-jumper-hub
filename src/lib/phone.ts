/**
 * Normalize a Bangladesh phone number into the international wa.me format
 * (digits only, leading country code 880, no '+').
 *
 * Accepts common BD formats:
 *   01687072001          → 8801687072001
 *   01687-072001         → 8801687072001
 *   +880 1687 072 001    → 8801687072001
 *   8801687072001        → 8801687072001
 *   1687072001           → 8801687072001
 *   00 880 1687 072 001  → 8801687072001
 *
 * Falls back to the raw digit string when the input doesn't look like a BD
 * mobile number, so non-BD numbers (e.g. UAE, Saudi) still pass through.
 */
export function normalizeBdPhone(input: string | null | undefined): string {
  if (!input) return "";
  // 1. Strip everything except digits.
  let d = String(input).replace(/\D+/g, "");
  if (!d) return "";

  // 2. Strip leading international-dial prefix "00" (e.g. 0088017...).
  if (d.startsWith("00")) d = d.slice(2);

  // 3. Already in 880XXXXXXXXXX form (13 digits) → done.
  if (d.startsWith("880") && d.length === 13) return d;

  // 4. Local form starting with 0 → replace leading 0 with 880.
  //    01XXXXXXXXX (11 digits) is the standard BD mobile format.
  if (d.startsWith("0") && d.length === 11) return "880" + d.slice(1);

  // 5. Bare 10-digit mobile starting with 1 (no leading 0, no 880).
  if (d.startsWith("1") && d.length === 10) return "880" + d;

  // 6. Anything that already starts with 880 but is the wrong length —
  //    trust it (could be a landline) and return as-is.
  if (d.startsWith("880")) return d;

  // 7. Unknown shape — return digits untouched so non-BD numbers still work.
  return d;
}

/** Render a human-readable BD phone number, e.g. "+880 1687-072001". */
export function formatBdPhoneDisplay(input: string | null | undefined): string {
  const d = normalizeBdPhone(input);
  if (d.startsWith("880") && d.length === 13) {
    return `+${d.slice(0, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
  }
  return input ?? "";
}
