import { Schema, model } from "mongoose";
import { IUser, SYS_GENDER, SYS_PROVIDER, SYS_ROLE, } from "../../../common";
const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true },
    password: {
        type: String, required: function () {
            if(this.provider === SYS_PROVIDER.system) return true
            return false
                }
    },
    phone: { type: String, required: true },
    profilePicture: { type: String },
    role: { type: Number, enum: SYS_ROLE, default: SYS_ROLE.user },
    provider: { type: Number, enum: SYS_PROVIDER, default: SYS_PROVIDER.system },
    gender: { type: Number, enum: SYS_GENDER, default: SYS_GENDER.male },
      credentialUpdatedAt: {
    type: Date,
    default: Date.now(),
  },
}, {
    timestamps: true
});
export const User = model<IUser>("User", userSchema);