import { z } from "zod";

export const DeleteOrganization = z.object({
  id: z.string(),
});
