"use strict";
// import dotenv from "dotenv";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_SECRET = exports.ACCESS_TOKEN_SECRET = exports.emailPassword = exports.Redis_Url = void 0;
// dotenv.config();
exports.Redis_Url = process.env.REDIS_URL;
exports.emailPassword = process.env.EMAIL_PASSWORD;
exports.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
exports.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
