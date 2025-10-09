import axios from "axios";

// cache simple en memoria (persiste mientras corre el servidor)
const typeCache = new Map();

async function fetchType(typeName) {
  if (typeCache.has(typeName)) return typeCache.get(typeName);
  try {
    const r = await axios.get(`https://pokeapi.co/api/v2/type/${typeName}`);
    typeCache.set(typeName, r.data);
    return r.data;
  } catch (err) {
    console.error(
      "fetchType error",
      typeName,
      err?.response?.status || err.message
    );
    return null; // no lanzar: seguimos con lo que tengamos
  }
}

export const getPokemon = async (req, res) => {
  try {
    const name = String(req.params.nameOrId).toLowerCase();
    const r = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`
    );
    const data = r.data;

    const types = data.types.map((t) => t.type.name);

    // calculamos multiplicadores por tipo atacante
    const multipliers = {}; // { "water": 2, "electric": 0.5, ... }

    await Promise.all(
      types.map(async (t) => {
        const typeData = await fetchType(t);
        if (!typeData) return;
        const dr = typeData.damage_relations;
        dr.double_damage_from.forEach(
          (d) => (multipliers[d.name] = (multipliers[d.name] || 1) * 2)
        );
        dr.half_damage_from.forEach(
          (d) => (multipliers[d.name] = (multipliers[d.name] || 1) * 0.5)
        );
        dr.no_damage_from.forEach(
          (d) => (multipliers[d.name] = (multipliers[d.name] || 1) * 0)
        );
      })
    );

    const weaknesses = Object.entries(multipliers)
      .filter(([_, m]) => m > 1)
      .map(([t]) => t);
    const resistances = Object.entries(multipliers)
      .filter(([_, m]) => m > 0 && m < 1)
      .map(([t]) => t);
    const immunities = Object.entries(multipliers)
      .filter(([_, m]) => m === 0)
      .map(([t]) => t);

    const sprite =
      data.sprites?.other?.["official-artwork"]?.front_default ||
      data.sprites?.front_default ||
      null;

    const simplified = {
      id: data.id,
      name: data.name,
      types,
      height: data.height / 10,
      weight: data.weight / 10,
      sprite,
      baseStats: data.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
      weaknesses,
      resistances,
      immunities,
    };

    return res.json(simplified);
  } catch (err) {
    console.error(
      "getPokemon error:",
      err?.response?.status,
      err?.response?.data || err.message
    );
    if (err?.response?.status === 404)
      return res.status(404).json({ error: "Pokémon no encontrado" });
    return res
      .status(500)
      .json({ error: "Error interno", details: err.message });
  }
};
