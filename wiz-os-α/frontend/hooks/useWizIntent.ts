import { useState } from "react";
import axios from "axios";

export interface WizMessage {
  role: "user" | "wiz";
  content: string;
  profile?: string;
}

export function useWizIntent() {
  const [messages, setMessages] = useState<WizMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendIntent = async (intent: string) => {
    if (!intent.trim()) return;

    // ユーザーの発話をログに追加
    setMessages((prev) => [...prev, { role: "user", content: intent }]);
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE}/intent`,
        { intent }
      );

      const data = res.data;

      // Wiz の応答をログに追加
      setMessages((prev) => [
        ...prev,
        {
          role: "wiz",
          content: data.message,
          profile: data.profile
        }
      ]);
    } catch (err) {
      console.error("Intent error:", err);
    }

    setLoading(false);
  };

  return {
    messages,
    sendIntent,
    loading
  };
}
