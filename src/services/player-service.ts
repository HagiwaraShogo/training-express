import * as PlayerModel from "../models/player-model";
import { Player, PlayerKey } from "../interfaces/Player";
import { PoolConnection } from "mysql2/promise";

  const getIdName = async (dbConnection: PoolConnection): Promise<Player[]> => {
    const result = await PlayerModel.getIdName(dbConnection);
    return result;
  };

  const getDataById = async (id:number ,dbConnection: PoolConnection): Promise<Player> => {
    const result = await PlayerModel.getDataById(id, dbConnection);
    return result;
  }


  const createPlayer = async (
    data: Player,
    dbConnection: PoolConnection
  ): Promise<number> => {
    const result: number = await PlayerModel.createPlayer(data, dbConnection);
    return result;
  };

  const updatePlayer = async (
    player: Player,
    dbConnection: PoolConnection
  ): Promise<void> => {
    await PlayerModel.playerExistenceCheck(player.id as number,dbConnection);
    await PlayerModel.updatePlayer(player,  dbConnection);
  }

  export { getIdName, createPlayer, getDataById, updatePlayer };