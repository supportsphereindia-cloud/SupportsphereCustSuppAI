const express = require("express");

const ApiError = require("../shared/errors/ApiError");
const ApiResponse = require("../shared/responses/ApiResponse");

const validate = require("../middleware/validate.middleware");
const { registerSchema } = require("../modules/auth/auth.validation");

const router = express.Router();

// =========================
// Health Check
// =========================

router.get("/health", (req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      "SupportSphere API is running 🚀",
      {
        timestamp: new Date().toISOString(),
      }
    )
  );
});

// =========================
// Error Test
// =========================

router.get("/error", (req, res, next) => {
  next(new ApiError(400, "This is a test error"));
});

// =========================
// Validation Test
// =========================

router.post(
  "/validate",
  validate(registerSchema),
  (req, res) => {
    res.status(200).json(
      new ApiResponse(
        200,
        "Validation successful",
        req.body
      )
    );
  }
);

module.exports = router;