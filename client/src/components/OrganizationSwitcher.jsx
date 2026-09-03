import { useEffect, useRef, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const OrganizationSwitcher = () => {
  const {
    user,
    activeOrganizationId,
    setActiveOrganizationId,
  } = useAuth();

  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const switcherRef = useRef(null);

  const memberships = user?.memberships || [];

  /**
   * Find the currently active organization.
   */
  const activeMembership = memberships.find(
    (membership) =>
      membership.organizationId ===
      activeOrganizationId
  );

  const activeOrganization =
    activeMembership?.organization;

  /**
   * Close the dropdown when the user
   * clicks outside the switcher.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        switcherRef.current &&
        !switcherRef.current.contains(
          event.target
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /**
   * Switch Active Organization
   */
  const handleOrganizationSwitch = (
    organizationId
  ) => {
    if (
      organizationId ===
      activeOrganizationId
    ) {
      setIsOpen(false);
      return;
    }

    localStorage.setItem(
      "activeOrganizationId",
      organizationId
    );

    setActiveOrganizationId(
      organizationId
    );

    setIsOpen(false);
  };

  /**
   * Open Create Organization page.
   */
  const handleCreateOrganization = () => {
    setIsOpen(false);
    navigate("/organization/create");
  };

  return (
    <div
      ref={switcherRef}
      className="relative"
    >
      {/* Organization Selector */}
      <button
        type="button"
        onClick={() =>
          setIsOpen((previous) => !previous)
        }
        className="flex max-w-56 items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-left transition hover:border-slate-600 hover:bg-slate-800"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Building2
          size={16}
          className="shrink-0 text-blue-400"
        />

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-white">
            {activeOrganization?.name ||
              "Select Organization"}
          </span>

          {activeMembership?.role && (
            <span className="block truncate text-xs text-slate-500">
              {activeMembership.role}
            </span>
          )}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-500 transition-transform ${
            isOpen
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {/* Organization Dropdown */}
      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">

          {/* Dropdown Header */}
          <div className="border-b border-slate-800 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Organizations
            </p>
          </div>

          {/* Organization List */}
          <div className="max-h-64 overflow-y-auto p-2">

            {memberships.length === 0 ? (
              <div className="px-3 py-4 text-center">
                <p className="text-sm text-slate-400">
                  No organizations yet.
                </p>
              </div>
            ) : (
              memberships.map(
                (membership) => {
                  const organization =
                    membership.organization;

                  const isActive =
                    membership.organizationId ===
                    activeOrganizationId;

                  return (
                    <button
                      key={
                        membership.id ||
                        membership.organizationId
                      }
                      type="button"
                      onClick={() =>
                        handleOrganizationSwitch(
                          membership.organizationId
                        )
                      }
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                        isActive
                          ? "bg-blue-500/10"
                          : "hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800">
                        <Building2
                          size={16}
                          className={
                            isActive
                              ? "text-blue-400"
                              : "text-slate-500"
                          }
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-medium ${
                            isActive
                              ? "text-white"
                              : "text-slate-300"
                          }`}
                        >
                          {organization?.name ||
                            "Organization"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {membership.role}
                        </p>
                      </div>

                      {isActive && (
                        <Check
                          size={17}
                          className="shrink-0 text-blue-400"
                        />
                      )}
                    </button>
                  );
                }
              )
            )}

          </div>

          {/* Create Organization */}
          <div className="border-t border-slate-800 p-2">
            <button
              type="button"
              onClick={
                handleCreateOrganization
              }
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800">
                <Plus
                  size={17}
                  className="text-slate-400"
                />
              </div>

              Create Organization
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default OrganizationSwitcher;