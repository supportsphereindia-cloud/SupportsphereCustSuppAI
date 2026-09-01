const express = require("express");

const authMiddleware = require("../../middleware/auth.middleware");

const {
  getUsers,
} = require("./user.controller");

const router = express.Router();


/**
 * =====================================================
 * USER ROUTES
 * =====================================================
 *
 * All user routes require authentication.
 */
router.use(authMiddleware);


/**
 * =====================================================
 * GET ALL REGISTERED USERS
 * =====================================================
 *
 * Fetches all registered users in
 * SupportSphere.
 *
 * Request:
 *
 * GET /api/v1/users
 *
 * Headers:
 *
 * Authorization: Bearer <accessToken>
 */
router.get(
  "/",
  getUsers
);


module.exports = router;

