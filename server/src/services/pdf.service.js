const { PDFParse } = require("pdf-parse");


// ========================================
// Extract Text From PDF
// ========================================

const extractTextFromPdf = async (
  fileBuffer
) => {
  if (!fileBuffer) {
    throw new Error("PDF file buffer is required");
  }

  const parser = new PDFParse({
    data: fileBuffer,
  });

  const result = await parser.getText();

  await parser.destroy();

  return result.text;
};


// ========================================
// Exports
// ========================================

module.exports = {
  extractTextFromPdf,
};