const prisma = require("../../config/prisma");


// ========================================
// Find Ticket For AI Analysis
// ========================================

/**
 * Finds a ticket inside the current
 * organization.
 *
 * The organization ID is mandatory here
 * to prevent cross-organization access.
 */
const findTicketForAnalysis = async (
  ticketId,
  organizationId
) => {
  return prisma.ticket.findFirst({
    where: {
      id: ticketId,
      organizationId,
    },

    select: {
      id: true,
      title: true,
      description: true,
      status: true,
      userId: true,
      organizationId: true,
    },
  });
};


// ========================================
// Find Existing AI Analysis
// ========================================

/**
 * Finds the existing AI analysis
 * belonging to a ticket.
 *
 * ticketId is unique in the database,
 * therefore findUnique is appropriate.
 */
const findAIAnalysisByTicketId = async (
  ticketId
) => {
  return prisma.aIAnalysis.findUnique({
    where: {
      ticketId,
    },
  });
};


// ========================================
// Create Or Update AI Analysis
// ========================================

/**
 * Creates a new AI analysis or updates
 * the existing analysis for a ticket.
 *
 * Each ticket can have only one AI
 * analysis because ticketId is unique.
 */
const upsertAIAnalysis = async (
  ticketId,
  analysis
) => {
  return prisma.aIAnalysis.upsert({
    where: {
      ticketId,
    },

    update: {
      summary:
        analysis.summary,

      category:
        analysis.category,

      priority:
        analysis.priority,

      sentiment:
        analysis.sentiment,

      rootCause:
        analysis.rootCause,

      suggestedResolution:
        analysis.suggestedResolution,

      customerResponse:
        analysis.customerResponse,

      recommendedNextAction:
        analysis.recommendedNextAction,
    },

    create: {
      ticketId,

      summary:
        analysis.summary,

      category:
        analysis.category,

      priority:
        analysis.priority,

      sentiment:
        analysis.sentiment,

      rootCause:
        analysis.rootCause,

      suggestedResolution:
        analysis.suggestedResolution,

      customerResponse:
        analysis.customerResponse,

      recommendedNextAction:
        analysis.recommendedNextAction,
    },
  });
};


// ========================================
// Exports
// ========================================

module.exports = {
  findTicketForAnalysis,
  findAIAnalysisByTicketId,
  upsertAIAnalysis,
};