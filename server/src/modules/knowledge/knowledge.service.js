const {
  createKnowledgeDocument,
  createKnowledgeChunks,
  updateKnowledgeDocumentStatus,
  findKnowledgeChunksByDocumentId,
  updateKnowledgeChunkEmbedding,
} = require("./knowledge.repository");

const {
  uploadPdfToCloudinary,
} = require("../../services/cloudinary.service");

const {
  extractTextFromPdf,
} = require("../../services/pdf.service");

const {
  chunkText,
} = require("../../services/chunking.service");

const {
  generateEmbeddings,
} = require("../../services/embedding.service");


// ========================================
// Upload Knowledge Document
// ========================================

const uploadKnowledgeDocument = async ({
  organizationId,
  file,
}) => {
  if (!file) {
    throw new Error("PDF file is required");
  }

  // Upload the PDF to Cloudinary
  const cloudinaryResult =
    await uploadPdfToCloudinary(
      file.buffer,
      organizationId,
      file.originalname
    );

  // Create the knowledge document record
  const document =
    await createKnowledgeDocument({
      organizationId,
      fileName: file.originalname,
      fileUrl: cloudinaryResult.secure_url,
    });

  try {
    // Extract text from the uploaded PDF
    const extractedText =
      await extractTextFromPdf(
        file.buffer
      );

    // Split the extracted text into searchable chunks
    const chunks =
      chunkText(extractedText);

    if (chunks.length === 0) {
      throw new Error(
        "No text could be extracted from the PDF"
      );
    }

    // Save all extracted chunks for this document
    await createKnowledgeChunks(
      document.id,
      chunks
    );

    // Fetch the saved chunks so their database IDs can be used
    // when storing the generated embeddings
    const knowledgeChunks =
      await findKnowledgeChunksByDocumentId(
        document.id
      );

    // Generate embeddings for all chunks in a single API request
    const embeddings =
      await generateEmbeddings(
        knowledgeChunks.map(
          (chunk) => chunk.content
        )
      );

    if (
      embeddings.length !==
      knowledgeChunks.length
    ) {
      throw new Error(
        "Embedding count does not match knowledge chunk count"
      );
    }

    // Save each generated embedding against its corresponding chunk
    for (
      let index = 0;
      index < knowledgeChunks.length;
      index++
    ) {
      await updateKnowledgeChunkEmbedding(
        knowledgeChunks[index].id,
        embeddings[index]
      );
    }

    // Mark the document as ready only after
    // all chunks and embeddings are successfully processed
    const updatedDocument =
      await updateKnowledgeDocumentStatus(
        document.id,
        "READY",
        chunks.length
      );

    return updatedDocument;
  } catch (error) {
    // Mark the document as failed if any processing step fails
    await updateKnowledgeDocumentStatus(
      document.id,
      "FAILED"
    );

    throw error;
  }
};


// ========================================
// Exports
// ========================================

module.exports = {
  uploadKnowledgeDocument,
};