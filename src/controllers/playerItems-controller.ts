import { Response, Request, NextFunction } from "express";
import { dbPool, transactionHelper } from "../helpers/db-helper";
import { PlayerItem } from "../interfaces/PlayerItem";
import * as PlayerItemService from "../services/playerItems-service"
import  * as MyError from "../interfaces/my-error";
import { Player } from "../interfaces/Player";
import { Gahca } from "../interfaces/Gacha"; 

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
        if(e instanceof  MyError.NotFoundError) {
            res.status(400).json({message:`${e.name}:${e.message}`});
        }
        next(e);
       }
    }

    async useItem(
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
        let result = {};

        try{
            await transactionHelper(dbConnection, async () => {
                result = await PlayerItemService.useItem(playerItemData, dbConnection);
            });
            res.status(200).json(result);

        } catch(e){
            if(e instanceof  MyError.NotFoundError) {
                res.status(400).json({message: e.message});
            }
            else if(e instanceof MyError.NotEnoughError) {
                res.status(400).json({message: e.message});
            }
            else if(e instanceof MyError.LimitExceededError) {
                res.status(400).json({message: e.message});
            }
            next(e);
        }
    }

    async useGacha(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        let GachaData: Gahca = {
            playerId: parseInt(req.params.id),
            count: req.body.count
        }
        const dbConnection = await dbPool.getConnection();

        try{
            let result = {};
            await transactionHelper(dbConnection, async () => {
                result = await PlayerItemService.useGacha(GachaData, dbConnection);
            });
            res.status(200).json(result);
        } catch (e) {
            if(e instanceof  MyError.NotFoundError) {
                res.status(400).json({message: e.message});
            }
            else if(e instanceof MyError.NotEnoughError) {
                res.status(400).json({message: e.message});
            }
            next(e);
        }
    }

    errorResponse(req: Request, res: Response, next: NextFunction) {
        next(new Error("エラー発生"));
    }
}