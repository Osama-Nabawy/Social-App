"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const common_1 = require("../common");
const DB_1 = require("../DB");
const isAuthenticated = async (req, res, next) => {
    const Authorization = req.headers.authorization;
    if (!Authorization) {
        throw new common_1.BadRequestException("Authorization header required");
    }
    const token = Authorization.startsWith("Bearer ")
        ? Authorization.split(" ")[1]
        : Authorization;
    const payload = (0, common_1.verifyAccessToken)(token);
    if (!payload) {
        throw new common_1.BadRequestException("invalid token");
    }
    const userExist = await DB_1.userRepo.findOne({ _id: payload.sub });
    if (!userExist) {
        throw new common_1.BadRequestException("User not found");
    }
    if (userExist.credentialUpdatedAt &&
        new Date(userExist.credentialUpdatedAt).getTime() >
            payload.iat * 1000) {
        throw new common_1.BadRequestException("Invalid token");
    }
    const tokenExist = await DB_1.redisClient.get(`bl_${payload.jti}`);
    if (tokenExist) {
        throw new common_1.BadRequestException("revoked token");
    }
    req.user = userExist;
    req.payload = payload;
    next();
};
exports.isAuthenticated = isAuthenticated;
