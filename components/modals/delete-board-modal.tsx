"use client";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deleteBoard } from "@/actions/delete-board";

import { useDeleteBoardModal } from "@/hooks/use-delete-board-modal";
import { useAction } from "@/hooks/use-action";

export const DeleteBoardModal = () => {
  const deleteBoardModal = useDeleteBoardModal();

  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = async () => {
    if (deleteBoardModal.id) {
      await execute({ id: deleteBoardModal.id });
      deleteBoardModal.onClose();
    }
  };

  return (
    <Dialog
      open={deleteBoardModal.isOpen}
      onOpenChange={() => deleteBoardModal.onClose()}
    >
      <DialogContent className="max-w-xs sm:max-w-md rounded-sm text-neutral-700">
        <DialogHeader>
          <p className="py-3 pt-7 sm:pt-4">
            Are you absolutely sure to delete{" "}
            <span className="font-bold">{deleteBoardModal.title}</span>?
          </p>
        </DialogHeader>
        <div className="flex justify-center gap-4">
          <Button
            className="max-w-20"
            onClick={onDelete}
            disabled={isLoading}
            variant={"destructive"}
          >
            Delete
          </Button>
          <DialogClose className="max-w-20">
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};
