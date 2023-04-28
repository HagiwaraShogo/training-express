import * as PlayerItemModel from "../models/playerItems-model";
import { Player } from "../interfaces/Player";
import { Item } from "../interfaces/Item";
import { PlayerItem, PlayerItemKey } from "../interfaces/PlayerItem";
import * as PlayerModel from "../models/player-model";
import * as ItemModel from "../models/item-model"
import { PoolConnection } from "mysql2/promise";
import  * as MyError from "../interfaces/my-error";

const addItem = async (
    data: PlayerItem,
    dbConnection: PoolConnection
): Promise<number> => {
    if(data.playerId == null) throw new MyError.NotFoundError("playerId is undefined.");
    await PlayerModel.playerExistenceCheck(data.playerId as number, dbConnection);

    if(data.itemId == null) throw new MyError.NotFoundError("itemId is undefined.");
    await ItemModel.itemExistenceCheck(data.itemId as number, dbConnection);

    await PlayerItemModel.addItem(data, dbConnection);
    
    return PlayerItemModel.getItemCount(data, dbConnection);
}

const useItem = async (
    data: PlayerItem,
    dbConnection: PoolConnection
): Promise<void> => {
    if(data.playerId == null) throw new MyError.NotFoundError("playerId is undefined.");
    if(data.itemId == null) throw new MyError.NotFoundError("itemId is undefined.");

    const playerData: Player = await PlayerModel.getDataById(data.playerId, dbConnection);
    const itemData: Item = await ItemModel.getDataById(data.itemId, dbConnection);
    const playerItemData: PlayerItem = await PlayerItemModel.getDataById(data, dbConnection);

    const maxValue: number = 200;
    const itemNameById = ["hp","mp"]

    const playerStatus:any = {
        "hp":playerData.hp,
        "mp":playerData.mp
    };


    const count: number = data.count as number;
    const nowCount: number = playerItemData.count;
    const beforeHeal: number = playerStatus[itemNameById[data.itemId-1]];
    
    if(nowCount < count)throw new MyError.NotEnoughError("item is not enough");
    if(beforeHeal == maxValue) throw new MyError.LimitExceededError("max value");

    let afterHeal:number = beforeHeal;
    let useItemCount:number = 0;
    for(let i=0;i<data.count;i++){
        afterHeal += itemData.heal;
        useItemCount++;
        if(afterHeal >= maxValue){
            afterHeal = maxValue;
            break;
        }
    }
    data.count = useItemCount;

    await PlayerItemModel.useItemUpdate(data, dbConnection);

    if(itemNameById[data.itemId-1] == "hp")
    {
        playerData.hp = afterHeal;
    }
    else if(itemNameById[data.itemId-1] == "mp")
    {
        playerData.mp = afterHeal;
    }

    await PlayerModel.updatePlayer(playerData, dbConnection);
}

export { addItem, useItem };