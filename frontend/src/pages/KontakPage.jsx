import { useEffect, useState } from "react";
import { Phone, MapPin, Stethoscope, MessageCircle } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { APP_INFO } from "@/data/content";
import { settingsService } from "@/services/screeningService";

export default function KontakPage() {
  const [settings, setSettings] = useState({
    rs_phone: APP_INFO.rsPhone,
    rs_name: APP_INFO.rsName,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsService
      .getAll()
      .then((res) => setSettings((prev) => ({ ...prev, ...res.data })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const phone = settings.rs_phone || APP_INFO.rsPhone;
  const phoneClean = phone.replace(/[^0-9+]/g, "");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
          <Phone className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kontak Konsultasi</h1>
          <p className="text-sm text-slate-500">
            Pendaftaran layanan DSA dan terapi wicara
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800">{settings.rs_name}</h2>
        <p className="mt-1 text-sm text-slate-500">Rumah Sakit Umum Daerah</p>

        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 text-primary-600" />
            <div>
              <p className="font-medium text-slate-700">Alamat</p>
              <p className="text-sm text-slate-500">
                Jl. Ciputat Raya No. 7, Kebayoran Lama, Jakarta Selatan
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 text-primary-600" />
            <div>
              <p className="font-medium text-slate-700">Telepon RS</p>
              <a
                href={`tel:${phoneClean}`}
                className="text-lg font-semibold text-primary-600 hover:underline"
              >
                {phone}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-primary-50 p-4">
            <div className="flex items-center gap-2 text-primary-700">
              <Stethoscope className="h-5 w-5" />
              <h3 className="font-semibold">Layanan DSA</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Deteksi Dini Autisme — skrining dan evaluasi perkembangan anak oleh tenaga kesehatan terlatih.
            </p>
          </div>
          <div className="rounded-xl bg-teal-50 p-4">
            <div className="flex items-center gap-2 text-teal-700">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">Terapi Wicara</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Layanan terapi wicara untuk anak dengan keterlambatan perkembangan komunikasi dan bahasa.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={`tel:${phoneClean}`}
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            <Phone className="h-4 w-4" />
            Hubungi Sekarang
          </a>
          <a
            href={`https://wa.me/${phoneClean.replace(/^0/, "62")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-green-300 bg-green-50 px-6 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
