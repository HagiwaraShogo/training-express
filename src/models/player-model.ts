import { PoolConnection } from "mysql2/promise";
import { Player } from "../interfaces/Player";
import { RowDataPacket, OkPacket } from "mysql2";
import { NotFoundError } from "../interfaces/my-error";

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

const getDataById = async (id:number, dbConnection: PoolConnection): Promise<Player> => {
  const[rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM `players` WHERE id = ?;",id
  );

  if(!rows[0])
  {
    throw new NotFoundError('user not found.');
  } 

  const result: Player = {
      id: rows[0].id,
      name: rows[0].name,
      hp: rows[0].hp,
      mp: rows[0].mp,
      money: rows[0].money
  };
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

export { getIdName, createPlayer, getDataById };