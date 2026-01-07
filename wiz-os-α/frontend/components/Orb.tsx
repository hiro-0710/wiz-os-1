"use client";

export default function Orb({
  aura,
  loading = false,
}: {
  aura?: { pulse: number; color: string; noise: number };
  loading?: boolean;
}) {
  // SSR対策：aura が null の間は描画しない
  if (!aura) return null;

  return (
    <div
      style={{
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: aura.color,
        opacity: loading ? 0.5 : 1,
        filter: `blur(${aura.noise}px)`,
        transform: `scale(${1 + aura.pulse * 0.02})`,
        transition: "all 0.2s ease-out",
      }}
    />
  );
}
