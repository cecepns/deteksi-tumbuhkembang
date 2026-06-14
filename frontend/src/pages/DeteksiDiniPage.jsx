import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ClipboardCheck, Send } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import { useScreening } from "@/context/ScreeningContext";
import { screeningService } from "@/services/screeningService";
import {
  CHECKLIST_ITEMS,
  AGE_GROUPS,
  evaluateScreening,
} from "@/data/checklist";

export default function DeteksiDiniPage() {
  const { session, setScreening, setScreeningResult } = useScreening();
  const navigate = useNavigate();
  const kelompokUsia = session.profile?.kelompok_usia;
  const items = kelompokUsia ? CHECKLIST_ITEMS[kelompokUsia] || [] : [];

  const [answers, setAnswers] = useState(() => {
    if (session.screening?.answers) return session.screening.answers;
    return items.map(() => false);
  });
  const [loading, setLoading] = useState(false);

  if (!session.profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <EmptyState
          title="Profil Anak Belum Diisi"
          description="Lengkapi profil anak terlebih dahulu agar ceklis sesuai usia dapat ditampilkan."
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

  if (!kelompokUsia || !items.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <EmptyState
          title="Usia Anak Tidak Sesuai"
          description="Alat deteksi ini untuk anak usia 0-36 bulan. Periksa tanggal lahir pada profil anak."
          action={
            <Link
              to="/profil-anak"
              className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white"
            >
              Perbarui Profil
            </Link>
          }
        />
      </div>
    );
  }

  const toggleAnswer = (index) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const checkedCount = answers.filter(Boolean).length;
    const totalCount = items.length;
    const evaluation = evaluateScreening(checkedCount, totalCount);

    const screeningData = {
      child_profile_id: session.profile.id,
      kelompok_usia: kelompokUsia,
      checklist_answers: items.map((item, i) => ({
        item,
        checked: answers[i],
      })),
      total_items: totalCount,
      checked_items: checkedCount,
      score: evaluation.score,
      status: evaluation.status,
      rekomendasi_stimulasi: evaluation.rekomendasi_stimulasi,
      rekomendasi_konsultasi: evaluation.rekomendasi_konsultasi,
    };

    setLoading(true);
    try {
      const res = await screeningService.create(screeningData);
      setScreening({ answers, kelompokUsia });
      setScreeningResult(res.data);
      toast.success("Hasil deteksi berhasil disimpan");
    } catch {
      const localResult = { ...screeningData, id: `local-${Date.now()}` };
      setScreening({ answers, kelompokUsia });
      setScreeningResult(localResult);
      toast.success("Hasil disimpan secara lokal (server tidak tersedia)");
    } finally {
      setLoading(false);
      navigate("/evaluasi");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
          <ClipboardCheck className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Deteksi Dini</h1>
          <p className="text-sm text-slate-500">
            {session.profile.nama_panggilan} — {AGE_GROUPS[kelompokUsia].label} ({items.length} item)
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
        Centang (<strong>✓</strong>) kemampuan komunikasi yang <strong>sudah konsisten</strong> dimiliki anak Anda.
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {items.map((item, index) => (
          <label
            key={index}
            className={`flex cursor-pointer gap-4 rounded-2xl border p-4 transition ${
              answers[index]
                ? "border-primary-300 bg-primary-50"
                : "border-slate-100 bg-white hover:border-slate-200"
            }`}
          >
            <input
              type="checkbox"
              checked={answers[index]}
              onChange={() => toggleAnswer(index)}
              className="mt-1 h-5 w-5 shrink-0 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <div>
              <span className="text-xs font-medium text-primary-600">Item {index + 1}</span>
              <p className="text-sm leading-relaxed text-slate-700">{item}</p>
            </div>
          </label>
        ))}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-60 sm:w-auto"
          >
            <Send className="h-4 w-4" />
            {loading ? "Memproses..." : "Submit & Lihat Evaluasi"}
          </button>
        </div>
      </form>
    </div>
  );
}
