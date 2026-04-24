"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = void 0;
const zod_1 = __importDefault(require("zod"));
exports.generalFields = {
    email: zod_1.default.email(),
    userName: zod_1.default.string().min(3).max(20),
    password: zod_1.default.string().min(6).max(100),
    age: zod_1.default.number().int().positive(),
    phoneNumber: zod_1.default.string().regex(new RegExp("^(010|011|012|015)[0-9]{8}$")).optional()
};
