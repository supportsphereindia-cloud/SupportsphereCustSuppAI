const express = require("express");

const authMiddleware = require("../../middleware/auth.middleware");
const organizationMiddleware = require("../../middleware/organization.middleware");

const {
  getDashboard,
} = require("./dashboard.controller");


const router = express.Router();


/**
 * Get Organization Dashboard
 *
 * Authentication
 *      ↓
 * Organization Context
 *      ↓
 * Controller
 *
 * The organizationMiddleware:
 * - Reads X-Organization-Id
 * - Verifies organization membership
 * - Attaches req.organization
 * - Provides the user's organization role
 */
router.get(
  "/",
  authMiddleware,
  organizationMiddleware,
  getDashboard
);


module.exports = router;