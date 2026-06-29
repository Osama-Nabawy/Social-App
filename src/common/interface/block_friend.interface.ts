import { Types } from "mongoose";

export interface IBlockFriend{
    userId: Types.ObjectId;
    blockUserId: Types.ObjectId;
}