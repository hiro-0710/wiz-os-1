// frontend/pages/api/state.ts

import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Wiz UI の現在の状態を取得する API。
 * Next.js → FastAPI の /ui/state をプロキシする。
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const backendRes = await fetch("http://localhost:8000/ui/state");
    const data = await backendRes.json();

    return res.status(200).json(data);

  } catch (err) {
    console.error("UI state API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
