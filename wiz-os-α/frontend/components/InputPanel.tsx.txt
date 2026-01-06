import { useState } from "react";

export default function InputPanel({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        width: "100%",
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        placeholder="Wiz に話しかける..."
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #444",
          background: "#111",
          color: "#fff",
        }}
      />

      <button
        onClick={send}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          background: "#333",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Send
      </button>
    </div>
  );
}
