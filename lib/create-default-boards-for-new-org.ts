import { defaultBoardImages } from "@/constants/defaultBoardImages";
import { db } from "./db";

export const createDefaultBoardsForNewOrganization = async (orgId: string) => {
  console.log(
    `Iniciando la creación de tableros por defecto para la organización: ${orgId}`
  );
  const defaultBoards = defaultBoardImages;

  for (const boardData of defaultBoards) {
    const {
      id,
      alt_description: title,
      urls: { thumb: imageThumbUrl, full: imageFullUrl },
      links: { html: imageLinkHTML },
    } = boardData;

    try {
      const board = await db.board.create({
        data: {
          title,
          orgId,
          imageId: id,
          imageThumbUrl,
          imageFullUrl,
          imageLinkHTML,
          imageUserName: "Default", // Asumiendo que no tienes un nombre de usuario para estas imágenes
        },
      });

      console.log(`Board created successfully: ${board.id}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating board: ${error.message}`);
      } else {
        console.error("An unknown error occurred");
      }
    }
  }
};
