// Load Environment Variables
require("dotenv").config();

// Import Express App
const app = require("./app");

// Application Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log("=================================");
  console.log("🚀 SupportSphere Backend Started");
  console.log(`🌐 Server Running on port ${PORT}`);
  console.log(`🟢 Environment    : ${process.env.NODE_ENV}`);
  console.log("=================================");
});