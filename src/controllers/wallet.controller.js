import { prisma } from "../app.js";

// GET /api/wallets
export const getWallets = async (req, res) => {
  try {
    const wallets = await prisma.wallet.findMany({
      include: { transactions: true },
    });
    res.json(wallets);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener wallets", error: err.message });
  }
};

// POST /api/wallets/add
export const addFunds = async (req, res) => {
  try {
    const { walletId, denominations, note, date } = req.body;

    // Validación básica
    if (!walletId || !denominations || !Array.isArray(denominations)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    // Calcular total agregado
    const total = denominations.reduce((acc, d) => acc + d.value * d.amount, 0);

    // Actualizar wallet y crear transacción
    const wallet = await prisma.wallet.update({
      where: { id: Number(walletId) },
      data: {
        balance: { increment: total },
        transactions: {
          create: {
            totalAmount: total,
            note: note || "",
            date: date ? new Date(date) : new Date(),
          },
        },
      },
      include: { transactions: true },
    });

    res.status(200).json({
      message: "Fondos agregados correctamente",
      wallet,
      total,
      note,
      date: date || new Date(),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al agregar fondos", error: err.message });
  }
};

// POST /api/wallet
export const createWallet = async (req, res) => {
  try {
    const { name, balance } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ message: "El nombre de la wallet es requerido" });

    const newWallet = await prisma.wallet.create({
      data: {
        name,
        balance: balance || 0,
      },
    });

    return res.status(201).json({
      message: "Wallet creada correctamente",
      wallet: newWallet,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error al crear wallet",
      error: err.message,
    });
  }
};
