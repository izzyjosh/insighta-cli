const axios = require("axios");
const { loadCredentials, saveCredentials, clearCredentials } = require("./credentials");

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

const authApi = axios.create({
  baseURL: "http://localhost:3000/api",
});

function isAuthFailure(error) {
  const status = error.response?.status;
  if (status !== 401 && status !== 403) {
    return false;
  }

  const requestUrl = error.config?.url || "";
  if (/^\/auth\//.test(requestUrl) || requestUrl.includes("/auth/refresh")) {
    return false;
  }

  const message =
    error.response?.data?.message || error.response?.data?.error || "";

  return /token|forbidden/i.test(message) || status === 401;
}

api.interceptors.request.use(async (config) => {
  const credentials = await loadCredentials();
  if (credentials?.token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${credentials.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry || !isAuthFailure(error)) {
      throw error;
    }

    const credentials = await loadCredentials();
    if (!credentials?.refreshToken) {
      await clearCredentials();
      throw new Error("Session expired. Please login again.");
    }

    try {
      originalRequest._retry = true;

      const response = await authApi.post("/auth/refresh", {
        refreshToken: credentials.refreshToken,
      });

      const refreshed = response.data?.data || response.data;
      await saveCredentials({
        ...credentials,
        token: refreshed.token,
        refreshToken: refreshed.refreshToken || credentials.refreshToken,
      });

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${refreshed.token}`;

      return api(originalRequest);
    } catch (refreshError) {
      await clearCredentials();
      throw new Error("Session expired. Please login again.", { cause: refreshError });
    }
  },
);

module.exports = api;