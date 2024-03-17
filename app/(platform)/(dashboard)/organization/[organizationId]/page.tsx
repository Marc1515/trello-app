import React, { Suspense } from "react";

import createOrganization from "@/actions/create-organization";

import { Separator } from "@/components/ui/separator";
import { Info } from "./_components/info";
import { BoardList } from "./_components/board-list";
import { checkSubscription } from "@/lib/subscription";
import { getClerkOrganizations } from "@/lib/get-clerk-organizations";
import { db } from "@/lib/db";

const OrganizationIdPage = async () => {
  const isPro = await checkSubscription();

  async function synchronizeAndCleanOrganizations() {
    const clerkOrgIds = await getClerkOrganizations();
    const allLocalOrgs = await db.organization.findMany();
    const localOrgIdsToDelete = allLocalOrgs
      .filter((localOrg) => !clerkOrgIds.includes(localOrg.id))
      .map((org) => org.id);

    for (const orgId of localOrgIdsToDelete) {
      // Asumiendo que deseas eliminar registros relacionados antes de eliminar la organización
      // Eliminar tableros (u otros datos relacionados) primero
      await db.board.deleteMany({
        where: {
          orgId: orgId,
        },
      });

      // Luego, eliminar la organización
      await db.organization.delete({
        where: {
          id: orgId,
        },
      });

      console.log(
        `Deleted organization and all related data for orgId: ${orgId}`
      );
    }
  }

  await synchronizeAndCleanOrganizations();

  const response = await createOrganization();
  if (response.error) {
    console.error("Error creating organization:", response.error);
  } else {
    console.log("Organization processed successfully:", response.data);
  }

  return (
    <div className="w-full mb-20">
      <Info isPro={isPro} />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
