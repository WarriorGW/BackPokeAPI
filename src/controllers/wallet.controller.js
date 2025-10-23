// controllers/wallet.controller.js
const wallets = [
  { id: "1", name: "Principal", balance: 500 },
  { id: "2", name: "Ahorros", balance: 1000 },
];

// POST /api/wallet/add
export const addFunds = (req, res) => {
  try {
    const { walletId, denominations, note, date } = req.body;

    const wallet = wallets.find((w) => w.id === walletId);
    if (!wallet)
      return res.status(404).json({ message: "Wallet no encontrada" });

    // Calcular el total agregado
    const total = denominations.reduce((acc, d) => acc + d.amount * d.value, 0);

    wallet.balance += total;

    return res.status(200).json({
      message: "Fondos agregados correctamente",
      wallet,
      total,
      note,
      date,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error al agregar fondos", error: err.message });
  }
};

// GET /api/wallet
export const getWallets = (req, res) => {
  res.json(wallets);
};
