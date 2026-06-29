import { Types } from "mongoose";
import { FriendReqRepository } from "../../DB/model/frind_request/friend_req.repository";
import { BlockFriendRepository } from "../../DB/model/block/block.repository";
import { BadRequestException, UnAuthorizedException } from "../../common";
import { FriendRepository } from "../../DB/model/friend/friend.repository";

export class FriendRequestService{
    constructor(private readonly friendReqRepo: FriendReqRepository,
        private readonly friendRepo: FriendRepository,
        private readonly blockRepo: BlockFriendRepository
    ) { }

    async sendFriendRequest(senderId: Types.ObjectId, reciverId: Types.ObjectId) {
        const blockExist = await this.blockRepo.findOne({ $or: [{ userId: senderId, blockUserId: reciverId }, { userId: reciverId, blockUserId: senderId }] })
        if (blockExist) throw new BadRequestException("You can't send friend request to this user")
        const friendExist = await this.friendRepo.findOne({ $or: [{ userId: senderId, friendId: reciverId }, { userId: reciverId, friendId: senderId }] })
        if (friendExist) throw new BadRequestException("You are already friends with this user")
        const requestExist = await this.friendReqRepo.findOne({ $or: [{ senderId, reciverId }, { senderId: reciverId, reciverId: senderId }] })
        if (requestExist) throw new BadRequestException("Friend request already sent")
        return await this.friendReqRepo.create({ senderId, reciverId })
    }

    async acceptFriendRequest(requestId: Types.ObjectId, userId: Types.ObjectId) {
        const request = await this.friendReqRepo.findOne({ _id: requestId })
        if (!request) throw new BadRequestException("Friend request not found")
        if (request.reciverId.toString() !== userId.toString()) throw new UnAuthorizedException("You are not the reciver of this friend request")
        await this.friendRepo.create({ userId: request.reciverId, friendId: request.senderId })
        await this.friendReqRepo.deleteOne({ _id: requestId })
    }
    async declareFriendRequest(requestId: Types.ObjectId, userId: Types.ObjectId) {
        const request = await this.friendReqRepo.findOne({ _id: requestId })
        if (!request) throw new BadRequestException("Friend request not found")
        if (request.reciverId.toString() !== userId.toString() || request.senderId.toString() !== userId.toString()) {
            throw new UnAuthorizedException("You are not the reciver of this friend request")
        }
        await this.friendReqRepo.deleteOne({ _id: requestId })
    }

    async removeFriend(userId: Types.ObjectId, friendId: Types.ObjectId) {
        const friendExist = await this.friendRepo.findOne({ $or: [{ userId, friendId }, { userId: friendId, friendId: userId }] })
        if (!friendExist) throw new BadRequestException("You are not friends with this user")
        await this.friendRepo.deleteOne({ _id: friendExist._id })
    }





}

export default new FriendRequestService(new FriendReqRepository(), new FriendRepository(), new BlockFriendRepository())