-- Migration: 001_add_admin_users
-- Deskripsi: Tabel admin untuk login panel admin
-- Jalankan: mysql -u root -p deteksi_tumbuhkembang < backend/sql/migrations/001_add_admin_users.sql

USE deteksi_tumbuhkembang;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(150) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Default admin: username=admin, password=admin123 (wajib diganti setelah deploy)
INSERT INTO admin_users (username, password_hash, name) VALUES
(
  'admin',
  '$2b$10$fPyMYTr1EKr3gtcSGq845OVBdwtbcwEWOOvUDI2wJt4OLqvLyg0G2',
  'Administrator'
)
ON DUPLICATE KEY UPDATE username = username;
