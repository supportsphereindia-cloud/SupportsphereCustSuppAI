import {
  ArrowLeft,
  Check,
  Plus,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useNavigate,
} from "react-router-dom";
import {
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

import {
  addOrganizationMember,
  getOrganizationMembers,
  removeOrganizationMember,
  updateOrganizationMemberRole,
} from "../api/organization.api";

import {
  useAuth,
} from "../context/AuthContext";


const OrganizationMembers = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    user,
    activeOrganizationId,
  } = useAuth();

  const [showAddMember, setShowAddMember] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("CUSTOMER");


  const [editingMemberId, setEditingMemberId] =
    useState(null);

  const [selectedRoles, setSelectedRoles] =
    useState({});


  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "organization-members",
      activeOrganizationId,
    ],
    queryFn: getOrganizationMembers,
    staleTime: 30 * 1000,
    enabled: Boolean(activeOrganizationId),
  });


  const members = data?.data || [];


  /**
   * Find the current user's role
   * in the active organization.
   */
  const activeMembership =
    user?.memberships?.find(
      (membership) =>
        membership.organizationId ===
        activeOrganizationId
    );

  const currentUserRole =
    activeMembership?.role;


  const canManageMembers =
    currentUserRole === "OWNER" ||
    currentUserRole === "ADMIN";


  const canAddMembers =
    currentUserRole === "OWNER" ||
    currentUserRole === "ADMIN";


  /**
   * OWNER can assign all roles.
   * ADMIN cannot assign OWNER.
   */
  const availableRoles =
    currentUserRole === "OWNER"
      ? [
          "OWNER",
          "ADMIN",
          "AGENT",
          "CUSTOMER",
        ]
      : [
          "ADMIN",
          "AGENT",
          "CUSTOMER",
        ];


  /**
   * Add organization member mutation.
   */
  const addMemberMutation =
    useMutation({
      mutationFn:
        addOrganizationMember,

      onSuccess: () => {
        toast.success(
          "Member added successfully"
        );

        setEmail("");

        setRole("CUSTOMER");

        setShowAddMember(false);

        queryClient.invalidateQueries({
          queryKey: [
            "organization-members",
            activeOrganizationId,
          ],
        });
      },

      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            "Unable to add member"
        );
      },
    });


  /**
   * Update organization member role mutation.
   */
  const updateRoleMutation =
    useMutation({
      mutationFn: ({
        memberId,
        role,
      }) =>
        updateOrganizationMemberRole(
          memberId,
          role
        ),

      onSuccess: () => {
        toast.success(
          "Member role updated successfully"
        );

        setEditingMemberId(null);

        queryClient.invalidateQueries({
          queryKey: [
            "organization-members",
            activeOrganizationId,
          ],
        });
      },

      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            "Unable to update member role"
        );
      },
    });


  /**
   * Remove organization member mutation.
   */
  const removeMemberMutation =
    useMutation({
      mutationFn:
        removeOrganizationMember,

      onSuccess: () => {
        toast.success(
          "Member removed successfully"
        );

        queryClient.invalidateQueries({
          queryKey: [
            "organization-members",
            activeOrganizationId,
          ],
        });
      },

      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            "Unable to remove member"
        );
      },
    });


  /**
   * Handle Add Member form submission.
   */
  const handleAddMember = (event) => {
    event.preventDefault();

    const trimmedEmail =
      email.trim();

    if (!trimmedEmail) {
      toast.error(
        "Please enter the user's email address"
      );

      return;
    }

    addMemberMutation.mutate({
      email: trimmedEmail,
      role,
    });
  };


  /**
   * Start editing a member's role.
   */
  const handleStartRoleEdit = (
    member
  ) => {
    setEditingMemberId(member.id);

    setSelectedRoles((current) => ({
      ...current,
      [member.id]: member.role,
    }));
  };


  /**
   * Cancel role editing.
   */
  const handleCancelRoleEdit = () => {
    setEditingMemberId(null);
  };


  /**
   * Save the selected member role.
   */
  const handleSaveRole = (
    member
  ) => {
    const selectedRole =
      selectedRoles[member.id];

    if (!selectedRole) {
      return;
    }

    if (
      selectedRole === member.role
    ) {
      setEditingMemberId(null);

      return;
    }

    updateRoleMutation.mutate({
      memberId: member.id,
      role: selectedRole,
    });
  };


  /**
   * Remove a member after confirmation.
   */
  const handleRemoveMember = (
    member
  ) => {
    const memberName =
      member.user?.name ||
      member.user?.email ||
      "this member";

    const confirmed =
      window.confirm(
        `Are you sure you want to remove ${memberName} from this organization?`
      );

    if (!confirmed) {
      return;
    }

    removeMemberMutation.mutate(
      member.id
    );
  };


  /**
   * Display member loading errors
   * through a toast notification.
   */
  useEffect(() => {
    if (isError) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to fetch organization members"
      );
    }
  }, [
    isError,
    error,
  ]);


  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-slate-800 bg-slate-950">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">

              <Users size={20} />

            </div>

            <div>

              <h1 className="font-bold">
                SupportSphere
              </h1>

              <p className="text-xs text-slate-500">
                Organization Members
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate("/dashboard")
            }
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >

            <ArrowLeft size={16} />

            <span className="hidden sm:inline">
              Dashboard
            </span>

          </button>

        </div>

      </header>


      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm text-slate-500">
                Organization
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                Members
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                View the members of your current organization.
              </p>

            </div>


            {canAddMembers && (
              <button
                type="button"
                onClick={() =>
                  setShowAddMember(
                    (current) => !current
                  )
                }
                className="flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
              >

                <UserPlus size={18} />

                {showAddMember
                  ? "Cancel"
                  : "Add Member"}

              </button>
            )}

          </div>

        </div>


        {canAddMembers &&
          showAddMember && (

            <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-6">

              <div className="mb-5">

                <div className="flex items-center gap-2">

                  <UserPlus
                    size={18}
                    className="text-blue-400"
                  />

                  <h3 className="font-semibold">
                    Add Member
                  </h3>

                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Add an existing SupportSphere user to this organization.
                </p>

              </div>


              <form
                onSubmit={handleAddMember}
                className="grid gap-4 md:grid-cols-[1fr_220px_auto]"
              >

                <div>

                  <label
                    htmlFor="member-email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    User Email
                  </label>

                  <input
                    id="member-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="user@example.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                    disabled={
                      addMemberMutation.isPending
                    }
                  />

                </div>


                <div>

                  <label
                    htmlFor="member-role"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Role
                  </label>

                  <select
                    id="member-role"
                    value={role}
                    onChange={(event) =>
                      setRole(
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                    disabled={
                      addMemberMutation.isPending
                    }
                  >

                    {availableRoles.map(
                      (availableRole) => (
                        <option
                          key={availableRole}
                          value={availableRole}
                        >
                          {availableRole}
                        </option>
                      )
                    )}

                  </select>

                </div>


                <div className="flex items-end">

                  <button
                    type="submit"
                    disabled={
                      addMemberMutation.isPending
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 md:w-fit"
                  >

                    <Plus size={18} />

                    {addMemberMutation.isPending
                      ? "Adding..."
                      : "Add Member"}

                  </button>

                </div>

              </form>

            </div>

          )}


        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

          {isLoading ? (

            <div className="p-10 text-center">

              <p className="text-sm text-slate-400">
                Loading members...
              </p>

            </div>

          ) : isError ? (

            <div className="p-10 text-center">

              <p className="font-medium">
                Unable to load members
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Please try again later.
              </p>

            </div>

          ) : members.length === 0 ? (

            <div className="p-10 text-center">

              <Users
                size={36}
                className="mx-auto mb-3 text-slate-600"
              />

              <p className="font-medium">
                No members found
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-800">

              {members.map((member) => {

                const isCurrentUser =
                  member.userId ===
                  user?.id;

                const isOwner =
                  member.role ===
                  "OWNER";

                const canEditThisMember =
                  canManageMembers &&
                  !isOwner &&
                  !isCurrentUser;

                const canRemoveThisMember =
                  canManageMembers &&
                  !isOwner &&
                  !isCurrentUser;

                const isEditing =
                  editingMemberId ===
                  member.id;

                const isRemoving =
                  removeMemberMutation.isPending &&
                  removeMemberMutation.variables ===
                    member.id;

                const memberRoles = [
                  "ADMIN",
                  "AGENT",
                  "CUSTOMER",
                ];

                return (
                  <div
                    key={member.id}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="flex min-w-0 items-center gap-4">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-300">

                        {member.user?.name
                          ?.charAt(0)
                          ?.toUpperCase() || "U"}

                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-medium">

                          {member.user?.name ||
                            "Unknown User"}

                          {isCurrentUser && (
                            <span className="ml-2 text-xs font-normal text-slate-500">
                              You
                            </span>
                          )}

                        </p>

                        <p className="truncate text-sm text-slate-500">

                          {member.user?.email ||
                            "No email available"}

                        </p>

                      </div>

                    </div>


                    {isEditing ? (

                      <div className="flex flex-wrap items-center gap-2">

                        <select
                          value={
                            selectedRoles[
                              member.id
                            ] ||
                            member.role
                          }
                          onChange={(
                            event
                          ) =>
                            setSelectedRoles(
                              (current) => ({
                                ...current,
                                [member.id]:
                                  event
                                    .target
                                    .value,
                              })
                            )
                          }
                          disabled={
                            updateRoleMutation.isPending
                          }
                          className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-blue-500"
                        >

                          {memberRoles.map(
                            (
                              memberRole
                            ) => (
                              <option
                                key={
                                  memberRole
                                }
                                value={
                                  memberRole
                                }
                              >
                                {
                                  memberRole
                                }
                              </option>
                            )
                          )}

                        </select>


                        <button
                          type="button"
                          onClick={() =>
                            handleSaveRole(
                              member
                            )
                          }
                          disabled={
                            updateRoleMutation.isPending
                          }
                          className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          <Check
                            size={16}
                          />

                          {updateRoleMutation.isPending
                            ? "Saving..."
                            : "Save"}

                        </button>


                        <button
                          type="button"
                          onClick={
                            handleCancelRoleEdit
                          }
                          disabled={
                            updateRoleMutation.isPending
                          }
                          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cancel
                        </button>

                      </div>

                    ) : (

                      <div className="flex flex-wrap items-center gap-3">

                        <div className="flex w-fit items-center gap-2 rounded-full bg-slate-800 px-3 py-1.5">

                          <Shield
                            size={14}
                            className="text-slate-400"
                          />

                          <span className="text-xs font-medium text-slate-300">
                            {member.role}
                          </span>

                        </div>


                        {canEditThisMember && (
                          <button
                            type="button"
                            onClick={() =>
                              handleStartRoleEdit(
                                member
                              )
                            }
                            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                          >
                            Change Role
                          </button>
                        )}


                        {canRemoveThisMember && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveMember(
                                member
                              )
                            }
                            disabled={
                              removeMemberMutation.isPending
                            }
                            className="flex items-center gap-2 rounded-lg border border-red-900/60 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-950/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            <Trash2 size={14} />

                            {isRemoving
                              ? "Removing..."
                              : "Remove"}

                          </button>
                        )}

                      </div>

                    )}

                  </div>
                );
              })}

            </div>

          )}

        </div>

      </main>

    </div>
  );
};

export default OrganizationMembers;