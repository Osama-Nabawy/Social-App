import { Schema, Types, model } from "mongoose";
import { IRequest } from "../../../common";
const schema = new Schema<IRequest>({
    reciverId: { type: Types.ObjectId, ref: "User", required: true },
    senderId: { type: Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: { createdAt: true }
}
)

export const FriendRequest = model<IRequest>("FriendRequest", schema)