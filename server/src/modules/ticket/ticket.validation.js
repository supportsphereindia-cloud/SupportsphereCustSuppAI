const { z } = require("zod");

/**
 * Create Ticket
 */
const createTicketSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title cannot exceed 100 characters"),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description cannot exceed 1000 characters"),
  }),
});

/**
 * Update Ticket
 */
const updateTicketSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid Ticket ID"),
  }),

  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(5, "Title must be at least 5 characters")
        .max(100, "Title cannot exceed 100 characters")
        .optional(),

      description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description cannot exceed 1000 characters")
        .optional(),
    })
    .refine(
      (data) =>
        data.title !== undefined ||
        data.description !== undefined,
      {
        message: "At least one field must be provided",
      }
    ),
});

/**
 * Filter & Search Tickets
 */
const filterTicketsSchema = z.object({
  query: z.object({
    status: z
      .enum(["OPEN", "CLOSED"])
      .optional(),

    search: z
      .string()
      .trim()
      .min(1, "Search cannot be empty")
      .max(100, "Search cannot exceed 100 characters")
      .optional(),
  }),
});

/**
 * Ticket ID Validation
 */
const ticketIdSchema = z.object({
  params: z.object({
    id: z.string().cuid("Invalid Ticket ID"),
  }),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
  filterTicketsSchema,
  ticketIdSchema,
};