import { useState } from "react";

export default function InputPanel({
  onSend,
  loading = false,
  onEvolve,
  onRollback,
}: {
  onSend: (text: string) => void | Promise<void>;
  loading?: boolean;
  onEvolve?: () => void | Promise<void>;
  onRollback?: () => void | Promise<void>;
}) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        display: "flex",
        gap: 10,
        padding: 10,
      }}
    >
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="メッセージを入力..."
        style={{
          flex: 1,
          padding: 10,
          borderRadius: 8,
          border: "1px solid #444",
          background: "#111",
          color: "#fff",
        }}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          padding: "10px 16px",
          borderRadius: 8,
          background: loading ? "#333" : "#0af",
          color: "#fff",
          border: "none",
        }}
      >
        送信
      </button>

      {onEvolve && (
        <button
          onClick={onEvolve}
          disabled={loading}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            background: "#6f0",
            color: "#000",
            border: "none",
          }}
        >
          進化
        </button>
      )}

      {onRollback && (
        <button
          onClick={onRollback}
          disabled={loading}
          style={{
            padding: "10px 12px",
            borderRadius: 8,
            background: "#f60",
            color: "#000",
            border: "none",
          }}
        >
          戻す
        </button>
      )}
    </div>
  );
}
