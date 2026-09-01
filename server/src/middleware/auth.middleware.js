const jwt = require("jsonwebtoken");

const ApiError = require("../shared/errors/ApiError");
const AUTH_MESSAGES = require("../modules/auth/auth.constants");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(401, AUTH_MESSAGES.UNAUTHORIZED)
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return next(
      new ApiError(401, AUTH_MESSAGES.UNAUTHORIZED)
    );
  }
};

module.exports = authMiddleware;