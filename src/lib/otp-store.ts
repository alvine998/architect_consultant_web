interface OtpRecord {
  code: string;
  expiresAt: number;
  fullName: string;
  ipAddress: string;
  phoneNumber: string;
  sentAt: number;
}

const otpStore = new Map<string, OtpRecord>();
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

export const createOtp = ({
  email,
  fullName,
  ipAddress,
  phoneNumber,
}: {
  email: string;
  fullName: string;
  ipAddress: string;
  phoneNumber: string;
}) => {
  const normalizedEmail = email.toLowerCase();
  const existingRecord = otpStore.get(normalizedEmail);
  const now = Date.now();

  if (existingRecord) {
    const retryAfterMs =
      existingRecord.sentAt + OTP_RESEND_COOLDOWN_MS - now;

    if (retryAfterMs > 0) {
      return {
        ok: false,
        message: `Please wait ${Math.ceil(
          retryAfterMs / 1000
        )} seconds before requesting another OTP.`,
        retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
      };
    }
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  otpStore.set(normalizedEmail, {
    code,
    expiresAt: now + 10 * 60 * 1000,
    fullName,
    ipAddress,
    phoneNumber,
    sentAt: now,
  });

  return {
    ok: true,
    code,
    message: "OTP sent successfully.",
  };
};

export const verifyOtp = ({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) => {
  const normalizedEmail = email.toLowerCase();
  const record = otpStore.get(normalizedEmail);

  if (!record) {
    return { ok: false, message: "OTP was not found. Please request a new OTP." };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalizedEmail);
    return { ok: false, message: "OTP expired. Please request a new OTP." };
  }

  if (record.code !== otp) {
    return { ok: false, message: "OTP is not correct." };
  }

  otpStore.delete(normalizedEmail);
  return { ok: true, message: "Email verified successfully." };
};
