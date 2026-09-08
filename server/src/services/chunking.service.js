// ========================================
// Text Chunking Configuration
// ========================================

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_CHUNK_OVERLAP = 200;


// ========================================
// Split Text Into Chunks
// ========================================

const chunkText = (
  text,
  chunkSize = DEFAULT_CHUNK_SIZE,
  chunkOverlap = DEFAULT_CHUNK_OVERLAP
) => {
  if (!text || typeof text !== "string") {
    throw new Error(
      "Text is required for chunking"
    );
  }

  if (
    chunkSize <= 0 ||
    chunkOverlap < 0 ||
    chunkOverlap >= chunkSize
  ) {
    throw new Error(
      "Invalid chunk size or overlap"
    );
  }

  const chunks = [];

  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(
      startIndex + chunkSize,
      text.length
    );

    const chunk = text
      .slice(startIndex, endIndex)
      .trim();

    if (chunk) {
      chunks.push(chunk);
    }

    if (endIndex >= text.length) {
      break;
    }

    startIndex =
      endIndex - chunkOverlap;
  }

  return chunks;
};


// ========================================
// Exports
// ========================================

module.exports = {
  chunkText,
};