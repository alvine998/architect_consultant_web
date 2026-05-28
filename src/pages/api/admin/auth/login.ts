import type { NextApiRequest, NextApiResponse } from "next";

interface LoginRequest {
  email: string;
  password: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

// Mock admin credentials
const ADMIN_EMAIL = "admin@architect.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_USER: AdminUser = {
  id: "admin-1",
  email: ADMIN_EMAIL,
  name: "Admin",
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body as LoginRequest;

  // Simple validation
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Set a simple session cookie
    res.setHeader(
      "Set-Cookie",
      `admin_session=${ADMIN_USER.id}; Path=/; HttpOnly; Max-Age=86400`
    );

    return res.status(200).json({
      success: true,
      admin: ADMIN_USER,
    });
  }

  return res.status(401).json({
    success: false,
    error: "Invalid credentials",
  });
}
