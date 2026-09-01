// Core Packages
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

// Import Routes
const routes = require("./routes");

// Import Error Middleware
const errorHandler = require("./middleware/error.middleware");

// Create Express App
const app = express();

// =========================
// Global Middlewares
// =========================

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Secure HTTP headers
app.use(helmet());

// HTTP request logger
app.use(morgan("dev"));

// =========================
// Routes
// =========================

app.use("/api/v1", routes);

// =========================
// 404 Handler
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =========================
// Global Error Handler
// =========================

app.use(errorHandler);

// Export App
module.exports = app;