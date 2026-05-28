import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { useToast } from "@/components/ToastProvider";
import { apiRequest } from "@/lib/api-client";
import Link from "next/link";
import Head from "next/head";

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

interface ApiUser {
  id: number | string;
  name: string;
  email: string;
  phone: string | null;
  chat_limit: number;
  createdAt: string;
  updatedAt: string;
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

export default function UsersList() {
  const toast = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await apiRequest<{ data: ApiUser[] }>(
          "/api/users?page=1&limit=100",
          { tokenType: "admin" }
        );
        setUsers(data.data.map(mapApiUser));
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  return (
    <ProtectedAdminRoute>
      <Head>
        <title>Users - Admin Portal</title>
      </Head>
      <AdminLayout title="Users Management">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-brown-200">
                <h2 className="text-lg font-bold text-brown-900">
                  All Users ({users.length})
                </h2>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-700"></div>
                </div>
              ) : users.length === 0 ? (
                <div className="p-6 text-center text-brown-600">
                  No users found
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-brown-50 border-b border-brown-200">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-brown-900">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-brown-900">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-brown-900">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-brown-900">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-brown-900">
                          Last Active
                        </th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-brown-900">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brown-200">
                      {users.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-brown-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="font-semibold text-brown-900">
                              {user.fullName}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-brown-700">{user.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-brown-700">{user.phoneNumber}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user.emailVerified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {user.emailVerified
                                ? "Verified"
                                : "Pending"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-brown-700 text-sm">
                              {new Date(user.lastActive).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/admin/users/${user.id}`}
                              className="text-brown-600 hover:text-brown-800 font-semibold"
                            >
                              View Details
                            </Link>
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
