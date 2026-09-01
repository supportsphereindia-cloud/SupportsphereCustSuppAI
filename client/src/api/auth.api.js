import api from "./axios";

/**
 * Login User
 */
export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  return response.data;
};

/**
 * Get Current User
 */
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};