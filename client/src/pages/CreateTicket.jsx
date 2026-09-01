import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createTicket } from "../api/ticket.api";

const createTicketSchema = z.object({
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

const CreateTicket = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
    reset,
  } = useForm({
    resolver:
      zodResolver(createTicketSchema),

    defaultValues: {
      title: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createTicket,

    onSuccess: (response) => {
      toast.success(
        "Ticket created successfully"
      );

      reset();

      queryClient.invalidateQueries({
        queryKey: ["tickets"],
      });

      const ticketId =
        response?.data?.id;

      if (ticketId) {
        navigate(
          `/tickets/${ticketId}`
        );
      } else {
        navigate("/dashboard");
      }
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Unable to create ticket"
      );
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-3xl px-6 py-10">
        {/* Back */}
        <button
          type="button"
          onClick={() =>
            navigate("/dashboard")
          }
          className="mb-8 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />

          Back to Dashboard
        </button>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <div className="mb-8">
            <p className="text-sm text-blue-400">
              New Ticket
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Create Support Ticket
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Describe your issue and our support
              team can help you resolve it.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Title */}
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
                placeholder="e.g. Payment gateway issue"
                {...register("title")}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              {errors.title && (
                <p className="mt-2 text-xs text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Description
              </label>

              <textarea
                id="description"
                rows={7}
                placeholder="Describe your issue in detail..."
                {...register(
                  "description"
                )}
                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              {errors.description && (
                <p className="mt-2 text-xs text-red-400">
                  {
                    errors.description
                      .message
                  }
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard")
                }
                className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  mutation.isPending
                }
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mutation.isPending && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {mutation.isPending
                  ? "Creating..."
                  : "Create Ticket"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateTicket;