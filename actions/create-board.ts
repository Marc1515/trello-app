"use server";

import {z} from "zod";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  errors?: {
    title?: string[];
  },
  message?: string | null;
}

const CreateBoard = z.object({
    title: z.string().min(3, {
      message: "Minimum length of 3 letters is required"
    }),
})

export async function create(prevState: State, formData: FormData) {

    const validateFields = CreateBoard.safeParse({
        title: formData.get("title")
    });

    if(!validateFields.success) {
      return {
        errors: validateFields.error.flatten().fieldErrors,
        messsage: "Missing Fields"
      }
    }

    const {title} = validateFields.data;

    try {
      await db.board.create({
        data: {
          title,
        },
      });
    } catch (error) {
      return{      
        message: "Database Error"
      }
    }


    revalidatePath("/organization/org_2bkLhXmlvUywmOGEoB9ZVkwyhD6");
    redirect("/organization/org_2bkLhXmlvUywmOGEoB9ZVkwyhD6");
  }