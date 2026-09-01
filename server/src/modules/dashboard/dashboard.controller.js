const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../shared/responses/ApiResponse");

const {
  getOrganizationDashboard,
} = require("./dashboard.service");


/**
 * Get Organization Dashboard
 *
 * Returns dashboard statistics and
 * recent tickets for the currently
 * selected organization.
 *
 * Authentication and organization
 * membership are handled by middleware.
 */
const getDashboard = asyncHandler(
  async (req, res) => {
    const dashboard =
      await getOrganizationDashboard(
        req.organization.id
      );


    return res.status(200).json(
      new ApiResponse(
        200,
        "Dashboard fetched successfully",
        dashboard
      )
    );
  }
);


module.exports = {
  getDashboard,
};