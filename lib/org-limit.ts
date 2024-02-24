import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

import { MAX_FREE_BOARDS } from "@/constants/boards";

export const incrementAvaibleCount = async () => {
  const { orgId } = auth();

  if (!orgId) throw new Error("Unauthorized");

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId },
  });

  if (orgLimit) {
    await db.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count + 1 },
    });
  } else {
    await db.orgLimit.create({
      data: { orgId, count: 1 },
    });
  }
};

export const decreaseAvaibleCount = async () => {
  const { orgId } = auth();

  if (!orgId) throw new Error("Unauthorized");

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId },
  });

  if (orgLimit) {
    await db.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 },
    });
  } else {
    await db.orgLimit.create({
      data: { orgId, count: 1 },
    });
  }
};
