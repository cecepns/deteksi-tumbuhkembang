-- Database: Alat Deteksi Dini Kemampuan Komunikasi Batita
-- RSUD Kebayoran Lama

CREATE DATABASE IF NOT EXISTS deteksi_tumbuhkembang
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE deteksi_tumbuhkembang;

-- Profil Anak
CREATE TABLE IF NOT EXISTS child_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama_lengkap VARCHAR(150) NOT NULL,
  nama_panggilan VARCHAR(100) NOT NULL,
  tanggal_lahir DATE NOT NULL,
  tempat_lahir VARCHAR(150) NOT NULL,
  nama_orang_tua VARCHAR(150) NOT NULL,
  nomor_telepon VARCHAR(20) NOT NULL,
  keluhan_ortu TEXT,
  usia_bulan INT NOT NULL,
  kelompok_usia VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_nama (nama_lengkap),
  INDEX idx_kelompok_usia (kelompok_usia),
  INDEX idx_created (created_at)
);

-- Riwayat Kesehatan dan Perkembangan
CREATE TABLE IF NOT EXISTS health_histories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_profile_id INT NOT NULL,
  riwayat_ibu_hamil TEXT,
  riwayat_anak_kandungan TEXT,
  riwayat_saat_lahir TEXT,
  riwayat_setelah_lahir TEXT,
  riwayat_motorik TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
  INDEX idx_child (child_profile_id)
);

-- Hasil Deteksi Dini
CREATE TABLE IF NOT EXISTS screening_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_profile_id INT NOT NULL,
  kelompok_usia VARCHAR(20) NOT NULL,
  tanggal_screening DATE NOT NULL,
  checklist_answers JSON NOT NULL,
  total_items INT NOT NULL,
  checked_items INT NOT NULL,
  score DECIMAL(5,2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  rekomendasi_stimulasi TEXT,
  rekomendasi_konsultasi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id) ON DELETE CASCADE,
  INDEX idx_child (child_profile_id),
  INDEX idx_status (status),
  INDEX idx_created (created_at)
);

-- Pengaturan konten (link stimulasi, kontak, dll)
CREATE TABLE IF NOT EXISTS app_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO app_settings (setting_key, setting_value) VALUES
('rs_phone', '021-739-1111'),
('rs_name', 'RSUD Kebayoran Lama'),
('tagline', 'Deteksi Cepat, Batita Hebat.'),
('stimulasi_0_6', 'https://drive.google.com'),
('stimulasi_7_12', 'https://drive.google.com'),
('stimulasi_13_18', 'https://drive.google.com'),
('stimulasi_19_24', 'https://drive.google.com'),
('stimulasi_25_30', 'https://drive.google.com'),
('stimulasi_31_36', 'https://drive.google.com')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

-- Sample data
INSERT INTO child_profiles (
  nama_lengkap, nama_panggilan, tanggal_lahir, tempat_lahir,
  nama_orang_tua, nomor_telepon, keluhan_ortu, usia_bulan, kelompok_usia
) VALUES (
  'Ahmad Fadli', 'Fadli', '2024-06-15', 'Jakarta Selatan',
  'Budi Santoso', '081234567890', 'Anak belum banyak bersuara', 12, '7-12'
);
