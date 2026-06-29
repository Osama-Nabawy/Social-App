import { Schema, Types, model } from "mongoose";
import { IBlockFriend } from "../../../common";
const schema = new Schema<IBlockFriend>({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    blockUserId: { type: Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true
})
export const BlockFriend = model("BlockFriend", schema);