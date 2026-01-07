import { WizMessage } from "../hooks/useWizIntent";

export default function LogPanel({
  messages,
}: {
  messages: WizMessage[];
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 20,
        top: 100,
        width: 260,
        height: 400,
        overflowY: "auto",
        color: "#fff",
        fontSize: 14,
        opacity: 0.9,
      }}
    >
      {messages.map((m, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <strong style={{ color: m.role === "user" ? "#6cf" : "#fc6" }}>
            {m.role === "user" ? "You" : "Wiz"}
          </strong>
          <div>{m.content}</div>
        </div>
      ))}
    </div>
  );
}
