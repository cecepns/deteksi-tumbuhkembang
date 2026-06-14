import { BookOpen, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PETUNJUK_STEPS } from "@/data/content";

export default function PetunjukPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Petunjuk Penggunaan Alat Deteksi Dini</h1>
          <p className="text-sm text-slate-500">Ikuti langkah-langkah berikut untuk melakukan skrining</p>
        </div>
      </div>

      <div className="space-y-4">
        {PETUNJUK_STEPS.map((item) => (
          <div
            key={item.step}
            className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
              {item.step}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-amber-100 bg-amber-50 p-5">
        <h3 className="flex items-center gap-2 font-semibold text-amber-800">
          <CheckCircle2 className="h-5 w-5" />
          Catatan Penting
        </h3>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-amber-900/80">
          <li>Isi profil anak terlebih dahulu sebelum melakukan deteksi dini.</li>
          <li>Centang hanya kemampuan yang sudah konsisten dimiliki anak.</li>
          <li>Hasil skrining bersifat skrining awal, bukan diagnosis medis.</li>
          <li>Konsultasikan hasil ke tenaga kesehatan jika ada kekhawatiran.</li>
        </ul>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/profil-anak"
          className="inline-flex rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          Mulai Isi Profil Anak
        </Link>
      </div>
    </div>
  );
}
