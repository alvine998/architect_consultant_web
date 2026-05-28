import type { NextApiRequest, NextApiResponse } from "next";
import { getUsers } from "@/lib/mockData";

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

  const users = getUsers();
  return res.status(200).json({ users });
}
