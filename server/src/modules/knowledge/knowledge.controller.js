const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../shared/responses/ApiResponse");

const {
  uploadKnowledgeDocument,
} = require("./knowledge.service");

const {
  searchKnowledge,
} = require("./retrieval.service");

const {
  generateGroundedAnswer,
} = require("../../services/llm.service");

const {
  deleteKnowledgeDocument,
  findKnowledgeDocumentById,
  findKnowledgeDocumentsByOrganizationId,
} = require("./knowledge.repository");

const {
  createAuditLogEntry,
} = require("../audit/audit.service");


// ========================================
// Upload Knowledge Document
// ========================================

const uploadDocument = asyncHandler(
  async (req, res) => {
    const organizationId =
      req.organization.id;

    const userId =
      req.user.id;

    const document =
      await uploadKnowledgeDocument({
        organizationId,
        file: req.file,
      });


    // ========================================
    // Create Audit Log
    // ========================================

    await createAuditLogEntry({
      organizationId,
      userId,
      action: "KNOWLEDGE_DOCUMENT_UPLOADED",
      entityType: "KNOWLEDGE_DOCUMENT",
      entityId: document.id,
      metadata: {
        fileName: document.fileName,
        status: document.status,
        chunkCount: document.chunkCount,
      },
    });


    // ========================================
    // Return Uploaded Document
    // ========================================

    return res.status(201).json(
      new ApiResponse(
        201,
        "Knowledge document uploaded successfully",
        document
      )
    );
  }
);


// ========================================
// Get Knowledge Documents
// ========================================

const getKnowledgeDocuments =
  asyncHandler(
    async (req, res) => {
      const organizationId =
        req.organization.id;


      // ========================================
      // Fetch Organization Knowledge Documents
      // ========================================

      const documents =
        await findKnowledgeDocumentsByOrganizationId(
          organizationId
        );


      // ========================================
      // Return Knowledge Documents
      // ========================================

      return res.status(200).json(
        new ApiResponse(
          200,
          "Knowledge documents fetched successfully",
          documents
        )
      );
    }
  );


// ========================================
// Search Knowledge
// ========================================

const searchKnowledgeController =
  asyncHandler(
    async (req, res) => {
      const organizationId =
        req.organization.id;

      const userId =
        req.user.id;

      const {
        question,
      } = req.body;


      // ========================================
      // Retrieve Relevant Knowledge
      // ========================================

      const retrievalResult =
        await searchKnowledge({
          organizationId,
          question,
        });


      // ========================================
      // No Relevant Knowledge
      // ========================================

      if (
        !retrievalResult.hasRelevantKnowledge
      ) {

        // ========================================
        // Create Audit Log
        // ========================================

        await createAuditLogEntry({
          organizationId,
          userId,
          action: "KNOWLEDGE_QUERY_SUBMITTED",
          entityType: "KNOWLEDGE_QUERY",
          metadata: {
            questionLength:
              question.length,

            result:
              "NO_RELEVANT_KNOWLEDGE",
          },
        });


        return res.status(200).json(
          new ApiResponse(
            200,
            "No relevant company knowledge found",
            {
              answer:
                "I don't have that information in the provided company knowledge.",

              sources: [],
            }
          )
        );
      }


      // ========================================
      // Generate Grounded Answer
      // ========================================

      const answer =
        await generateGroundedAnswer({
          question,

          knowledgeChunks:
            retrievalResult.results,
        });


      // ========================================
      // Build Sources
      // ========================================

      const sources =
        retrievalResult.results.map(
          (result) => ({
            documentId:
              result.documentId,

            fileName:
              result.fileName,

            chunkIndex:
              result.chunkIndex,

            similarity:
              Number(
                result.similarity
              ),
          })
        );


      // ========================================
      // Create Audit Log
      // ========================================

      await createAuditLogEntry({
        organizationId,
        userId,
        action: "KNOWLEDGE_QUERY_SUBMITTED",
        entityType: "KNOWLEDGE_QUERY",
        metadata: {
          questionLength:
            question.length,

          result:
            "ANSWERED",

          sourceCount:
            sources.length,
        },
      });


      // ========================================
      // Return Grounded Answer
      // ========================================

      return res.status(200).json(
        new ApiResponse(
          200,
          "Knowledge answer generated successfully",
          {
            answer,

            sources,
          }
        )
      );
    }
  );


// ========================================
// Delete Knowledge Document
// ========================================

const deleteDocument = asyncHandler(
  async (req, res) => {
    const organizationId =
      req.organization.id;

    const userId =
      req.user.id;

    const {
      documentId,
    } = req.params;


    // ========================================
    // Find Knowledge Document
    // ========================================
    //
    // The organization ID is included in the
    // query to prevent cross-organization access.
    //

    const document =
      await findKnowledgeDocumentById(
        documentId,
        organizationId
      );


    // ========================================
    // Document Not Found
    // ========================================

    if (!document) {
      return res.status(404).json(
        new ApiResponse(
          404,
          "Knowledge document not found",
          null
        )
      );
    }


    // ========================================
    // Delete Knowledge Document
    // ========================================

    const result =
      await deleteKnowledgeDocument(
        documentId,
        organizationId
      );


    // ========================================
    // Verify Deletion
    // ========================================

    if (result.count === 0) {
      return res.status(404).json(
        new ApiResponse(
          404,
          "Knowledge document not found",
          null
        )
      );
    }


    // ========================================
    // Create Audit Log
    // ========================================

    await createAuditLogEntry({
      organizationId,
      userId,
      action: "KNOWLEDGE_DOCUMENT_DELETED",
      entityType: "KNOWLEDGE_DOCUMENT",
      entityId: document.id,
      metadata: {
        fileName:
          document.fileName,

        status:
          document.status,

        chunkCount:
          document.chunkCount,
      },
    });


    // ========================================
    // Return Success Response
    // ========================================

    return res.status(200).json(
      new ApiResponse(
        200,
        "Knowledge document deleted successfully",
        null
      )
    );
  }
);


// ========================================
// Exports
// ========================================

module.exports = {
  uploadDocument,
  getKnowledgeDocuments,
  searchKnowledgeController,
  deleteDocument,
};