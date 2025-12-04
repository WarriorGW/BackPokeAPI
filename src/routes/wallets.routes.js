import express from "express";
import {
  addFunds,
  createWallet,
  deleteWallet,
  getWallets,
  updateWallet,
} from "../controllers/wallet.controller.js";

const router = express.Router();

router.get("/", getWallets);
router.post("/add", addFunds);
router.post("/", createWallet);
router.put("/:id", updateWallet);
router.delete("/:id", deleteWallet);

export default router;
