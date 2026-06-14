const DEFAULT_API_BASE_URL =
  "https://api.kingcreativestudio.my.id/deteksi-tumbuhkembang/api";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL;
