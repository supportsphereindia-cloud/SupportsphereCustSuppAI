const {
  countTotalTickets,
  countOpenTickets,
  countClosedTickets,
  countOrganizationMembers,
  findRecentTickets,
} = require("./dashboard.repository");


/**
 * Get Organization Dashboard
 *
 * Returns dashboard statistics and
 * recent tickets for the currently
 * selected organization.
 *
 * All data is scoped to the organization
 * provided by organizationMiddleware.
 */
const getOrganizationDashboard = async (
  organizationId
) => {
  /**
   * Fetch dashboard statistics.
   *
   * Promise.all allows these independent
   * database queries to execute concurrently.
   */
  const [
    totalTickets,
    openTickets,
    closedTickets,
    totalMembers,
    recentTickets,
  ] = await Promise.all([
    countTotalTickets(
      organizationId
    ),

    countOpenTickets(
      organizationId
    ),

    countClosedTickets(
      organizationId
    ),

    countOrganizationMembers(
      organizationId
    ),

    findRecentTickets(
      organizationId
    ),
  ]);


  /**
   * Return the complete dashboard data.
   */
  return {
    statistics: {
      totalTickets,
      openTickets,
      closedTickets,
      totalMembers,
    },

    recentTickets,
  };
};


module.exports = {
  getOrganizationDashboard,
};