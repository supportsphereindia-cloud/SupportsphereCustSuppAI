const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../shared/responses/ApiResponse");

const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("./auth.service");

const AUTH_MESSAGES = require("./auth.constants");

/**
 * Register User
 */
const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      AUTH_MESSAGES.USER_REGISTERED,
      user
    )
  );
});

/**
 * Login User
 */
const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      AUTH_MESSAGES.LOGIN_SUCCESSFUL,
      result
    )
  );
});

/**
 * Get Current Authenticated User
 */
const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);

  return res.status(200).json(
    new ApiResponse(
      200,
      "Current user fetched successfully",
      user
    )
  );
});

module.exports = {
  register,
  login,
  me,
};