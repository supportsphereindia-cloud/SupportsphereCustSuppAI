const { z } = require("zod");


// ========================================
// Upload Knowledge Document Validation
// ========================================

const uploadKnowledgeDocumentSchema =
  z.object({
    body: z.object({}),
    params: z.object({}),
    query: z.object({}),
  });


// ========================================
// Search Knowledge Validation
// ========================================

const searchKnowledgeSchema =
  z.object({
    body: z.object({
      question: z
        .string()
        .trim()
        .min(
          1,
          "Question is required"
        )
        .max(
          1000,
          "Question must not exceed 1000 characters"
        ),
    }),

    params: z.object({}),

    query: z.object({}),
  });


// ========================================
// Exports
// ========================================

module.exports = {
  uploadKnowledgeDocumentSchema,
  searchKnowledgeSchema,
};