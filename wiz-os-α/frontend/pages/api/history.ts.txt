// pages/api/history.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ status: "method-not-allowed" });
  }

  try {
    const backend = process.env.BACKEND_URL || "http://localhost:8000";
    const component = req.query.component as string;

    const url = new URL(`${backend}/history`);
    if (component) {
      url.searchParams.set("component", component);
    }

    const response = await fetch(url.toString(), { method: "GET" });
    const json = await response.json();

    return res.status(200).json(json);
  } catch (e) {
    console.error("history proxy error:", e);
    return res.status(500).json({ status: "error" });
  }
}
