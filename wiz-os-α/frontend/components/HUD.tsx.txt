export default function HUD({ aura }: { aura: { pulse: number; color: string; noise: number } }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 200,
        height: 200,
        borderRadius: "50%",
        border: `1px solid ${aura.color}`,
        opacity: 0.4,
        transform: `scale(${1 + aura.noise * 0.1})`,
        transition: "transform 0.4s ease, border 0.4s ease",
      }}
    />
  );
}
