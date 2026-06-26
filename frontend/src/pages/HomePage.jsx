import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAppSettings } from "@/hooks/useAppSettings";
import RsudLogo from "@/components/ui/RsudLogo";
import heroImage from "@/assets/hero.png";

export default function HomePage() {
  const settings = useAppSettings();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-teal-800 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white" />
          <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white" />
        </div>
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-20">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm backdrop-blur">
              <RsudLogo className="h-8 w-auto rounded bg-white p-0.5" />
              {settings.rs_name}
            </div>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Alat Deteksi Dini Perkembangan Kemampuan Komunikasi Batita
            </h1>
            <p className="mt-2 text-lg font-medium text-primary-100">
              {settings.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/profil-anak"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-lg transition hover:bg-primary-50"
              >
                Mulai Skrining
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/petunjuk"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Petunjuk Penggunaan
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl bg-white/10 p-3 shadow-xl backdrop-blur-sm sm:p-4">
              <img
                src={heroImage}
                alt="Ilustrasi ibu dan anak batita bermain bersama di ruang tamu"
                className="h-auto w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-primary-100 bg-primary-50/50 p-6 sm:p-8">
          <h2 className="mb-4 text-xl font-bold text-primary-800">
            Tentang Alat Deteksi Ini
          </h2>
          <div className="space-y-4 text-sm leading-relaxed text-slate-600 whitespace-pre-line">
            {settings.disclaimer}
          </div>
        </div>
      </section>

      {/* Quick Steps */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-800">
            Cara Menggunakan
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { step: 1, title: "Profil Anak", path: "/profil-anak" },
              { step: 2, title: "Riwayat Kesehatan", path: "/riwayat-kesehatan" },
              { step: 3, title: "Deteksi Dini", path: "/deteksi-dini" },
              { step: 4, title: "Evaluasi Hasil", path: "/evaluasi" },
              { step: 5, title: "Stimulasi & Kontak", path: "/stimulasi" },
            ].map((item) => (
              <Link
                key={item.step}
                to={item.path}
                className="group rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-primary-200 hover:bg-primary-50/50 hover:shadow-md"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white">
                  {item.step}
                </div>
                <h3 className="font-semibold text-slate-800 group-hover:text-primary-700">
                  {item.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
