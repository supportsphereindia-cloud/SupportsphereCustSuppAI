import api from "./axios";


// ========================================
// Get All Tickets
// ========================================

/**
 * Get all tickets
 *
 * Optional query parameters:
 *
 * - status = OPEN | CLOSED
 * - search = search text
 */
export const getTickets = async ({
  status,
  search,
} = {}) => {
  const params = {};

  if (status && status !== "ALL") {
    params.status = status;
  }

  if (search?.trim()) {
    params.search = search.trim();
  }

  const response = await api.get(
    "/tickets",
    {
      params,
    }
  );

  return response.data;
};


// ========================================
// Get Ticket By ID
// ========================================

/**
 * Get ticket by ID
 */
export const getTicketById = async (
  ticketId
) => {
  const response = await api.get(
    `/tickets/${ticketId}`
  );

  return response.data;
};


// ========================================
// Create Ticket
// ========================================

/**
 * Create a new ticket
 */
export const createTicket = async (
  ticketData
) => {
  const response = await api.post(
    "/tickets",
    ticketData
  );

  return response.data;
};


// ========================================
// Update Ticket
// ========================================

/**
 * Update ticket
 */
export const updateTicket = async (
  ticketId,
  ticketData
) => {
  const response = await api.patch(
    `/tickets/${ticketId}`,
    ticketData
  );

  return response.data;
};


// ========================================
// Close Ticket
// ========================================

/**
 * Close ticket
 */
export const closeTicket = async (
  ticketId
) => {
  const response = await api.patch(
    `/tickets/${ticketId}/close`
  );

  return response.data;
};


// ========================================
// Analyze Ticket With AI
// ========================================

/**
 * Analyze ticket with AI
 *
 * Calls:
 *
 * POST /api/v1/ai/tickets/:id/analyze
 *
 * This endpoint:
 *
 * 1. Fetches the ticket
 * 2. Sends it to OpenRouter
 * 3. Generates AI analysis
 * 4. Creates or updates the AIAnalysis record
 * 5. Returns the saved analysis
 */
export const analyzeTicket = async (
  ticketId
) => {
  const response = await api.post(
    `/ai/tickets/${ticketId}/analyze`
  );

  return response.data;
};


// ========================================
// Get Existing AI Analysis
// ========================================

/**
 * Get existing AI analysis for a ticket
 *
 * Calls:
 *
 * GET /api/v1/ai/tickets/:id/analysis
 *
 * This endpoint does NOT call OpenRouter.
 *
 * It retrieves the analysis that is already
 * stored in the AIAnalysis table.
 *
 * If the ticket has never been analyzed,
 * the backend returns 404.
 */
export const getTicketAnalysis = async (
  ticketId
) => {
  const response = await api.get(
    `/ai/tickets/${ticketId}/analysis`
  );

  return response.data;
};