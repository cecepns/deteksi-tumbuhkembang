const TIDAK_ADA = "Tidak ada";

export function parseHealthHistoryValue(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // Data lama format teks bebas — tampilkan kosong agar ortu isi ulang via checkbox
  }

  return [];
}

export function serializeHealthHistoryValue(selected) {
  return JSON.stringify(selected);
}

export function formatHealthHistoryDisplay(value) {
  const items = parseHealthHistoryValue(value);
  if (!items.length) {
    return typeof value === "string" && value.trim() ? value : "-";
  }
  return items.join(", ");
}

export function toggleHealthHistoryOption(current, option, hasTidakAda = true) {
  const selected = [...current];
  const index = selected.indexOf(option);

  if (index >= 0) {
    selected.splice(index, 1);
    return selected;
  }

  if (hasTidakAda && option === TIDAK_ADA) {
    return [TIDAK_ADA];
  }

  if (hasTidakAda) {
    return [...selected.filter((item) => item !== TIDAK_ADA), option];
  }

  return [...selected, option];
}

export function getInitialHealthHistoryForm(saved = {}) {
  const form = {};
  const keys = [
    "riwayat_ibu_hamil",
    "riwayat_anak_kandungan",
    "riwayat_saat_lahir",
    "riwayat_setelah_lahir",
    "riwayat_motorik",
  ];

  keys.forEach((key) => {
    form[key] = parseHealthHistoryValue(saved[key]);
  });

  return form;
}

export function serializeHealthHistoryForm(form) {
  const payload = {};
  Object.entries(form).forEach(([key, value]) => {
    payload[key] = serializeHealthHistoryValue(value);
  });
  return payload;
}
