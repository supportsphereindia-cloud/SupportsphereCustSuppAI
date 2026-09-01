const prisma = require("../../config/prisma");


// ========================================
// Create Audit Log
// ========================================

/**
 * Creates a new audit log entry.
 *
 * Audit logs are created internally by
 * application services and record:
 *
 * - Organization where the action occurred
 * - User who performed the action
 * - Action that was performed
 * - Entity that was affected
 * - Optional entity ID
 * - Optional metadata
 */
const createAuditLog = async ({
  organizationId,
  userId,
  action,
  entityType,
  entityId = null,
  metadata = null,
}) => {
  return prisma.auditLog.create({
    data: {
      organizationId,
      userId,
      action,
      entityType,
      entityId,
      metadata,
    },
  });
};


// ========================================
// Find Audit Logs By Organization
// ========================================

/**
 * Fetches audit logs belonging to an
 * organization.
 *
 * Logs are returned from newest to oldest.
 *
 * Supports optional pagination.
 */
const findAuditLogsByOrganizationId = async (
  organizationId,
  {
    page = 1,
    limit = 20,
  } = {}
) => {
  const skip =
    (page - 1) * limit;

  return prisma.auditLog.findMany({
    where: {
      organizationId,
    },

    orderBy: {
      createdAt: "desc",
    },

    skip,

    take: limit,

    include: {
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


// ========================================
// Count Audit Logs By Organization
// ========================================

/**
 * Returns the total number of audit logs
 * belonging to an organization.
 *
 * Useful for pagination metadata.
 */
const countAuditLogsByOrganizationId = async (
  organizationId
) => {
  return prisma.auditLog.count({
    where: {
      organizationId,
    },
  });
};


// ========================================
// Find Audit Log By ID
// ========================================

/**
 * Fetches a single audit log.
 *
 * The organization ID is included in the
 * query to prevent accessing an audit log
 * belonging to another organization.
 */
const findAuditLogById = async (
  auditLogId,
  organizationId
) => {
  return prisma.auditLog.findFirst({
    where: {
      id: auditLogId,
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
  });
};


// ========================================
// Find Audit Logs By Entity
// ========================================

/**
 * Fetches audit logs for a specific entity.
 *
 * Example:
 *
 * entityType = "TICKET"
 * entityId   = "ticket-id"
 *
 * This allows us to display the complete
 * history of a ticket.
 */
const findAuditLogsByEntity = async (
  organizationId,
  entityType,
  entityId
) => {
  return prisma.auditLog.findMany({
    where: {
      organizationId,
      entityType,
      entityId,
    },

    orderBy: {
      createdAt: "desc",
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
  });
};


// ========================================
// Exports
// ========================================

module.exports = {
  createAuditLog,
  findAuditLogsByOrganizationId,
  countAuditLogsByOrganizationId,
  findAuditLogById,
  findAuditLogsByEntity,
};