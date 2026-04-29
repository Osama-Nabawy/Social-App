import { Schema, Types, model } from "mongoose";
import { IPost } from "../../../common";

const schema = new Schema<IPost>({
    userId: {
        type:Types.ObjectId,ref:"User",required:true
    },
    content: String,
    image: [String],
    commentCount: {type:Number , default:0},
    reactionCount: {type:Number , default:0},
    shareCount:{type:Number , default:0},
},{timestamps:true})

export const Post = model("Post",schema)