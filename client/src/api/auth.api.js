import api from "./axios";

/**
 * Register User
 */
export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};

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