import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";
import CreateOrganization from "./pages/CreateOrganization";
import OrganizationMembers from "./pages/OrganizationMembers";

import ProtectedRoute from "./routes/ProtectedRoute";
import OrganizationRoute from "./routes/OrganizationRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* Protected Routes */}

        <Route
          path="/organization/create"
          element={
            <ProtectedRoute>
              <CreateOrganization />
            </ProtectedRoute>
          }
        />

        {/* Organization Routes */}

        <Route
          path="/dashboard"
          element={
            <OrganizationRoute>
              <Dashboard />
            </OrganizationRoute>
          }
        />

        {/* Organization Members */}

        <Route
          path="/organization/members"
          element={
            <OrganizationRoute>
              <OrganizationMembers />
            </OrganizationRoute>
          }
        />

        <Route
          path="/tickets/create"
          element={
            <OrganizationRoute>
              <CreateTicket />
            </OrganizationRoute>
          }
        />

        <Route
          path="/tickets/:id"
          element={
            <OrganizationRoute>
              <TicketDetails />
            </OrganizationRoute>
          }
        />

        {/* Default Route */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        {/* Unknown Route */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;