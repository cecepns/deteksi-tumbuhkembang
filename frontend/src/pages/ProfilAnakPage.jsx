import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { User, Save, ArrowRight } from "lucide-react";
import FormField from "@/components/ui/FormField";
import { useScreening } from "@/context/ScreeningContext";
import { childProfileService } from "@/services/screeningService";
import { calculateAgeInMonths, getAgeGroup, AGE_GROUPS } from "@/data/checklist";

const initialForm = {
  nama_lengkap: "",
  nama_panggilan: "",
  tanggal_lahir: "",
  tempat_lahir: "",
  nama_orang_tua: "",
  nomor_telepon: "",
  keluhan_ortu: "",
};

export default function ProfilAnakPage() {
  const { session, setProfile } = useScreening();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    ...(session.profile
      ? {
          nama_lengkap: session.profile.nama_lengkap || "",
          nama_panggilan: session.profile.nama_panggilan || "",
          tanggal_lahir: session.profile.tanggal_lahir?.split("T")[0] || session.profile.tanggal_lahir || "",
          tempat_lahir: session.profile.tempat_lahir || "",
          nama_orang_tua: session.profile.nama_orang_tua || "",
          nomor_telepon: session.profile.nomor_telepon || "",
          keluhan_ortu: session.profile.keluhan_ortu || "",
        }
      : {}),
  }));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const usiaBulan = form.tanggal_lahir ? calculateAgeInMonths(form.tanggal_lahir) : null;
  const kelompokUsia = usiaBulan !== null ? getAgeGroup(usiaBulan) : null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nama_lengkap.trim()) newErrors.nama_lengkap = "Nama lengkap wajib diisi";
    if (!form.nama_panggilan.trim()) newErrors.nama_panggilan = "Nama panggilan wajib diisi";
    if (!form.tanggal_lahir) newErrors.tanggal_lahir = "Tanggal lahir wajib diisi";
    if (!form.tempat_lahir.trim()) newErrors.tempat_lahir = "Tempat lahir wajib diisi";
    if (!form.nama_orang_tua.trim()) newErrors.nama_orang_tua = "Nama orang tua wajib diisi";
    if (!form.nomor_telepon.trim()) newErrors.nomor_telepon = "Nomor telepon wajib diisi";
    if (usiaBulan !== null && usiaBulan > 36) {
      newErrors.tanggal_lahir = "Alat ini untuk anak usia 0-36 bulan";
    }
    if (usiaBulan !== null && kelompokUsia === null) {
      newErrors.tanggal_lahir = "Usia anak di luar rentang 0-36 bulan";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Periksa kembali data yang diisi");
      return;
    }

    setLoading(true);
    const payload = {
      ...form,
      usia_bulan: usiaBulan,
      kelompok_usia: kelompokUsia,
    };

    try {
      let saved;
      if (session.profile?.id) {
        const res = await childProfileService.update(session.profile.id, payload);
        saved = res.data;
      } else {
        const res = await childProfileService.create(payload);
        saved = res.data;
      }
      setProfile(saved);
      toast.success("Profil anak berhasil disimpan");
    } catch (err) {
      const localProfile = { ...payload, id: session.profile?.id || `local-${Date.now()}` };
      setProfile(localProfile);
      toast.success("Profil disimpan secara lokal (server tidak tersedia)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Profil Anak</h1>
          <p className="text-sm text-slate-500">Lengkapi data anak untuk menentukan kelompok usia skrining</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <FormField
          label="Nama Lengkap Anak"
          name="nama_lengkap"
          value={form.nama_lengkap}
          onChange={handleChange}
          required
          error={errors.nama_lengkap}
        />
        <FormField
          label="Nama Panggilan"
          name="nama_panggilan"
          value={form.nama_panggilan}
          onChange={handleChange}
          required
          error={errors.nama_panggilan}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="Tanggal Lahir"
            name="tanggal_lahir"
            type="date"
            value={form.tanggal_lahir}
            onChange={handleChange}
            required
            error={errors.tanggal_lahir}
          />
          <FormField
            label="Tempat Lahir"
            name="tempat_lahir"
            value={form.tempat_lahir}
            onChange={handleChange}
            required
            error={errors.tempat_lahir}
          />
        </div>

        {usiaBulan !== null && kelompokUsia && (
          <div className="rounded-xl bg-primary-50 px-4 py-3 text-sm text-primary-800">
            Usia anak: <strong>{usiaBulan} bulan</strong> — Kelompok:{" "}
            <strong>{AGE_GROUPS[kelompokUsia].label}</strong>
          </div>
        )}

        <FormField
          label="Nama Orang Tua"
          name="nama_orang_tua"
          value={form.nama_orang_tua}
          onChange={handleChange}
          required
          error={errors.nama_orang_tua}
        />
        <FormField
          label="Nomor Telepon"
          name="nomor_telepon"
          type="tel"
          value={form.nomor_telepon}
          onChange={handleChange}
          required
          placeholder="08xxxxxxxxxx"
          error={errors.nomor_telepon}
        />
        <FormField
          label="Keluhan Orang Tua"
          name="keluhan_ortu"
          value={form.keluhan_ortu}
          onChange={handleChange}
          rows={3}
          placeholder="Ceritakan keluhan atau kekhawatiran terkait perkembangan anak..."
        />

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {loading ? "Menyimpan..." : "Simpan Profil"}
          </button>
          {session.profile && (
            <Link
              to="/riwayat-kesehatan"
              className="inline-flex items-center gap-2 rounded-xl border border-primary-200 px-6 py-2.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50"
            >
              Lanjut
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
