const express = require("express");

const router = express.Router();

const authMiddleware = require("../../middleware/auth.middleware");
const organizationMiddleware = require("../../middleware/organization.middleware");
const requireRole = require("../../middleware/rbac.middleware");
const validate = require("../../middleware/validate.middleware");
const { uploadPdf } = require("../../middleware/upload.middleware");

const {
  uploadDocument,
  getKnowledgeDocuments,
  searchKnowledgeController,
  deleteDocument,
} = require("./knowledge.controller");

const {
  uploadKnowledgeDocumentSchema,
  searchKnowledgeSchema,
} = require("./knowledge.validation");


// ========================================
// Knowledge Document Routes
// ========================================

/**
 * Knowledge document routes require:
 *
 * 1. Authentication
 * 2. Organization membership
 * 3. Owner/Admin/Agent role
 * 4. PDF upload validation
 * 5. Request validation
 *
 * X-Organization-Id header:
 *
 * X-Organization-Id: <organizationId>
 */


// ========================================
// Upload Knowledge Document
// ========================================

router.post(
  "/",
  authMiddleware,
  organizationMiddleware,
  requireRole("OWNER", "ADMIN", "AGENT"),
  uploadPdf.single("file"),
  validate(uploadKnowledgeDocumentSchema),
  uploadDocument
);


// ========================================
// Get Knowledge Documents
// ========================================

router.get(
  "/",
  authMiddleware,
  organizationMiddleware,
  requireRole("OWNER", "ADMIN", "AGENT"),
  getKnowledgeDocuments
);


// ========================================
// Search Knowledge
// ========================================

router.post(
  "/search",
  authMiddleware,
  organizationMiddleware,
  requireRole("OWNER", "ADMIN", "AGENT"),
  validate(searchKnowledgeSchema),
  searchKnowledgeController
);


// ========================================
// Delete Knowledge Document
// ========================================

router.delete(
  "/:documentId",
  authMiddleware,
  organizationMiddleware,
  requireRole("OWNER", "ADMIN", "AGENT"),
  deleteDocument
);


// ========================================
// Exports
// ========================================

module.exports = router;
