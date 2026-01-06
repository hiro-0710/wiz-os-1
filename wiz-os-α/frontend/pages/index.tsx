import { useState } from "react";
import { ProfileBadge } from "../components/ProfileBadge";
import { ResponseBubble } from "../components/ResponseBubble";
import { auraColor } from "../lib/aura";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent: input }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Intent error:", err);
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen px-6 py-10 text-white"
      style={{
        backgroundColor: auraColor(
          response?.aura || "calm",
          response?.profile || "guest"
        ),
        transition: "background-color 0.6s ease",
      }}
    >
      <ProfileBadge
        profile={response?.profile}
        confidence={response?.confidence}
      />

      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-xl font-semibold tracking-wide">Wiz Chat</h1>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          className="w-full p-3 rounded bg-black/30 border border-white/20"
          placeholder="Wizに話しかけてみよう…"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition"
        >
          {loading ? "考え中…" : "送信"}
        </button>

        {response && (
          <ResponseBubble
            message={response.message}
            profile={response.profile}
          />
        )}
      </div>
    </div>
  );
}
