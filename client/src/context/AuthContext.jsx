import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  getCurrentUser,
} from "../api/auth.api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    localStorage.getItem("accessToken")
  );

  const [activeOrganizationId, setActiveOrganizationId] =
    useState(
      localStorage.getItem("activeOrganizationId")
    );

  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await getCurrentUser();

      const currentUser = response.data;

      setUser(currentUser);

      const memberships =
        currentUser.memberships || [];

      const storedOrganizationId =
        localStorage.getItem(
          "activeOrganizationId"
        );

      const organizationExists =
        memberships.some(
          (membership) =>
            membership.organizationId ===
            storedOrganizationId
        );

      if (
        storedOrganizationId &&
        organizationExists
      ) {
        setActiveOrganizationId(
          storedOrganizationId
        );
      } else if (memberships.length > 0) {
        const organizationId =
          memberships[0].organizationId;

        localStorage.setItem(
          "activeOrganizationId",
          organizationId
        );

        setActiveOrganizationId(
          organizationId
        );
      } else {
        localStorage.removeItem(
          "activeOrganizationId"
        );

        setActiveOrganizationId(null);
      }
    } catch (error) {
      console.error(
        "Failed to fetch current user:",
        error
      );

      localStorage.removeItem("accessToken");
      localStorage.removeItem(
        "activeOrganizationId"
      );

      setToken(null);
      setUser(null);
      setActiveOrganizationId(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    const accessToken =
      response.data.accessToken;

    const loggedInUser =
      response.data.user;

    localStorage.setItem(
      "accessToken",
      accessToken
    );

    setToken(accessToken);
    setUser(loggedInUser);

    const memberships =
      loggedInUser.memberships || [];

    if (memberships.length > 0) {
      const storedOrganizationId =
        localStorage.getItem(
          "activeOrganizationId"
        );

      const organizationExists =
        memberships.some(
          (membership) =>
            membership.organizationId ===
            storedOrganizationId
        );

      if (
        storedOrganizationId &&
        organizationExists
      ) {
        setActiveOrganizationId(
          storedOrganizationId
        );
      } else {
        const organizationId =
          memberships[0].organizationId;

        localStorage.setItem(
          "activeOrganizationId",
          organizationId
        );

        setActiveOrganizationId(
          organizationId
        );
      }
    } else {
      localStorage.removeItem(
        "activeOrganizationId"
      );

      setActiveOrganizationId(null);
    }

    return response;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem(
      "activeOrganizationId"
    );

    setToken(null);
    setUser(null);
    setActiveOrganizationId(null);
  };

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    activeOrganizationId,
    setActiveOrganizationId,
    isAuthenticated:
      Boolean(token && user),
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};