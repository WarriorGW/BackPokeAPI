import express from "express";
import {
  addFunds,
  createWallet,
  getWallets,
} from "../controllers/wallet.controller.js";

const router = express.Router();

router.get("/", getWallets);
router.post("/add", addFunds);
router.post("/", createWallet); // 👈 Nuevo endpoint

export default router;
