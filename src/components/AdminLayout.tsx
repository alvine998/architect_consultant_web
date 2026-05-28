import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  BarChart3,
  Building2,
  LogOut,
  ShieldCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

const navItems = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/login-attempts",
    label: "Login Attempts",
    icon: ShieldCheck,
  },
];

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { admin, logout } = useAdminAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-50 to-brown-100 overflow-x-hidden">
      <header className="bg-white border-b border-brown-200 sticky top-0 z-40">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-brown-600 to-brown-800 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                <Building2 className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-brown-500">
                  ArchitectAI Admin
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-brown-900 truncate">
                  {title}
                </h1>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <span className="text-sm text-brown-700 font-semibold truncate">
                {admin?.name}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col sm:flex-row bg-gradient-to-br from-brown-50 to-brown-100">
        <aside className="w-full sm:w-64 bg-white border-b sm:border-b-0 sm:border-r border-brown-200 sm:min-h-[calc(100vh-73px)] flex-shrink-0">
          <nav className="p-4 sm:p-6 flex sm:block gap-2 overflow-x-auto sm:space-y-2">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive =
                router.pathname === href || router.pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex sm:flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                    isActive
                      ? "bg-brown-100 text-brown-900"
                      : "text-brown-700 hover:bg-brown-50"
                  }`}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
