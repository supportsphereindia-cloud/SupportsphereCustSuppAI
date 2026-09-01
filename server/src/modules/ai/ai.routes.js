const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");

const organizationMiddleware = require(
  "../../middleware/organization.middleware"
);

const validate = require(
  "../../middleware/validate.middleware"
);

const {
  analyzeTicketSchema,
} = require("./ai.validation");

const {
  analyzeTicket,
  getAnalysis,
} = require("./ai.controller");


// ========================================
// Analyze Ticket With AI
// ========================================

/**
 * POST /ai/tickets/:id/analyze
 *
 * Middleware flow:
 *
 * 1. Authenticate user
 * 2. Resolve and verify organization
 * 3. Validate request parameters
 * 4. Analyze ticket with AI
 *
 * Required header:
 *
 * X-Organization-Id: <organizationId>
 */
router.post(
  "/tickets/:id/analyze",
  authMiddleware,
  organizationMiddleware,
  validate(analyzeTicketSchema),
  analyzeTicket
);


// ========================================
// Get Existing AI Analysis
// ========================================

/**
 * GET /ai/tickets/:id/analysis
 *
 * Middleware flow:
 *
 * 1. Authenticate user
 * 2. Resolve and verify organization
 * 3. Fetch existing AI analysis
 *
 * Required header:
 *
 * X-Organization-Id: <organizationId>
 */
router.get(
  "/tickets/:id/analysis",
  authMiddleware,
  organizationMiddleware,
  getAnalysis
);


// ========================================
// Exports
// ========================================

module.exports = router;