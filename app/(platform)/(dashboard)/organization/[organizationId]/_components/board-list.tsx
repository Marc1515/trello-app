import { Board } from "@prisma/client";

import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { HelpCircle, User2 } from "lucide-react";

import { db } from "@/lib/db";
import { Hint } from "@/components/hint";
import { Skeleton } from "@/components/ui/skeleton";
import { FormPopover } from "@/components/form/form-popover";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { getAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

import { BoardOptions } from "../../../board/[boardId]/_components/board-options";

interface BoardListProps {
  data: Board;
}

export const BoardList = async ({ data }: BoardListProps) => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const boards = await db.board.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const availableCount = await getAvailableCount();
  const isPro = await checkSubscription();

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="h-6 w-6 mr-2" />
        Your Boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <div key={board.id} className="flex flex-col">
            <div className="absolute flex flex-row justify-between z-50">
              <p className="relative font-semibold text-white">{board.title}</p>
              <BoardOptions id={board.id} />
            </div>

            <Link
              href={`/board/${board.id}`}
              className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
              style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            </Link>
          </div>
        ))}
        {/* Mobile Screen */}
        <FormPopover align="start" side="bottom" sideOffSet={10}>
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex md:hidden flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Create new board</p>
            <span className="text-xs">
              {isPro
                ? "Unlimited"
                : `${MAX_FREE_BOARDS - availableCount} remaining`}
            </span>
            <Hint
              sideOffSet={40}
              description={`Free workspaces can have to 5 open boards. For unlimited boards upgrade this workspace.`}
            >
              <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
            </Hint>
          </div>
        </FormPopover>
        {/* Mobile Screen */}

        {/* Wider Screens */}
        <FormPopover sideOffSet={10} side="right">
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm hidden md:flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <p className="text-sm">Create new board</p>
            <span className="text-xs">
              {isPro
                ? "Unlimited"
                : `${MAX_FREE_BOARDS - availableCount} remaining`}
            </span>
            <Hint
              sideOffSet={40}
              description={`Free workspaces can have to 5 open boards. For unlimited boards upgrade this workspace.`}
            >
              <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
            </Hint>
          </div>
        </FormPopover>
        {/* Wider Screens */}
      </div>
    </div>
  );
};

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  );
};
