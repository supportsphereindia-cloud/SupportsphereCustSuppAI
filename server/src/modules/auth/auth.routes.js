const express = require("express");

const validate = require("../../middleware/validate.middleware");
const authMiddleware = require("../../middleware/auth.middleware");

const {
  registerSchema,
  loginSchema,
} = require("./auth.validation");

const {
  register,
  login,
  me,
} = require("./auth.controller");

const router = express.Router();

/**
 * Register
 */
router.post(
  "/register",
  validate(registerSchema),
  register
);

/**
 * Login
 */
router.post(
  "/login",
  validate(loginSchema),
  login
);

/**
 * Get Current Authenticated User
 */
router.get(
  "/me",
  authMiddleware,
  me
);

module.exports = router;