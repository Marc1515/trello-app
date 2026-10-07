import { z } from "zod";
import { Board } from "@/generated/prisma/browser";

import { ActionState } from "@/lib/create-safe-action";

import { DeleteOrganization } from "./schema";

export type InputType = z.infer<typeof DeleteOrganization>;
export type ReturnType = ActionState<InputType, Board>;
