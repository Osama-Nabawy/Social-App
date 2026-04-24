"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
exports.connectRedis = connectRedis;
const redis_1 = require("redis");
const config_1 = require("../config");
exports.redisClient = (0, redis_1.createClient)({
    url: config_1.Redis_Url
});
function connectRedis() {
    exports.redisClient.connect().then(() => {
        console.log("redis connected successfully");
    }).catch((error) => {
        console.log("fail to connect redis db", error);
    });
}
