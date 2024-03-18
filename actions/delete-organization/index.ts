"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";

import { DeleteOrganization } from "./schema";
import { InputType, ReturnType } from "./types";
import { redirect } from "next/navigation";
import { synchronizeOrganizations } from "../synchronize-organizations";

export async function deleteOrganization() {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const localOrgIdsToDelete = await synchronizeOrganizations();

    for (const orgId of localOrgIdsToDelete) {
      await db.orgLimit.delete({
        where: {
          orgId: orgId,
        },
      });

      await db.board.deleteMany({
        where: {
          orgId: orgId,
        },
      });

      await db.organization.delete({
        where: {
          id: orgId,
        },
      });

      console.log(
        `Deleted organization and all related data for orgId: ${orgId}`
      );
    }
  } catch (error) {
    return {
      error: "Failed to delete",
    };
  }
}
