import { create } from "zustand";

type DeleteBoardModalStore = {
  id?: string;
  title?: string;
  isOpen: boolean;
  onOpen: (id: string, title: string) => void;
  onClose: () => void;
};

export const useDeleteBoardModal = create<DeleteBoardModalStore>((set) => ({
  id: undefined,
  title: undefined,
  isOpen: false,
  onOpen: (id: string, title: string) => set({ isOpen: true, id, title }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
