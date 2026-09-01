const ApiError = require("../shared/errors/ApiError");

const {
  findOrganizationMember,
} = require("../modules/organization/organization.repository");


/**
 * Organization Context Middleware
 *
 * Determines the active organization for the
 * authenticated user and verifies membership.
 *
 * Expected header:
 *
 * X-Organization-Id: <organizationId>
 */
const organizationMiddleware = async (
  req,
  res,
  next
) => {
  /**
   * Authentication must already have
   * populated req.user.
   */
  if (!req.user || !req.user.id) {
    return next(
      new ApiError(
        401,
        "Unauthorized"
      )
    );
  }


  /**
   * Read the active organization ID
   * from the request header.
   */
  const organizationId =
    req.headers["x-organization-id"];


  /**
   * Organization ID is required.
   */
  if (!organizationId) {
    return next(
      new ApiError(
        400,
        "Organization ID is required"
      )
    );
  }


  try {
    /**
     * Find the user's membership in
     * the requested organization.
     */
    const membership =
      await findOrganizationMember(
        organizationId,
        req.user.id
      );


    /**
     * User does not belong to this
     * organization.
     */
    if (!membership) {
      return next(
        new ApiError(
          403,
          "You are not a member of this organization"
        )
      );
    }


    /**
     * Attach organization context
     * to the request.
     *
     * This will later be used by
     * RBAC and ticket authorization.
     */
    req.organization = {
      id: membership.organizationId,
      role: membership.role,
      name: membership.organization.name,
      slug: membership.organization.slug,
    };


    next();
  } catch (error) {
    next(error);
  }
};


module.exports = organizationMiddleware;