import { Response, Request, NextFunction } from "express";
import { PoolConnection } from "mysql2/promise";
import { PlayerItem, PlayerItemKey } from "../interfaces/PlayerItem";
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

  const useItemUpdate = async (
    data: PlayerItem,
    dbConnection: PoolConnection
  ):Promise<void>=> {
    const[rows] = await dbConnection.query<RowDataPacket[]>(
        "UPDATE `player_items` SET `count` = `count` - ? WHERE `player_id` = ? && `item_id` = ?",
        [data.count, data.playerId, data.itemId]
    );
  }

export { addItem, getItemCount, getDataById, useItemUpdate };