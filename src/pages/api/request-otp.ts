import { createOtp } from "@/lib/otp-store";
import type { NextApiRequest, NextApiResponse } from "next";

interface RequestBody {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface ResponseBody {
  message: string;
  demoOtp?: string;
  retryAfterSeconds?: number;
}

const getIpAddress = (req: NextApiRequest) => {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = req.headers["x-real-ip"];

  if (typeof realIp === "string" && realIp.trim()) {
    return realIp;
  }

  return req.socket.remoteAddress ?? "unknown";
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { fullName, email, phoneNumber } = req.body as RequestBody;
  const ipAddress = getIpAddress(req);
  const phoneDigits = phoneNumber?.replace(/\D/g, "") ?? "";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!fullName?.trim()) {
    res.status(400).json({ message: "Full name is required." });
    return;
  }

  if (!emailPattern.test(email ?? "")) {
    res.status(400).json({ message: "A valid email address is required." });
    return;
  }

  if (phoneDigits.length < 10 || phoneDigits.length > 13) {
    res
      .status(400)
      .json({ message: "Phone number must contain 10 to 13 digits." });
    return;
  }

  const result = createOtp({
    email,
    fullName: fullName.trim(),
    ipAddress,
    phoneNumber: phoneDigits,
  });

  if (!result.ok) {
    res.status(429).json({
      message: result.message,
      retryAfterSeconds: result.retryAfterSeconds,
    });
    return;
  }

  res.status(200).json({
    message: `OTP sent to ${email}.`,
    demoOtp: result.code,
  });
}
