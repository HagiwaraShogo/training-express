import { PoolConnection } from "mysql2/promise";
import { Player } from "../interfaces/Player";
import { RowDataPacket, OkPacket } from "mysql2";

const getIdName = async (dbConnection: PoolConnection): Promise<Player[]> => {
    const [rows] = await dbConnection.query<RowDataPacket[]>(
        "SELECT * FROM `players`;"
      );
    
    const result: Player[] = rows.map((row) => {
    return {
      id: row.id,
      name: row.name
    };
  });

  return result;
}

const createPlayer = async (
    data: Player,
    dbConnection: PoolConnection
  ): Promise<number> => {
    const [rows] = await dbConnection.query<OkPacket>(
      "INSERT INTO `players` (`name`, `hp`, `mp`, `money`) VALUES (?,?,?,?)",
      [data.name, data.hp, data.mp, data.money]
    );
  
    return rows.insertId;
  };

export { getIdName, createPlayer };