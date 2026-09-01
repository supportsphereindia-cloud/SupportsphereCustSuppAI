const { z } = require("zod");


// ========================================
// Get Audit Logs
// ========================================

/**
 * Validates pagination parameters for
 * organization audit logs.
 *
 * Example:
 *
 * GET /audit?page=1&limit=20
 */
const getAuditLogsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .default("1")
      .refine(
        (value) => /^\d+$/.test(value),
        {
          message: "Page must be a positive integer",
        }
      )
      .refine(
        (value) => Number(value) >= 1,
        {
          message: "Page must be a positive integer",
        }
      ),

    limit: z
      .string()
      .optional()
      .default("20")
      .refine(
        (value) => /^\d+$/.test(value),
        {
          message: "Limit must be a positive integer",
        }
      )
      .refine(
        (value) =>
          Number(value) >= 1 &&
          Number(value) <= 100,
        {
          message: "Limit must be between 1 and 100",
        }
      ),
  }),
});


// ========================================
// Get Audit Log By ID
// ========================================

/**
 * Validates the audit log ID.
 */
const getAuditLogSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid Audit Log ID"),
  }),
});


// ========================================
// Get Entity Audit History
// ========================================

/**
 * Validates the entity type and entity ID.
 *
 * Example:
 *
 * /audit/entity/TICKET/cmt123
 */
const getEntityAuditHistorySchema = z.object({
  params: z.object({
    entityType: z
      .string()
      .min(1, "Entity type is required")
      .max(50, "Entity type is too long"),

    entityId: z
      .string()
      .min(1, "Entity ID is required"),
  }),
});


// ========================================
// Exports
// ========================================

module.exports = {
  getAuditLogsSchema,
  getAuditLogSchema,
  getEntityAuditHistorySchema,
};