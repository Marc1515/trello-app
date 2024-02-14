"use client";

import { List } from "@prisma/client";

interface ListContainerProps {
  data: List[];
  boardId: string;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  return <div>List container</div>;
};
