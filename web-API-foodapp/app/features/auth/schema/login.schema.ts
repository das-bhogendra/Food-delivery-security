import { z } from "zod";

export const loginSchema = z.object({
  // Backend expects `identifier` (email or username depending on your auth design)
  identifier: z.string().min(1, "Identifier is required"),
  password: z.string().min(6, "Min 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
