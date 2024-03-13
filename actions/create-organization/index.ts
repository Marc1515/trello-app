"use server";

import { auth } from "@clerk/nextjs";
/* import { revalidatePath } from "next/cache"; */

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { ReturnType } from "./types";
import { CreateOrganization } from "./schema";

const handler = async (): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  let org;

  try {
    org = await db.organization.create({
      data: {
        id: orgId,
        name: "default",
        defaultBoardsCreated: false,
      },
    });
  } catch (error) {
    return {
      error: "Failed to create",
    };
  }

  /* revalidatePath(`/board/${board.id}`); */
  return { data: org };
};

export const createOrganization = createSafeAction(CreateOrganization, handler);
