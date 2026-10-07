import { create } from "zustand";

import { Board } from "@/generated/prisma/browser";

type DeleteBoardModalStore = {
  data?: Board;
  isOpen: boolean;
  onOpen: (data: Board) => void;
  onClose: () => void;
};

export const useDeleteBoardModal = create<DeleteBoardModalStore>((set) => ({
  data: undefined,
  isOpen: false,
  onOpen: (data: Board) => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false, data: undefined }),
}));
