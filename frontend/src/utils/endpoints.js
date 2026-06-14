export const API_ENDPOINTS = {
  HEALTH: "/health",
  AUTH: {
    LOGIN: "/auth/login",
    ME: "/auth/me",
  },
  ADMIN: {
    STATS: "/admin/stats",
    SETTINGS: "/admin/settings",
  },
  CHILD_PROFILES: {
    LIST: "/child-profiles",
    DETAIL: (id) => `/child-profiles/${id}`,
    CREATE: "/child-profiles",
    UPDATE: (id) => `/child-profiles/${id}`,
    DELETE: (id) => `/child-profiles/${id}`,
  },
  HEALTH_HISTORIES: {
    LIST: "/health-histories",
    CREATE: "/health-histories",
  },
  SCREENING: {
    LIST: "/screening-results",
    CREATE: "/screening-results",
  },
  SETTINGS: "/settings",
};
