const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../shared/responses/ApiResponse");

const {
  createNewOrganization,
  getOrganizationById,
  getMyOrganizations,
  addMemberToOrganization,
  getOrganizationMembers,
  changeMemberRole,
  removeMemberFromOrganization,
} = require("./organization.service");


/**
 * Create Organization
 */
const createOrganization = asyncHandler(
  async (req, res) => {
    const organization =
      await createNewOrganization(
        req.user.id,
        req.body
      );

    return res.status(201).json(
      new ApiResponse(
        201,
        "Organization created successfully",
        organization
      )
    );
  }
);


/**
 * Get Current User's Organizations
 */
const getOrganizations = asyncHandler(
  async (req, res) => {
    const organizations =
      await getMyOrganizations(
        req.user.id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Organizations fetched successfully",
        organizations
      )
    );
  }
);


/**
 * Get Organization By ID
 */
const getOrganization = asyncHandler(
  async (req, res) => {
    const organization =
      await getOrganizationById(
        req.params.id,
        req.user.id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Organization fetched successfully",
        organization
      )
    );
  }
);


/**
 * Add Member To Organization
 */
const addMember = asyncHandler(
  async (req, res) => {
    const member =
      await addMemberToOrganization(
        req.organization.id,
        req.user.id,
        req.organization.role,
        req.body
      );

    return res.status(201).json(
      new ApiResponse(
        201,
        "Organization member added successfully",
        member
      )
    );
  }
);


/**
 * Get Organization Members
 */
const getMembers = asyncHandler(
  async (req, res) => {
    const members =
      await getOrganizationMembers(
        req.organization.id
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Organization members fetched successfully",
        members
      )
    );
  }
);


/**
 * Change Organization Member Role
 */
const updateMemberRole = asyncHandler(
  async (req, res) => {
    const member =
      await changeMemberRole(
        req.organization.id,
        req.user.id,
        req.organization.role,
        req.params.memberId,
        req.body.role
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Organization member role updated successfully",
        member
      )
    );
  }
);


/**
 * Remove Organization Member
 */
const removeMember = asyncHandler(
  async (req, res) => {
    await removeMemberFromOrganization(
      req.organization.id,
      req.user.id,
      req.params.memberId
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Organization member removed successfully",
        null
      )
    );
  }
);


module.exports = {
  createOrganization,
  getOrganizations,
  getOrganization,
  addMember,
  getMembers,
  updateMemberRole,
  removeMember,
};