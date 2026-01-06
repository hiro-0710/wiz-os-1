export default function RollbackPanel({
  onRollback,
}: {
  onRollback: (index: number) => void;
}) {
  return (
    <div
      style={{
        width: "100%",
        padding: 10,
        background: "rgba(255,255,255,0.03)",
        borderRadius: 8,
        color: "#aaa",
        fontSize: 12,
      }}
    >
      <button
        onClick={() => onRollback(0)}
        style={{
          padding: "8px 14px",
          borderRadius: 6,
          background: "#222",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Rollback (sample)
      </button>
    </div>
  );
}
