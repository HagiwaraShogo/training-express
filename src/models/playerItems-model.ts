import { Response, Request, NextFunction } from "express";
import { PoolConnection } from "mysql2/promise";
import { PlayerItem, playerItemAllData } from "../interfaces/PlayerItem";
import { RowDataPacket, OkPacket } from "mysql2";
import { NotFoundError } from "../interfaces/my-error";
import { access } from "fs";

const addItem = async(
    data: PlayerItem,
    dbConnection: PoolConnection
): Promise<void> => {
    await dbConnection.query(
        "INSERT INTO `player_items`(`player_id`, `item_id`, `count`) VALUES (?, ?, ? ) ON DUPLICATE KEY UPDATE `count` = `count` + ?",
        [data.playerId, data.itemId, data.count, data.count]
    );
}

const getItemCount = async(
    data: PlayerItem,
    dbConnection: PoolConnection
): Promise<number> => {
    const[rows] = await dbConnection.query<RowDataPacket[]>(
        "SELECT * FROM `player_items` WHERE `player_id` = ? AND `item_id` = ?",[data.playerId, data.itemId]
    );

    return rows[0].count;
}

const getDataById = async (
    data: PlayerItem, 
    dbConnection: PoolConnection
): Promise<PlayerItem> => {
    const[rows] = await dbConnection.query<RowDataPacket[]>(
        "SELECT * FROM `player_items` WHERE `player_id` = ? AND `item_id` = ?",[data.playerId, data.itemId]
    );
  
    if(!rows[0])
    {
      throw new NotFoundError('user not found.');
    } 
  
    const result: PlayerItem = {
        playerId: rows[0].playerId,
        itemId: rows[0].itemId,
        count: rows[0].count,
    };
    return result;
}

const getDataByPlayerId = async (
    id: number,
    dbConnection: PoolConnection
): Promise<PlayerItem[]> => {
    const[rows] = await dbConnection.query<RowDataPacket[]>(
        "SELECT * FROM `player_items` WHERE `player_id` = ?",
        id
    );

    if(!rows[0])
    {
      throw new NotFoundError('PlayerItemData is not found.');
    } 

    const playerItemData = rows.map((row) => {
        return {
            playerId: row.player_id,
            itemId: row.item_id,
            count: row.count
        }
    })
    return playerItemData;
}

const useItemUpdate = async (
    data: PlayerItem,
    dbConnection: PoolConnection
):Promise<void>=> {
    const[rows] = await dbConnection.query<RowDataPacket[]>(
        "UPDATE `player_items` SET `count` = `count` - ? WHERE `player_id` = ? && `item_id` = ?",
        [data.count, data.playerId, data.itemId]
    );
}

const useGacha = async (
    id: number,
    dbConnection: PoolConnection
): Promise<PlayerItem[]> => {
    const [rows] = await dbConnection.query<RowDataPacket[]> (
        "SELECT * FROM `player_items` WHERE `player_id` = ?",
        [id]
    )

    if(!rows[0]) throw new NotFoundError('user not found.');

    const playerItemData = rows.map((row) => {
        return {
            playerId: row.player_id,
            itemId:   row.item_id,
            count:    row.count
        }
    });

    return playerItemData;
}

const getPlayerItemAllData = async (
    playerId: number,
    dbConnection: PoolConnection
): Promise<playerItemAllData[]> => {
    const [rows] = await dbConnection.query<RowDataPacket[]> (
        "SELECT `item_id`, `name`, `heal`, `price`,`count` FROM player_items, items WHERE player_items.item_id = items.id AND player_id = ?",
        [playerId]
    )

    if(!rows[0]) throw new NotFoundError('user not found.');

    const resultData =  rows.map((row) => {
        return {
            itemId: row.item_id,
            name: row.name,
            heal: row.heal,
            price: row.price,
            count: row.count
        }
    })
    return resultData
}

export { addItem, getItemCount, getDataById, getDataByPlayerId, useItemUpdate, useGacha, getPlayerItemAllData };