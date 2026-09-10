import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken");

    const activeOrganizationId =
      localStorage.getItem(
        "activeOrganizationId"
      );

    // Add JWT authentication header
    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    // Add active organization header
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