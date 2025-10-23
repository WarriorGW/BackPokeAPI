// routes/wallet.routes.js
import express from "express";
import { addFunds, getWallets } from "../controllers/wallet.controller.js";

const router = express.Router();

router.get("/", getWallets);
router.post("/add", addFunds);

export default router;
