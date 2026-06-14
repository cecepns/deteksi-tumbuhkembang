import { Link } from "react-router-dom";
import {
  BarChart3,
  Lightbulb,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { useScreening } from "@/context/ScreeningContext";
import { AGE_GROUPS } from "@/data/checklist";

const statusConfig = {
  green: {
    icon: CheckCircle2,
    bg: "bg-green-50 border-green-200",
    text: "text-green-800",
    badge: "bg-green-100 text-green-700",
  },
  yellow: {
    icon: AlertTriangle,
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
    badge: "bg-amber-100 text-amber-700",
  },
  red: {
    icon: XCircle,
    bg: "bg-red-50 border-red-200",
    text: "text-red-800",
    badge: "bg-red-100 text-red-700",
  },
};

export default function EvaluasiPage() {
  const { session } = useScreening();
  const result = session.screeningResult;

  if (!result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <EmptyState
          title="Belum Ada Hasil Evaluasi"
          description="Lakukan deteksi dini terlebih dahulu untuk melihat skor dan rekomendasi."
          action={
            <Link
              to="/deteksi-dini"
              className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white"
            >
              Mulai Deteksi Dini
            </Link>
          }
        />
      </div>
    );
  }

  const score = result.score;
  const statusColor =
    score >= 85 ? "green" : score >= 60 ? "yellow" : "red";
  const config = statusConfig[statusColor];
  const StatusIcon = config.icon;
  const kelompokLabel = AGE_GROUPS[result.kelompok_usia]?.label || result.kelompok_usia;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Evaluasi Hasil Deteksi Dini</h1>
          {session.profile && (
            <p className="text-sm text-slate-500">
              {session.profile.nama_panggilan} — {kelompokLabel}
            </p>
          )}
        </div>
      </div>

      {/* Score Card */}
      <div className={`mb-6 rounded-2xl border p-6 ${config.bg}`}>
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
          <div className="relative mb-4 sm:mb-0 sm:mr-6">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-white shadow-md">
              <div>
                <p className="text-3xl font-bold text-slate-800">{score}%</p>
                <p className="text-xs text-slate-500">Skor</p>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${config.badge}`}>
              <StatusIcon className="h-4 w-4" />
              {result.status}
            </div>
            <p className={`text-sm ${config.text}`}>
              {result.checked_items} dari {result.total_items} kemampuan komunikasi tercapai sesuai usia.
            </p>
          </div>
        </div>
      </div>

      {/* Detail Checklist */}
      {result.checklist_answers && (
        <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-800">Rincian Ceklis</h3>
          <div className="space-y-2">
            {(typeof result.checklist_answers === "string"
              ? JSON.parse(result.checklist_answers)
              : result.checklist_answers
            ).map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-lg px-3 py-2 text-sm ${
                  item.checked ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                }`}
              >
                {item.checked ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <span>{item.item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-primary-700">
            <Lightbulb className="h-5 w-5" />
            <h3 className="font-semibold">Rekomendasi Stimulasi</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            {result.rekomendasi_stimulasi}
          </p>
          <Link
            to="/stimulasi"
            className="mt-3 inline-block text-sm font-medium text-primary-600 hover:underline"
          >
            Lihat Ide Stimulasi →
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-primary-700">
            <Stethoscope className="h-5 w-5" />
            <h3 className="font-semibold">Rekomendasi Konsultasi</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            {result.rekomendasi_konsultasi}
          </p>
          <Link
            to="/kontak"
            className="mt-3 inline-block text-sm font-medium text-primary-600 hover:underline"
          >
            Hubungi RS →
          </Link>
        </div>
      </div>
    </div>
  );
}
