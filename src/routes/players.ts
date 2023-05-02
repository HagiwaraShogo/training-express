import * as express from "express";
import { PlayerController } from "../controllers/player-controller";
export const router = express.Router();

const playerController = new PlayerController();

//    /players

router.get("/", playerController.getplayers);
router.get("/:id", playerController.getDataById);
router.post("/", playerController.createPlayer);
router.put("/:id", playerController.updatePlayer);
router.delete("/:id", playerController.destroyPlayer);
