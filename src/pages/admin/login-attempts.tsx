import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { useToast } from "@/components/ToastProvider";
import { apiRequest } from "@/lib/api-client";
import Head from "next/head";
import { CircleCheck, CircleX } from "lucide-react";

interface LoginAttempt {
  id: string;
  email: string;
  timestamp: Date;
  status: "success" | "failed";
  ipAddress: string;
}

interface ApiAttempt {
  id: number | string;
  email: string;
  ipaddress: string;
  timestamp: string;
  success: boolean;
}

const mapApiAttempt = (attempt: ApiAttempt): LoginAttempt => ({
  id: String(attempt.id),
  email: attempt.email,
  timestamp: new Date(attempt.timestamp),
  status: attempt.success ? "success" : "failed",
  ipAddress: attempt.ipaddress,
});

export default function LoginAttempts() {
  const toast = useToast();
  const [attempts, setAttempts] = useState<LoginAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "success" | "failed">("all");

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const data = await apiRequest<{ data: ApiAttempt[] }>(
          "/api/user-attempts?page=1&limit=100",
          { tokenType: "admin" }
        );
        setAttempts(data.data.map(mapApiAttempt));
      } catch (error) {
        console.error("Failed to fetch login attempts:", error);
        toast.error("Failed to load login attempts.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttempts();
  }, [toast]);

  const filteredAttempts = attempts.filter((attempt) => {
    if (filter === "all") return true;
    return attempt.status === filter;
  });

  return (
    <ProtectedAdminRoute>
      <Head>
        <title>Login Attempts - Admin Portal</title>
      </Head>
      <AdminLayout title="Login Attempts">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-brown-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-bold text-brown-900">
                  All Login Attempts ({filteredAttempts.length})
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      filter === "all"
                        ? "bg-brown-700 text-white"
                        : "bg-brown-100 text-brown-700 hover:bg-brown-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter("success")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      filter === "success"
                        ? "bg-green-600 text-white"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    Success
                  </button>
                  <button
                    onClick={() => setFilter("failed")}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      filter === "failed"
                        ? "bg-red-600 text-white"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    Failed
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-700"></div>
                </div>
              ) : filteredAttempts.length === 0 ? (
                <div className="p-6 text-center text-brown-600">
                  No login attempts found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-brown-50 border-b border-brown-200">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-brown-900">
                          Timestamp
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-brown-900">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-brown-900">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-brown-900">
                          IP Address
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brown-200">
                      {filteredAttempts.map((attempt) => (
                        <tr
                          key={attempt.id}
                          className="hover:bg-brown-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="text-sm text-brown-900">
                              {new Date(attempt.timestamp).toLocaleString()}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-brown-700 text-sm">
                              {attempt.email}
                            </p>
                          </td>
                          <td className="px-6 py-4">
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
                          <td className="px-6 py-4">
                            <p className="text-sm text-brown-900 font-mono">
                              {attempt.ipAddress}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
