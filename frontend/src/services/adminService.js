import { get, post, put } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";

export const adminService = {
  login: (data) => post(API_ENDPOINTS.AUTH.LOGIN, data),
  me: () => get(API_ENDPOINTS.AUTH.ME),
  getStats: () => get(API_ENDPOINTS.ADMIN.STATS),
  getSettings: () => get(API_ENDPOINTS.ADMIN.SETTINGS),
  updateSettings: (settings) =>
    put(API_ENDPOINTS.ADMIN.SETTINGS, { settings }),
};
