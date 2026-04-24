import { NextFunction, Request, Response } from "express";
import { BadRequestException, ITokenPayload, verifyAccessToken } from "../common";
import { redisClient, userRepo } from "../DB";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const Authorization = req.headers.authorization;

  if (!Authorization) {
    throw new BadRequestException("Authorization header required");
  }

  const token = Authorization.startsWith("Bearer ")
    ? Authorization.split(" ")[1]
    : Authorization;

  const payload = verifyAccessToken(token as string) as ITokenPayload;

  if (!payload) {
    throw new BadRequestException("invalid token");
  }

  const userExist = await userRepo.findOne({ _id: payload.sub });

  if (!userExist) {
    throw new BadRequestException("User not found");
  }

  if (
    userExist.credentialUpdatedAt &&
    new Date(userExist.credentialUpdatedAt).getTime() >
      payload.iat * 1000
  ) {
    throw new BadRequestException("Invalid token");
  }

  const tokenExist = await redisClient.get(`bl_${payload.jti}`);

  if (tokenExist) {
    throw new BadRequestException("revoked token");
  }

  req.user = userExist;
  req.payload = payload;

  next();
};