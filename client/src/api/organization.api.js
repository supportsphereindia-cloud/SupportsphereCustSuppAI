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

export const getOrganizationMembers = async () => {

  const response = await api.get(

    "/organizations/members"

  );

  return response.data;

};

export const addOrganizationMember = async (
  memberData
) => {

  const response = await api.post(

    "/organizations/members",

    memberData

  );

  return response.data;

};

export const updateOrganizationMemberRole = async (
  memberId,
  role
) => {

  const response = await api.patch(

    `/organizations/members/${memberId}/role`,

    {
      role,
    }

  );

  return response.data;

};

export const removeOrganizationMember = async (
  memberId
) => {

  const response = await api.delete(

    `/organizations/members/${memberId}`

  );

  return response.data;

};