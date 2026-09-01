const ApiError = require("../../shared/errors/ApiError");

const TICKET_MESSAGES = require("./ticket.constants");

const {
  createTicket,
  findTicketsByUserId,
  findTicketsByOrganizationId,
  findTicketById,
  updateTicket,
  deleteAIAnalysisByTicketId,
  updateTicketStatus,
} = require("./ticket.repository");

const {
  createAuditLogEntry,
} = require("../audit/audit.service");


// =====================================================
// Organization-Level Ticket Roles
// =====================================================
//
// These roles can access tickets belonging to
// other members of the same organization.
//
// CUSTOMER is intentionally excluded because
// customers can only access their own tickets.
//
const ORGANIZATION_TICKET_ROLES = [
  "OWNER",
  "ADMIN",
  "AGENT",
];


// =====================================================
// Create Ticket
// =====================================================

/**
 * Create Ticket
 *
 * Ticket is created inside the user's
 * current organization.
 *
 * After successful creation, an audit log
 * is created for the ticket creation event.
 */
const createNewTicket = async (
  userId,
  organizationId,
  ticketData
) => {

  // ========================================
  // Create Ticket
  // ========================================

  const ticket =
    await createTicket({
      ...ticketData,
      userId,
      organizationId,
    });


  // ========================================
  // Create Audit Log
  // ========================================

  await createAuditLogEntry({
    organizationId,
    userId,
    action: "TICKET_CREATED",
    entityType: "TICKET",
    entityId: ticket.id,
    metadata: {
      title: ticket.title,
      status: ticket.status,
      ticketOwnerId: ticket.userId,
    },
  });


  // ========================================
  // Return Created Ticket
  // ========================================

  return ticket;
};


// =====================================================
// Get Tickets
// =====================================================

/**
 * Get Tickets
 *
 * Ticket visibility depends on the
 * user's organization role.
 *
 * OWNER
 * ADMIN
 * AGENT
 *
 * can view all tickets belonging
 * to the current organization.
 *
 * CUSTOMER
 *
 * can only view their own tickets.
 *
 * Supports:
 *
 * - Status filtering
 * - Search
 */
const getTickets = async (
  userId,
  organizationId,
  userRole,
  filters = {}
) => {

  // ========================================
  // Organization-Level Ticket Access
  // ========================================

  if (
    ORGANIZATION_TICKET_ROLES.includes(
      userRole
    )
  ) {
    return findTicketsByOrganizationId(
      organizationId,
      filters
    );
  }


  // ========================================
  // Customer Ticket Access
  // ========================================

  return findTicketsByUserId(
    userId,
    organizationId,
    filters
  );
};


// =====================================================
// Get Ticket By ID
// =====================================================

/**
 * Get Ticket By ID
 *
 * OWNER
 * ADMIN
 * AGENT
 *
 * can access any ticket inside
 * their organization.
 *
 * CUSTOMER
 *
 * can only access their own ticket.
 */
const getTicketById = async (
  ticketId,
  userId,
  organizationId,
  userRole
) => {

  // ========================================
  // Find Ticket Inside Organization
  // ========================================

  const ticket =
    await findTicketById(
      ticketId,
      organizationId
    );


  // ========================================
  // Ticket Not Found
  // ========================================

  if (!ticket) {
    throw new ApiError(
      404,
      TICKET_MESSAGES.TICKET_NOT_FOUND
    );
  }


  // ========================================
  // Organization-Level Access
  // ========================================

  if (
    ORGANIZATION_TICKET_ROLES.includes(
      userRole
    )
  ) {
    return ticket;
  }


  // ========================================
  // Customer Ownership Check
  // ========================================

  if (ticket.userId !== userId) {
    throw new ApiError(
      403,
      TICKET_MESSAGES.UNAUTHORIZED_TICKET_ACCESS
    );
  }


  // ========================================
  // Return Ticket
  // ========================================

  return ticket;
};


// =====================================================
// Update Ticket
// =====================================================

/**
 * Update Ticket
 *
 * OWNER
 * ADMIN
 * AGENT
 *
 * can update tickets belonging
 * to their organization.
 *
 * CUSTOMER
 *
 * can only update their own ticket.
 *
 * Closed tickets cannot be edited.
 *
 * Existing AI analysis is deleted
 * because it was generated from the
 * previous ticket data.
 *
 * An audit log is created after
 * successful modification.
 */
const updateUserTicket = async (
  ticketId,
  userId,
  organizationId,
  userRole,
  ticketData
) => {

  // ========================================
  // Find Ticket Inside Organization
  // ========================================

  const ticket =
    await findTicketById(
      ticketId,
      organizationId
    );


  // ========================================
  // Ticket Not Found
  // ========================================

  if (!ticket) {
    throw new ApiError(
      404,
      TICKET_MESSAGES.TICKET_NOT_FOUND
    );
  }


  // ========================================
  // Authorization Check
  // ========================================
  //
  // OWNER / ADMIN / AGENT can update
  // any ticket in their organization.
  //
  // CUSTOMER can only update their
  // own ticket.
  //

  if (
    !ORGANIZATION_TICKET_ROLES.includes(
      userRole
    ) &&
    ticket.userId !== userId
  ) {
    throw new ApiError(
      403,
      TICKET_MESSAGES.UNAUTHORIZED_TICKET_ACCESS
    );
  }


  // ========================================
  // Closed Ticket Check
  // ========================================

  if (ticket.status === "CLOSED") {
    throw new ApiError(
      400,
      TICKET_MESSAGES.TICKET_ALREADY_CLOSED
    );
  }


  // ========================================
  // Store Previous Ticket Values
  // ========================================
  //
  // These values are stored in the
  // audit log so we can see what changed.
  //

  const previousTicket = {
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
  };


  // ========================================
  // Update Ticket
  // ========================================

  const updateResult =
    await updateTicket(
      ticketId,
      organizationId,
      ticketData
    );


  // ========================================
  // Verify Update
  // ========================================

  if (updateResult.count === 0) {
    throw new ApiError(
      404,
      TICKET_MESSAGES.TICKET_NOT_FOUND
    );
  }


  // ========================================
  // Delete Existing AI Analysis
  // ========================================
  //
  // Existing AI analysis was generated
  // from the previous ticket information.
  //
  // Therefore it must be removed when
  // ticket information changes.
  //

  await deleteAIAnalysisByTicketId(
    ticketId
  );


  // ========================================
  // Fetch Updated Ticket
  // ========================================

  const updatedTicket =
    await findTicketById(
      ticketId,
      organizationId
    );


  // ========================================
  // Create Audit Log
  // ========================================

  await createAuditLogEntry({
    organizationId,
    userId,
    action: "TICKET_UPDATED",
    entityType: "TICKET",
    entityId: ticketId,
    metadata: {
      previous: previousTicket,

      updated: {
        title: updatedTicket.title,
        description: updatedTicket.description,
        status: updatedTicket.status,
      },

      ticketOwnerId:
        updatedTicket.userId,

      aiAnalysisRemoved: true,
    },
  });


  // ========================================
  // Return Updated Ticket
  // ========================================

  return updatedTicket;
};


// =====================================================
// Close Ticket
// =====================================================

/**
 * Close Ticket
 *
 * OWNER
 * ADMIN
 * AGENT
 *
 * can close tickets belonging
 * to their organization.
 *
 * CUSTOMER
 *
 * can only close their own ticket.
 *
 * An audit log is created after
 * successful closure.
 */
const closeTicket = async (
  ticketId,
  userId,
  organizationId,
  userRole
) => {

  // ========================================
  // Find Ticket Inside Organization
  // ========================================

  const ticket =
    await findTicketById(
      ticketId,
      organizationId
    );


  // ========================================
  // Ticket Not Found
  // ========================================

  if (!ticket) {
    throw new ApiError(
      404,
      TICKET_MESSAGES.TICKET_NOT_FOUND
    );
  }


  // ========================================
  // Authorization Check
  // ========================================
  //
  // OWNER / ADMIN / AGENT can close
  // any ticket in their organization.
  //
  // CUSTOMER can only close their
  // own ticket.
  //

  if (
    !ORGANIZATION_TICKET_ROLES.includes(
      userRole
    ) &&
    ticket.userId !== userId
  ) {
    throw new ApiError(
      403,
      TICKET_MESSAGES.UNAUTHORIZED_TICKET_ACCESS
    );
  }


  // ========================================
  // Already Closed Check
  // ========================================

  if (ticket.status === "CLOSED") {
    throw new ApiError(
      400,
      TICKET_MESSAGES.TICKET_ALREADY_CLOSED
    );
  }


  // ========================================
  // Store Previous Status
  // ========================================

  const previousStatus =
    ticket.status;


  // ========================================
  // Close Ticket
  // ========================================

  const updateResult =
    await updateTicketStatus(
      ticketId,
      organizationId,
      "CLOSED"
    );


  // ========================================
  // Verify Update
  // ========================================

  if (updateResult.count === 0) {
    throw new ApiError(
      404,
      TICKET_MESSAGES.TICKET_NOT_FOUND
    );
  }


  // ========================================
  // Fetch Closed Ticket
  // ========================================

  const closedTicket =
    await findTicketById(
      ticketId,
      organizationId
    );


  // ========================================
  // Create Audit Log
  // ========================================

  await createAuditLogEntry({
    organizationId,
    userId,
    action: "TICKET_CLOSED",
    entityType: "TICKET",
    entityId: ticketId,
    metadata: {
      title: closedTicket.title,
      previousStatus,
      newStatus: closedTicket.status,
      ticketOwnerId: closedTicket.userId,
    },
  });


  // ========================================
  // Return Closed Ticket
  // ========================================

  return closedTicket;
};


// =====================================================
// Exports
// =====================================================

module.exports = {
  createNewTicket,
  getTickets,
  getTicketById,
  updateUserTicket,
  closeTicket,
};