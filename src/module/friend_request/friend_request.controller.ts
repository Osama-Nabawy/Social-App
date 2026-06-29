import { Router } from "express";
import friendRequestService from "./friend_request.service";
import { Types } from "mongoose";
const router = Router();

router.post("/send/:senderId", async (req, res) => {
    await friendRequestService.sendFriendRequest(
      req.params.senderId as unknown as Types.ObjectId,
      new Types.ObjectId("69ef5cd3441cbe9a423aeb23"),
    );
    res.sendStatus(204);
});

router.post("/accept/:requestId", async (req, res) => {
    await friendRequestService.acceptFriendRequest(
        req.params.requestId as unknown as Types.ObjectId,
        new Types.ObjectId("69ef5cd3441cbe9a423aeb23")
    );
    res.sendStatus(204);
});
router.post("/declare/:requestId", async (req, res) => {
    await friendRequestService.declareFriendRequest(
        req.params.requestId as unknown as Types.ObjectId,
        new Types.ObjectId("69ef5cd3441cbe9a423aeb23")
    );
    res.sendStatus(204);
});
router.delete("/remove/:friendId", async (req, res) => {
    await friendRequestService.removeFriend(
        new Types.ObjectId("69ef5cd3441cbe9a423aeb23"),
        req.params.friendId as unknown as Types.ObjectId
    );
    res.sendStatus(204);
});

export const requestRouter = router;