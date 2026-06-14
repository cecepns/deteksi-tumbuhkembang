import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import FormField from "@/components/ui/FormField";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminLoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error("Username dan password wajib diisi");
      return;
    }
    setSubmitting(true);
    try {
      await login(form.username, form.password);
      toast.success("Login berhasil");
      navigate("/admin");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-600 to-teal-800 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-500">Panel Admin Deteksi Batita</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            placeholder="admin"
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            placeholder="••••••••"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            <LogIn className="h-4 w-4" />
            {submitting ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Default: admin / admin123 — wajib diganti setelah deploy
        </p>
      </div>
    </div>
  );
}
