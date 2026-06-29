import { Types } from "mongoose";
import { IPost } from "./post.interface";

export interface IComment {
    postId?: Types.ObjectId|IPost[];
    userId: Types.ObjectId;
    parentId?: Types.ObjectId;
    content?: string;
    image?: string[];
    mentionUserId?: Types.ObjectId[];
    reactionCount?: number;
}