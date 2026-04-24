"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccessToken = createAccessToken;
exports.createRefreshToken = createRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const config_1 = require("../../config");
function createAccessToken(sub, username, email, deviceId) {
    const jti = node_crypto_1.default.randomBytes(10).toString("hex");
    const payload = {
        sub,
        username,
        email,
        deviceId,
        jti,
        iat: Math.floor(Date.now() / 1000),
    };
    return jsonwebtoken_1.default.sign(payload, config_1.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
}
function createRefreshToken(sub, username, email, deviceId) {
    const jti = node_crypto_1.default.randomBytes(10).toString("hex");
    const payload = {
        sub,
        username,
        email,
        deviceId,
        jti,
        iat: Math.floor(Date.now() / 1000),
    };
    return jsonwebtoken_1.default.sign(payload, config_1.REFRESH_TOKEN_SECRET, {
        expiresIn: "1y",
    });
}
function verifyAccessToken(token) {
    return jsonwebtoken_1.default.verify(token, config_1.ACCESS_TOKEN_SECRET);
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, config_1.REFRESH_TOKEN_SECRET);
}
