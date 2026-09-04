import api from "./axios";


// ========================================
// Get Organization Audit Logs
// ========================================

/**
 * Get audit logs for the active organization
 *
 * Optional query parameters:
 *
 * - page = page number
 * - limit = number of logs per page
 */
export const getAuditLogs = async ({
  page = 1,
  limit = 20,
} = {}) => {
  const params = {
    page,
    limit,
  };

  const response = await api.get(
    "/audit-logs",
    {
      params,
    }
  );

  return response.data;
};


// ========================================
// Get Audit Log By ID
// ========================================

/**
 * Get a single audit log by ID
 */
export const getAuditLogById = async (
  auditLogId
) => {
  const response = await api.get(
    `/audit-logs/${auditLogId}`
  );

  return response.data;
};


// ========================================
// Get Entity Audit History
// ========================================

/**
 * Get audit history for a specific entity
 *
 * Example:
 *
 * GET /api/v1/audit-logs/entity/TICKET/:ticketId
 *
 * This endpoint retrieves all audit events
 * associated with the specified entity.
 */
export const getEntityAuditHistory = async (
  entityType,
  entityId
) => {
  const response = await api.get(
    `/audit-logs/entity/${entityType}/${entityId}`
  );

  return response.data;
};