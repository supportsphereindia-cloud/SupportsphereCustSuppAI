const express = require("express");

const healthRoutes = require("./health.routes");

const authRoutes = require("../modules/auth/auth.routes");

const ticketRoutes = require("../modules/ticket/ticket.routes");

const aiRoutes = require("../modules/ai/ai.routes");

const organizationRoutes = require(
  "../modules/organization/organization.routes"
);

const userRoutes = require(
  "../modules/user/user.routes"
);

const dashboardRoutes = require(
  "../modules/dashboard/dashboard.routes"
);

const auditRoutes = require(
  "../modules/audit/audit.routes"
);

const router = express.Router();


// =====================================================
// Health Routes
// =====================================================

router.use(
  healthRoutes
);


// =====================================================
// Auth Routes
// =====================================================

router.use(
  "/auth",
  authRoutes
);


// =====================================================
// Ticket Routes
// =====================================================

router.use(
  "/tickets",
  ticketRoutes
);


// =====================================================
// AI Routes
// =====================================================

router.use(
  "/ai",
  aiRoutes
);


// =====================================================
// Organization Routes
// =====================================================

router.use(
  "/organizations",
  organizationRoutes
);


// =====================================================
// User Routes
// =====================================================

router.use(
  "/users",
  userRoutes
);


// =====================================================
// Dashboard Routes
// =====================================================

router.use(
  "/dashboard",
  dashboardRoutes
);


// =====================================================
// Audit Routes
// =====================================================

router.use(
  "/audit",
  auditRoutes
);


module.exports = router;