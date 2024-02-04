"use server";

import {z} from "zod";

import { db } from "@/lib/db";

const createBoard =z.object({
    title: z.string(),
})

export async function create(formData: FormData) {

    const {title} = createBoard.parse({
        title: formData.get("title")
    });

    await db.board.create({
      data: {
        title,
      },
    });
  }