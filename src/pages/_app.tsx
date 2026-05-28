import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import { ToastProvider } from "@/components/ToastProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ToastProvider>
      <AdminAuthProvider>
        <Component {...pageProps} />
      </AdminAuthProvider>
    </ToastProvider>
  );
}
