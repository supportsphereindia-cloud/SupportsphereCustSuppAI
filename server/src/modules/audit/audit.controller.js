const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../shared/responses/ApiResponse");

const {
  getOrganizationAuditLogs,
  getAuditLogById,
  getEntityAuditLogs,
} = require("./audit.service");


// ========================================
// Get Organization Audit Logs
// ========================================

/**
 * Get Audit Logs
 *
 * Returns audit logs belonging to the
 * currently selected organization.
 *
 * Supports:
 * - Pagination
 * - Limit
 */
const getAuditLogs = asyncHandler(async (req, res) => {

  // ========================================
  // Get Organization ID
  // ========================================

  const organizationId =
    req.organization.id;


  // ========================================
  // Get Pagination Parameters
  // ========================================

  const {
    page = 1,
    limit = 20,
  } = req.query;


  // ========================================
  // Fetch Audit Logs
  // ========================================

  const result =
    await getOrganizationAuditLogs(
      organizationId,
      page,
      limit
    );


  // ========================================
  // Return Response
  // ========================================

  return res.status(200).json(
    new ApiResponse(
      200,
      "Audit logs fetched successfully",
      result
    )
  );
});


// ========================================
// Get Audit Log By ID
// ========================================

/**
 * Get a single audit log.
 *
 * The audit log is restricted to the
 * currently selected organization.
 */
const getAuditLog = asyncHandler(async (req, res) => {

  // ========================================
  // Get Audit Log ID
  // ========================================

  const {
    id,
  } = req.params;


  // ========================================
  // Get Organization ID
  // ========================================

  const organizationId =
    req.organization.id;


  // ========================================
  // Fetch Audit Log
  // ========================================

  const auditLog =
    await getAuditLogById(
      id,
      organizationId
    );


  // ========================================
  // Return Response
  // ========================================

  return res.status(200).json(
    new ApiResponse(
      200,
      "Audit log fetched successfully",
      auditLog
    )
  );
});


// ========================================
// Get Entity Audit Logs
// ========================================

/**
 * Get audit history for a specific entity.
 *
 * Example:
 *
 * GET /audit/entity/TICKET/cmt123
 *
 * This can be used to view the complete
 * history of a ticket, member, or other
 * audited entity.
 */
const getEntityAuditHistory = asyncHandler(
  async (req, res) => {

    // ========================================
    // Get Entity Parameters
    // ========================================

    const {
      entityType,
      entityId,
    } = req.params;


    // ========================================
    // Get Organization ID
    // ========================================

    const organizationId =
      req.organization.id;


    // ========================================
    // Fetch Entity Audit History
    // ========================================

    const auditLogs =
      await getEntityAuditLogs(
        organizationId,
        entityType,
        entityId
      );


    // ========================================
    // Return Response
    // ========================================

    return res.status(200).json(
      new ApiResponse(
        200,
        "Entity audit history fetched successfully",
        auditLogs
      )
    );
  }
);


// ========================================
// Exports
// ========================================

module.exports = {
  getAuditLogs,
  getAuditLog,
  getEntityAuditHistory,
};