export const APP_INFO = {
  rsName: "RSUD Kebayoran Lama",
  tagline: "Deteksi Cepat, Batita Hebat.",
  rsPhone: "021-739-1111",
  disclaimer: `Alat Deteksi Dini Perkembangan Kemampuan Komunikasi Anak Batita ini merupakan media digital yang digunakan untuk membantu orang tua dan tenaga kesehatan memantau perkembangan kemampuan komunikasi anak usia batita secara cepat, mudah, dan sesuai tahapan usia anak. Sistem ini dilengkapi ceklis perkembangan, hasil deteksi otomatis, serta rekomendasi stimulasi dan tindak lanjut konsultasi.

Alat ini membantu orang tua mengenali sejak dini adanya keterlambatan atau gangguan perkembangan komunikasi pada anak sehingga penanganan dapat dilakukan lebih cepat dan tepat.

Alat ini bertujuan untuk meningkatkan pemahaman orang tua tentang deteksi dini perkembangan kemampuan komunikasi anak batita melalui pemantauan yang praktis, terukur, dan berbasis digital.

Seluruh data anak dan hasil pemeriksaan yang diinput ke dalam sistem bersifat rahasia dan hanya digunakan untuk keperluan deteksi dini, pemantauan perkembangan, serta konsultasi kesehatan anak di RSUD Kebayoran Lama. Data pengguna disimpan dengan aman dan tidak disebarluaskan tanpa persetujuan pengguna.`,
};

export const NAV_ITEMS = [
  { path: "/petunjuk", label: "Petunjuk Penggunaan" },
  { path: "/profil-anak", label: "Profil Anak" },
  { path: "/riwayat-kesehatan", label: "Riwayat Kesehatan" },
  { path: "/deteksi-dini", label: "Deteksi Dini" },
  { path: "/evaluasi", label: "Evaluasi Hasil" },
  { path: "/stimulasi", label: "Ide Stimulasi" },
  { path: "/kontak", label: "Kontak Konsultasi" },
];

export const PETUNJUK_STEPS = [
  {
    step: 1,
    title: "Isi Profil Anak",
    desc: "Lengkapi data anak termasuk nama, tanggal lahir, dan data orang tua. Usia anak akan otomatis dihitung untuk menentukan kelompok usia.",
  },
  {
    step: 2,
    title: "Lengkapi Riwayat Kesehatan",
    desc: "Isi riwayat kesehatan ibu saat hamil, riwayat anak saat dalam kandungan, saat lahir, setelah lahir, dan perkembangan motorik.",
  },
  {
    step: 3,
    title: "Lakukan Deteksi Dini",
    desc: "Centang kemampuan komunikasi yang sudah dimiliki anak sesuai usia. Ceklis akan muncul otomatis berdasarkan usia anak.",
  },
  {
    step: 4,
    title: "Lihat Evaluasi Hasil",
    desc: "Setelah submit, sistem akan menampilkan skor, status perkembangan, rekomendasi stimulasi, dan rekomendasi konsultasi.",
  },
  {
    step: 5,
    title: "Stimulasi & Konsultasi",
    desc: "Akses ide stimulasi sesuai usia anak dan hubungi RSUD Kebayoran Lama untuk layanan konsultasi DSA dan terapi wicara.",
  },
];
