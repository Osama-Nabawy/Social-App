"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepo = exports.UserRepository = void 0;
const DB_repository_1 = require("../../DB.repository");
const user_model_1 = require("./user.model");
class UserRepository extends DB_repository_1.AbstractRepository {
    constructor() {
        super(user_model_1.User);
    }
}
exports.UserRepository = UserRepository;
exports.userRepo = new UserRepository();
