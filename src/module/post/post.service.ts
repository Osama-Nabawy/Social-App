import { Types } from "mongoose";
import { AddReactionDTO, CreatePostDTO } from "./post.dto";
import { PostRepository } from "../../DB";
import { BadRequestException, NotFoundException, ON_MODEL, UnAuthorizedException } from "../../common";
import { UserReactionRepository } from "../../DB/model/user-reaction/user-reaction.repository";

export class PostService {
    constructor(private readonly postRepo: PostRepository,
        private readonly userReactionRepo: UserReactionRepository
    ) { }
    
    
    async create(createPostDTO: CreatePostDTO, userId: Types.ObjectId) {
        return await this.postRepo.create({ ...createPostDTO, userId })
    }

    async addReaction(addReactionDTO: AddReactionDTO, userId: Types.ObjectId) {
        const { postId, reaction } = addReactionDTO
        const postExist = await this.postRepo.findOne({ _id: postId })
        if (!postExist) {
            throw new BadRequestException("Post not found")
        }
        const reactionExist = await this.userReactionRepo.findOne({ userId, onModel: "Post", refId: postId })
        if (!reactionExist) {
            await this.userReactionRepo.create({ userId, onModel: ON_MODEL.post, refId: new Types.ObjectId(postId), reaction })
            await this.postRepo.updateOne({ _id: postId }, { $inc: { reactionCount: 1 } })
                return
        }
        if (reactionExist) {
            if (reactionExist.reaction == reaction) {
                await this.userReactionRepo.deleteOne(reactionExist._id)
                await this.postRepo.updateOne({ _id: postId }, { $inc: { reactionCount: -1 } })
                return
            } else {
                await this.userReactionRepo.updateOne({ _id: reactionExist._id }, { reaction })
                return  
            }

        }
        
    }

    async getpost(postId: Types.ObjectId) { 
        const postExist = await this.postRepo.findOne({ _id: postId })
        if (!postExist) {
            throw new NotFoundException("Post not found")
        }
        return postExist
    }
    async updatePost(postId: Types.ObjectId, userId: Types.ObjectId, updateData: CreatePostDTO) {
        const post = await this.postRepo.findOne({ _id: postId })
        if (!post) {
            throw new NotFoundException("Post not found")
        }
        if (post.userId.toString() !== userId.toString()) {
            throw new UnAuthorizedException("You are not the owner of this post")
        }
        return await this.postRepo.updateOne({ _id: postId }, { ...updateData })
    }
    async deletePost(postId: Types.ObjectId, userId: Types.ObjectId) {
        const post = await this.postRepo.findOne({ _id: postId })
        if (!post) {
            throw new NotFoundException("Post not found")
        }
        if (post.userId.toString() !== userId.toString()) {
            throw new UnAuthorizedException("You are not the owner of this post")
        }
        return await this.postRepo.deleteOne({ _id: postId })
    }
    async getAllPosts(userId: Types.ObjectId) {
        return await this.postRepo.findAll({ userId })
    }

}
export default new PostService(new PostRepository, new UserReactionRepository)