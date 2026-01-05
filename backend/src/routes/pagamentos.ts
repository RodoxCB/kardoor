import { Router } from "express";
import prisma from "../clients/prismaClient";

const router = Router();

router.post("/pix/confirmar", async (req, res) => {
  const { chave } = req.body;
  try {
    await prisma.solicitacaoCampanha.updateMany({
      data: { pixConfirmado: true, status: "PIX_RECEBIDO" },
      where: { status: "AGUARDANDO_PAGAMENTO" },
    });
    res.json({ message: "PIX confirmado", chave });
  } catch (error) {
    res.json({ message: "Mock PIX confirmado", chave });
  }
});

export default router;
