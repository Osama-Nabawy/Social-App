import { IFriend } from "../../../common";
import { AbstractRepository } from "../../DB.repository";
import { Friend } from "./friend.model";

export class FriendRepository extends AbstractRepository<IFriend> {
    constructor() {
        super(Friend);
    }
}