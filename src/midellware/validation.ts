import { NextFunction, Request, Response } from "express";
import  { ZodObject } from "zod";
import { BadRequestException } from "../common";

export const isValidate = (schema: ZodObject) => {
    return (req :Request, res:Response, next:NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
           const errMessages = result.error.issues.reduce((acc, issue) => {
               acc[issue.path[0] as string] = issue.message;
               return acc;
           }, {} as Record<string, string>);

            throw new BadRequestException("Validation Error", errMessages);
        }
        next();
    }
}