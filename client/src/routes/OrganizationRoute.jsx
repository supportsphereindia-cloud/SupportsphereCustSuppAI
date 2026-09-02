import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const OrganizationRoute = ({ children }) => {
  const {
    isAuthenticated,
    loading,
    activeOrganizationId,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <p className="text-slate-400">
          Loading...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!activeOrganizationId) {
    return (
      <Navigate
        to="/organization/create"
        replace
      />
    );
  }

  return children;
};

export default OrganizationRoute;