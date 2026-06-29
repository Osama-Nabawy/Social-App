import { Types } from "mongoose";
import {
  CommentRepository,
  PostRepository,
  UserReactionRepository,
} from "../../DB";
import { AddReactionDTO, CreateCommentDTO } from "./comment.dto";
import {
  BadRequestException,
  IComment,
  IPost,
  NotFoundException,
  ON_MODEL,
  UnAuthorizedException,
} from "../../common";

export class CommentService {
  constructor(
    private readonly commentRepo: CommentRepository,
    private readonly postRepo: PostRepository,
    private readonly userReactionRepo: UserReactionRepository,
  ) {}

  async create(
    createCommentDTO: CreateCommentDTO,
    params: any,
    userId: Types.ObjectId,
  ) {
    const { postId, parentId } = params as {
      postId?: string;
      parentId?: string;
    };
    if (!postId) {
      throw new BadRequestException("PostId is required");
    }
    const postExist = await this.postRepo.findOne({ _id: postId });
    if (!postExist) {
      throw new NotFoundException("Post not found");
    }
    let parentCommentExist = undefined;
    if (parentId) {
      parentCommentExist = await this.commentRepo.findOne({ _id: parentId });
      if (!parentCommentExist) {
        throw new NotFoundException("Parent comment not found");
      }
    }
    return await this.commentRepo.create({
      ...createCommentDTO,
      parentId: parentId as unknown as Types.ObjectId,
      userId,
      postId: params.postId || parentCommentExist?.postId,
    });
  }

  async addReaction(addReactionDTO: AddReactionDTO, userId: Types.ObjectId) {
    const { commentId, reaction } = addReactionDTO;
    const commentExist = await this.commentRepo.findOne({ _id: commentId });
    if (!commentExist) {
      throw new BadRequestException("Comment not found");
    }
    const reactionExist = await this.userReactionRepo.findOne({
      userId,
      onModel: "comment",
      refId: commentId,
    });
    if (!reactionExist) {
      await this.userReactionRepo.create({
        userId,
        onModel: ON_MODEL.comment,
        refId: new Types.ObjectId(commentId),
        reaction,
      });
      await this.commentRepo.updateOne(
        { _id: commentId },
        { $inc: { reactionCount: 1 } },
      );
      return;
    }
    if (reactionExist) {
      if (reactionExist.reaction == reaction) {
        await this.userReactionRepo.deleteOne(reactionExist._id);
        await this.commentRepo.updateOne(
          { _id: commentId },
          { $inc: { reactionCount: -1 } },
        );
        return;
      } else {
        await this.userReactionRepo.updateOne(
          { _id: reactionExist._id },
          { reaction },
        );
        return;
      }
    }
  }

  async getComment(commentId: Types.ObjectId) {
    return await this.commentRepo.findOne({ _id: commentId });
  }
  async updateComment(
    commentId: Types.ObjectId,
    userId: Types.ObjectId,
    updateData: CreateCommentDTO,
  ) {
    const comment = await this.commentRepo.findOne({ _id: commentId });
    if (!comment) {
      throw new NotFoundException("Comment not found");
    }
    if (comment.userId.toString() !== userId.toString()) {
      throw new BadRequestException("You are not the owner of this comment");
    }
    return await this.commentRepo.updateOne(
      { _id: commentId },
      { ...updateData },
    );
  }
  async deleteComment(commentId: Types.ObjectId, userId: Types.ObjectId) {
    const comment = await this.commentRepo.findOne({ _id: commentId }, {}, { populate: "postId" });
    if (!comment) {
      throw new NotFoundException("Comment not found");
    }
    const commentAuthorId = comment.userId.toString();
    const postAuthorId = (comment.postId as unknown as IPost[])[0]?.userId.toString();
    if (commentAuthorId !== userId.toString() && postAuthorId !== userId.toString()) {
      throw new UnAuthorizedException("You are not authorized to delete this comment");
    }

    return await this.commentRepo.deleteOne({ _id: commentId });
  }

  async getAllComments(params: any) {
    const comments = await this.commentRepo.findAll({
      postId: params.postId,
      parentId: params.parentId,
    });
    if (!comments.length) {
      throw new NotFoundException("Comments not found");
    }
    return comments;
  }
}

export default new CommentService(
  new CommentRepository(),
  new PostRepository(),
  new UserReactionRepository(),
);
