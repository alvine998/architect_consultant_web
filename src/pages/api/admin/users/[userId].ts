import type { NextApiRequest, NextApiResponse } from "next";
import { getUserById, getChatsByUserId, getLoginAttempts } from "@/lib/mockData";

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

  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "User ID is required" });
  }

  const user = getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const chats = getChatsByUserId(userId);
  const loginAttempts = getLoginAttempts(userId);

  return res.status(200).json({
    user,
    chats,
    loginAttempts,
  });
}
