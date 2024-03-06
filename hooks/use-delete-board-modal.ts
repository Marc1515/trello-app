import { create } from "zustand";

type DeleteBoardModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useDeleteBoardModal = create<DeleteBoardModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
