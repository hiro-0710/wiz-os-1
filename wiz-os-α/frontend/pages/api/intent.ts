import type { NextApiRequest, NextApiResponse } from "next";

// backend の intent_engine を呼び出す（仮の最小構成）
async function callIntentEngine(intent: string) {
  const res = await fetch("http://localhost:8000/wiz/intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ intent }),
  });

  return await res.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { intent } = req.body;

  if (!intent || typeof intent !== "string") {
    return res.status(400).json({ error: "Invalid intent" });
  }

  try {
    const result = await callIntentEngine(intent);

    return res.status(200).json({
      ok: true,
      result,
    });
  } catch (err) {
    console.error("Intent Engine Error:", err);
    return res.status(500).json({ error: "Intent engine failed" });
  }
}
