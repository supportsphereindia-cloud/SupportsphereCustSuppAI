const ApiError = require("../shared/errors/ApiError");

const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return next(
        new ApiError(
          400,
          "Validation failed",
          errors
        )
      );
    }

    // Replace only the validated request parts
    if (result.data.body !== undefined) {
      req.body = result.data.body;
    }

    if (result.data.params !== undefined) {
      req.params = result.data.params;
    }

    if (result.data.query !== undefined) {
      req.query = result.data.query;
    }

    next();
  };
};

module.exports = validate;