import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { useToast } from "@/components/ToastProvider";
import { apiRequest } from "@/lib/api-client";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import {
  ArrowLeft,
  CircleCheck,
  CircleX,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  projectIntent: string;
  createdAt: Date;
  lastActive: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface LoginAttempt {
  id: string;
  email: string;
  timestamp: Date;
  status: "success" | "failed";
  ipAddress: string;
}

interface ApiUser {
  id: number | string;
  name: string;
  email: string;
  phone: string | null;
  chat_limit: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiAttempt {
  id: number | string;
  email: string;
  ipaddress: string;
  timestamp: string;
  success: boolean;
}

const mapApiUser = (user: ApiUser): User => ({
  id: String(user.id),
  fullName: user.name,
  email: user.email,
  phoneNumber: user.phone ?? "-",
  emailVerified: true,
  projectIntent: "-",
  createdAt: new Date(user.createdAt),
  lastActive: new Date(user.updatedAt),
});

const mapApiAttempt = (attempt: ApiAttempt): LoginAttempt => ({
  id: String(attempt.id),
  email: attempt.email,
  timestamp: new Date(attempt.timestamp),
  status: attempt.success ? "success" : "failed",
  ipAddress: attempt.ipaddress,
});

export default function UserDetail() {
  const toast = useToast();
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"chats" | "attempts">("chats");

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const userData = await apiRequest<ApiUser>(`/api/users/${userId}`, {
          tokenType: "admin",
        });
        const mappedUser = mapApiUser(userData);
        const attemptsData = await apiRequest<{ data: ApiAttempt[] }>(
          `/api/user-attempts?page=1&limit=100&email=${encodeURIComponent(
            mappedUser.email
          )}`,
          { tokenType: "admin" }
        );

        setUser(mappedUser);
        setChats([]);
        setLoginAttempts(attemptsData.data.map(mapApiAttempt));
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Failed to load user detail.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [toast, userId]);

  if (loading) {
    return (
      <ProtectedAdminRoute>
        <div className="flex items-center justify-center min-h-screen bg-brown-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-700"></div>
        </div>
      </ProtectedAdminRoute>
    );
  }

  if (!user) {
    return (
      <ProtectedAdminRoute>
        <Head>
          <title>User Not Found - Admin Portal</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-brown-50 to-brown-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-brown-900 mb-4">
              User Not Found
            </h1>
            <Link
              href="/admin/users"
              className="text-brown-600 hover:text-brown-800 font-semibold"
            >
              Back to Users
            </Link>
          </div>
        </div>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <Head>
        <title>{user.fullName} - Admin Portal</title>
      </Head>
      <AdminLayout title={user.fullName}>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-brown-600 hover:text-brown-800 font-semibold mb-6"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Users
          </Link>

          {/* User Info */}
          <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-brown-900 mb-4">
              User Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-brown-600 font-semibold">Full Name</p>
                <p className="text-lg text-brown-900">{user.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-brown-600 font-semibold">Email</p>
                <p className="text-lg text-brown-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-brown-600 font-semibold">
                  Phone Number
                </p>
                <p className="text-lg text-brown-900">{user.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-brown-600 font-semibold">
                  Email Verified
                </p>
                <p
                  className={`text-lg font-semibold ${
                    user.emailVerified
                      ? "text-green-700"
                      : "text-yellow-700"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {user.emailVerified ? (
                      <CircleCheck className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <CircleX className="w-5 h-5" aria-hidden="true" />
                    )}
                    {user.emailVerified ? "Verified" : "Pending"}
                  </span>
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-brown-600 font-semibold">
                  Project Intent
                </p>
                <p className="text-lg text-brown-900">{user.projectIntent}</p>
              </div>
              <div>
                <p className="text-sm text-brown-600 font-semibold">
                  Joined Date
                </p>
                <p className="text-lg text-brown-900">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-brown-600 font-semibold">
                  Last Active
                </p>
                <p className="text-lg text-brown-900">
                  {new Date(user.lastActive).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow">
            {/* Tab Navigation */}
            <div className="border-b border-brown-200 flex">
              <button
                onClick={() => setActiveTab("chats")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "chats"
                    ? "text-brown-900 border-b-2 border-brown-700"
                    : "text-brown-600 hover:text-brown-800"
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <MessageSquareText className="w-5 h-5" aria-hidden="true" />
                  Chat History ({chats.length})
                </span>
              </button>
              <button
                onClick={() => setActiveTab("attempts")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "attempts"
                    ? "text-brown-900 border-b-2 border-brown-700"
                    : "text-brown-600 hover:text-brown-800"
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                  Login Attempts ({loginAttempts.length})
                </span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "chats" ? (
                <div className="space-y-4">
                  {chats.length === 0 ? (
                    <p className="text-center text-brown-600 py-8">
                      No chats yet
                    </p>
                  ) : (
                    chats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`flex ${
                          chat.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-md px-4 py-3 rounded-lg ${
                            chat.role === "user"
                              ? "bg-brown-700 text-white rounded-br-none"
                              : "bg-brown-100 text-brown-900 rounded-bl-none"
                          }`}
                        >
                          <p className="break-words text-sm">{chat.content}</p>
                          <span
                            className={`text-xs mt-2 block ${
                              chat.role === "user"
                                ? "text-brown-200"
                                : "text-brown-600"
                            }`}
                          >
                            {new Date(chat.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {loginAttempts.length === 0 ? (
                    <p className="text-center text-brown-600 py-8">
                      No login attempts
                    </p>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="bg-brown-50 border-b border-brown-200">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">
                            Timestamp
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-brown-900">
                            IP Address
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brown-200">
                        {loginAttempts.map((attempt) => (
                          <tr key={attempt.id}>
                            <td className="px-4 py-3">
                              <p className="text-sm text-brown-900">
                                {new Date(attempt.timestamp).toLocaleString()}
                              </p>
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  attempt.status === "success"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                <span className="inline-flex items-center gap-1.5">
                                  {attempt.status === "success" ? (
                                    <CircleCheck className="w-3.5 h-3.5" aria-hidden="true" />
                                  ) : (
                                    <CircleX className="w-3.5 h-3.5" aria-hidden="true" />
                                  )}
                                  {attempt.status === "success"
                                    ? "Success"
                                    : "Failed"}
                                </span>
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm text-brown-900 font-mono">
                                {attempt.ipAddress}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
