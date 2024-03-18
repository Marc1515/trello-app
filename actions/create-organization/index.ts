"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { defaultBoardImages } from "@/constants/defaultBoardImages";

import { incrementAvaibleCount } from "@/lib/org-limit";

type ReturnType = {
  error?: string;
  data?: any;
};

const createDefaultBoards = async (orgId: string) => {
  for (const boardImage of defaultBoardImages) {
    await db.board.create({
      data: {
        orgId: orgId,
        title: boardImage.title_name || "Default Board",
        imageId: boardImage.id,
        imageThumbUrl: boardImage.urls.thumb,
        imageFullUrl: boardImage.urls.full,
        imageUserName: boardImage.user.links.html,
        imageLinkHTML: boardImage.links.html,
      },
    });
    await incrementAvaibleCount();
  }
};

const createOrganization = async (): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  let organization = await db.organization.findUnique({
    where: { id: orgId },
  });

  if (!organization) {
    organization = await db.organization.create({
      data: {
        id: orgId,
        name: "Nombre por defecto",
        defaultBoardsCreated: false,
      },
    });

    if (!organization.defaultBoardsCreated) {
      await createDefaultBoards(orgId);

      await db.organization.update({
        where: { id: orgId },
        data: { defaultBoardsCreated: true },
      });
    }

    return { data: organization };
  } else {
    return { error: "Organization already exists" };
  }
};

export default createOrganization;
