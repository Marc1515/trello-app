"use client";

import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDeleteBoardModal } from "@/hooks/use-delete-board-modal";
import { Button } from "@/components/ui/button";
import { deleteBoard } from "@/actions/delete-board";
import { useAction } from "@/hooks/use-action";

interface DeleteBoardModalProps {
  id: string;
}

export const DeleteBoardModal = ({ id }: DeleteBoardModalProps) => {
  const deleteModal = useDeleteBoardModal();

  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = () => {
    console.log(id);
    execute({ id });
  };

  return (
    <Dialog open={deleteModal.isOpen} onOpenChange={deleteModal.onClose}>
      <DialogContent className="max-w-md">
        <p>Are you absolutely sure to delete this board?</p>
        <Button onClick={onDelete} disabled={isLoading} variant={"destructive"}>
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
};
