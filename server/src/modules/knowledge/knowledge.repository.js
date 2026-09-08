const prisma = require("../../config/prisma");


// ========================================
// Create Knowledge Document
// ========================================

const createKnowledgeDocument = async ({
  organizationId,
  fileName,
  fileUrl,
}) => {
  return prisma.knowledgeDocument.create({
    data: {
      organizationId,
      fileName,
      fileUrl,
      status: "PROCESSING",
    },
  });
};


// ========================================
// Find Knowledge Document By ID
// ========================================

const findKnowledgeDocumentById = async (
  documentId,
  organizationId
) => {
  return prisma.knowledgeDocument.findFirst({
    where: {
      id: documentId,
      organizationId,
    },
  });
};


// ========================================
// Update Knowledge Document Status
// ========================================

const updateKnowledgeDocumentStatus = async (
  documentId,
  status,
  chunkCount = undefined
) => {
  const data = {
    status,
  };

  if (chunkCount !== undefined) {
    data.chunkCount = chunkCount;
  }

  return prisma.knowledgeDocument.update({
    where: {
      id: documentId,
    },
    data,
  });
};


// ========================================
// Get Organization Knowledge Documents
// ========================================

const findKnowledgeDocumentsByOrganizationId =
  async (organizationId) => {
    return prisma.knowledgeDocument.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  };


// ========================================
// Delete Knowledge Document
// ========================================

const deleteKnowledgeDocument = async (
  documentId,
  organizationId
) => {
  return prisma.knowledgeDocument.deleteMany({
    where: {
      id: documentId,
      organizationId,
    },
  });
};


// ========================================
// Create Knowledge Chunks
// ========================================

const createKnowledgeChunks = async (
  documentId,
  chunks
) => {
  return prisma.knowledgeChunk.createMany({
    data: chunks.map((content, index) => ({
      documentId,
      content,
      chunkIndex: index,
    })),
  });
};


// ========================================
// Find Knowledge Chunks By Document ID
// ========================================

const findKnowledgeChunksByDocumentId = async (
  documentId
) => {
  return prisma.knowledgeChunk.findMany({
    where: {
      documentId,
    },
    orderBy: {
      chunkIndex: "asc",
    },
  });
};


// ========================================
// Update Knowledge Chunk Embedding
// ========================================

const updateKnowledgeChunkEmbedding = async (
  chunkId,
  embedding
) => {
  const vectorString =
    `[${embedding.join(",")}]`;

  return prisma.$executeRaw`
    UPDATE "KnowledgeChunk"
    SET "embedding" = ${vectorString}::vector
    WHERE "id" = ${chunkId}
  `;
};


// ========================================
// Search Knowledge Chunks
// ========================================

const searchKnowledgeChunks = async (
  organizationId,
  embedding,
  topK = 5
) => {
  const vectorString =
    `[${embedding.join(",")}]`;

  return prisma.$queryRaw`
    SELECT
      kc.id,
      kc."documentId",
      kc.content,
      kc."chunkIndex",
      kd."fileName",
      1 - (
        kc.embedding <=> ${vectorString}::vector
      ) AS similarity
    FROM "KnowledgeChunk" kc
    INNER JOIN "KnowledgeDocument" kd
      ON kd.id = kc."documentId"
    WHERE kd."organizationId" = ${organizationId}
      AND kd.status = 'READY'
      AND kc.embedding IS NOT NULL
    ORDER BY kc.embedding <=> ${vectorString}::vector
    LIMIT ${topK}
  `;
};


// ========================================
// Exports
// ========================================

module.exports = {
  createKnowledgeDocument,
  findKnowledgeDocumentById,
  updateKnowledgeDocumentStatus,
  findKnowledgeDocumentsByOrganizationId,
  deleteKnowledgeDocument,
  createKnowledgeChunks,
  findKnowledgeChunksByDocumentId,
  updateKnowledgeChunkEmbedding,
  searchKnowledgeChunks,
};