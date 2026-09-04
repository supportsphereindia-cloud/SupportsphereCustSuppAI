const ApiError = require("../../shared/errors/ApiError");

const {
  createAuditLog,
  findAuditLogsByOrganizationId,
  countAuditLogsByOrganizationId,
  findAuditLogById,
  findAuditLogsByEntity,
} = require("./audit.repository");


// ========================================
// Create Audit Log
// ========================================

/**
 * Creates an audit log entry.
 *
 * This function is intended to be called
 * internally by application services.
 *
 * Examples:
 *
 * - Ticket created
 * - Ticket updated
 * - Ticket closed
 * - AI analysis created
 * - Organization member added
 * - Organization member role updated
 * - Organization member removed
 *
 * Clients should never directly control
 * audit log creation.
 */
const createAuditLogEntry = async ({
  organizationId,
  userId,
  action,
  entityType,
  entityId = null,
  metadata = null,
}) => {

  // ========================================
  // Validate Organization
  // ========================================

  if (!organizationId) {
    throw new ApiError(
      400,
      "Organization ID is required"
    );
  }


  // ========================================
  // Validate User
  // ========================================

  if (!userId) {
    throw new ApiError(
      400,
      "User ID is required"
    );
  }


  // ========================================
  // Validate Action
  // ========================================

  if (!action) {
    throw new ApiError(
      400,
      "Audit action is required"
    );
  }


  // ========================================
  // Validate Entity Type
  // ========================================

  if (!entityType) {
    throw new ApiError(
      400,
      "Entity type is required"
    );
  }


  // ========================================
  // Create Audit Log
  // ========================================

  return createAuditLog({
    organizationId,
    userId,
    action,
    entityType,
    entityId,
    metadata,
  });
};


// ========================================
// Get Organization Audit Logs
// ========================================

/**
 * Returns audit logs belonging to the
 * authenticated user's organization.
 *
 * The organizationId comes from the
 * organization middleware and therefore
 * prevents cross-organization access.
 *
 * Supports:
 *
 * - Pagination
 * - Organization-level isolation
 */
const getOrganizationAuditLogs = async (
  organizationId,
  page = 1,
  limit = 20
) => {

  // ========================================
  // Validate Organization
  // ========================================

  if (!organizationId) {
    throw new ApiError(
      400,
      "Organization ID is required"
    );
  }


  // ========================================
  // Normalize Pagination
  // ========================================

  const parsedPage =
    Number(page);

  const parsedLimit =
    Number(limit);


  // ========================================
  // Validate Page
  // ========================================

  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 1
  ) {
    throw new ApiError(
      400,
      "Page must be a positive integer"
    );
  }


  // ========================================
  // Validate Limit
  // ========================================

  if (
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1 ||
    parsedLimit > 100
  ) {
    throw new ApiError(
      400,
      "Limit must be between 1 and 100"
    );
  }


  // ========================================
  // Fetch Logs And Count
  // ========================================

  const [
    auditLogs,
    totalLogs,
  ] = await Promise.all([
    findAuditLogsByOrganizationId(
      organizationId,
      {
        page: parsedPage,
        limit: parsedLimit,
      }
    ),

    countAuditLogsByOrganizationId(
      organizationId
    ),
  ]);


  // ========================================
  // Calculate Total Pages
  // ========================================

  const totalPages =
    Math.ceil(
      totalLogs / parsedLimit
    );


  // ========================================
  // Return Result
  // ========================================

  return {
    logs: auditLogs,

    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total: totalLogs,
      totalPages,

      hasNextPage:
        parsedPage < totalPages,

      hasPreviousPage:
        parsedPage > 1,
    },
  };
};


// ========================================
// Get Audit Log By ID
// ========================================

/**
 * Returns one audit log belonging to
 * the current organization.
 *
 * The repository must query using both:
 *
 * - auditLogId
 * - organizationId
 *
 * This prevents a user from accessing an
 * audit log belonging to another
 * organization even if they know its ID.
 */
const getAuditLogById = async (
  auditLogId,
  organizationId
) => {

  // ========================================
  // Validate Organization
  // ========================================

  if (!organizationId) {
    throw new ApiError(
      400,
      "Organization ID is required"
    );
  }


  // ========================================
  // Validate Audit Log ID
  // ========================================

  if (!auditLogId) {
    throw new ApiError(
      400,
      "Audit log ID is required"
    );
  }


  // ========================================
  // Fetch Audit Log
  // ========================================

  const auditLog =
    await findAuditLogById(
      auditLogId,
      organizationId
    );


  // ========================================
  // Audit Log Not Found
  // ========================================

  if (!auditLog) {
    throw new ApiError(
      404,
      "Audit log not found"
    );
  }


  // ========================================
  // Return Audit Log
  // ========================================

  return auditLog;
};


// ========================================
// Get Entity Audit History
// ========================================

/**
 * Returns the audit history of a specific
 * entity inside the current organization.
 *
 * Example:
 *
 * entityType = "TICKET"
 * entityId   = ticketId
 *
 * The organizationId is always included
 * to prevent cross-organization history
 * access.
 */
const getEntityAuditLogs = async (
  organizationId,
  entityType,
  entityId
) => {

  // ========================================
  // Validate Organization
  // ========================================

  if (!organizationId) {
    throw new ApiError(
      400,
      "Organization ID is required"
    );
  }


  // ========================================
  // Validate Entity Type
  // ========================================

  if (!entityType) {
    throw new ApiError(
      400,
      "Entity type is required"
    );
  }


  // ========================================
  // Validate Entity ID
  // ========================================

  if (!entityId) {
    throw new ApiError(
      400,
      "Entity ID is required"
    );
  }


  // ========================================
  // Fetch Entity History
  // ========================================

  return findAuditLogsByEntity(
    organizationId,
    entityType,
    entityId
  );
};


// ========================================
// Exports
// ========================================

module.exports = {
  createAuditLogEntry,
  getOrganizationAuditLogs,
  getAuditLogById,
  getEntityAuditLogs,
};