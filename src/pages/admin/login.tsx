import { useState } from "react";
import { useRouter } from "next/router";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { useToast } from "@/components/ToastProvider";
import Head from "next/head";
import { Building2 } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAdminAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Login successful. Welcome back.");
        router.push("/admin/dashboard");
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - Architect Consultant</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-brown-50 to-brown-100 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-brown-600 to-brown-800 rounded-xl flex items-center justify-center text-white">
                <Building2 className="w-7 h-7" aria-hidden="true" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-brown-900 mb-2">
              Admin Portal
            </h1>
            <p className="text-center text-brown-600 mb-8">
              Architect Consultant Management
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-brown-900 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-600 focus:border-transparent text-brown-900"
                  placeholder="admin@architect.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-brown-900 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-600 focus:border-transparent text-brown-900"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brown-700 hover:bg-brown-800 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* <div className="mt-8 p-4 bg-brown-50 rounded-lg border border-brown-200">
              <p className="text-xs text-brown-700 font-mono mb-2">
                Demo Credentials:
              </p>
              <p className="text-xs text-brown-600 font-mono">
                Email: admin@architect.com
              </p>
              <p className="text-xs text-brown-600 font-mono">
                Password: admin123
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
