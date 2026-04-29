import { IReaction } from "../../../common";
import { AbstractRepository } from "../../DB.repository";
import { Reaction } from "./user-reaction.model";

export class UserReactionRepository extends AbstractRepository<IReaction>{
    constructor() {
        super(Reaction)
    }
}