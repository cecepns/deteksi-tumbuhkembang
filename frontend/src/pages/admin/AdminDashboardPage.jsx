import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, FileHeart, ClipboardCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { adminService } from "@/services/adminService";

const statCards = [
  { key: "totalProfiles", label: "Profil Anak", icon: Users, to: "/admin/profil-anak", color: "bg-blue-50 text-blue-700" },
  { key: "totalHistories", label: "Riwayat Kesehatan", icon: FileHeart, to: "/admin/riwayat-kesehatan", color: "bg-rose-50 text-rose-700" },
  { key: "totalScreenings", label: "Hasil Skrining", icon: ClipboardCheck, to: "/admin/hasil-skrining", color: "bg-teal-50 text-teal-700" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getStats()
      .then((res) => setStats(res.data))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Ringkasan data skrining deteksi dini</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <Link
            key={card.key}
            to={card.to}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className={`mb-3 inline-flex rounded-xl p-2.5 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats?.[card.key] ?? 0}</p>
            <p className="text-sm text-slate-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Skrining Terbaru</h2>
          <Link
            to="/admin/hasil-skrining"
            className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:underline"
          >
            Lihat semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {stats?.recentScreenings?.length ? (
          <div className="divide-y divide-slate-100">
            {stats.recentScreenings.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium text-slate-700">{item.nama_panggilan || "-"}</p>
                  <p className="text-slate-500">{item.status}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-700">{item.score}%</p>
                  <p className="text-xs text-slate-400">
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Belum ada data skrining.</p>
        )}
      </div>
    </div>
  );
}
