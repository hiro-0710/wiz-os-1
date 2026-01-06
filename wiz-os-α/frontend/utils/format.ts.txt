// ------------------------------
// Time formatting
// ------------------------------
export function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

// ------------------------------
// Score formatting
// ------------------------------
export function formatScore(n: number | null): string {
  if (n === null || Number.isNaN(n)) return "-";
  return n.toFixed(3);
}

// ------------------------------
// Diff formatting (optional)
// ------------------------------
export function formatDiff(diff: string): string {
  if (!diff) return "// no diff";
  return diff.trim();
}
