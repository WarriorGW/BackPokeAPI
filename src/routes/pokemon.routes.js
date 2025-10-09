import { Router } from "express";
import { getPokemon } from "../controllers/pokemon.controller.js";

const router = Router();
router.get("/:nameOrId", getPokemon);

export default router;
