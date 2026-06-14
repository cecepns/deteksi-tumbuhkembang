const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

const ALLOWED_SETTING_KEYS = [
  "rs_phone",
  "rs_name",
  "tagline",
  "disclaimer",
  "stimulasi_0_6",
  "stimulasi_7_12",
  "stimulasi_13_18",
  "stimulasi_19_24",
  "stimulasi_25_30",
  "stimulasi_31_36",
];

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "deteksi_tumbuhkembang",
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "2mb" }));

const sanitize = (str) => {
  if (typeof str !== "string") return str;
  return str.trim().replace(/[<>]/g, "");
};

const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = [10, 25, 50, 100].includes(parseInt(query.limit, 10))
    ? parseInt(query.limit, 10)
    : 10;
  const offset = (page - 1) * limit;
  const search = sanitize(query.search || "");
  const sort = ["created_at", "nama_lengkap", "usia_bulan", "score"].includes(
    query.sort
  )
    ? query.sort
    : "created_at";
  const order = query.order === "asc" ? "ASC" : "DESC";
  return { page, limit, offset, search, sort, order };
};

const paginateResponse = (data, total, page, limit) => ({
  success: true,
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  },
});

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Akses ditolak, silakan login" });
  }
  try {
    req.admin = jwt.verify(header.slice(7), JWT_SECRET);
    next();
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Sesi tidak valid, silakan login ulang" });
  }
};

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "API berjalan" });
});

// --- Child Profiles ---
app.get("/api/child-profiles", authMiddleware, async (req, res) => {
  try {
    const { page, limit, offset, search, sort, order } = parsePagination(
      req.query
    );
    let where = "";
    const params = [];
    if (search) {
      where =
        "WHERE nama_lengkap LIKE ? OR nama_panggilan LIKE ? OR nama_orang_tua LIKE ?";
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM child_profiles ${where}`,
      params
    );
    const [rows] = await pool.query(
      `SELECT * FROM child_profiles ${where} ORDER BY ${sort} ${order} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    res.json(paginateResponse(rows, countRows[0].total, page, limit));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil data profil" });
  }
});

app.get("/api/child-profiles/:id", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM child_profiles WHERE id = ?",
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Profil tidak ditemukan" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil profil" });
  }
});

app.post("/api/child-profiles", async (req, res) => {
  try {
    const {
      nama_lengkap,
      nama_panggilan,
      tanggal_lahir,
      tempat_lahir,
      nama_orang_tua,
      nomor_telepon,
      keluhan_ortu,
      usia_bulan,
      kelompok_usia,
    } = req.body;

    if (
      !nama_lengkap ||
      !nama_panggilan ||
      !tanggal_lahir ||
      !tempat_lahir ||
      !nama_orang_tua ||
      !nomor_telepon
    ) {
      return res.status(400).json({ success: false, message: "Data wajib belum lengkap" });
    }

    const [result] = await pool.query(
      `INSERT INTO child_profiles
        (nama_lengkap, nama_panggilan, tanggal_lahir, tempat_lahir, nama_orang_tua, nomor_telepon, keluhan_ortu, usia_bulan, kelompok_usia)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sanitize(nama_lengkap),
        sanitize(nama_panggilan),
        tanggal_lahir,
        sanitize(tempat_lahir),
        sanitize(nama_orang_tua),
        sanitize(nomor_telepon),
        sanitize(keluhan_ortu || ""),
        usia_bulan || 0,
        kelompok_usia || "",
      ]
    );

    const [rows] = await pool.query(
      "SELECT * FROM child_profiles WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal menyimpan profil" });
  }
});

app.put("/api/child-profiles/:id", async (req, res) => {
  try {
    const fields = [
      "nama_lengkap",
      "nama_panggilan",
      "tanggal_lahir",
      "tempat_lahir",
      "nama_orang_tua",
      "nomor_telepon",
      "keluhan_ortu",
      "usia_bulan",
      "kelompok_usia",
    ];
    const updates = [];
    const values = [];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        updates.push(`${f} = ?`);
        values.push(
          typeof req.body[f] === "string" ? sanitize(req.body[f]) : req.body[f]
        );
      }
    }
    if (!updates.length) {
      return res.status(400).json({ success: false, message: "Tidak ada data untuk diupdate" });
    }
    values.push(req.params.id);
    await pool.query(
      `UPDATE child_profiles SET ${updates.join(", ")} WHERE id = ?`,
      values
    );
    const [rows] = await pool.query(
      "SELECT * FROM child_profiles WHERE id = ?",
      [req.params.id]
    );
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengupdate profil" });
  }
});

app.delete("/api/child-profiles/:id", authMiddleware, async (req, res) => {
  try {
    const [existing] = await pool.query(
      "SELECT id FROM child_profiles WHERE id = ?",
      [req.params.id]
    );
    if (!existing.length) {
      return res.status(404).json({ success: false, message: "Profil tidak ditemukan" });
    }

    await pool.query("DELETE FROM child_profiles WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Profil anak berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal menghapus profil" });
  }
});

// --- Health Histories ---
app.get("/api/health-histories", authMiddleware, async (req, res) => {
  try {
    const { page, limit, offset, search, sort, order } = parsePagination(
      req.query
    );
    let where = "";
    const params = [];
    if (req.query.child_profile_id) {
      where = "WHERE h.child_profile_id = ?";
      params.push(req.query.child_profile_id);
    }
    if (search) {
      where += where ? " AND " : "WHERE ";
      where += "(c.nama_lengkap LIKE ? OR c.nama_panggilan LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term);
    }
    const sortCol = sort === "nama_lengkap" ? "c.nama_lengkap" : `h.${sort}`;
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM health_histories h
       LEFT JOIN child_profiles c ON c.id = h.child_profile_id ${where}`,
      params
    );
    const [rows] = await pool.query(
      `SELECT h.*, c.nama_lengkap, c.nama_panggilan FROM health_histories h
       LEFT JOIN child_profiles c ON c.id = h.child_profile_id
       ${where} ORDER BY ${sortCol} ${order} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    res.json(paginateResponse(rows, countRows[0].total, page, limit));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil riwayat kesehatan" });
  }
});

app.post("/api/health-histories", async (req, res) => {
  try {
    const {
      child_profile_id,
      riwayat_ibu_hamil,
      riwayat_anak_kandungan,
      riwayat_saat_lahir,
      riwayat_setelah_lahir,
      riwayat_motorik,
    } = req.body;

    if (!child_profile_id) {
      return res.status(400).json({ success: false, message: "Profil anak wajib diisi terlebih dahulu" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM health_histories WHERE child_profile_id = ?",
      [child_profile_id]
    );

    let resultId;
    if (existing.length) {
      await pool.query(
        `UPDATE health_histories SET
          riwayat_ibu_hamil = ?, riwayat_anak_kandungan = ?, riwayat_saat_lahir = ?,
          riwayat_setelah_lahir = ?, riwayat_motorik = ?
         WHERE child_profile_id = ?`,
        [
          sanitize(riwayat_ibu_hamil || ""),
          sanitize(riwayat_anak_kandungan || ""),
          sanitize(riwayat_saat_lahir || ""),
          sanitize(riwayat_setelah_lahir || ""),
          sanitize(riwayat_motorik || ""),
          child_profile_id,
        ]
      );
      resultId = existing[0].id;
    } else {
      const [result] = await pool.query(
        `INSERT INTO health_histories
          (child_profile_id, riwayat_ibu_hamil, riwayat_anak_kandungan, riwayat_saat_lahir, riwayat_setelah_lahir, riwayat_motorik)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          child_profile_id,
          sanitize(riwayat_ibu_hamil || ""),
          sanitize(riwayat_anak_kandungan || ""),
          sanitize(riwayat_saat_lahir || ""),
          sanitize(riwayat_setelah_lahir || ""),
          sanitize(riwayat_motorik || ""),
        ]
      );
      resultId = result.insertId;
    }

    const [rows] = await pool.query(
      "SELECT * FROM health_histories WHERE id = ?",
      [resultId]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal menyimpan riwayat kesehatan" });
  }
});

// --- Screening Results ---
app.get("/api/screening-results", authMiddleware, async (req, res) => {
  try {
    const { page, limit, offset, search, sort, order } = parsePagination(
      req.query
    );
    let where = "";
    const params = [];
    if (req.query.child_profile_id) {
      where = "WHERE s.child_profile_id = ?";
      params.push(req.query.child_profile_id);
    }
    if (search) {
      where += where ? " AND " : "WHERE ";
      where += "(c.nama_lengkap LIKE ? OR c.nama_panggilan LIKE ?)";
      const term = `%${search}%`;
      params.push(term, term);
    }
    const sortCol =
      sort === "nama_lengkap" ? "c.nama_lengkap" : sort === "score" ? "s.score" : `s.${sort}`;
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM screening_results s
       LEFT JOIN child_profiles c ON c.id = s.child_profile_id ${where}`,
      params
    );
    const [rows] = await pool.query(
      `SELECT s.*, c.nama_lengkap, c.nama_panggilan, c.usia_bulan
       FROM screening_results s
       LEFT JOIN child_profiles c ON c.id = s.child_profile_id
       ${where} ORDER BY ${sortCol} ${order} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    res.json(paginateResponse(rows, countRows[0].total, page, limit));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil hasil skrining" });
  }
});

app.post("/api/screening-results", async (req, res) => {
  try {
    const {
      child_profile_id,
      kelompok_usia,
      checklist_answers,
      total_items,
      checked_items,
      score,
      status,
      rekomendasi_stimulasi,
      rekomendasi_konsultasi,
    } = req.body;

    if (!child_profile_id || !kelompok_usia || !checklist_answers) {
      return res.status(400).json({ success: false, message: "Data skrining belum lengkap" });
    }

    const [result] = await pool.query(
      `INSERT INTO screening_results
        (child_profile_id, kelompok_usia, checklist_answers, total_items, checked_items, score, status, rekomendasi_stimulasi, rekomendasi_konsultasi)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        child_profile_id,
        kelompok_usia,
        JSON.stringify(checklist_answers),
        total_items,
        checked_items,
        score,
        status,
        rekomendasi_stimulasi,
        rekomendasi_konsultasi,
      ]
    );

    const [rows] = await pool.query(
      "SELECT * FROM screening_results WHERE id = ?",
      [result.insertId]
    );
    res.status(201).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal menyimpan hasil skrining" });
  }
});

// --- App Settings ---
app.get("/api/settings", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT setting_key, setting_value FROM app_settings");
    const settings = {};
    rows.forEach((r) => {
      settings[r.setting_key] = r.setting_value;
    });
    res.json({ success: true, data: settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil pengaturan" });
  }
});

// --- Auth ---
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Username dan password wajib diisi" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM admin_users WHERE username = ? AND is_active = 1 LIMIT 1",
      [sanitize(username)]
    );

    if (!rows.length || !bcrypt.compareSync(password, rows[0].password_hash)) {
      return res
        .status(401)
        .json({ success: false, message: "Username atau password salah" });
    }

    const admin = rows[0];
    const token = jwt.sign(
      { id: admin.id, username: admin.username, name: admin.name },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        token,
        admin: { id: admin.id, username: admin.username, name: admin.name },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal login" });
  }
});

app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, username, name FROM admin_users WHERE id = ? AND is_active = 1",
      [req.admin.id]
    );
    if (!rows.length) {
      return res.status(401).json({ success: false, message: "Admin tidak ditemukan" });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil profil admin" });
  }
});

// --- Admin Settings ---
app.get("/api/admin/settings", authMiddleware, async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT setting_key, setting_value, updated_at FROM app_settings ORDER BY setting_key"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil pengaturan" });
  }
});

app.put("/api/admin/settings", authMiddleware, async (req, res) => {
  try {
    const settings = req.body?.settings;
    if (!settings || typeof settings !== "object") {
      return res
        .status(400)
        .json({ success: false, message: "Data pengaturan tidak valid" });
    }

    const entries = Object.entries(settings).filter(([key]) =>
      ALLOWED_SETTING_KEYS.includes(key)
    );

    if (!entries.length) {
      return res
        .status(400)
        .json({ success: false, message: "Tidak ada pengaturan valid untuk disimpan" });
    }

    for (const [key, value] of entries) {
      await pool.query(
        `INSERT INTO app_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, sanitize(String(value ?? ""))]
      );
    }

    const [rows] = await pool.query(
      "SELECT setting_key, setting_value, updated_at FROM app_settings ORDER BY setting_key"
    );
    res.json({ success: true, data: rows, message: "Pengaturan berhasil disimpan" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal menyimpan pengaturan" });
  }
});

// --- Admin Stats ---
app.get("/api/admin/stats", authMiddleware, async (_req, res) => {
  try {
    const [[profiles]] = await pool.query(
      "SELECT COUNT(*) as total FROM child_profiles"
    );
    const [[histories]] = await pool.query(
      "SELECT COUNT(*) as total FROM health_histories"
    );
    const [[screenings]] = await pool.query(
      "SELECT COUNT(*) as total FROM screening_results"
    );
    const [recentScreenings] = await pool.query(
      `SELECT s.score, s.status, s.created_at, c.nama_panggilan
       FROM screening_results s
       LEFT JOIN child_profiles c ON c.id = s.child_profile_id
       ORDER BY s.created_at DESC LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        totalProfiles: profiles.total,
        totalHistories: histories.total,
        totalScreenings: screenings.total,
        recentScreenings,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal mengambil statistik" });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
