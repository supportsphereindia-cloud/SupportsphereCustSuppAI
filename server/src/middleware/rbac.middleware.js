/**
 * Role-Based Access Control Middleware
 *
 * Restricts access to routes based on
 * the authenticated user's organization role.
 *
 * Usage:
 *
 * requireRole("OWNER")
 *
 * requireRole("OWNER", "ADMIN")
 *
 * requireRole("OWNER", "ADMIN", "AGENT")
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    /**
     * Organization middleware must run first.
     *
     * It populates:
     * req.organization
     * req.organization.role
     */
    if (!req.organization) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "Organization context is required",
      });
    }

    /**
     * Get the user's role inside
     * the current organization.
     */
    const userRole = req.organization.role;

    /**
     * Check whether the user's role
     * is allowed to access this route.
     */
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "You do not have permission to perform this action",
      });
    }

    /**
     * User has the required role.
     * Continue to the controller.
     */
    next();
  };
};

module.exports = requireRole;