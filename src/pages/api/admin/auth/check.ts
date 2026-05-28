import type { NextApiRequest, NextApiResponse } from "next";

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

const ADMIN_USER: AdminUser = {
  id: "admin-1",
  email: "admin@architect.com",
  name: "Admin",
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Check if admin session cookie exists
  const sessionCookie = req.cookies.admin_session;

  if (sessionCookie === ADMIN_USER.id) {
    return res.status(200).json({
      authenticated: true,
      admin: ADMIN_USER,
    });
  }

  return res.status(401).json({
    authenticated: false,
  });
}
