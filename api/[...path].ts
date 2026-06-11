import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getInitialDBState } from "./_db.js";

// Catch-all handler for all mutation API endpoints.
// Since Vercel serverless has no persistent filesystem, all mutations
// are acknowledged here but the real state is persisted in localStorage on the client.
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();

  const url = req.url || "";
  const body = req.body || {};

  // POST /api/reset — return fresh seed state
  if (url.includes("/reset") && req.method === "POST") {
    return res.json({ success: true, message: "Roadmap re-seeded from source blueprint.", state: getInitialDBState() });
  }

  // Acknowledge all mutations — client stores actual state in localStorage
  if (req.method === "POST") {
    const id = `${Date.now()}`;
    return res.status(201).json({ ...body, id, success: true });
  }

  if (req.method === "PUT") {
    return res.json({ ...body, success: true });
  }

  if (req.method === "DELETE") {
    return res.json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
