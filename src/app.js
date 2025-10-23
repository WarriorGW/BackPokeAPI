import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pokemonRoutes from "./routes/pokemon.routes.js";
import walletRoutes from "./routes/wallets.routes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.use("/api/pokemon", pokemonRoutes);
app.use("/api/wallet", walletRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
