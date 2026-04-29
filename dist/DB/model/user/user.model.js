"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const common_1 = require("../../../common");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    password: {
        type: String, required: function () {
            if (this.provider === common_1.SYS_PROVIDER.system)
                return true;
            return false;
        }
    },
    phoneNumber: { type: String, required: true },
    profilePicture: { type: String },
    role: { type: Number, enum: common_1.SYS_ROLE, default: common_1.SYS_ROLE.user },
    provider: { type: Number, enum: common_1.SYS_PROVIDER, default: common_1.SYS_PROVIDER.system },
    gender: { type: Number, enum: common_1.SYS_GENDER, default: common_1.SYS_GENDER.male },
    credentialUpdatedAt: {
        type: Date,
        default: Date.now(),
    },
}, {
    timestamps: true
});
exports.User = (0, mongoose_1.model)("User", userSchema);
