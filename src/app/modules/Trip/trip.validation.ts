import { z } from "zod";

const createTripValidation = z.object({
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number().min(0, "Budget must be a positive number"),
  photo: z.string(),
});
const updateTripValidation = z.object({
  destination: z.string().min(1, "Destination is required").optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().min(0, "Budget must be a positive number").optional(),
  photo: z.string().optional(),
});

export const tripValidation = { createTripValidation, updateTripValidation };
