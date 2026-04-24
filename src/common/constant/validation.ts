import z from "zod";

export const generalFields = {
        email: z.email(),
        userName: z.string().min(3).max(20),
        password: z.string().min(6).max(100),
        age: z.number().int().positive(),
        phoneNumber: z.string().regex(new RegExp("^(010|011|012|015)[0-9]{8}$")).optional()
}