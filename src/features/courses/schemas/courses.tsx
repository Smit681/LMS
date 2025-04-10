import { z } from "zod";

//created zod verification schema for course form data
export const courseSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
});
