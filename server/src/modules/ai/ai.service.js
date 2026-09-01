const OpenAI = require("openai");

const ApiError = require("../../shared/errors/ApiError");

const {
  findTicketForAnalysis,
  findAIAnalysisByTicketId,
  upsertAIAnalysis,
} = require("./ai.repository");

const {
  createAuditLogEntry,
} = require("../audit/audit.service");


// ========================================
// OpenRouter Client
// ========================================

const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});


// ========================================
// Organization Roles
// ========================================
//
// These roles can analyze any ticket
// belonging to their organization.
//
// CUSTOMER can only analyze their
// own ticket.
//

const ORGANIZATION_ROLES = [
  "OWNER",
  "ADMIN",
  "AGENT",
];


// ========================================
// Get Ticket For Analysis
// ========================================

/**
 * Fetches a ticket from the current
 * organization and verifies that the
 * authenticated user is authorized to
 * analyze it.
 *
 * OWNER
 * ADMIN
 * AGENT
 *
 * Can analyze any ticket inside the
 * organization.
 *
 * CUSTOMER
 *
 * Can analyze only their own ticket.
 */
const getTicketForAnalysis = async (
  ticketId,
  userId,
  organizationId,
  userRole
) => {

  // ========================================
  // Fetch Ticket
  // ========================================

  const ticket =
    await findTicketForAnalysis(
      ticketId,
      organizationId
    );


  // ========================================
  // Ticket Not Found
  // ========================================

  if (!ticket) {
    return null;
  }


  // ========================================
  // Organization-Level Access
  // ========================================

  if (
    ORGANIZATION_ROLES.includes(
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
      "You are not authorized to access this ticket"
    );
  }


  return ticket;
};


// ========================================
// Get Existing Ticket Analysis
// ========================================

/**
 * Fetches an existing AI analysis.
 *
 * Authorization follows the same rules
 * as ticket access.
 */
const getTicketAnalysis = async (
  ticketId,
  userId,
  organizationId,
  userRole
) => {

  // ========================================
  // Fetch Ticket
  // ========================================

  const ticket =
    await findTicketForAnalysis(
      ticketId,
      organizationId
    );


  // ========================================
  // Ticket Not Found
  // ========================================

  if (!ticket) {
    return null;
  }


  // ========================================
  // Authorization Check
  // ========================================

  if (
    !ORGANIZATION_ROLES.includes(
      userRole
    ) &&
    ticket.userId !== userId
  ) {
    throw new ApiError(
      403,
      "You are not authorized to access this ticket"
    );
  }


  // ========================================
  // Fetch Existing Analysis
  // ========================================

  return findAIAnalysisByTicketId(
    ticket.id
  );
};


// ========================================
// Analyze Ticket With AI
// ========================================

/**
 * Sends ticket information to OpenRouter,
 * validates the AI response, saves the
 * analysis and creates an audit log.
 *
 * Authorization is handled before this
 * function is called.
 *
 * organizationId and userId are required
 * so the AI analysis can be recorded in
 * the organization's audit history.
 */
const analyzeTicketWithAI = async (
  ticket,
  organizationId,
  userId
) => {

  // ========================================
  // Validate Organization Context
  // ========================================

  if (!organizationId) {
    throw new ApiError(
      400,
      "Organization ID is required"
    );
  }


  // ========================================
  // Validate User Context
  // ========================================

  if (!userId) {
    throw new ApiError(
      400,
      "User ID is required"
    );
  }


  // ========================================
  // Send Ticket To OpenRouter
  // ========================================

  let response;

  try {

    response =
      await openrouter.chat.completions.create({
        model: "openrouter/free",

        messages: [
          {
            role: "system",

            content: `
You are an AI customer support analyst
for SupportSphere.

Analyze the support ticket provided by
the application.

Return ONLY valid JSON.

Do NOT use Markdown.
Do NOT use code fences.
Do NOT add any explanation before or
after the JSON.

The JSON must contain exactly these fields:

{
  "summary": "string",
  "category": "string",
  "priority": "LOW",
  "sentiment": "NEUTRAL",
  "rootCause": "string",
  "suggestedResolution": "string",
  "customerResponse": "string",
  "recommendedNextAction": "string"
}

Allowed priority values:

LOW
MEDIUM
HIGH
CRITICAL

Allowed sentiment values:

POSITIVE
NEUTRAL
NEGATIVE
FRUSTRATED

Rules:

1. Do not invent facts that are not
   present in the ticket.

2. If the root cause cannot be determined,
   say that further investigation is required.

3. Keep the analysis concise and useful
   for a support agent.

4. The customer response must be
   professional and empathetic.

5. Return JSON only.
            `,
          },

          {
            role: "user",

            content: `
Analyze this SupportSphere ticket.

Ticket ID:
${ticket.id}

Title:
${ticket.title}

Description:
${ticket.description}

Current Status:
${ticket.status}
            `,
          },
        ],
      });

  } catch (error) {

    // ========================================
    // OpenRouter Error
    // ========================================

    console.error(
      "OpenRouter API error:",
      error
    );

    throw new ApiError(
      502,
      "AI provider is currently unavailable"
    );
  }


  // ========================================
  // Extract AI Response
  // ========================================

  const content =
    response?.choices?.[0]?.message?.content;


  if (!content) {

    console.error(
      "OpenRouter returned an empty response:",
      response
    );

    throw new ApiError(
      502,
      "AI provider returned an empty response"
    );
  }


  // ========================================
  // Log Raw Response
  // ========================================

  console.log(
    "\n========== RAW AI RESPONSE ==========\n"
  );

  console.log(content);

  console.log(
    "\n=====================================\n"
  );


  // ========================================
  // Clean AI Response
  // ========================================

  let cleanedContent =
    content.trim();


  // Remove Markdown JSON fences if
  // the provider returns them despite
  // the system instruction.

  cleanedContent =
    cleanedContent.replace(
      /^```json\s*/i,
      ""
    );

  cleanedContent =
    cleanedContent.replace(
      /^```\s*/i,
      ""
    );

  cleanedContent =
    cleanedContent.replace(
      /\s*```$/i,
      ""
    );

  cleanedContent =
    cleanedContent.trim();


  // ========================================
  // Parse AI JSON
  // ========================================

  let analysis;


  // ========================================
  // Attempt 1: Parse Entire Response
  // ========================================

  try {

    analysis =
      JSON.parse(
        cleanedContent
      );

  } catch (error) {

    // ======================================
    // Attempt 2: Extract JSON Object
    // ======================================

    const firstBrace =
      cleanedContent.indexOf("{");

    const lastBrace =
      cleanedContent.lastIndexOf("}");


    if (
      firstBrace !== -1 &&
      lastBrace !== -1 &&
      lastBrace > firstBrace
    ) {

      const possibleJson =
        cleanedContent.slice(
          firstBrace,
          lastBrace + 1
        );


      try {

        analysis =
          JSON.parse(
            possibleJson
          );

      } catch (parseError) {

        analysis = null;
      }
    }
  }


  // ========================================
  // Validate JSON
  // ========================================

  if (!analysis) {

    console.error(
      "Invalid AI JSON response:"
    );

    console.error(
      cleanedContent
    );

    throw new ApiError(
      502,
      "AI provider returned invalid JSON"
    );
  }


  // ========================================
  // Validate Required Fields
  // ========================================

  const requiredFields = [
    "summary",
    "category",
    "priority",
    "sentiment",
    "rootCause",
    "suggestedResolution",
    "customerResponse",
    "recommendedNextAction",
  ];


  const missingFields =
    requiredFields.filter(
      (field) =>
        typeof analysis[field] !== "string"
    );


  if (
    missingFields.length > 0
  ) {

    console.error(
      "AI response is missing required fields:",
      missingFields
    );

    throw new ApiError(
      502,
      "AI provider returned incomplete analysis"
    );
  }


  // ========================================
  // Validate Priority
  // ========================================

  const allowedPriorities = [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL",
  ];


  if (
    !allowedPriorities.includes(
      analysis.priority
    )
  ) {

    throw new ApiError(
      502,
      "AI provider returned an invalid priority"
    );
  }


  // ========================================
  // Validate Sentiment
  // ========================================

  const allowedSentiments = [
    "POSITIVE",
    "NEUTRAL",
    "NEGATIVE",
    "FRUSTRATED",
  ];


  if (
    !allowedSentiments.includes(
      analysis.sentiment
    )
  ) {

    throw new ApiError(
      502,
      "AI provider returned an invalid sentiment"
    );
  }


  // ========================================
  // Save AI Analysis
  // ========================================

  let savedAnalysis;

  try {

    savedAnalysis =
      await upsertAIAnalysis(
        ticket.id,
        analysis
      );

  } catch (error) {

    console.error(
      "Failed to save AI analysis:",
      error
    );

    throw error;
  }


  // ========================================
  // Create Audit Log
  // ========================================

  await createAuditLogEntry({
    organizationId,
    userId,

    action: "AI_ANALYSIS_CREATED",

    entityType: "AI_ANALYSIS",

    entityId: savedAnalysis.id,

    metadata: {
      ticketId: ticket.id,
      ticketTitle: ticket.title,
      priority: savedAnalysis.priority,
      sentiment: savedAnalysis.sentiment,
      category: savedAnalysis.category,
    },
  });


  // ========================================
  // Return Saved Analysis
  // ========================================

  return {
    id: savedAnalysis.id,

    ticketId:
      savedAnalysis.ticketId,

    summary:
      savedAnalysis.summary,

    category:
      savedAnalysis.category,

    priority:
      savedAnalysis.priority,

    sentiment:
      savedAnalysis.sentiment,

    rootCause:
      savedAnalysis.rootCause,

    suggestedResolution:
      savedAnalysis.suggestedResolution,

    customerResponse:
      savedAnalysis.customerResponse,

    recommendedNextAction:
      savedAnalysis.recommendedNextAction,

    createdAt:
      savedAnalysis.createdAt,

    updatedAt:
      savedAnalysis.updatedAt,
  };
};


// ========================================
// Exports
// ========================================

module.exports = {
  getTicketForAnalysis,
  getTicketAnalysis,
  analyzeTicketWithAI,
};