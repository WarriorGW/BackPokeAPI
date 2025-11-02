import express from "express";
import { getTransactions } from "../controllers/transaction.controller.js";

const router = express.Router();

// Endpoint para listar todas las transacciones
router.get("/", getTransactions);

export default router;
