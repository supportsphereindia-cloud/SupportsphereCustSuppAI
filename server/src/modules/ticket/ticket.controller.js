const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../shared/responses/ApiResponse");

const {
  createNewTicket,
  getTickets,
  getTicketById,
  updateUserTicket,
  closeTicket,
} = require("./ticket.service");

const TICKET_MESSAGES = require("./ticket.constants");


/**
 * Create Ticket
 *
 * Ticket is created inside the
 * currently selected organization.
 *
 * The authenticated user becomes
 * the owner/creator of the ticket.
 */
const createTicket = asyncHandler(async (req, res) => {
  const ticket = await createNewTicket(
    req.user.id,
    req.organization.id,
    req.body
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      TICKET_MESSAGES.TICKET_CREATED,
      ticket
    )
  );
});


/**
 * Get Tickets
 *
 * Ticket visibility depends on
 * the user's organization role.
 *
 * OWNER:
 * - Can view all organization tickets.
 *
 * ADMIN:
 * - Can view all organization tickets.
 *
 * AGENT:
 * - Can view all organization tickets.
 *
 * CUSTOMER:
 * - Can view only their own tickets.
 *
 * Supports:
 * - Status filtering
 * - Search
 */
const getTicketsController = asyncHandler(async (req, res) => {
  const tickets = await getTickets(
    req.user.id,
    req.organization.id,
    req.organization.role,
    req.query
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      TICKET_MESSAGES.TICKETS_FETCHED,
      tickets
    )
  );
});


/**
 * Get Ticket By ID
 *
 * OWNER:
 * - Can access any ticket in the organization.
 *
 * ADMIN:
 * - Can access any ticket in the organization.
 *
 * AGENT:
 * - Can access any ticket in the organization.
 *
 * CUSTOMER:
 * - Can access only their own ticket.
 *
 * The ticket is always restricted
 * to the currently selected organization.
 */
const getTicket = asyncHandler(async (req, res) => {
  const ticket = await getTicketById(
    req.params.id,
    req.user.id,
    req.organization.id,
    req.organization.role
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      TICKET_MESSAGES.TICKET_FETCHED,
      ticket
    )
  );
});


/**
 * Update Ticket
 *
 * OWNER:
 * - Can update any ticket in the organization.
 *
 * ADMIN:
 * - Can update any ticket in the organization.
 *
 * AGENT:
 * - Can update any ticket in the organization.
 *
 * CUSTOMER:
 * - Can update only their own ticket.
 *
 * Closed tickets cannot be edited.
 */
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await updateUserTicket(
    req.params.id,
    req.user.id,
    req.organization.id,
    req.organization.role,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      TICKET_MESSAGES.TICKET_UPDATED,
      ticket
    )
  );
});


/**
 * Close Ticket
 *
 * OWNER:
 * - Can close any ticket in the organization.
 *
 * ADMIN:
 * - Can close any ticket in the organization.
 *
 * AGENT:
 * - Can close any ticket in the organization.
 *
 * CUSTOMER:
 * - Can close only their own ticket.
 *
 * The ticket must currently be OPEN.
 */
const closeUserTicket = asyncHandler(async (req, res) => {
  const ticket = await closeTicket(
    req.params.id,
    req.user.id,
    req.organization.id,
    req.organization.role
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      TICKET_MESSAGES.TICKET_CLOSED,
      ticket
    )
  );
});


module.exports = {
  createTicket,
  getTickets: getTicketsController,
  getTicket,
  updateTicket,
  closeUserTicket,
};