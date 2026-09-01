const express = require("express");

const authMiddleware = require("../../middleware/auth.middleware");
const organizationMiddleware = require("../../middleware/organization.middleware");
const validate = require("../../middleware/validate.middleware");

const {
  createTicketSchema,
  updateTicketSchema,
  filterTicketsSchema,
  ticketIdSchema,
} = require("./ticket.validation");

const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  closeUserTicket,
} = require("./ticket.controller");

const router = express.Router();


/**
 * =====================================================
 * CREATE TICKET
 * =====================================================
 *
 * Authentication
 *      ↓
 * Organization Context
 *      ↓
 * Validation
 *      ↓
 * Controller
 *
 * Any authenticated member of the
 * organization can create a ticket.
 */
router.post(
  "/",
  authMiddleware,
  organizationMiddleware,
  validate(createTicketSchema),
  createTicket
);


/**
 * =====================================================
 * GET TICKETS
 * =====================================================
 *
 * Ticket visibility depends on
 * the user's organization role.
 *
 * OWNER
 * ADMIN
 * AGENT
 *      ↓
 * Can view all tickets in the
 * current organization.
 *
 * CUSTOMER
 *      ↓
 * Can view only their own tickets.
 *
 * Supports:
 *
 * GET /tickets
 * GET /tickets?status=OPEN
 * GET /tickets?status=CLOSED
 * GET /tickets?search=payment
 *
 * Authentication
 *      ↓
 * Organization Context
 *      ↓
 * Validation
 *      ↓
 * Controller
 *      ↓
 * Role-based Service Logic
 */
router.get(
  "/",
  authMiddleware,
  organizationMiddleware,
  validate(filterTicketsSchema),
  getTickets
);


/**
 * =====================================================
 * GET TICKET BY ID
 * =====================================================
 *
 * OWNER
 * ADMIN
 * AGENT
 *      ↓
 * Can access any ticket belonging
 * to the current organization.
 *
 * CUSTOMER
 *      ↓
 * Can access only their own ticket.
 *
 * Organization middleware prevents
 * cross-organization access.
 */
router.get(
  "/:id",
  authMiddleware,
  organizationMiddleware,
  validate(ticketIdSchema),
  getTicket
);


/**
 * =====================================================
 * UPDATE TICKET
 * =====================================================
 *
 * OWNER
 * ADMIN
 * AGENT
 *      ↓
 * Can update any ticket in the
 * current organization.
 *
 * CUSTOMER
 *      ↓
 * Can update only their own ticket.
 *
 * Closed tickets cannot be edited.
 */
router.patch(
  "/:id",
  authMiddleware,
  organizationMiddleware,
  validate(updateTicketSchema),
  updateTicket
);


/**
 * =====================================================
 * CLOSE TICKET
 * =====================================================
 *
 * OWNER
 * ADMIN
 * AGENT
 *      ↓
 * Can close any ticket in the
 * current organization.
 *
 * CUSTOMER
 *      ↓
 * Can close only their own ticket.
 *
 * Only OPEN tickets can be closed.
 */
router.patch(
  "/:id/close",
  authMiddleware,
  organizationMiddleware,
  validate(ticketIdSchema),
  closeUserTicket
);


module.exports = router;