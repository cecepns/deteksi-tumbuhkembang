import { get, post, put, del } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";

export const childProfileService = {
  create: (data) => post(API_ENDPOINTS.CHILD_PROFILES.CREATE, data),
  update: (id, data) => put(API_ENDPOINTS.CHILD_PROFILES.UPDATE(id), data),
  delete: (id) => del(API_ENDPOINTS.CHILD_PROFILES.DELETE(id)),
  getById: (id) => get(API_ENDPOINTS.CHILD_PROFILES.DETAIL(id)),
  list: (params) => get(API_ENDPOINTS.CHILD_PROFILES.LIST, params),
};

export const healthHistoryService = {
  create: (data) => post(API_ENDPOINTS.HEALTH_HISTORIES.CREATE, data),
  list: (params) => get(API_ENDPOINTS.HEALTH_HISTORIES.LIST, params),
};

export const screeningService = {
  create: (data) => post(API_ENDPOINTS.SCREENING.CREATE, data),
  list: (params) => get(API_ENDPOINTS.SCREENING.LIST, params),
};

export const settingsService = {
  getAll: () => get(API_ENDPOINTS.SETTINGS),
};
