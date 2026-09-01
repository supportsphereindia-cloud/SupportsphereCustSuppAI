const prisma = require("../../config/prisma");


/**
 * Get total number of tickets
 * belonging to an organization.
 */
const countTotalTickets = async (
  organizationId
) => {
  return prisma.ticket.count({
    where: {
      organizationId,
    },
  });
};


/**
 * Get number of OPEN tickets
 * belonging to an organization.
 */
const countOpenTickets = async (
  organizationId
) => {
  return prisma.ticket.count({
    where: {
      organizationId,
      status: "OPEN",
    },
  });
};


/**
 * Get number of CLOSED tickets
 * belonging to an organization.
 */
const countClosedTickets = async (
  organizationId
) => {
  return prisma.ticket.count({
    where: {
      organizationId,
      status: "CLOSED",
    },
  });
};


/**
 * Get total number of members
 * belonging to an organization.
 */
const countOrganizationMembers = async (
  organizationId
) => {
  return prisma.organizationMember.count({
    where: {
      organizationId,
    },
  });
};


/**
 * Get recent tickets belonging
 * to an organization.
 *
 * Returns the latest tickets first.
 */
const findRecentTickets = async (
  organizationId,
  limit = 5
) => {
  return prisma.ticket.findMany({
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

      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },

      aiAnalysis: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: limit,
  });
};


module.exports = {
  countTotalTickets,
  countOpenTickets,
  countClosedTickets,
  countOrganizationMembers,
  findRecentTickets,
};