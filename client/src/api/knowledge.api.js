import api from "./axios";


// ========================================
// Get Knowledge Documents
// ========================================

/**
 * Get all knowledge documents
 *
 * Calls:
 *
 * GET /api/v1/knowledge
 *
 * The backend automatically scopes the request
 * to the active organization using the
 * X-Organization-Id header.
 */
export const getKnowledgeDocuments =
  async () => {
    const response = await api.get(
      "/knowledge"
    );

    return response.data;
  };


// ========================================
// Upload Knowledge Document
// ========================================

/**
 * Upload a company knowledge PDF
 *
 * Calls:
 *
 * POST /api/v1/knowledge
 *
 * Uses multipart/form-data because the
 * request contains a PDF file.
 */
export const uploadKnowledgeDocument =
  async (file) => {
    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    const response = await api.post(
      "/knowledge",
      formData
    );

    return response.data;
  };


// ========================================
// Search Company Knowledge
// ========================================

/**
 * Search company knowledge and generate
 * a grounded AI answer.
 *
 * Calls:
 *
 * POST /api/v1/knowledge/search
 */
export const searchKnowledge = async (
  question
) => {
  const response = await api.post(
    "/knowledge/search",
    {
      question,
    }
  );

  return response.data;
};


// ========================================
// Delete Knowledge Document
// ========================================

/**
 * Delete a knowledge document
 *
 * Calls:
 *
 * DELETE /api/v1/knowledge/:documentId
 */
export const deleteKnowledgeDocument =
  async (documentId) => {
    const response = await api.delete(
      `/knowledge/${documentId}`
    );

    return response.data;
  };