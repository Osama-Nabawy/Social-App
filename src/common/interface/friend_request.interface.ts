import { Types } from "mongoose";

export interface IRequest{
    senderId: Types.ObjectId
    reciverId:Types.ObjectId
}