import { Types } from "mongoose";
import { IRequest } from "../../../common";
import { AbstractRepository } from "../../DB.repository";
import { FriendRequest } from "./friend_req.model";

export class FriendReqRepository extends AbstractRepository<IRequest> { 
    constructor() {
        super(FriendRequest)
    }
    sendRequest(senderId: Types.ObjectId, reciverId: Types.ObjectId) { 
        
    }
}