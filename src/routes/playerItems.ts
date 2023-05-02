import * as express from "express";
import { PlayerItemController } from "../controllers/playerItems-controller";
export const router = express.Router();

const playerItemController = new PlayerItemController();

router.post("/:id/addItem", playerItemController.addItem);
router.post("/:id/useItem", playerItemController.useItem);
router.post("/:id/useGacha", playerItemController.useGacha);