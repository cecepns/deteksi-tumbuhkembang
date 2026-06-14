import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import SearchInput from "@/components/admin/SearchInput";
import LimitSelect from "@/components/admin/LimitSelect";
import Pagination from "@/components/admin/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { childProfileService } from "@/services/screeningService";
import { AGE_GROUPS } from "@/data/checklist";

function confirmDelete(nama) {
  return new Promise((resolve) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-slate-800">
            Hapus profil <strong>{nama}</strong>?
          </p>
          <p className="text-xs text-slate-500">
            Riwayat kesehatan dan hasil skrining terkait juga akan dihapus.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Ya, Hapus
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Batal
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  });
}

export default function AdminProfilesPage() {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const debouncedSearch = useDebounce(search, 300);

  const fetchData = useCallback(() => {
    setLoading(true);
    childProfileService
      .list({ page, limit, search: debouncedSearch })
      .then((res) => {
        setData(res.data);
        setPagination(res.pagination);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, limit]);

  const handleDelete = async (row) => {
    const confirmed = await confirmDelete(row.nama_panggilan || row.nama_lengkap);
    if (!confirmed) return;

    setDeletingId(row.id);
    try {
      await childProfileService.delete(row.id);
      toast.success("Profil anak berhasil dihapus");
      if (data.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        fetchData();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800">Data Profil Anak</h1>
      <p className="mt-1 text-sm text-slate-500">Semua profil anak yang terdaftar</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Cari nama anak atau orang tua..."
        />
        <LimitSelect value={limit} onChange={setLimit} />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {loading ? (
          <LoadingSpinner />
        ) : data.length === 0 ? (
          <EmptyState title="Tidak ada data" description="Belum ada profil anak terdaftar." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Nama</th>
                  <th className="px-4 py-3 font-medium">TTL</th>
                  <th className="px-4 py-3 font-medium">Usia</th>
                  <th className="px-4 py-3 font-medium">Orang Tua</th>
                  <th className="px-4 py-3 font-medium">Telepon</th>
                  <th className="px-4 py-3 font-medium">Tanggal Input</th>
                  <th className="px-4 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{row.nama_lengkap}</p>
                      <p className="text-xs text-slate-500">{row.nama_panggilan}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {row.tempat_lahir}, {new Date(row.tanggal_lahir).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      {row.usia_bulan} bln
                      <span className="block text-xs text-slate-500">
                        {AGE_GROUPS[row.kelompok_usia]?.label || row.kelompok_usia}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{row.nama_orang_tua}</td>
                    <td className="px-4 py-3 text-slate-600">{row.nomor_telepon}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(row.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(row)}
                        disabled={deletingId === row.id}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        title="Hapus profil"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {deletingId === row.id ? "Menghapus..." : "Hapus"}
                      </button>
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
