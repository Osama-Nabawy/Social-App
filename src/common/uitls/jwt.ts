import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "node:crypto";
import { ITokenPayload } from "../interface";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../config";


export function createAccessToken(
  sub: string,
  username: string,
  email: string,
  deviceId: string
): string {
  const jti = crypto.randomBytes(10).toString("hex");

  const payload: ITokenPayload = {
    sub,
    username,
    email,
    deviceId,
    jti,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
}

export function createRefreshToken(
  sub: string,
  username: string,
  email: string,
  deviceId: string,
): string {
  const jti = crypto.randomBytes(10).toString("hex");

  const payload: ITokenPayload = {
    sub,
    username,
    email,
    deviceId,
    jti,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "1y",
  });
}

export function verifyAccessToken(token: string): JwtPayload | string {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token: string): JwtPayload | string {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}