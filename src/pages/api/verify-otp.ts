import { verifyOtp } from "@/lib/otp-store";
import type { NextApiRequest, NextApiResponse } from "next";

interface RequestBody {
  email: string;
  otp: string;
}

interface ResponseBody {
  message: string;
  verified: boolean;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseBody>
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed", verified: false });
    return;
  }

  const { email, otp } = req.body as RequestBody;

  if (!email?.trim() || !otp?.trim()) {
    res
      .status(400)
      .json({ message: "Email and OTP are required.", verified: false });
    return;
  }

  const result = verifyOtp({
    email,
    otp: otp.replace(/\s/g, ""),
  });

  res
    .status(result.ok ? 200 : 400)
    .json({ message: result.message, verified: result.ok });
}
