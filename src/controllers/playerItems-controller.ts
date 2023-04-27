import { Response, Request, NextFunction } from "express";
import { dbPool, transactionHelper } from "../helpers/db-helper";
import { PlayerItem } from "../interfaces/PlayerItem";
import * as PlayerItemService from "../services/playerItems-service"
import { NotFoundError } from "../interfaces/my-error";

export class PlayerItemController
{
    async addItem(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        const playerItemData: PlayerItem = {
            playerId: parseInt(req.params.id),
            itemId: req.body.itemId,
            count: req.body.count
        }

        const dbConnection = await dbPool.getConnection();

       try{
        let count: number = 0;

        await transactionHelper(dbConnection, async () => {
            count = await PlayerItemService.addItem(playerItemData, dbConnection);
        });
        
        res.status(200).json({id: playerItemData.itemId, count: count});
       } catch(e) {
        if(e instanceof  NotFoundError) {
            res.status(400).json({message:`${e.name}:${e.message}`});
        }
        next(e);
       }
    }

    errorResponse(req: Request, res: Response, next: NextFunction) {
        next(new Error("エラー発生"));
    }
}