import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken");

    const activeOrganizationId =
      localStorage.getItem(
        "activeOrganizationId"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    if (activeOrganizationId) {
      config.headers["X-Organization-Id"] =
        activeOrganizationId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;