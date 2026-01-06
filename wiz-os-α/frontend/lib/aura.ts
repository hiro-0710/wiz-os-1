export function auraColor(aura: string, profile: string): string {
  const baseColors: Record<string, string> = {
    hiroya: "#88ccff",   // 精密・冷静
    family: "#ffd9b3",   // 柔らかい・暖色
    guest:  "#cccccc",   // 中立・控えめ
  };

  const brightness: Record<string, number> = {
    calm: 0.4,
    focus: 0.55,
    alert: 0.7,
    dim: 0.25,
  };

  const base = baseColors[profile] || "#cccccc";
  const alpha = brightness[aura] ?? 0.4;

  return `${base}${Math.floor(alpha * 255).toString(16).padStart(2, "0")}`;
}
