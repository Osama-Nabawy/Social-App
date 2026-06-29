import z from "zod";
import { SYS_REACTION } from "../../common";
import { Types } from "mongoose";

export interface CreateCommentDTO {
  content?: string;
  image?: string[];
  mentionUserId?: Types.ObjectId[];
}

export const commentSchema = z
  .object({
    postId: z.string(),
    userId: z.string(),
    content: z.string().optional(),
    image: z.string().optional(),
    mentionUserId: z.array(z.string()).optional(),
  })
  .refine((data) => {
    const { content, image } = data;
    if (!content && !image) {
      throw new Error("Either content or image must be provided");
    }
    return true;
  });

export interface AddReactionDTO {
  commentId: string;
  reaction: SYS_REACTION;
}
