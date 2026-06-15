import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import SearchInput from "@/components/admin/SearchInput";
import LimitSelect from "@/components/admin/LimitSelect";
import Pagination from "@/components/admin/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { healthHistoryService } from "@/services/screeningService";
import { formatHealthHistoryDisplay } from "@/utils/healthHistory";

export default function AdminHealthHistoriesPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setLoading(true);
    healthHistoryService
      .list({ page, limit, search: debouncedSearch })
      .then((res) => {
        setData(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, limit]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Riwayat Kesehatan</h1>
      <p className="mt-1 text-sm text-slate-500">Data riwayat kesehatan dan perkembangan anak</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari nama anak..." />
        <LimitSelect value={limit} onChange={setLimit} />
      </div>

      <div className="mt-4 space-y-4">
        {loading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <EmptyState title="Tidak ada data" description="Belum ada riwayat kesehatan." />
        ) : (
          data.map((row) => (
            <div
              key={row.id}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-slate-800">
                    {row.nama_lengkap || row.nama_panggilan || `Anak #${row.child_profile_id}`}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(row.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                {[
                  ["Riwayat Ibu Hamil", row.riwayat_ibu_hamil],
                  ["Riwayat di Kandungan", row.riwayat_anak_kandungan],
                  ["Saat Lahir", row.riwayat_saat_lahir],
                  ["Setelah Lahir", row.riwayat_setelah_lahir],
                  ["Perkembangan Motorik", row.riwayat_motorik],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs font-medium text-slate-500">{label}</p>
                    <p className="mt-0.5 text-slate-700">
                      {formatHealthHistoryDisplay(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {pagination && (
        <Pagination pagination={pagination} onPageChange={setPage} />
      )}
    </div>
  );
}
