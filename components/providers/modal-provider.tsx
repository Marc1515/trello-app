"use client";

import { useIsClient } from "@/hooks/use-is-client";

import { CardModal } from "@/components/modals/card-modal";
import { ProModal } from "@/components/modals/pro-modal";
import { DeleteBoardModal } from "../modals/delete-board-modal";

export const ModalProvider = () => {
  const isMounted = useIsClient();

  if (!isMounted) return null;

  return (
    <>
      <CardModal />
      <ProModal />
      <DeleteBoardModal />
    </>
  );
};
