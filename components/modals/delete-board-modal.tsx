"use client";

import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDeleteBoardModal } from "@/hooks/use-delete-board-modal";
import { Button } from "@/components/ui/button";
import { deleteBoard } from "@/actions/delete-board";
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
      <DialogContent className="max-w-md">
        <p>Are you absolutely sure to delete this board?</p>
        <Button onClick={onDelete} disabled={isLoading} variant={"destructive"}>
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
};
