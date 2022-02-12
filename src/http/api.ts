import express from "express";

import { createOrderController } from "./controllers/orders";

const v1Router = express.Router();

v1Router.get("/", (req, res) => {
  return res.json({ message: "Yo! we're up" });
});

const orderRouter = express.Router();
orderRouter.post("/", (req, res) => createOrderController.execute(req, res));
v1Router.use("/orders", orderRouter);

export { v1Router };
