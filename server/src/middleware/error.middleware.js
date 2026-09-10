const errorHandler = (err, req, res, next) => {
  console.error("=================================");
  console.error("SupportSphere Error");
  console.error("Method:", req.method);
  console.error("Path:", req.originalUrl);
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  console.error("=================================");

  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    statusCode,
    message:
      process.env.NODE_ENV === "production" &&
      statusCode === 500
        ? "Internal Server Error"
        : err.message || "Internal Server Error",
    errors: err.errors || [],
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;