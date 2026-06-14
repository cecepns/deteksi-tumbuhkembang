import { api } from "./api";

export const get = async (endpoint, params = {}) => {
  const { data } = await api.get(endpoint, { params });
  return data;
};

export const post = async (endpoint, body = {}) => {
  const { data } = await api.post(endpoint, body);
  return data;
};

export const put = async (endpoint, body = {}) => {
  const { data } = await api.put(endpoint, body);
  return data;
};

export const del = async (endpoint) => {
  const { data } = await api.delete(endpoint);
  return data;
};
