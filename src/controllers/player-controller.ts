import { Response, Request, NextFunction } from "express";
import { dbPool, transactionHelper } from "../helpers/db-helper";
import * as playerService from "../services/player-service";
//import { getIdName } from "../services/player-service";
import { Player } from "../interfaces/Player";

export class PlayerController
{
  async getIdName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const dbConnection = await dbPool.getConnection();
    try
    {
      const result = await playerService.getIdName(dbConnection);

      res.status(200);
      res.json(result);
    } 
    catch (e)
    {
      next(e);
    } 
    finally 
    {
      dbConnection.release(); // connectionを返却
    }
  }

  async createPlayer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if (
      !req.body.name ||
      !req.body.hp ||
      !req.body.mp ||
      !req.body.money
    ) {
      res.status(400).json({ message: "Invalid parameters or body." });
      return;
    }

    const player: Player = {
      name: req.body.name,
      hp: req.body.hp,
      mp: req.body.mp,
      money: req.body.money,
    };

    const dbConnection = await dbPool.getConnection();
    try {
      let result: number;
      // トランザクション例2
      await transactionHelper(dbConnection, async () => {
        result = await playerService.createPlayer(player, dbConnection);
      });
      res.status(200).json({ id: result! });
    } catch (e) {
      next(e);
    }
  }

  errorResponse(req: Request, res: Response, next: NextFunction) {
    next(new Error("エラー発生"));
  }
}