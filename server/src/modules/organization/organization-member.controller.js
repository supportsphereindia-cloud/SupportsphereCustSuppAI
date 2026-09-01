const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../shared/responses/ApiResponse");

const {
  addMemberToOrganization,
  getOrganizationMembers,
  changeMemberRole,
  removeMemberFromOrganization,
} = require("./organization.service");


/**
 * Add Existing User To Organization
 *
 * OWNER and ADMIN can add existing users.
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
        "Member added to organization successfully",
        member
      )
    );
  }
);


/**
 * Get All Organization Members
 *
 * Returns all users belonging to
 * the currently active organization.
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
 * Update Organization Member Role
 *
 * OWNER and ADMIN can update roles.
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
 *
 * OWNER and ADMIN can remove members.
 */
const removeMember = asyncHandler(
  async (req, res) => {
    const member =
      await removeMemberFromOrganization(
        req.organization.id,
        req.user.id,
        req.params.memberId
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        "Organization member removed successfully",
        member
      )
    );
  }
);


module.exports = {
  addMember,
  getMembers,
  updateMemberRole,
  removeMember,
};