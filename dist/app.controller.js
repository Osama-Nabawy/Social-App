"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("./module/auth/auth.controller"));
const DB_1 = require("./DB");
const redis_connection_1 = require("./DB/redis.connection");
const error_1 = require("./common/uitls/error");
const post_controller_1 = __importDefault(require("./module/post/post.controller"));
const comment_controller_1 = __importDefault(require("./module/comment/comment.controller"));
const friend_request_controller_1 = require("./module/friend_request/friend_request.controller");
function bootstrap() {
    const app = (0, express_1.default)();
    (0, DB_1.connectDB)();
    (0, redis_connection_1.connectRedis)();
    const port = 3000;
    app.use(express_1.default.json());
    app.use("/auth", auth_controller_1.default);
    app.use("/post", post_controller_1.default);
    app.use("/comment", comment_controller_1.default);
    app.use("/request", friend_request_controller_1.requestRouter);
    app.use((error, req, res, next) => {
        return res.status(error.cause | 500).json({
            message: error.message,
            success: false,
            details: error instanceof error_1.BadRequestException ? error.details : undefined,
        });
    });
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
