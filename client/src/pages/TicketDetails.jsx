import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle,
  Edit3,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";

import {
  useForm,
} from "react-hook-form";

import {
  z,
} from "zod";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import {
  closeTicket,
  getTicketById,
  updateTicket,
  analyzeTicket,
} from "../api/ticket.api";

import { useAuth } from "../context/AuthContext";


// ========================================
// Edit Ticket Validation
// ========================================

const editTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      5,
      "Title must be at least 5 characters"
    )
    .max(
      100,
      "Title cannot exceed 100 characters"
    ),

  description: z
    .string()
    .trim()
    .min(
      10,
      "Description must be at least 10 characters"
    )
    .max(
      1000,
      "Description cannot exceed 1000 characters"
    ),
});


// ========================================
// Component
// ========================================

const TicketDetails = () => {
  const { id } = useParams();

  const {
    activeOrganizationId,
  } = useAuth();

  const navigate = useNavigate();

  const queryClient = useQueryClient();


  // ========================================
  // State
  // ========================================

  const [
    isEditing,
    setIsEditing,
  ] = useState(false);

  const [
    showCloseConfirmation,
    setShowCloseConfirmation,
  ] = useState(false);


  // ========================================
  // Fetch Ticket
  // ========================================

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "ticket",
      activeOrganizationId,
      id,
    ],

    queryFn: () =>
      getTicketById(id),

    enabled:
      Boolean(
        id &&
        activeOrganizationId
      ),
  });


  const ticket = data?.data;

  const isClosed =
    ticket?.status === "CLOSED";


  // ========================================
  // Existing AI Analysis
  // ========================================

  /**
   * AI analysis now comes from the database
   * through the ticket response.
   *
   * This means:
   *
   * - Refreshing the page does NOT remove it.
   * - Existing analysis is automatically displayed.
   * - Re-running AI analysis replaces the
   *   existing analysis.
   */

  const aiAnalysis =
    ticket?.aiAnalysis || null;


  // ========================================
  // React Hook Form
  // ========================================

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm({
    resolver:
      zodResolver(
        editTicketSchema
      ),

    defaultValues: {
      title: "",
      description: "",
    },
  });


  // ========================================
  // Populate Form
  // ========================================

  useEffect(() => {
    if (ticket) {
      reset({
        title: ticket.title,
        description:
          ticket.description,
      });
    }
  }, [
    ticket,
    reset,
  ]);


  // ========================================
  // Update Ticket
  // ========================================

  const updateMutation =
    useMutation({
      mutationFn: (ticketData) =>
        updateTicket(
          id,
          ticketData
        ),

      onSuccess: () => {
        toast.success(
          "Ticket updated successfully"
        );

        setIsEditing(false);

        /**
         * Refetch ticket.
         *
         * This is important because the backend
         * may invalidate/remove the previous
         * AI analysis after ticket modification.
         */
        queryClient.invalidateQueries({
          queryKey: [
            "ticket",
            activeOrganizationId,
            id,
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "tickets",
          ],
        });
      },

      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            "Unable to update ticket"
        );
      },
    });


  // ========================================
  // Close Ticket
  // ========================================

  const closeMutation =
    useMutation({
      mutationFn: () =>
        closeTicket(id),

      onSuccess: () => {
        toast.success(
          "Ticket closed successfully"
        );

        setShowCloseConfirmation(
          false
        );

        queryClient.invalidateQueries({
          queryKey: [
            "ticket",
            activeOrganizationId,
            id,
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "tickets",
          ],
        });
      },

      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            "Unable to close ticket"
        );

        setShowCloseConfirmation(
          false
        );
      },
    });


  // ========================================
  // AI Analysis
  // ========================================

  const aiMutation =
    useMutation({
      mutationFn: () =>
        analyzeTicket(id),

      onSuccess: () => {

        toast.success(
          "AI analysis completed"
        );

        /**
         * The AI analysis is persisted in
         * PostgreSQL by the backend.
         *
         * Refetch the ticket so the newly
         * saved analysis is loaded from the
         * database.
         */
        queryClient.invalidateQueries({
          queryKey: [
            "ticket",
            activeOrganizationId,
            id,
          ],
        });
      },

      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            "Unable to analyze ticket"
        );
      },
    });


  // ========================================
  // Submit Edit
  // ========================================

  const onSubmit = (
    ticketData
  ) => {
    updateMutation.mutate(
      ticketData
    );
  };


  // ========================================
  // Cancel Edit
  // ========================================

  const handleCancelEdit = () => {

    reset({
      title: ticket.title,
      description:
        ticket.description,
    });

    setIsEditing(false);
  };


  // ========================================
  // Close Confirmation
  // ========================================

  const handleCloseClick = () => {
    setShowCloseConfirmation(
      true
    );
  };


  const handleCancelClose = () => {

    if (
      !closeMutation.isPending
    ) {
      setShowCloseConfirmation(
        false
      );
    }
  };


  const handleConfirmClose = () => {
    closeMutation.mutate();
  };


  // ========================================
  // Loading
  // ========================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">

        <main className="mx-auto max-w-4xl px-6 py-10">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

            <Loader2
              size={28}
              className="mx-auto mb-4 animate-spin text-blue-400"
            />

            <p className="text-sm font-medium text-slate-300">
              Loading ticket...
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Please wait while we fetch the ticket details.
            </p>

          </div>

        </main>

      </div>
    );
  }


  // ========================================
  // Error / Not Found
  // ========================================

  if (
    isError ||
    !ticket
  ) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">

        <main className="mx-auto max-w-4xl px-6 py-10">

          <button
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />

            Back to Dashboard
          </button>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">

            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">

              <X
                size={24}
                className="text-red-400"
              />

            </div>


            <h2 className="text-xl font-semibold">
              Ticket not found
            </h2>


            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              The ticket may have been deleted
              or you may not have access to it.
            </p>


            <button
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium transition hover:bg-blue-500"
            >
              Return to Dashboard
            </button>

          </div>

        </main>

      </div>
    );
  }


  // ========================================
  // Main UI
  // ========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <main className="mx-auto max-w-4xl px-6 py-10">


        {/* ========================================
            Back
        ======================================== */}

        <button
          onClick={() =>
            navigate(
              "/dashboard"
            )
          }
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />

          Back to Dashboard
        </button>


        {/* ========================================
            Ticket Card
        ======================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">


          {/* ========================================
              Header
          ======================================== */}

          <div className="border-b border-slate-800 p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              <div className="min-w-0 flex-1">

                <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
                  Ticket
                </p>


                {!isEditing ? (

                  <h1 className="text-2xl font-bold">
                    {ticket.title}
                  </h1>

                ) : (

                  <div>

                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-medium text-slate-300"
                    >
                      Title
                    </label>


                    <input
                      id="title"
                      type="text"
                      {...register(
                        "title"
                      )}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                    />


                    {errors.title && (
                      <p className="mt-2 text-xs text-red-400">
                        {
                          errors.title
                            .message
                        }
                      </p>
                    )}

                  </div>
                )}

              </div>


              {/* Status */}

              <span
                className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  isClosed
                    ? "bg-green-500/10 text-green-400"
                    : "bg-blue-500/10 text-blue-400"
                }`}
              >
                {ticket.status}
              </span>

            </div>

          </div>


          {/* ========================================
              Description
          ======================================== */}

          <div className="p-6">

            <h2 className="mb-3 text-sm font-semibold text-slate-300">
              Description
            </h2>


            {!isEditing ? (

              <p className="whitespace-pre-wrap leading-7 text-slate-400">
                {ticket.description}
              </p>

            ) : (

              <div>

                <textarea
                  id="description"
                  rows={8}
                  {...register(
                    "description"
                  )}
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />


                {errors.description && (
                  <p className="mt-2 text-xs text-red-400">
                    {
                      errors
                        .description
                        .message
                    }
                  </p>
                )}

              </div>
            )}

          </div>


          {/* ========================================
              Metadata
          ======================================== */}

          <div className="grid gap-6 border-t border-slate-800 p-6 sm:grid-cols-3">


            {/* Ticket ID */}

            <div>

              <p className="text-xs text-slate-500">
                Ticket ID
              </p>


              <p className="mt-1 break-all font-mono text-xs text-slate-400">
                {ticket.id}
              </p>

            </div>


            {/* Created */}

            <div>

              <p className="text-xs text-slate-500">
                Created
              </p>


              <p className="mt-1 text-sm text-slate-300">
                {new Date(
                  ticket.createdAt
                ).toLocaleString()}
              </p>

            </div>


            {/* Last Updated */}

            <div>

              <p className="text-xs text-slate-500">
                Last Updated
              </p>


              <p className="mt-1 text-sm text-slate-300">
                {new Date(
                  ticket.updatedAt
                ).toLocaleString()}
              </p>

            </div>

          </div>


          {/* ========================================
              Actions
          ======================================== */}

          {!isClosed && (

            <div className="flex flex-col gap-3 border-t border-slate-800 p-6 sm:flex-row sm:justify-end">


              {!isEditing ? (

                <>

                  {/* ========================================
                      Edit
                  ======================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      setIsEditing(
                        true
                      )
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                  >

                    <Edit3 size={16} />

                    Edit Ticket

                  </button>


                  {/* ========================================
                      AI Analysis
                  ======================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      aiMutation.mutate()
                    }
                    disabled={
                      aiMutation.isPending
                    }
                    className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {aiMutation.isPending ? (

                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                    ) : (

                      <Sparkles
                        size={16}
                      />

                    )}


                    {aiMutation.isPending
                      ? "Analyzing..."
                      : aiAnalysis
                      ? "Re-analyze with AI"
                      : "Analyze with AI"}

                  </button>


                  {/* ========================================
                      Close
                  ======================================== */}

                  <button
                    type="button"
                    onClick={
                      handleCloseClick
                    }
                    disabled={
                      closeMutation.isPending
                    }
                    className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <CheckCircle
                      size={16}
                    />

                    Close Ticket

                  </button>

                </>

              ) : (

                <>

                  {/* ========================================
                      Cancel
                  ======================================== */}

                  <button
                    type="button"
                    onClick={
                      handleCancelEdit
                    }
                    disabled={
                      updateMutation.isPending
                    }
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    <X size={16} />

                    Cancel

                  </button>


                  {/* ========================================
                      Save
                  ======================================== */}

                  <button
                    type="button"
                    onClick={handleSubmit(
                      onSubmit
                    )}
                    disabled={
                      updateMutation.isPending
                    }
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >

                    {updateMutation.isPending && (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    )}


                    {updateMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}

                  </button>

                </>

              )}

            </div>

          )}

        </div>


        {/* ========================================
            AI Analysis
        ======================================== */}

        {aiAnalysis && (

          <div className="mt-6 overflow-hidden rounded-2xl border border-purple-500/20 bg-slate-900">


            {/* ========================================
                AI Header
            ======================================== */}

            <div className="border-b border-purple-500/20 bg-purple-500/5 p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">

                  <Sparkles
                    size={20}
                    className="text-purple-400"
                  />

                </div>


                <div>

                  <h2 className="text-lg font-semibold">
                    AI Support Analysis
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    AI-generated analysis of this support ticket
                  </p>

                </div>

              </div>

            </div>


            {/* ========================================
                AI Content
            ======================================== */}

            <div className="p-6">


              {/* ========================================
                  Analysis Metadata
              ======================================== */}

              <div className="mb-6 grid gap-4 sm:grid-cols-2">


                {/* Analysis ID */}

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <p className="text-xs text-slate-500">
                    Analysis ID
                  </p>

                  <p className="mt-2 break-all font-mono text-xs text-slate-400">
                    {aiAnalysis.id}
                  </p>

                </div>


                {/* Analyzed At */}

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <p className="text-xs text-slate-500">
                    Analyzed At
                  </p>

                  <p className="mt-2 text-sm text-slate-300">
                    {new Date(
                      aiAnalysis.updatedAt ||
                        aiAnalysis.createdAt
                    ).toLocaleString()}
                  </p>

                </div>

              </div>


              {/* ========================================
                  Summary
              ======================================== */}

              <div>

                <h3 className="text-sm font-semibold text-slate-300">
                  Summary
                </h3>

                <p className="mt-2 leading-7 text-slate-400">
                  {aiAnalysis.summary}
                </p>

              </div>


              {/* ========================================
                  Classification
              ======================================== */}

              <div className="mt-6 grid gap-4 sm:grid-cols-3">


                {/* Category */}

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <p className="text-xs text-slate-500">
                    Category
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-200">
                    {aiAnalysis.category}
                  </p>

                </div>


                {/* Priority */}

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <p className="text-xs text-slate-500">
                    Priority
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      aiAnalysis.priority ===
                      "CRITICAL"
                        ? "bg-red-500/10 text-red-400"
                        : aiAnalysis.priority ===
                          "HIGH"
                        ? "bg-orange-500/10 text-orange-400"
                        : aiAnalysis.priority ===
                          "MEDIUM"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    {aiAnalysis.priority}
                  </span>

                </div>


                {/* Sentiment */}

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                  <p className="text-xs text-slate-500">
                    Sentiment
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      aiAnalysis.sentiment ===
                      "FRUSTRATED"
                        ? "bg-red-500/10 text-red-400"
                        : aiAnalysis.sentiment ===
                          "NEGATIVE"
                        ? "bg-orange-500/10 text-orange-400"
                        : aiAnalysis.sentiment ===
                          "POSITIVE"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-slate-500/10 text-slate-300"
                    }`}
                  >
                    {aiAnalysis.sentiment}
                  </span>

                </div>

              </div>


              {/* ========================================
                  Root Cause
              ======================================== */}

              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5">

                <h3 className="text-sm font-semibold text-slate-300">
                  Root Cause
                </h3>

                <p className="mt-2 leading-7 text-slate-400">
                  {aiAnalysis.rootCause}
                </p>

              </div>


              {/* ========================================
                  Suggested Resolution
              ======================================== */}

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-5">

                <h3 className="text-sm font-semibold text-slate-300">
                  Suggested Resolution
                </h3>

                <p className="mt-2 leading-7 text-slate-400">
                  {aiAnalysis.suggestedResolution}
                </p>

              </div>


              {/* ========================================
                  Customer Response
              ======================================== */}

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-5">

                <h3 className="text-sm font-semibold text-slate-300">
                  Suggested Customer Response
                </h3>

                <p className="mt-2 leading-7 text-slate-400">
                  {aiAnalysis.customerResponse}
                </p>

              </div>


              {/* ========================================
                  Recommended Next Action
              ======================================== */}

              <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-5">

                <h3 className="text-sm font-semibold text-slate-300">
                  Recommended Next Action
                </h3>

                <p className="mt-2 leading-7 text-slate-400">
                  {aiAnalysis.recommendedNextAction}
                </p>

              </div>

            </div>

          </div>

        )}


        {/* ========================================
            Close Confirmation Modal
        ======================================== */}

        {showCloseConfirmation && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">


              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">

                <CheckCircle
                  size={24}
                  className="text-green-400"
                />

              </div>


              <h2 className="text-xl font-semibold">
                Close this ticket?
              </h2>


              <p className="mt-2 text-sm leading-6 text-slate-400">
                Are you sure you want to close this
                ticket? You can no longer edit a
                closed ticket.
              </p>


              <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950 p-4">

                <p className="truncate text-sm font-medium text-slate-200">
                  {ticket.title}
                </p>

                <p className="mt-1 font-mono text-xs text-slate-500">
                  {ticket.id}
                </p>

              </div>


              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={
                    handleCancelClose
                  }
                  disabled={
                    closeMutation.isPending
                  }
                  className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>


                <button
                  type="button"
                  onClick={
                    handleConfirmClose
                  }
                  disabled={
                    closeMutation.isPending
                  }
                  className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {closeMutation.isPending && (

                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                  )}


                  {closeMutation.isPending
                    ? "Closing..."
                    : "Yes, Close Ticket"}

                </button>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
};


export default TicketDetails;