import { IBlockFriend } from "../../../common";
import { AbstractRepository } from "../../DB.repository";
import { BlockFriend } from "./block.model";

export class BlockFriendRepository extends AbstractRepository<IBlockFriend> { 
    constructor() {
        super(BlockFriend)
    }
}