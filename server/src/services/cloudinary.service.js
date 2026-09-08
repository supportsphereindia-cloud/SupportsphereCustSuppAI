const cloudinary = require("../config/cloudinary");


// ========================================
// Upload PDF to Cloudinary
// ========================================

const uploadPdfToCloudinary = (
  fileBuffer,
  organizationId,
  fileName
) => {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: `supportsphere/organizations/${organizationId}/knowledge`,
          public_id: fileName.replace(
            /\.pdf$/i,
            ""
          ),
          format: "pdf",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        }
      );

    uploadStream.end(fileBuffer);
  });
};


// ========================================
// Delete PDF From Cloudinary
// ========================================

const deletePdfFromCloudinary = async (
  publicId
) => {
  return cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: "raw",
    }
  );
};


// ========================================
// Exports
// ========================================

module.exports = {
  uploadPdfToCloudinary,
  deletePdfFromCloudinary,
};