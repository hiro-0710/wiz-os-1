"use client";

export default function HUD({
  aura,
  profile,
}: {
  aura?: { pulse: number; color: string; noise: number };
  profile?: string;
}) {
  // SSR対策：aura が null の間は描画しない
  if (!aura) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: -20,
        right: -20,
        color: aura.color,
        fontSize: 14,
        opacity: 0.8,
      }}
    >
      {profile ?? ""}
    </div>
  );
}
