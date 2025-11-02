Este proyecto contiene una API para acceder a informacion de PokeAPI y aparte contiene el backend para el proyecto de una aplicacion movil sobre el manejo de monedas

Ruta para las wallets:

https://back-poke-api.vercel.app/api/wallet

Ruta para los pokemones:

https://back-poke-api.vercel.app/api/pokemon/25

Ejemplos válidos:

- /api/pokemon/pikachu
- /api/pokemon/25

Estructura de la respuesta:

```json
{
  "id": 25,
  "name": "pikachu",
  "types": ["electric"],
  "height": 0.4,
  "weight": 6.0,
  "sprite": "https://.../official-artwork/25.png",
  "baseStats": [
    { "name": "hp", "value": 35 },
    { "name": "attack", "value": 55 },
    ...
  ],
  "weaknesses": ["ground"],
  "resistances": ["electric", "flying", "steel"],
  "immunities": []
}
```

Si el Pokémon no existe o hay error de nombre, responde con:

```json
{ "error": "Pokémon no encontrado" }
```
