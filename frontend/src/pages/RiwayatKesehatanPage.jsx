import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FileHeart, Save, ArrowRight } from "lucide-react";
import FormField from "@/components/ui/FormField";
import EmptyState from "@/components/ui/EmptyState";
import { useScreening } from "@/context/ScreeningContext";
import { healthHistoryService } from "@/services/screeningService";

const initialForm = {
  riwayat_ibu_hamil: "",
  riwayat_anak_kandungan: "",
  riwayat_saat_lahir: "",
  riwayat_setelah_lahir: "",
  riwayat_motorik: "",
};

export default function RiwayatKesehatanPage() {
  const { session, setHealthHistory } = useScreening();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...(session.healthHistory || {}),
  }));
  const [loading, setLoading] = useState(false);

  if (!session.profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <EmptyState
          title="Profil Anak Belum Diisi"
          description="Silakan lengkapi profil anak terlebih dahulu sebelum mengisi riwayat kesehatan."
          action={
            <Link
              to="/profil-anak"
              className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white"
            >
              Isi Profil Anak
            </Link>
          }
        />
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      child_profile_id: session.profile.id,
      ...form,
    };

    try {
      const res = await healthHistoryService.create(payload);
      setHealthHistory(res.data);
      toast.success("Riwayat kesehatan berhasil disimpan");
    } catch {
      setHealthHistory(payload);
      toast.success("Riwayat disimpan secara lokal (server tidak tersedia)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
          <FileHeart className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Riwayat Kesehatan & Perkembangan</h1>
          <p className="text-sm text-slate-500">
            Anak: <strong>{session.profile.nama_panggilan}</strong>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <FormField
          label="Riwayat Kesehatan Ibu Saat Mengandung"
          name="riwayat_ibu_hamil"
          value={form.riwayat_ibu_hamil}
          onChange={handleChange}
          rows={3}
          placeholder="Contoh: kehamilan normal, ada komplikasi, dll."
        />
        <FormField
          label="Riwayat Kesehatan Anak di Kandungan"
          name="riwayat_anak_kandungan"
          value={form.riwayat_anak_kandungan}
          onChange={handleChange}
          rows={3}
          placeholder="Contoh: hasil USG, gerakan janin, dll."
        />
        <FormField
          label="Riwayat Kesehatan Anak Saat Dilahirkan"
          name="riwayat_saat_lahir"
          value={form.riwayat_saat_lahir}
          onChange={handleChange}
          rows={3}
          placeholder="Contoh: berat lahir, APGAR score, cara persalinan, dll."
        />
        <FormField
          label="Riwayat Kesehatan Anak Setelah Lahir"
          name="riwayat_setelah_lahir"
          value={form.riwayat_setelah_lahir}
          onChange={handleChange}
          rows={3}
          placeholder="Contoh: pernah dirawat, operasi, penyakit, dll."
        />
        <FormField
          label="Riwayat Perkembangan Motorik"
          name="riwayat_motorik"
          value={form.riwayat_motorik}
          onChange={handleChange}
          rows={3}
          placeholder="Contoh: kapan tengkurap, duduk, merangkak, berjalan, dll."
        />

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {loading ? "Menyimpan..." : "Simpan Riwayat"}
          </button>
          <Link
            to="/deteksi-dini"
            className="inline-flex items-center gap-2 rounded-xl border border-primary-200 px-6 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
          >
            Lanjut Deteksi
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </form>
    </div>
  );
}
