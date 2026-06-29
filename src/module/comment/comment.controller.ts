import { NextFunction, Request, Response, Router } from "express";
import { Types } from "mongoose";
import commentService from "./comment.service";
const router = Router({ mergeParams: true });

router.post(
  "/add-reaction",
  async (req: Request, res: Response, next: NextFunction) => {
    await commentService.addReaction(
      req.body,
      new Types.ObjectId("69ef5cd3441cbe9a423aeb23"),
    );
    res.status(200).json({ msg: "success" });
  },
);

router.get(
  "/:commentId",
  async (req: Request, res: Response, next: NextFunction) => {
    const comment = await commentService.getComment(
      req.params.commentId as unknown as Types.ObjectId,
    );
    res.status(200).json({ msg: "success", data: comment });
  },
);

router.put(
  "/:commentId",
  async (req: Request, res: Response, next: NextFunction) => {
    const updatedComment = await commentService.updateComment(
      req.params.commentId as unknown as Types.ObjectId,
      new Types.ObjectId("69ef5cd3441cbe9a423aeb23"),
      req.body,
    );
    res.status(200).json({ msg: "success", data: updatedComment });
  },
);
router.delete(
  "/:commentId",
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;
    await commentService.deleteComment(
      commentId as unknown as Types.ObjectId,
      new Types.ObjectId("69ef5cd3441cbe9a423aeb23")
    );
    res.status(200).json({ msg: "success" });
  }
);

router.post(
  "{/:parentId}",
  async (req: Request, res: Response, next: NextFunction) => {
    const createdComment = await commentService.create(
      req.body,
      req.params,
      new Types.ObjectId("69ef5cd3441cbe9a423aeb23"),
    );
    res.status(200).json({ msg: "success", data: createdComment });
  },
);

export default router;
