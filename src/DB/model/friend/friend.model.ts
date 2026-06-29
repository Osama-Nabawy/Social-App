import { Schema, Types, model } from "mongoose";
import { IFriend } from "../../../common";

const schema = new Schema<IFriend>({
    userId: { type: Types.ObjectId, ref: "User", required: true },
    friendId: { type: Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true
})

export const Friend = model<IFriend>("Friend", schema)
