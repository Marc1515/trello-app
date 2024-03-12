"use client";

import { Suspense, useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";

import { Info } from "./_components/info";
import { BoardList } from "./_components/board-list";
import { checkSubscription } from "@/lib/subscription";
import { createDefaultBoardsForNewOrganization } from "@/lib/create-default-boards-for-new-org";
import { auth } from "@clerk/nextjs";

const OrganizationIdPage = () => {
  const [isPro, setIsPro] = useState(false);
  const { userId, orgId } = auth();

  useEffect(() => {
    async function initOrganizationSetup() {
      // Verifica la suscripción y establece isPro
      const isProStatus = await checkSubscription();
      setIsPro(isProStatus);

      // Lógica para crear tableros por defecto, si es necesario
      await createDefaultBoardsForNewOrganization(orgId);
    }

    if (orgId) {
      initOrganizationSetup();
    }
  }, [orgId]);

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
