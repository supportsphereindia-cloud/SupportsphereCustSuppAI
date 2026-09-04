import {
  Activity,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FileText,
  UserPlus,
  UserMinus,
  UserCog,
  Bot,
  Ticket,
} from "lucide-react";

import {
  useQuery,
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
  getAuditLogs,
} from "../api/audit.api";

import {
  useAuth,
} from "../context/AuthContext";


const AuditLogs = () => {
  const navigate = useNavigate();

  const {
    activeOrganizationId,
  } = useAuth();

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const pageSize = 20;


  /**
   * Get audit logs for the
   * active organization.
   */
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "audit-logs",
      activeOrganizationId,
      currentPage,
    ],
    queryFn: () =>
      getAuditLogs({
        page: currentPage,
        limit: pageSize,
      }),
    staleTime: 30 * 1000,
    enabled: Boolean(
      activeOrganizationId
    ),
  });


  const logs =
    data?.data?.logs || [];

  const pagination =
    data?.data?.pagination || {};


  const totalPages =
    pagination.totalPages || 1;

  const total =
    pagination.total || 0;


  /**
   * Display an error toast when
   * audit logs cannot be loaded.
   */
  useEffect(() => {
    if (isError) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to fetch audit logs"
      );
    }
  }, [
    isError,
    error,
  ]);


  /**
   * Reset pagination when the
   * active organization changes.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [
    activeOrganizationId,
  ]);


  /**
   * Get an appropriate icon for
   * each audit action.
   */
  const getActionIcon = (
    action
  ) => {
    switch (action) {
      case "TICKET_CREATED":
        return (
          <Ticket
            size={16}
          />
        );

      case "TICKET_UPDATED":
        return (
          <FileText
            size={16}
          />
        );

      case "TICKET_CLOSED":
        return (
          <Ticket
            size={16}
          />
        );

      case "AI_ANALYSIS_CREATED":
        return (
          <Bot
            size={16}
          />
        );

      case "MEMBER_ADDED":
        return (
          <UserPlus
            size={16}
          />
        );

      case "MEMBER_ROLE_UPDATED":
        return (
          <UserCog
            size={16}
          />
        );

      case "MEMBER_REMOVED":
        return (
          <UserMinus
            size={16}
          />
        );

      default:
        return (
          <Activity
            size={16}
          />
        );
    }
  };


  /**
   * Format an audit action for
   * human-readable display.
   */
  const formatAction = (
    action
  ) => {
    return action
      ?.split("_")
      .map(
        (word) =>
          word.charAt(0) +
          word
            .slice(1)
            .toLowerCase()
      )
      .join(" ");
  };


  /**
   * Format the audit timestamp
   * according to the user's locale.
   */
  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(
      date
    ).toLocaleString();
  };


  /**
   * Move to the previous page.
   */
  const handlePreviousPage = () => {
    setCurrentPage(
      (page) =>
        Math.max(
          1,
          page - 1
        )
    );
  };


  /**
   * Move to the next page.
   */
  const handleNextPage = () => {
    setCurrentPage(
      (page) =>
        Math.min(
          totalPages,
          page + 1
        )
    );
  };


  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-slate-800 bg-slate-950">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">

              <Activity
                size={20}
              />

            </div>

            <div>

              <h1 className="font-bold">
                SupportSphere
              </h1>

              <p className="text-xs text-slate-500">
                Audit Logs
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >

            <ArrowLeft
              size={16}
            />

            <span className="hidden sm:inline">
              Dashboard
            </span>

          </button>

        </div>

      </header>


      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-8">

          <p className="text-sm text-slate-500">
            Organization
          </p>

          <h2 className="mt-1 text-3xl font-bold">
            Audit Logs
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Review activity performed within your current organization.
          </p>

        </div>


        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

          {isLoading ? (

            <div className="p-10 text-center">

              <p className="text-sm text-slate-400">
                Loading audit logs...
              </p>

            </div>

          ) : isError ? (

            <div className="p-10 text-center">

              <Activity
                size={36}
                className="mx-auto mb-3 text-slate-600"
              />

              <p className="font-medium">
                Unable to load audit logs
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Please try again later.
              </p>

            </div>

          ) : logs.length === 0 ? (

            <div className="p-10 text-center">

              <Activity
                size={36}
                className="mx-auto mb-3 text-slate-600"
              />

              <p className="font-medium">
                No audit activity found
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Organization activity will appear here.
              </p>

            </div>

          ) : (

            <>

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full">

                  <thead className="border-b border-slate-800 bg-slate-950/60">

                    <tr>

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                        Action
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                        Performed By
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                        Entity
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                        Details
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                        Date
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-slate-800">

                    {logs.map(
                      (log) => (

                        <tr
                          key={log.id}
                          className="transition hover:bg-slate-800/40"
                        >

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">

                                {getActionIcon(
                                  log.action
                                )}

                              </div>

                              <span className="text-sm font-medium text-slate-200">
                                {formatAction(
                                  log.action
                                )}
                              </span>

                            </div>

                          </td>


                          <td className="px-5 py-4">

                            <div>

                              <p className="text-sm font-medium text-slate-200">
                                {log.user?.name ||
                                  "Unknown User"}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {log.user?.email ||
                                  "No email available"}
                              </p>

                            </div>

                          </td>


                          <td className="px-5 py-4">

                            <p className="text-sm text-slate-300">
                              {log.entityType ||
                                "Unknown"}
                            </p>

                            {log.entityId && (
                              <p className="mt-1 max-w-48 truncate text-xs text-slate-600">
                                {log.entityId}
                              </p>
                            )}

                          </td>


                          <td className="max-w-xs px-5 py-4">

                            <div className="text-xs text-slate-400">

                              {log.metadata
                                ? Object.entries(
                                    log.metadata
                                  )
                                    .map(
                                      ([key, value]) =>
                                        `${key}: ${String(
                                          value
                                        )}`
                                    )
                                    .join(
                                      " • "
                                    )
                                : "No additional details"}

                            </div>

                          </td>


                          <td className="whitespace-nowrap px-5 py-4">

                            <span className="text-sm text-slate-400">
                              {formatDate(
                                log.createdAt
                              )}
                            </span>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              <div className="divide-y divide-slate-800 md:hidden">

                {logs.map(
                  (log) => (

                    <div
                      key={log.id}
                      className="p-5"
                    >

                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-400">

                          {getActionIcon(
                            log.action
                          )}

                        </div>


                        <div className="min-w-0 flex-1">

                          <div className="flex flex-col gap-1">

                            <p className="font-medium text-slate-200">
                              {formatAction(
                                log.action
                              )}
                            </p>

                            <p className="text-xs text-slate-500">
                              {formatDate(
                                log.createdAt
                              )}
                            </p>

                          </div>


                          <div className="mt-4 space-y-3">

                            <div>

                              <p className="text-xs uppercase tracking-wide text-slate-600">
                                Performed By
                              </p>

                              <p className="mt-1 text-sm text-slate-300">
                                {log.user?.name ||
                                  "Unknown User"}
                              </p>

                              <p className="text-xs text-slate-500">
                                {log.user?.email ||
                                  "No email available"}
                              </p>

                            </div>


                            <div>

                              <p className="text-xs uppercase tracking-wide text-slate-600">
                                Entity
                              </p>

                              <p className="mt-1 text-sm text-slate-300">
                                {log.entityType ||
                                  "Unknown"}
                              </p>

                              {log.entityId && (
                                <p className="mt-1 break-all text-xs text-slate-600">
                                  {log.entityId}
                                </p>
                              )}

                            </div>


                            <div>

                              <p className="text-xs uppercase tracking-wide text-slate-600">
                                Details
                              </p>

                              <p className="mt-1 break-words text-xs leading-5 text-slate-400">

                                {log.metadata
                                  ? Object.entries(
                                      log.metadata
                                    )
                                      .map(
                                        ([key, value]) =>
                                          `${key}: ${String(
                                            value
                                          )}`
                                      )
                                      .join(
                                        " • "
                                      )
                                  : "No additional details"}

                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>


              <div className="flex flex-col gap-4 border-t border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm text-slate-500">

                  {total > 0
                    ? `Showing page ${currentPage} of ${totalPages} • ${total} total ${
                        total === 1
                          ? "event"
                          : "events"
                      }`
                    : "No events"}

                </p>


                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={
                      handlePreviousPage
                    }
                    disabled={
                      currentPage <=
                        1 ||
                      isLoading
                    }
                    className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    <ChevronLeft
                      size={16}
                    />

                    Previous

                  </button>


                  <span className="min-w-20 text-center text-sm text-slate-500">

                    {currentPage} /{" "}
                    {totalPages}

                  </span>


                  <button
                    type="button"
                    onClick={
                      handleNextPage
                    }
                    disabled={
                      currentPage >=
                        totalPages ||
                      isLoading
                    }
                    className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    Next

                    <ChevronRight
                      size={16}
                    />

                  </button>

                </div>

              </div>

            </>

          )}

        </div>

      </main>

    </div>
  );
};


export default AuditLogs;