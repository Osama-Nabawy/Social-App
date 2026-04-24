"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidate = void 0;
const common_1 = require("../common");
const isValidate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errMessages = result.error.issues.reduce((acc, issue) => {
                acc[issue.path[0]] = issue.message;
                return acc;
            }, {});
            throw new common_1.BadRequestException("Validation Error", errMessages);
        }
        next();
    };
};
exports.isValidate = isValidate;
