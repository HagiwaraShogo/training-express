import * as express from "express";
import { PlayerController } from "../controllers/player-controller";
export const router = express.Router();

const playerController = new PlayerController();

//    /players

router.get("/", playerController.getIdName);
//router.get("/", playerController.getDataById);
router.post("/", playerController.createPlayer);
