import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Save, Settings } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import FormField from "@/components/ui/FormField";
import { adminService } from "@/services/adminService";
import { STIMULATION_LINKS } from "@/data/checklist";

const GENERAL_FIELDS = [
  { key: "rs_name", label: "Nama RS", type: "text" },
  { key: "rs_phone", label: "Nomor Telepon RS", type: "tel" },
  { key: "tagline", label: "Tagline", type: "text" },
  { key: "disclaimer", label: "Disclaimer / Penjelasan Alat", type: "textarea", rows: 8 },
];

export default function AdminSettingsPage() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService
      .getSettings()
      .then((res) => {
        const mapped = {};
        res.data.forEach((item) => {
          mapped[item.setting_key] = item.setting_value;
        });
        setForm(mapped);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminService.updateSettings(form);
      const mapped = {};
      res.data.forEach((item) => {
        mapped[item.setting_key] = item.setting_value;
      });
      setForm(mapped);
      toast.success("Pengaturan berhasil disimpan");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pengaturan Aplikasi</h1>
          <p className="text-sm text-slate-500">Kelola kontak RS, disclaimer, dan link stimulasi</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-800">Informasi Umum</h2>
          <div className="space-y-4">
            {GENERAL_FIELDS.map((field) => (
              <FormField
                key={field.key}
                label={field.label}
                name={field.key}
                type={field.type === "textarea" ? undefined : field.type}
                rows={field.rows}
                value={form[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-800">Link Ide Stimulasi (Google Drive)</h2>
          <div className="space-y-4">
            {STIMULATION_LINKS.map((item) => (
              <FormField
                key={item.settingKey}
                label={item.label}
                name={item.settingKey}
                type="url"
                value={form[item.settingKey] || ""}
                onChange={(e) => handleChange(item.settingKey, e.target.value)}
                placeholder="https://drive.google.com/..."
              />
            ))}
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </form>
    </div>
  );
}
