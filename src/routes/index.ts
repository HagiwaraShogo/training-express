import * as express from "express";
import * as foo from "./foo";
import * as users from "./users";
import * as player from "./players";
import * as playeritem from "./playerItems";

import { HogeController } from "../controllers";

export const router = express.Router();

const hogeController = new HogeController();

router.get("/", (req, res, next) => {
  res.status(200);
  res.json({ text: "Hello World" });
});
router.get("/errorSample", hogeController.errorResponse);
router.use("/foo", foo.router);
router.use("/users", users.router);
router.use("/players", player.router);
router.use("/playerItems", playeritem.router);
