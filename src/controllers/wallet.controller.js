import { prisma } from "../app.js";

// GET /api/wallets
export const getWallets = async (req, res) => {
  try {
    const wallets = await prisma.wallet.findMany({
      include: { transactions: true },
    });
    res.json(wallets);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error al obtener wallets" });
  }
};

// POST /api/wallets/add
export const addFunds = async (req, res) => {
  try {
    const { walletId, denominations, note, date } = req.body;

    if (!walletId || !Array.isArray(denominations))
      return res.status(400).json({ message: "Datos inválidos" });

    const total = denominations.reduce((acc, d) => acc + d.value * d.amount, 0);

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

    res.json({ message: "Fondos agregados", wallet });
  } catch (err) {
    res.status(500).json({ message: "Error al agregar fondos" });
  }
};

// POST /api/wallets
export const createWallet = async (req, res) => {
  try {
    const { name, balance } = req.body;

    if (!name) return res.status(400).json({ message: "Nombre requerido" });

    const newWallet = await prisma.wallet.create({
      data: { name, balance: balance || 0 },
    });

    res.status(201).json({ message: "Wallet creada", wallet: newWallet });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error al crear wallet" });
  }
};

// PUT /api/wallets/:id  (editar)
export const updateWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, balance } = req.body;

    const updated = await prisma.wallet.update({
      where: { id: Number(id) },
      data: { name, balance },
    });

    res.json({ message: "Wallet actualizada", wallet: updated });
  } catch {
    res.status(500).json({ message: "Error al actualizar wallet" });
  }
};

// DELETE /api/wallets/:id  (eliminar)
export const deleteWallet = async (req, res) => {
  try {
    const { id } = req.params;

    // Eliminar transacciones primero para evitar errores de FK
    await prisma.transaction.deleteMany({
      where: { walletId: Number(id) },
    });

    await prisma.wallet.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Wallet eliminada" });
  } catch {
    res.status(500).json({ message: "Error al eliminar wallet" });
  }
};
