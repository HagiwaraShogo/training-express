import * as PlayerItemModel from "../models/playerItems-model";
import { Player } from "../interfaces/Player";
import { Item } from "../interfaces/Item";
import { PlayerItem, PlayerItemKey } from "../interfaces/PlayerItem";
import { Gacha } from "../interfaces/Gacha";
import * as PlayerModel from "../models/player-model";
import * as ItemModel from "../models/item-model"
import { PoolConnection } from "mysql2/promise";
import  * as MyError from "../interfaces/my-error";

const addItem = async (
    data: PlayerItem,
    dbConnection: PoolConnection
): Promise<number> => {
    if(data.playerId == null) throw new MyError.NotFoundError("playerId is undefined.");
    await PlayerModel.playerExistenceCheck(data.playerId, dbConnection);

    if(data.itemId == null) throw new MyError.NotFoundError("itemId is undefined.");
    await ItemModel.itemExistenceCheck(data.itemId as number, dbConnection);

    await PlayerItemModel.addItem(data, dbConnection);
    
    return PlayerItemModel.getItemCount(data, dbConnection);
}

const useItem = async (
    data: PlayerItem,
    dbConnection: PoolConnection
): Promise<object> => {
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

    return {
        itemI: data.itemId,
        count: nowCount - count,
        player: {
            id: playerData.id,
            hp: playerData.hp,
            mp: playerData.mp
        }
    }
}

const useGacha = async (
    gachaData:Gacha,
    dbConnection: PoolConnection
):Promise<any> =>{
    const gachaPrice = 10;

    const playerData: Player = await PlayerModel.getDataById(gachaData.playerId, dbConnection);
    const itemData: Item[] = await ItemModel.getAllData(dbConnection);

    if(playerData.money < gachaData.count * gachaPrice)
    {
        throw new MyError.NotEnoughError("money is not enough.");
    }

    const updatingData: Player =  {
        id: gachaData.playerId,
        money: playerData.money - gachaData.count * gachaPrice
    };
    await PlayerModel.updatePlayer(updatingData,dbConnection);

    const percentById:any = {};
    itemData.forEach((item:any)=>{
        percentById[item.id] = item.percent as number;
    });

    const result:any = {};

    for(let i = 0; i < gachaData.count; i++){
        const random = Math.floor(Math.random() * (100 - 1) + 1);
        let totalPercent = 0;
        
        for(let j = 1; j <= Object.keys(percentById).length; j++)
        {
            totalPercent += percentById[j];
            if(random <= totalPercent)
            {
                if(j in result)
                {
                    result[j] += 1;
                }
                else
                {
                    result[j] = 1;
                }
                break;
            }
        }
    }

    // レスポンス用
    let resultResponse: any = [];
    for(let i = 1; i <= Object.keys(percentById).length; i++)
    {
        const item:PlayerItem = {
            playerId: gachaData.playerId,
            itemId: i,
            count: result[i]
        }
        await PlayerItemModel.addItem(item, dbConnection);
        
        if(i in result)
        {
            const data = {
                'itemId': i,
                'count': result[i]
            }
            resultResponse.push(data);
        }
    }

    let itemResponse: any = [];
    const playerItemData: PlayerItem[] = await PlayerItemModel.getDataByPlayerId(gachaData.playerId, dbConnection);
    playerItemData.forEach((playerItem:any) => {
        const data = {
            'itemId': playerItem.itemId,
            'count': playerItem.count
        }
        itemResponse.push(data);
    })

    return {
        results: resultResponse,
        player : {
            monay: updatingData.money,
            items: itemResponse
          }
    }
}

export { addItem, useItem, useGacha };