import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getInitialDBState } from "./_db.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "POST") {
    const { email, password } = req.body || {};
    if (email === "admin@syntaxia.dev" && password === "syntaxia2026") {
      return res.json({
        success: true,
        token: "syntaxia_secure_private_token_2026",
        user: { id: "1", name: "Srivishnu (Sir)", email: "vishnusenpaiit@gmail.com" }
      });
    }
    return res.status(401).json({ error: "Invalid administrative credentials." });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
