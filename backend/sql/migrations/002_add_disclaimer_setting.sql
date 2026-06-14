-- Migration: 002_add_disclaimer_setting
-- Deskripsi: Tambah setting disclaimer agar bisa diedit dari panel admin
-- Jalankan: mysql -u root -p deteksi_tumbuhkembang < backend/sql/migrations/002_add_disclaimer_setting.sql

USE deteksi_tumbuhkembang;

INSERT INTO app_settings (setting_key, setting_value) VALUES
(
  'disclaimer',
  'Alat Deteksi Dini Perkembangan Kemampuan Komunikasi Anak Batita ini merupakan media digital yang digunakan untuk membantu orang tua dan tenaga kesehatan memantau perkembangan kemampuan komunikasi anak usia batita secara cepat, mudah, dan sesuai tahapan usia anak. Sistem ini dilengkapi ceklis perkembangan, hasil deteksi otomatis, serta rekomendasi stimulasi dan tindak lanjut konsultasi.

Alat ini membantu orang tua mengenali sejak dini adanya keterlambatan atau gangguan perkembangan komunikasi pada anak sehingga penanganan dapat dilakukan lebih cepat dan tepat.

Alat ini bertujuan untuk meningkatkan pemahaman orang tua tentang deteksi dini perkembangan kemampuan komunikasi anak batita melalui pemantauan yang praktis, terukur, dan berbasis digital.

Seluruh data anak dan hasil pemeriksaan yang diinput ke dalam sistem bersifat rahasia dan hanya digunakan untuk keperluan deteksi dini, pemantauan perkembangan, serta konsultasi kesehatan anak di RSUD Kebayoran Lama. Data pengguna disimpan dengan aman dan tidak disebarluaskan tanpa persetujuan pengguna.'
)
ON DUPLICATE KEY UPDATE setting_key = setting_key;
