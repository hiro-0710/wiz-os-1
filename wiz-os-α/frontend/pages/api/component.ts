// frontend/pages/api/component.ts

import type { NextApiRequest, NextApiResponse } from "next";

/**
 * UI コンポーネントの状態を管理する API。
 * 
 * - 現在の UI 状態を取得
 * - UI の進化（evolve-ui）を呼び出す
 * - UI の巻き戻し（rollback-ui）を呼び出す
 * - UI の履歴（history）を返す
 *
 * すべて backend 側の API と連携して動く。
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { action } = req.query;

  try {
    // ----------------------------------------------------
    // GET: 現在の UI 状態を取得
    // ----------------------------------------------------
    if (req.method === "GET") {
      const backendRes = await fetch("http://localhost:8000/ui/state");
      const data = await backendRes.json();
      return res.status(200).json(data);
    }

    // ----------------------------------------------------
    // POST: UI を進化させる
    // ----------------------------------------------------
    if (req.method === "POST" && action === "evolve") {
      const backendRes = await fetch("http://localhost:8000/ui/evolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });

      const data = await backendRes.json();
      return res.status(200).json(data);
    }

    // ----------------------------------------------------
    // POST: UI を巻き戻す
    // ----------------------------------------------------
    if (req.method === "POST" && action === "rollback") {
      const backendRes = await fetch("http://localhost:8000/ui/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await backendRes.json();
      return res.status(200).json(data);
    }

    // ----------------------------------------------------
    // GET: UI の履歴を取得
    // ----------------------------------------------------
    if (req.method === "GET" && action === "history") {
      const backendRes = await fetch("http://localhost:8000/ui/history");
      const data = await backendRes.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: "Invalid request" });

  } catch (err) {
    console.error("UI component API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
