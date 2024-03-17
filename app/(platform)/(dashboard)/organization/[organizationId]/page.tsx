import React, { Suspense } from "react";

import createOrganization from "@/actions/create-organization";

import { Separator } from "@/components/ui/separator";
import { Info } from "./_components/info";
import { BoardList } from "./_components/board-list";
import { checkSubscription } from "@/lib/subscription";

import { deleteOrganization } from "@/actions/delete-organization";

const OrganizationIdPage = async () => {
  const isPro = await checkSubscription();

  await deleteOrganization();

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
