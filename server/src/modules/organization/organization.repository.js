const prisma = require("../../config/prisma");


/**
 * Create a new organization.
 */
const createOrganization = async (
  organizationData
) => {
  return prisma.organization.create({
    data: organizationData,
  });
};


/**
 * Find an organization by ID.
 */
const findOrganizationById = async (
  organizationId
) => {
  return prisma.organization.findUnique({
    where: {
      id: organizationId,
    },
  });
};


/**
 * Find an organization by slug.
 */
const findOrganizationBySlug = async (
  slug
) => {
  return prisma.organization.findUnique({
    where: {
      slug,
    },
  });
};


/**
 * Create an organization membership.
 */
const createOrganizationMember = async (
  membershipData
) => {
  return prisma.organizationMember.create({
    data: membershipData,

    include: {
      organization: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};


/**
 * Find a user's membership in a specific organization.
 *
 * Returns the user's organization role
 * along with organization information.
 */
const findOrganizationMember = async (
  organizationId,
  userId
) => {
  return prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },

    include: {
      organization: true,
    },
  });
};


/**
 * Find all organization memberships
 * belonging to a user.
 */
const findOrganizationMembershipsByUserId = async (
  userId
) => {
  return prisma.organizationMember.findMany({
    where: {
      userId,
    },

    include: {
      organization: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};


/**
 * Get all organizations that a user belongs to.
 */
const findOrganizationsByUserId = async (
  userId
) => {
  return prisma.organizationMember.findMany({
    where: {
      userId,
    },

    include: {
      organization: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};


/**
 * Get all members of an organization.
 */
const findOrganizationMembers = async (
  organizationId
) => {
  return prisma.organizationMember.findMany({
    where: {
      organizationId,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};


/**
 * Find a specific organization member
 * by membership ID.
 */
const findOrganizationMemberById = async (
  memberId
) => {
  return prisma.organizationMember.findUnique({
    where: {
      id: memberId,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      organization: true,
    },
  });
};


/**
 * Update an organization member's role.
 */
const updateOrganizationMemberRole = async (
  memberId,
  role
) => {
  return prisma.organizationMember.update({
    where: {
      id: memberId,
    },

    data: {
      role,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      organization: true,
    },
  });
};


/**
 * Remove a member from an organization.
 */
const deleteOrganizationMember = async (
  memberId
) => {
  return prisma.organizationMember.delete({
    where: {
      id: memberId,
    },
  });
};


/**
 * Assign existing tickets to an organization.
 *
 * Used during the migration of existing tickets
 * into the user's organization.
 */
const assignTicketsToOrganization = async (
  userId,
  organizationId
) => {
  return prisma.ticket.updateMany({
    where: {
      userId,
      organizationId: null,
    },

    data: {
      organizationId,
    },
  });
};


module.exports = {
  createOrganization,
  findOrganizationById,
  findOrganizationBySlug,
  createOrganizationMember,
  findOrganizationMember,
  findOrganizationMembershipsByUserId,
  findOrganizationsByUserId,
  findOrganizationMembers,
  findOrganizationMemberById,
  updateOrganizationMemberRole,
  deleteOrganizationMember,
  assignTicketsToOrganization,
};