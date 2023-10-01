import z from "zod";

export const addLinkResponseParser = z.object({
  message: z.string()
});