import { PoolConnection } from "mysql2/promise";
import { Player, PlayerKey } from "../interfaces/Player";
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

  const updatePlayer = async (
    player:Player,
    dbConnection: PoolConnection
  ): Promise<void> => {
    let setSql = new Array();
    let updateData = new Array();
    (Object.keys(player) as PlayerKey[]).forEach((key)=>{
      if(key == "id") return;
      if(player[key]) 
      {
        setSql.push(`${key} = ?`);
        updateData.push(player[key]);
      }
    });
    updateData.push(player.id);

    await dbConnection.query<OkPacket>(
      "UPDATE `players` SET " + setSql.join(', ') + " WHERE `id` = ?", updateData
    );
  }

  async function playerExistenceCheck(id:number, dbConnection: PoolConnection)
  {
    const[rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM `players` WHERE id = ?;",id
    );

    if(!rows[0])
    {
      throw new NotFoundError('user not found.');
    } 
  }

  const destroyPlayer= async (
    id:number,
    dbConnection: PoolConnection
  ): Promise<void> => {
    await dbConnection.query(
      "DELETE FROM `players` WHERE id = ?",id
    );
  }

export { getIdName, createPlayer, getDataById, updatePlayer, getPlayer, destroyPlayer };
