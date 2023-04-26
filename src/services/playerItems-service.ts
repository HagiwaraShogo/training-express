import * as PlayerItemModel from "../models/playerItems-model";
import { PlayerItem, PlayerItemKey } from "../interfaces/PlayerItem";
import * as PlayerModel from "../models/player-model";
import { PoolConnection } from "mysql2/promise";

const addItem = async (
    data: PlayerItem,
    dbConnection: PoolConnection
): Promise<number> => {
    if(data.playerId == null) throw new Error("playerId is undefined.");
    await PlayerModel.playerExistenceCheck(data.playerId as number, dbConnection);

    if(data.itemId == null) throw new Error("itemId is undefined.");
    await PlayerItemModel.itemExistenceCheck(data.itemId as number, dbConnection);

    await PlayerItemModel.addItem(data, dbConnection);
    
    return PlayerItemModel.getItemCount(data, dbConnection);
}

export { addItem };