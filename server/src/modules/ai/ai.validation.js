const { z } = require("zod");


// ========================================
// Analyze Ticket Validation
// ========================================

/**
 * Validates the ticket ID used when
 * requesting an AI analysis.
 *
 * Expected request:
 *
 * POST /ai/tickets/:id/analyze
 *
 * The ticket ID must be a valid
 * Prisma CUID.
 */
const analyzeTicketSchema = z.object({

  params: z.object({

    id: z.string().cuid(
      "Invalid ticket ID"
    ),

  }),

});


// ========================================
// Exports
// ========================================

module.exports = {
  analyzeTicketSchema,
};
