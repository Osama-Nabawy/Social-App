"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const common_1 = require("../../common");
exports.signupSchema = zod_1.default.object({
    email: common_1.generalFields.email,
    userName: common_1.generalFields.userName,
    password: common_1.generalFields.password,
    age: common_1.generalFields.age,
    phoneNumber: common_1.generalFields.phoneNumber
});
