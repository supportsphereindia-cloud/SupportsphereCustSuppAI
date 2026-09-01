const prisma = require("../../config/prisma");


/**
 * Create a new ticket
 */
const createTicket = async (ticketData) => {
  return prisma.ticket.create({
    data: ticketData,
  });
};


/**
 * Get all tickets for a user within an organization
 *
 * Supports:
 * - Organization filtering
 * - Status filtering
 * - Search by title & description
 */
const findTicketsByUserId = async (
  userId,
  organizationId,
  filters = {}
) => {
  const where = {
    userId,
    organizationId,
  };


  /**
   * Filter by ticket status.
   */
  if (filters.status) {
    where.status = filters.status;
  }


  /**
   * Search in ticket title
   * and description.
   */
  if (filters.search) {
    where.OR = [
      {
        title: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
    ];
  }


  return prisma.ticket.findMany({
    where,

    include: {
      aiAnalysis: true,
      organization: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};


/**
 * Get all tickets belonging to
 * an organization.
 *
 * This is used by:
 *
 * OWNER
 * ADMIN
 * AGENT
 *
 * to view organization-level tickets.
 *
 * Supports:
 * - Status filtering
 * - Search
 */
const findTicketsByOrganizationId = async (
  organizationId,
  filters = {}
) => {
  const where = {
    organizationId,
  };


  /**
   * Filter by ticket status.
   */
  if (filters.status) {
    where.status = filters.status;
  }


  /**
   * Search in ticket title
   * and description.
   */
  if (filters.search) {
    where.OR = [
      {
        title: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: filters.search,
          mode: "insensitive",
        },
      },
    ];
  }


  return prisma.ticket.findMany({
    where,

    include: {
      aiAnalysis: true,

      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      organization: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};


/**
 * Find ticket by ID within an organization.
 *
 * Organization ID is included in the query
 * to prevent cross-organization access.
 *
 * Includes:
 * - AI analysis
 * - Organization
 * - Ticket owner
 */
const findTicketById = async (
  id,
  organizationId
) => {
  return prisma.ticket.findFirst({
    where: {
      id,
      organizationId,
    },

    include: {
      aiAnalysis: true,

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
 * Update ticket details.
 *
 * Organization ID is included in the
 * query to prevent cross-organization updates.
 */
const updateTicket = async (
  id,
  organizationId,
  ticketData
) => {
  return prisma.ticket.updateMany({
    where: {
      id,
      organizationId,
    },

    data: ticketData,
  });
};


/**
 * Delete AI analysis for a ticket.
 */
const deleteAIAnalysisByTicketId = async (
  ticketId
) => {
  return prisma.aIAnalysis.deleteMany({
    where: {
      ticketId,
    },
  });
};


/**
 * Update ticket status.
 *
 * Organization ID is included in the
 * query to prevent cross-organization updates.
 */
const updateTicketStatus = async (
  id,
  organizationId,
  status
) => {
  return prisma.ticket.updateMany({
    where: {
      id,
      organizationId,
    },

    data: {
      status,
    },
  });
};


/**
 * Count tickets belonging to an organization.
 *
 * Useful for:
 * - Dashboard statistics
 * - Ticket counts
 * - Analytics
 */
const countTicketsByOrganizationId = async (
  organizationId,
  status
) => {
  const where = {
    organizationId,
  };


  /**
   * Optionally filter the count
   * by ticket status.
   */
  if (status) {
    where.status = status;
  }


  return prisma.ticket.count({
    where,
  });
};


module.exports = {
  createTicket,
  findTicketsByUserId,
  findTicketsByOrganizationId,
  findTicketById,
  updateTicket,
  deleteAIAnalysisByTicketId,
  updateTicketStatus,
  countTicketsByOrganizationId,
};