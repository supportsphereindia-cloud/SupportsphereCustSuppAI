import { useMemo, useState } from "react";
import {
  LogOut,
  Plus,
  Search,
  Ticket,
  X,
} from "lucide-react";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import { getTickets } from "../api/ticket.api";
import useDebounce from "../hooks/useDebounce";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  /**
   * Debounced Search
   *
   * API request will only happen
   * after the user stops typing.
   */
  const debouncedSearch = useDebounce(
    search.trim(),
    500
  );

  /**
   * Fetch Tickets
   */
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "tickets",
      {
        status,
        search: debouncedSearch,
      },
    ],

    queryFn: () =>
      getTickets({
        status,
        search: debouncedSearch,
      }),

    staleTime: 30 * 1000,
  });

  const tickets = data?.data || [];

  /**
   * Statistics
   *
   * These statistics represent
   * the currently displayed tickets.
   */
  const statistics = useMemo(() => {
    const total = tickets.length;

    const open = tickets.filter(
      (ticket) => ticket.status === "OPEN"
    ).length;

    const closed = tickets.filter(
      (ticket) => ticket.status === "CLOSED"
    ).length;

    return {
      total,
      open,
      closed,
    };
  }, [tickets]);

  /**
   * Logout
   */
  const handleLogout = () => {
    queryClient.clear();
    logout();
  };

  /**
   * Create Ticket
   *
   * Uses existing CreateTicket.jsx
   */
  const handleCreateTicket = () => {
    navigate("/tickets/create");
  };

  /**
   * Open Ticket Details
   *
   * Uses existing TicketDetails.jsx
   */
  const handleTicketClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  /**
   * API Error
   */
  if (isError) {
    toast.error(
      error?.response?.data?.message ||
        "Unable to fetch tickets"
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Ticket size={20} />
            </div>

            <div>
              <h1 className="font-bold">
                SupportSphere
              </h1>

              <p className="text-xs text-slate-500">
                Customer Support Platform
              </p>
            </div>

          </div>

          {/* User */}
          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                {user?.name}
              </p>

              <p className="text-xs text-slate-500">
                {user?.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <LogOut size={16} />

              <span className="hidden sm:inline">
                Logout
              </span>
            </button>

          </div>
        </div>
      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* =================================================
            DASHBOARD HEADING
        ================================================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-sm text-slate-500">
              Dashboard
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              Your Support Tickets
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Create, manage and track your
              support requests.
            </p>
          </div>


          {/* Create Ticket */}
          <button
            type="button"
            onClick={handleCreateTicket}
            className="flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
          >
            <Plus size={18} />

            Create Ticket
          </button>

        </div>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          {/* Total */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-sm text-slate-400">
              Total Tickets
            </p>

            <p className="mt-2 text-3xl font-bold">
              {statistics.total}
            </p>

          </div>


          {/* Open */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-sm text-slate-400">
              Open Tickets
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-400">
              {statistics.open}
            </p>

          </div>


          {/* Closed */}
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

            <p className="text-sm text-slate-400">
              Closed Tickets
            </p>

            <p className="mt-2 text-3xl font-bold text-green-400">
              {statistics.closed}
            </p>

          </div>

        </div>


        {/* =================================================
            SEARCH + FILTER
        ================================================= */}

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">

          {/* Search */}
          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search tickets..."
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 pl-10 pr-10 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />


            {/* Clear Search */}
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}

          </div>


          {/* Status Filter */}
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
          >

            <option value="ALL">
              All Tickets
            </option>

            <option value="OPEN">
              Open
            </option>

            <option value="CLOSED">
              Closed
            </option>

          </select>

        </div>


        {/* =================================================
            SEARCH STATUS
        ================================================= */}

        {search.trim() !== debouncedSearch && (
          <p className="mb-4 text-xs text-slate-500">
            Searching...
          </p>
        )}


        {/* =================================================
            BACKGROUND FETCH STATUS
        ================================================= */}

        {isFetching &&
          search.trim() === debouncedSearch && (
            <p className="mb-4 text-xs text-slate-500">
              Updating tickets...
            </p>
          )}


        {/* =================================================
            TICKET LIST
        ================================================= */}

        <div className="space-y-4">

          {/* Initial Loading */}
          {isLoading ? (

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">

              <p className="text-sm text-slate-400">
                Loading tickets...
              </p>

            </div>

          ) : tickets.length === 0 ? (

            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">

              <Ticket
                size={36}
                className="mx-auto mb-3 text-slate-600"
              />

              <p className="font-medium">
                No tickets found
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or
                filter.
              </p>

            </div>

          ) : (

            /* =================================================
               TICKET LIST
            ================================================= */

            tickets.map((ticket) => (

              <button
                key={ticket.id}
                type="button"
                onClick={() =>
                  handleTicketClick(ticket.id)
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-slate-600 hover:bg-slate-900/80"
              >

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  {/* Ticket Content */}
                  <div className="min-w-0 flex-1">

                    <h3 className="truncate text-lg font-semibold">
                      {ticket.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                      {ticket.description}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-3">

                      {/* Ticket ID */}
                      <p className="text-xs text-slate-600">
                        ID: {ticket.id}
                      </p>

                      {/* Created */}
                      <p className="text-xs text-slate-600">
                        Created{" "}
                        {new Date(
                          ticket.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                  </div>


                  {/* Status */}
                  <span
                    className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      ticket.status === "OPEN"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    {ticket.status}
                  </span>

                </div>

              </button>

            ))

          )}

        </div>

      </main>

    </div>
  );
};

export default Dashboard;