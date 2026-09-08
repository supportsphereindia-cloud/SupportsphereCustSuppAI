const {
  searchKnowledgeChunks,
} = require("./knowledge.repository");

const {
  generateEmbeddings,
} = require("../../services/embedding.service");


// ========================================
// Retrieval Configuration
// ========================================

const DEFAULT_TOP_K = 5;

const DEFAULT_SIMILARITY_THRESHOLD = 0.45;


// ========================================
// Search Knowledge
// ========================================

const searchKnowledge = async ({
  organizationId,
  question,
  topK = DEFAULT_TOP_K,
  similarityThreshold =
    DEFAULT_SIMILARITY_THRESHOLD,
}) => {
  if (!organizationId) {
    throw new Error(
      "Organization ID is required"
    );
  }

  if (
    !question ||
    typeof question !== "string" ||
    !question.trim()
  ) {
    throw new Error(
      "Question is required"
    );
  }


  // ========================================
  // Generate Question Embedding
  // ========================================

  const embeddings =
    await generateEmbeddings([
      question.trim(),
    ]);

  if (
    !embeddings ||
    embeddings.length !== 1
  ) {
    throw new Error(
      "Failed to generate question embedding"
    );
  }


  // ========================================
  // Search Organization Knowledge
  // ========================================

  const results =
    await searchKnowledgeChunks(
      organizationId,
      embeddings[0],
      topK
    );


  // ========================================
  // Apply Similarity Threshold
  // ========================================

  const relevantResults =
    results.filter(
      (result) =>
        Number(result.similarity) >=
        similarityThreshold
    );


  // ========================================
  // Return Retrieval Result
  // ========================================

  return {
    results: relevantResults,

    hasRelevantKnowledge:
      relevantResults.length > 0,
  };
};


// ========================================
// Exports
// ========================================

module.exports = {
  searchKnowledge,
};