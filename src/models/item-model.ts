import { PoolConnection } from "mysql2/promise";
import { Item } from "../interfaces/Item";
import { RowDataPacket, OkPacket } from "mysql2";
import { NotFoundError } from "../interfaces/my-error";

async function itemExistenceCheck(id:number, dbConnection: PoolConnection)
{
    const[rows] = await dbConnection.query<RowDataPacket[]>(
      "SELECT * FROM `items` WHERE id = ?;",id
    );

    if(!rows[0])
    {
      throw new NotFoundError('item is not found.');
    } 
}

const getDataById = async (
    id:number,
    dbConnection: PoolConnection
): Promise<Item> => {
    const[rows] = await dbConnection.query<RowDataPacket[]>(
        "SELECT * FROM `items` WHERE id = ?;",id
    );
  
    if(!rows[0])
    {
      throw new NotFoundError('item not found.');
    } 
  
    const result: Item = {
        id: rows[0].id,
        name: rows[0].name,
        heal:rows[0].heal,
        price:rows[0].price
    };
    return result;
}

export { itemExistenceCheck, getDataById }