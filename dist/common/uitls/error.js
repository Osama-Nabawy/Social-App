"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnAuthorizedException = exports.NotFoundException = exports.BadRequestException = exports.ConflictDataException = void 0;
class ConflictDataException extends Error {
    constructor(massge) {
        super(massge, { cause: 409 });
    }
}
exports.ConflictDataException = ConflictDataException;
class BadRequestException extends Error {
    details;
    constructor(massge, details) {
        super(massge, { cause: 400 });
        this.details = details;
        this.details = details;
    }
}
exports.BadRequestException = BadRequestException;
class NotFoundException extends Error {
    constructor(massge) {
        super(massge, { cause: 404 });
    }
}
exports.NotFoundException = NotFoundException;
class UnAuthorizedException extends Error {
    constructor(massge) {
        super(massge, { cause: 401 });
    }
}
exports.UnAuthorizedException = UnAuthorizedException;
