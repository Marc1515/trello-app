"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

type ReturnType = {
  error?: string;
  data?: any;
};

const createOrganization = async (): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const existingOrganization = await db.organization.findUnique({
    where: { id: orgId },
  });

  if (existingOrganization) {
    return { error: "Organization already exists" };
  }

  try {
    const organization = await db.organization.create({
      data: {
        id: orgId,
        name: "Nombre por defecto",
        defaultBoardsCreated: false,
      },
    });

    return { data: organization };
  } catch (error) {
    console.error("Error al crear la organización:", error);
    return { error: "Failed to create organization" };
  }
};

export default createOrganization;
