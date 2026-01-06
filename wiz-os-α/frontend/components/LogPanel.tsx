import { WizLog } from "../hooks/useWizEvolutionLoop";

export default function LogPanel({ logs }: { logs: WizLog[] }) {
  return (
    <div
      style={{
        width: "100%",
        maxHeight: 200,
        overflowY: "auto",
        padding: 10,
        background: "rgba(255,255,255,0.03)",
        borderRadius: 8,
        fontSize: 12,
        color: "#ccc",
      }}
    >
      {logs.map((log, i) => (
        <div key={i} style={{ marginBottom: 6 }}>
          <span style={{ opacity: 0.5 }}>{log.timestamp}</span>
          <br />
          {log.message}
        </div>
      ))}
    </div>
  );
}
