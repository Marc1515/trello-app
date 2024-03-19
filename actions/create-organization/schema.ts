import { z } from "zod";

export const CreateOrganization = z.object({
  id: z.string(),
  name: z.string(),
  defaultBoardsCreated: z.boolean(),
});
