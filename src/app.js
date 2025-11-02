import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pokemonRoutes from "./routes/pokemon.routes.js";
import transactionsRoutes from "./routes/transaction.routes.js";
import walletRoutes from "./routes/wallets.routes.js";

dotenv.config();
export const prisma = new PrismaClient();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/api/pokemon", pokemonRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/transactions", transactionsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
