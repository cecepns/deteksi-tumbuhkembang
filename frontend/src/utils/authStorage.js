const TOKEN_KEY = "admin_token";
const ADMIN_KEY = "admin_user";

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(TOKEN_KEY),
  getAdmin: () => {
    try {
      const raw = localStorage.getItem(ADMIN_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setAdmin: (admin) => localStorage.setItem(ADMIN_KEY, JSON.stringify(admin)),
  removeAdmin: () => localStorage.removeItem(ADMIN_KEY),
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  },
};
