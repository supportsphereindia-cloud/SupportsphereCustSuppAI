const multer = require("multer");


// ========================================
// Multer Configuration
// ========================================

const storage = multer.memoryStorage();


// ========================================
// PDF File Filter
// ========================================

const fileFilter = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(
      new Error("Only PDF files are allowed")
    );
  }

  cb(null, true);
};


// ========================================
// Upload Configuration
// ========================================

const uploadPdf = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});


// ========================================
// Exports
// ========================================

module.exports = {
  uploadPdf,
};