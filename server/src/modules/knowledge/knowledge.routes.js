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
// Knowledge Routes
// ========================================

/**
 * Knowledge routes require:
 *
 * 1. Authentication
 * 2. Organization membership
 * 3. Role-based access control
 *
 * Role permissions:
 *
 * OWNER
 * - Upload knowledge documents
 * - View knowledge documents
 * - Use AI Knowledge Assistant
 * - Delete knowledge documents
 *
 * ADMIN
 * - Upload knowledge documents
 * - View knowledge documents
 * - Use AI Knowledge Assistant
 * - Delete knowledge documents
 *
 * AGENT
 * - View knowledge documents
 * - Use AI Knowledge Assistant
 *
 * CUSTOMER
 * - Use AI Knowledge Assistant
 *
 * X-Organization-Id header:
 *
 * X-Organization-Id: <organizationId>
 */


// ========================================
// Upload Knowledge Document
// ========================================

/**
 * OWNER and ADMIN can upload
 * knowledge documents.
 */
router.post(
  "/",
  authMiddleware,
  organizationMiddleware,
  requireRole("OWNER", "ADMIN"),
  uploadPdf.single("file"),
  validate(uploadKnowledgeDocumentSchema),
  uploadDocument
);


// ========================================
// Get Knowledge Documents
// ========================================

/**
 * OWNER, ADMIN and AGENT can view
 * company knowledge documents.
 *
 * CUSTOMER cannot directly access
 * the internal knowledge document list.
 */
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

/**
 * All organization roles can use
 * the AI Knowledge Assistant.
 *
 * OWNER
 * ADMIN
 * AGENT
 * CUSTOMER
 */
router.post(
  "/search",
  authMiddleware,
  organizationMiddleware,
  requireRole(
    "OWNER",
    "ADMIN",
    "AGENT",
    "CUSTOMER"
  ),
  validate(searchKnowledgeSchema),
  searchKnowledgeController
);


// ========================================
// Delete Knowledge Document
// ========================================

/**
 * OWNER and ADMIN can delete
 * knowledge documents.
 */
router.delete(
  "/:documentId",
  authMiddleware,
  organizationMiddleware,
  requireRole("OWNER", "ADMIN"),
  deleteDocument
);


// ========================================
// Exports
// ========================================

module.exports = router;