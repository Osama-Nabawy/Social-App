import z from "zod";
import { generalFields } from "../../common";
export const signupSchema = z.object({
    email:generalFields.email, 
    userName: generalFields.userName,
    password: generalFields.password,
    age: generalFields.age,
    phoneNumber: generalFields.phoneNumber
})