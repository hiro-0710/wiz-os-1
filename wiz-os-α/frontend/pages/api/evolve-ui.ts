// pages/api/evolve-ui.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "method-not-allowed" });
  }

  try {
    const backend = process.env.BACKEND_URL || "http://localhost:8000";

    const response = await fetch(`${backend}/evolve-ui`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const json = await response.json();
    return res.status(200).json(json);
  } catch (e) {
    console.error("evolve-ui proxy error:", e);
    return res.status(500).json({ status: "error" });
  }
}
