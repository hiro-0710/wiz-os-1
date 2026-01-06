export default function Orb({ aura }: { aura: { pulse: number; color: string } }) {
  return (
    <div
      style={{
        width: 160,
        height: 160,
        borderRadius: "50%",
        background: aura.color,
        opacity: 0.6,
        filter: `blur(40px)`,
        transform: `scale(${aura.pulse})`,
        transition: "transform 0.4s ease, background 0.4s ease",
      }}
    />
  );
}
