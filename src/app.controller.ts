import express, { NextFunction, Request, Response } from "express";
import authRoutes from "./module/auth/auth.controller";
import { connectDB } from "./DB";
import { connectRedis } from "./DB/redis.connection";
import dotenv from "dotenv";
import { Redis_Url } from "./config";
import { BadRequestException } from "./common/uitls/error";
import postRouter from "./module/post/post.controller";
import commentRouter from "./module/comment/comment.controller";
import { requestRouter } from "./module/friend_request/friend_request.controller";

export function bootstrap() {
  const app = express();

  connectDB();
  connectRedis();
  const port = 3000;
  app.use(express.json());
  app.use("/auth", authRoutes);
  app.use("/post", postRouter);
  app.use("/comment", commentRouter);
  app.use("/request", requestRouter);

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status((error.cause as number) | 500).json({
      message: error.message,
      success: false,
      details: error instanceof BadRequestException ? error.details : undefined,
    });
  });
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
