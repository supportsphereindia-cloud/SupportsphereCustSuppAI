const {
  getTicketForAnalysis,
  getTicketAnalysis,
  analyzeTicketWithAI,
} = require("./ai.service");

const ApiError = require("../../shared/errors/ApiError");
const ApiResponse = require("../../shared/responses/ApiResponse");


// ========================================
// Analyze Ticket
// ========================================

/**
 * Analyze a ticket using AI.
 *
 * Authentication and organization context
 * are provided by middleware.
 *
 * The service is responsible for:
 *
 * - Ticket authorization
 * - Sending ticket data to OpenRouter
 * - Validating the AI response
 * - Saving the AI analysis
 * - Creating the audit log
 */
const analyzeTicket = async (
  req,
  res,
  next
) => {
  try {

    // ========================================
    // Get Ticket ID
    // ========================================

    const { id } = req.params;


    // ========================================
    // Get Authentication Context
    // ========================================

    const userId =
      req.user.id;

    const organizationId =
      req.organization.id;

    const userRole =
      req.organization.role;


    // ========================================
    // Fetch Ticket
    // ========================================

    const ticket =
      await getTicketForAnalysis(
        id,
        userId,
        organizationId,
        userRole
      );


    // ========================================
    // Ticket Not Found
    // ========================================

    if (!ticket) {
      throw new ApiError(
        404,
        "Ticket not found"
      );
    }


    // ========================================
    // Analyze Ticket With AI
    // ========================================

    const analysis =
      await analyzeTicketWithAI(
        ticket,
        organizationId,
        userId
      );


    // ========================================
    // Return Analysis
    // ========================================

    return res.status(200).json(
      new ApiResponse(
        200,
        "Ticket analyzed successfully",
        analysis
      )
    );

  } catch (error) {

    next(error);

  }
};


// ========================================
// Get Existing Ticket Analysis
// ========================================

/**
 * Returns the existing AI analysis
 * for a ticket.
 *
 * Authentication and organization
 * authorization are handled through
 * middleware and the service layer.
 */
const getAnalysis = async (
  req,
  res,
  next
) => {
  try {

    // ========================================
    // Get Ticket ID
    // ========================================

    const { id } = req.params;


    // ========================================
    // Get Authentication Context
    // ========================================

    const userId =
      req.user.id;

    const organizationId =
      req.organization.id;

    const userRole =
      req.organization.role;


    // ========================================
    // Fetch Existing Analysis
    // ========================================

    const analysis =
      await getTicketAnalysis(
        id,
        userId,
        organizationId,
        userRole
      );


    // ========================================
    // Analysis Not Found
    // ========================================

    if (!analysis) {
      throw new ApiError(
        404,
        "AI analysis not found for this ticket"
      );
    }


    // ========================================
    // Return Existing Analysis
    // ========================================

    return res.status(200).json(
      new ApiResponse(
        200,
        "Ticket analysis retrieved successfully",
        analysis
      )
    );

  } catch (error) {

    next(error);

  }
};


// ========================================
// Exports
// ========================================

module.exports = {
  analyzeTicket,
  getAnalysis,
}