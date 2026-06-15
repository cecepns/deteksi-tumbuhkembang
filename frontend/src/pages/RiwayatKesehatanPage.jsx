import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FileHeart, Save, ArrowRight } from "lucide-react";
import CheckboxGroup from "@/components/forms/CheckboxGroup";
import EmptyState from "@/components/ui/EmptyState";
import { useScreening } from "@/context/ScreeningContext";
import { healthHistoryService } from "@/services/screeningService";
import { HEALTH_HISTORY_SECTIONS } from "@/data/healthHistoryOptions";
import {
  getInitialHealthHistoryForm,
  serializeHealthHistoryForm,
  toggleHealthHistoryOption,
} from "@/utils/healthHistory";

export default function RiwayatKesehatanPage() {
  const { session, setHealthHistory } = useScreening();
  const [form, setForm] = useState(() =>
    getInitialHealthHistoryForm(session.healthHistory || {})
  );
  const [errors, setErrors] = useState({});
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

  const handleCheckboxChange = (name, option, hasTidakAda) => {
    setForm((prev) => ({
      ...prev,
      [name]: toggleHealthHistoryOption(prev[name] || [], option, hasTidakAda),
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    HEALTH_HISTORY_SECTIONS.forEach((section) => {
      if (section.required && (!form[section.key] || form[section.key].length === 0)) {
        newErrors[section.key] = "Pilih minimal satu opsi";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Lengkapi semua bagian riwayat kesehatan");
      return;
    }

    setLoading(true);
    const serialized = serializeHealthHistoryForm(form);
    const payload = {
      child_profile_id: session.profile.id,
      ...serialized,
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

      <div className="mb-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Centang (<strong>✓</strong>) kondisi yang sesuai. Pilih <strong>Tidak ada</strong> jika tidak
        ada riwayat pada bagian tersebut.
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
      >
        {HEALTH_HISTORY_SECTIONS.map((section) => (
          <CheckboxGroup
            key={section.key}
            label={section.label}
            name={section.key}
            options={section.options}
            value={form[section.key] || []}
            onChange={handleCheckboxChange}
            required={section.required}
            hint={section.hint}
            hasTidakAda={section.hasTidakAda}
            error={errors[section.key]}
          />
        ))}

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
