const express = require("express");

const authMiddleware = require("../../middleware/auth.middleware");
const organizationMiddleware = require("../../middleware/organization.middleware");
const requireRole = require("../../middleware/rbac.middleware");

const {
  createOrganization,
  getOrganizations,
  getOrganization,
} = require("./organization.controller");

const {
  addMember,
  getMembers,
  updateMemberRole,
  removeMember,
} = require("./organization-member.controller");

const router = express.Router();


router.use(authMiddleware);


/**
 * Create Organization
 */
router.post(
  "/",
  createOrganization
);


/**
 * Get Current User's Organizations
 */
router.get(
  "/",
  getOrganizations
);


/**
 * =====================================================
 * ORGANIZATION MEMBER MANAGEMENT
 * =====================================================
 */


/**
 * Add Member
 *
 * OWNER and ADMIN can add members.
 */
router.post(
  "/members",
  organizationMiddleware,
  requireRole("OWNER", "ADMIN"),
  addMember
);


/**
 * Get Organization Members
 *
 * OWNER and ADMIN can view members.
 */
router.get(
  "/members",
  organizationMiddleware,
  requireRole("OWNER", "ADMIN"),
  getMembers
);


/**
 * Change Member Role
 *
 * OWNER and ADMIN can change member roles.
 */
router.patch(
  "/members/:memberId/role",
  organizationMiddleware,
  requireRole("OWNER"),
  updateMemberRole
);


/**
 * Remove Member
 *
 * OWNER and ADMIN can remove members.
 */
router.delete(
  "/members/:memberId",
  organizationMiddleware,
  requireRole("OWNER", "ADMIN"),
  removeMember
);


/**
 * Get Organization By ID
 *
 * This route must remain AFTER /members routes.
 */
router.get(
  "/:id",
  organizationMiddleware,
  getOrganization
);


module.exports = router;