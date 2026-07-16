import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import SearchInput from "@/components/admin/SearchInput";
import LimitSelect from "@/components/admin/LimitSelect";
import Pagination from "@/components/admin/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { screeningService } from "@/services/screeningService";
import { AGE_GROUPS } from "@/data/checklist";

const statusBadge = (score) => {
  if (score >= 85) return "bg-green-100 text-green-700";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

export default function AdminScreeningPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setLoading(true);
    screeningService
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
      <h1 className="text-2xl font-bold text-slate-800">Hasil Skrining</h1>
      <p className="mt-1 text-sm text-slate-500">Semua hasil deteksi dini yang tersimpan</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari nama anak..." />
        <LimitSelect value={limit} onChange={setLimit} />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {loading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <EmptyState title="Tidak ada data" description="Belum ada hasil skrining." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Anak</th>
                  <th className="px-4 py-3 font-medium">Kelompok Usia</th>
                  <th className="px-4 py-3 font-medium">Skor</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Item</th>
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{row.nama_panggilan || "-"}</p>
                      <p className="text-xs text-slate-500">{row.nama_lengkap}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {AGE_GROUPS[row.kelompok_usia]?.label || row.kelompok_usia}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(row.score)}`}
                      >
                        {row.score}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.status}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.checked_items}/{row.total_items}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {row.tanggal_screening ? new Date(row.tanggal_screening).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(row.created_at).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pagination && (
          <div className="border-t border-slate-100 px-4">
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
