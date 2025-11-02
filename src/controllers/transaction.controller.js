import { prisma } from "../app.js";

// GET /api/transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { wallet: true }, // Incluye la wallet asociada
      orderBy: { date: "desc" }, // Orden descendente por fecha
    });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({
      message: "Error al obtener transacciones",
      error: err.message,
    });
  }
};
