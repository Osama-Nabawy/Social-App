import { SYS_GENDER, SYS_PROVIDER, SYS_ROLE } from "../enums";

export interface IUser{
    email: string,
    userName: string,
    password: string,
    phone?: string,
    profilePicture?: string,
    role?: SYS_ROLE,
    gender?: SYS_GENDER,
    provider?: SYS_PROVIDER,
    credentialUpdatedAt?: Date
}