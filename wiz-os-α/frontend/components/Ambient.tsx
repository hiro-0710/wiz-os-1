export default function Ambient({ aura }: { aura: { color: string; noise: number } }) {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        background: `radial-gradient(circle at center, ${aura.color}10, transparent 70%)`,
        opacity: 0.4 + aura.noise * 0.2,
        transition: "opacity 0.4s ease, background 0.4s ease",
      }}
    />
  );
}
