import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getInitialDBState } from "./_db.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    // Return the initial seed state — client merges with localStorage mutations
    const state = getInitialDBState();
    return res.json(state);
  }

  if (req.method === "POST") {
    // Reset — just return the seed state (client will store in localStorage)
    const state = getInitialDBState();
    return res.json({ success: true, state });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
