import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useAppSettings } from "@/hooks/useAppSettings";

export default function Layout() {
  const settings = useAppSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold text-primary-700">{settings.tagline}</p>
          <p className="mt-1 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {settings.rs_name}
          </p>
        </div>
      </footer>
    </div>
  );
}
