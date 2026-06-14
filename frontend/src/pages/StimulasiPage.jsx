import { useEffect, useState } from "react";
import { ExternalLink, Lightbulb } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { STIMULATION_LINKS } from "@/data/checklist";
import { settingsService } from "@/services/screeningService";
import { useScreening } from "@/context/ScreeningContext";

const defaultLinks = {
  stimulasi_0_6: "https://drive.google.com",
  stimulasi_7_12: "https://drive.google.com",
  stimulasi_13_18: "https://drive.google.com",
  stimulasi_19_24: "https://drive.google.com",
  stimulasi_25_30: "https://drive.google.com",
  stimulasi_31_36: "https://drive.google.com",
};

export default function StimulasiPage() {
  const { session } = useScreening();
  const [links, setLinks] = useState(defaultLinks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsService
      .getAll()
      .then((res) => setLinks((prev) => ({ ...prev, ...res.data })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const highlightKey = session.profile?.kelompok_usia
    ? `stimulasi_${session.profile.kelompok_usia.replace("-", "_")}`
    : null;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
          <Lightbulb className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ide Stimulasi Kemampuan Komunikasi</h1>
          <p className="text-sm text-slate-500">
            Panduan stimulasi berdasarkan kelompok usia anak
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {STIMULATION_LINKS.map((item) => {
          const isHighlight = highlightKey === item.settingKey;
          return (
            <a
              key={item.key}
              href={links[item.settingKey] || defaultLinks[item.settingKey]}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between gap-4 rounded-2xl border p-5 transition hover:shadow-md ${
                isHighlight
                  ? "border-primary-300 bg-primary-50"
                  : "border-slate-100 bg-white hover:border-primary-200"
              }`}
            >
              <div>
                <p className="font-semibold text-slate-800">{item.label}</p>
                {isHighlight && (
                  <p className="mt-1 text-xs font-medium text-primary-600">
                    Direkomendasikan untuk usia anak Anda
                  </p>
                )}
              </div>
              <ExternalLink className="h-5 w-5 shrink-0 text-primary-600" />
            </a>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Link materi stimulasi dapat diperbarui oleh admin RS melalui pengaturan sistem.
      </p>
    </div>
  );
}
