import { Schema, model, Types } from "mongoose";
import { IComment } from "../../../common";

const commentSchema = new Schema<IComment>(
  {
    postId: { type: Types.ObjectId, ref: "Post", required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    parentId: { type: Types.ObjectId, ref: "Comment" },
    content: { type: String, maxlength: 200 },
    image: { type: String },
    mentionUserId: [{ type: Types.ObjectId, ref: "User" }],
    reactionCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);
// commentSchema.pre("deleteOne", async function () {
//   let filter = this.getFilter();
//   let repliescomment = await this.model.find({ parentId: filter._id });
//   if (repliescomment.length > 0) {
//     await this.model.deleteOne({ _id: filter._id });
//   }
// });
// commentSchema.pre("deleteOne", async function () {
//   console.log(this);
//   let filter = this.getFilter();
//   const replies = await this.model.find({ parentId: filter._id });
//   if (replies.length > 0) {
//     for (const reply of replies) {
//       await this.model.deleteOne({ _id: reply._id });
//     }
//   }
// })

// commentSchema.pre("deleteOne", async function () {
//   const filter = this.getFilter();

//   const replies = await this.model.find({
//     parentId: filter._id,
//   });

//   for (const reply of replies) {
//     await this.model.deleteOne({ _id: reply._id });
//   }
// });
commentSchema.pre("findOneAndDelete", async function () {
    const filter = this.getFilter();
    const replies = await this.model.find({
      parentId: filter._id,
    });
    for (const reply of replies) {
      await this.model.deleteOne({ _id: reply._id });
    }
})
export const Comment = model<IComment>("Comment", commentSchema);
