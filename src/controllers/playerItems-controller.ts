import { Response, Request, NextFunction } from "express";
import { dbPool, transactionHelper } from "../helpers/db-helper";
import { PlayerItem, useItemResponse, useGachaResponse } from "../interfaces/PlayerItem";
import * as PlayerItemService from "../services/playerItems-service"
import  * as MyError from "../interfaces/my-error";
import { Gacha } from "../interfaces/Gacha"; 

export class PlayerItemController
{
    async addItem(
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> {
        if(parseInt(req.params.id) == null) res.status(400).json("playerId is not Found.");
        const playerItemData: PlayerItem = {
            playerId: parseInt(req.params.id),
            itemId: req.body.itemId,
            count: req.body.count
        }

        const dbConnection = await dbPool.getConnection();

       try{
        await transactionHelper(dbConnection, async () => {
            const count: number = await PlayerItemService.addItem(playerItemData, dbConnection);
            res.status(200).json({id: playerItemData.itemId, count: count});
        });
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
        if(parseInt(req.params.id) == null) res.status(400).json("playerId is not Found.");

        const playerItemData: PlayerItem = {
            playerId: parseInt(req.params.id),
            itemId: req.body.itemId,
            count: req.body.count
        }

        const dbConnection = await dbPool.getConnection();

        try{
            await transactionHelper(dbConnection, async () => {
                const result: useItemResponse = await PlayerItemService.useItem(playerItemData, dbConnection);
                res.status(200).json(result);
            });
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
        if(parseInt(req.params.id) == null) res.status(400).json("playerId is not Found.");

        let GachaData: Gacha = {
            playerId: parseInt(req.params.id),
            count: req.body.count
        }
        console.log(parseInt(req.params.id));
        const dbConnection = await dbPool.getConnection();

        try{
            await transactionHelper(dbConnection, async () => {
                const result: useGachaResponse = await PlayerItemService.useGacha(GachaData, dbConnection);
                res.status(200).json(result);
            });
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