import { Schema, Types, model } from "mongoose";
import { IReaction, ON_MODEL, SYS_REACTION } from "../../../common";

const schema = new Schema<IReaction>({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    onModel: {
        type: String,
        required:true,
        enum: ON_MODEL
    },
    reaction: {
        type: Number,
        enum: SYS_REACTION,
        default:0
    },
    refId:{ type: Types.ObjectId,ref:"onModel", required: true }
})


export const Reaction = model("Reaction",schema)