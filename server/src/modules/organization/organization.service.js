const ApiError = require("../../shared/errors/ApiError");

const {
  createOrganization,
  findOrganizationById,
  findOrganizationBySlug,
  createOrganizationMember,
  findOrganizationMember,
  findOrganizationsByUserId,
  findOrganizationMembers,
  findOrganizationMemberById,
  updateOrganizationMemberRole,
  deleteOrganizationMember,
  assignTicketsToOrganization,
} = require("./organization.repository");

const {
  getUserByEmail,
} = require("../user/user.service");

const {
  createAuditLogEntry,
} = require("../audit/audit.service");


/**
 * Create Organization
 *
 * The user who creates the organization
 * automatically becomes its OWNER.
 */
const createNewOrganization = async (
  userId,
  { name, slug }
) => {
  // Check whether the slug is already in use.
  const existingOrganization =
    await findOrganizationBySlug(slug);

  if (existingOrganization) {
    throw new ApiError(
      409,
      "Organization slug already exists"
    );
  }

  // Create the organization.
  const organization =
    await createOrganization({
      name,
      slug,
    });

  // Add the creator as OWNER.
  await createOrganizationMember({
    organizationId: organization.id,
    userId,
    role: "OWNER",
  });

  // Assign existing tickets belonging to
  // this user to the newly created organization.
  await assignTicketsToOrganization(
    userId,
    organization.id
  );

  return organization;
};


/**
 * Get Organization By ID
 */
const getOrganizationById = async (
  organizationId,
  userId
) => {
  const organization =
    await findOrganizationById(
      organizationId
    );

  if (!organization) {
    throw new ApiError(
      404,
      "Organization not found"
    );
  }

  // Verify that the user belongs to
  // this organization.
  const membership =
    await findOrganizationMember(
      organizationId,
      userId
    );

  if (!membership) {
    throw new ApiError(
      403,
      "You are not a member of this organization"
    );
  }

  return organization;
};


/**
 * Get Current User's Organizations
 */
const getMyOrganizations = async (
  userId
) => {
  return findOrganizationsByUserId(
    userId
  );
};


/**
 * Add Existing User To Organization
 *
 * OWNER and ADMIN can add existing users.
 *
 * ADMIN cannot assign the OWNER role.
 */
const addMemberToOrganization = async (
  organizationId,
  actingUserId,
  actingUserRole,
  { email, role = "CUSTOMER" }
) => {
  /**
   * Validate requested role.
   */
  const allowedRoles = [
    "OWNER",
    "ADMIN",
    "AGENT",
    "CUSTOMER",
  ];

  if (!allowedRoles.includes(role)) {
    throw new ApiError(
      400,
      "Invalid organization role"
    );
  }


  /**
   * ADMIN users cannot create
   * another OWNER.
   */
  if (
    actingUserRole === "ADMIN" &&
    role === "OWNER"
  ) {
    throw new ApiError(
      403,
      "ADMIN users cannot assign the OWNER role"
    );
  }


  /**
   * Find the user by email.
   */
  const user =
    await getUserByEmail(email);


  /**
   * Prevent duplicate membership.
   */
  const existingMembership =
    await findOrganizationMember(
      organizationId,
      user.id
    );

  if (existingMembership) {
    throw new ApiError(
      409,
      "User is already a member of this organization"
    );
  }


  /**
   * Create membership.
   */
  const member =
    await createOrganizationMember({
      organizationId,
      userId: user.id,
      role,
    });


  // ========================================
  // Create Audit Log
  // ========================================

  await createAuditLogEntry({
    organizationId,
    userId: actingUserId,

    action: "MEMBER_ADDED",

    entityType: "ORGANIZATION_MEMBER",

    entityId: member.id,

    metadata: {
      memberUserId: user.id,
      memberEmail: user.email,
      memberName: user.name,
      role: member.role,
    },
  });


  return member;
};


/**
 * Get All Organization Members
 */
const getOrganizationMembers = async (
  organizationId
) => {
  return findOrganizationMembers(
    organizationId
  );
};


/**
 * Update Organization Member Role
 *
 * OWNER can change non-owner roles.
 * ADMIN can change non-owner roles but
 * cannot assign OWNER.
 */
const changeMemberRole = async (
  organizationId,
  actingUserId,
  actingUserRole,
  memberId,
  newRole
) => {
  /**
   * Validate requested role.
   */
  const allowedRoles = [
    "OWNER",
    "ADMIN",
    "AGENT",
    "CUSTOMER",
  ];

  if (!allowedRoles.includes(newRole)) {
    throw new ApiError(
      400,
      "Invalid organization role"
    );
  }


  /**
   * ADMIN cannot promote anyone
   * to OWNER.
   */
  if (
    actingUserRole === "ADMIN" &&
    newRole === "OWNER"
  ) {
    throw new ApiError(
      403,
      "ADMIN users cannot assign the OWNER role"
    );
  }


  /**
   * Find target member.
   */
  const member =
    await findOrganizationMemberById(
      memberId
    );

  if (!member) {
    throw new ApiError(
      404,
      "Organization member not found"
    );
  }


  /**
   * Verify that the target member
   * belongs to the active organization.
   */
  if (
    member.organizationId !== organizationId
  ) {
    throw new ApiError(
      403,
      "Organization member does not belong to this organization"
    );
  }


  /**
   * Prevent modification of OWNER.
   *
   * Ownership transfer will be implemented
   * separately with stricter safeguards.
   */
  if (member.role === "OWNER") {
    throw new ApiError(
      403,
      "The OWNER role cannot be modified"
    );
  }


  /**
   * Prevent a user from modifying
   * their own organization role.
   */
  if (member.userId === actingUserId) {
    throw new ApiError(
      400,
      "You cannot change your own organization role"
    );
  }


  /**
   * Store the previous role before
   * updating the membership.
   */
  const previousRole =
    member.role;


  /**
   * Update member role.
   */
  const updatedMember =
    await updateOrganizationMemberRole(
      memberId,
      newRole
    );


  // ========================================
  // Create Audit Log
  // ========================================

  await createAuditLogEntry({
    organizationId,
    userId: actingUserId,

    action: "MEMBER_ROLE_UPDATED",

    entityType: "ORGANIZATION_MEMBER",

    entityId: member.id,

    metadata: {
      memberUserId: member.userId,
      memberEmail:
        member.user?.email || null,
      memberName:
        member.user?.name || null,
      previousRole,
      newRole: updatedMember.role,
    },
  });


  return updatedMember;
};


/**
 * Remove Organization Member
 *
 * OWNER and ADMIN can remove members.
 *
 * OWNER members cannot be removed through
 * this endpoint.
 */
const removeMemberFromOrganization = async (
  organizationId,
  actingUserId,
  memberId
) => {
  /**
   * Find target member.
   */
  const member =
    await findOrganizationMemberById(
      memberId
    );

  if (!member) {
    throw new ApiError(
      404,
      "Organization member not found"
    );
  }


  /**
   * Verify that the target member
   * belongs to the active organization.
   */
  if (
    member.organizationId !== organizationId
  ) {
    throw new ApiError(
      403,
      "Organization member does not belong to this organization"
    );
  }


  /**
   * Prevent removing an OWNER.
   *
   * Ownership transfer will be handled
   * separately in the future.
   */
  if (member.role === "OWNER") {
    throw new ApiError(
      403,
      "The OWNER cannot be removed from the organization"
    );
  }


  /**
   * Prevent self-removal.
   */
  if (member.userId === actingUserId) {
    throw new ApiError(
      400,
      "You cannot remove yourself from the organization"
    );
  }


  /**
   * Remove the member.
   */
  await deleteOrganizationMember(
    memberId
  );


  // ========================================
  // Create Audit Log
  // ========================================

  await createAuditLogEntry({
    organizationId,
    userId: actingUserId,

    action: "MEMBER_REMOVED",

    entityType: "ORGANIZATION_MEMBER",

    entityId: member.id,

    metadata: {
      memberUserId: member.userId,
      memberEmail:
        member.user?.email || null,
      memberName:
        member.user?.name || null,
      role: member.role,
    },
  });


  return member;
};


module.exports = {
  createNewOrganization,
  getOrganizationById,
  getMyOrganizations,
  addMemberToOrganization,
  getOrganizationMembers,
  changeMemberRole,
  removeMemberFromOrganization,
};