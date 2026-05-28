import type { NextApiRequest, NextApiResponse } from "next";
import { getLoginAttempts } from "@/lib/mockData";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check admin authentication
  const sessionCookie = req.cookies.admin_session;
  if (sessionCookie !== "admin-1") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const attempts = getLoginAttempts();
  
  // Sort by timestamp descending
  attempts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return res.status(200).json({ attempts });
}
