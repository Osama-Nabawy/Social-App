"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
function connectDB() {
    mongoose_1.default.connect("mongodb://127.0.0.1:27017/Social-App").then(() => {
        console.log("DB connected successfully");
    }).catch((error) => {
        console.log("fail to connect to DB", error);
    });
}
