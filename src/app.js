import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pokemonRoutes from "./routes/pokemon.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/pokemon", pokemonRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
