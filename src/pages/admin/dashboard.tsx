import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { useToast } from "@/components/ToastProvider";
import { apiRequest } from "@/lib/api-client";
import Link from "next/link";
import Head from "next/head";
import { BarChart3, CircleCheck, CircleX, Users } from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalLoginAttempts: number;
  successfulLogins: number;
  failedLogins: number;
}

export default function AdminDashboard() {
  const toast = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalLoginAttempts: 0,
    successfulLogins: 0,
    failedLogins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, attemptsRes] = await Promise.all([
          apiRequest<{
            data: unknown[];
            meta?: { total: number };
          }>("/api/users?page=1&limit=1", { tokenType: "admin" }),
          apiRequest<{
            data: Array<{ success: boolean }>;
            meta?: { total: number };
          }>("/api/user-attempts?page=1&limit=100", { tokenType: "admin" }),
        ]);

          const totalAttempts = attemptsRes.meta?.total ?? attemptsRes.data.length;
          const successfulAttempts = attemptsRes.data.filter(
            (attempt) => attempt.success
          ).length;

          setStats({
            totalUsers: usersRes.meta?.total ?? usersRes.data.length,
            totalLoginAttempts: totalAttempts,
            successfulLogins: successfulAttempts,
            failedLogins: totalAttempts - successfulAttempts,
          });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        toast.error("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  return (
    <ProtectedAdminRoute>
      <Head>
        <title>Dashboard - Admin Portal</title>
      </Head>
      <AdminLayout title="Admin Dashboard">
            {/* Stats Grid */}
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-700"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Total Users */}
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-brown-600 text-sm font-semibold">
                          Total Users
                        </p>
                        <p className="text-3xl font-bold text-brown-900 mt-2">
                          {stats.totalUsers}
                        </p>
                      </div>
                      <Users className="w-8 h-8 text-brown-700" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Total Login Attempts */}
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-brown-600 text-sm font-semibold">
                          Total Login Attempts
                        </p>
                        <p className="text-3xl font-bold text-brown-900 mt-2">
                          {stats.totalLoginAttempts}
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-brown-700" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Successful Logins */}
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-semibold">
                          Successful Logins
                        </p>
                        <p className="text-3xl font-bold text-green-700 mt-2">
                          {stats.successfulLogins}
                        </p>
                      </div>
                      <CircleCheck className="w-8 h-8 text-green-600" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Failed Logins */}
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 text-sm font-semibold">
                          Failed Logins
                        </p>
                        <p className="text-3xl font-bold text-red-700 mt-2">
                          {stats.failedLogins}
                        </p>
                      </div>
                      <CircleX className="w-8 h-8 text-red-600" aria-hidden="true" />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow p-6">
                  <h2 className="text-xl font-bold text-brown-900 mb-4">
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                      href="/admin/users"
                      className="p-4 border-2 border-brown-300 hover:border-brown-600 rounded-lg hover:bg-brown-50 transition-colors"
                    >
                      <p className="font-semibold text-brown-900">View Users</p>
                      <p className="text-sm text-brown-600 mt-1">
                        Manage and view all registered users
                      </p>
                    </Link>
                    <Link
                      href="/admin/login-attempts"
                      className="p-4 border-2 border-brown-300 hover:border-brown-600 rounded-lg hover:bg-brown-50 transition-colors"
                    >
                      <p className="font-semibold text-brown-900">
                        Login Activity
                      </p>
                      <p className="text-sm text-brown-600 mt-1">
                        View user login attempts and activity
                      </p>
                    </Link>
                  </div>
                </div>
              </>
            )}
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
