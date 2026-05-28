export class ApiRequestError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.data = data;
  }
}

const normalizeBaseUrl = (url: string) =>
  url.replace(/\/+$/, "").replace(/\/api$/, "");

export const API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
);

type TokenType = "user" | "admin";

const tokenKeys: Record<TokenType, string> = {
  user: "token",
  admin: "adminToken",
};

export const getStoredToken = (type: TokenType = "user") => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(tokenKeys[type]);
};

export const setStoredToken = (token: string, type: TokenType = "user") => {
  if (typeof window === "undefined") return;
  localStorage.setItem(tokenKeys[type], token);
};

export const clearStoredToken = (type: TokenType = "user") => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(tokenKeys[type]);
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { tokenType?: TokenType } = {}
) {
  const { tokenType = "user", headers, ...requestOptions } = options;
  const token = getStoredToken(tokenType);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? String(data.message)
        : "Request failed";

    throw new ApiRequestError(message, response.status, data);
  }

  return data as T;
}
