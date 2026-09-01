const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");
const organizationMiddleware = require("../../middleware/organization.middleware");
const validate = require("../../middleware/validate.middleware");

const {
  getAuditLogs,
  getAuditLog,
  getEntityAuditHistory,
} = require("./audit.controller");

const {
  getAuditLogsSchema,
  getAuditLogSchema,
  getEntityAuditHistorySchema,
} = require("./audit.validation");


// ========================================
// Audit Log Routes
// ========================================

/**
 * All audit-log routes require:
 *
 * 1. Authentication
 * 2. Organization membership
 * 3. Request validation
 *
 * X-Organization-Id header:
 *
 * X-Organization-Id: <organizationId>
 */


// ========================================
// Get Organization Audit Logs
// ========================================

router.get(
  "/",
  authMiddleware,
  organizationMiddleware,
  validate(getAuditLogsSchema),
  getAuditLogs
);


// ========================================
// Get Audit Log By ID
// ========================================

router.get(
  "/:id",
  authMiddleware,
  organizationMiddleware,
  validate(getAuditLogSchema),
  getAuditLog
);


// ========================================
// Get Entity Audit History
// ========================================

router.get(
  "/entity/:entityType/:entityId",
  authMiddleware,
  organizationMiddleware,
  validate(getEntityAuditHistorySchema),
  getEntityAuditHistory
);


// ========================================
// Exports
// ========================================

module.exports = router;