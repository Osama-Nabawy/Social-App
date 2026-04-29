import { Types } from "mongoose";

export interface IPost {
    userId: Types.ObjectId;
    content?: string;
    image?: string[];
            reactionCount?: number
    commentCount?: number
    shareCount?:number
    
}