import api from "./axios";

export const createOrganization = async (organizationData) => {
  const response = await api.post(
    "/organizations",
    organizationData
  );

  return response.data;
};

export const getOrganizations = async () => {
  const response = await api.get("/organizations");

  return response.data;
};