import { Response, Request, NextFunction } from "express";
import { dbPool, transactionHelper } from "../helpers/db-helper";
import * as playerService from "../services/player-service";
//import { getIdName } from "../services/player-service";
import { Player } from "../interfaces/Player";
import { NotFoundError } from "../interfaces/my-error";

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

  async getDataById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const PlayerId = parseInt(req.params.id);
    const dbConnection = await dbPool.getConnection();
    try
    {
      const result = await playerService.getDataById(PlayerId, dbConnection);

      res.status(200);
      res.json(result);
    } 
    catch (e)
    {
      if (e instanceof NotFoundError) {
        res.status(404).json({ message: e.message });
      }
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

  async updatePlayer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if(!req.body)
    {
      res.status(400).json({ message: "Invalid parameters or body." });
      return;
    }
    const PlayerId = parseInt(req.params.id);

    const player: Player = {
      id: PlayerId,
      name: req.body.name,
      hp: req.body.hp,
      mp: req.body.mp,
      money: req.body.money
    };

    const dbConnection = await dbPool.getConnection();

    try {
      // トランザクション例2
      await transactionHelper(dbConnection, async () => {
        await playerService.updatePlayer(player, dbConnection);
      });

      await dbConnection.commit();
      res.status(200).json({ player: player! });
    } catch (e) {
      await dbConnection.rollback();

      if (e instanceof NotFoundError) {
        res.status(404).json({ message: e.message });
      }
      else{
        next(e);
      }
    }
  }

  async destroyPlayer(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const PlayerId = parseInt(req.params.id);
    const dbConnection = await dbPool.getConnection();

    try {
      // トランザクション例2
      await transactionHelper(dbConnection, async () => {
        await playerService.destroyPlayer(PlayerId, dbConnection);
      });

      await dbConnection.commit();
      res.status(200).json({ player: "playerId:" + PlayerId! + " delete" });
    } catch (e) {
      await dbConnection.rollback();

      if (e instanceof NotFoundError) {
        res.status(404).json({ message: e.message });
      }
      else{
        next(e);
      }
    }
  }

  errorResponse(req: Request, res: Response, next: NextFunction) {
    next(new Error("エラー発生"));
  }
}