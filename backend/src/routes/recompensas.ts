import { Router } from "express";
import prisma from "../clients/prismaClient";

const router = Router();

const recompensasMock = [
  { id: 1, nome: "Posto premium", descricao: "Desconto de até R$50 na gasolina", pontos: 300, disponivel: true },
  { id: 2, nome: "Lava-rápido", descricao: "Lavagem completa com polimento", pontos: 220, disponivel: true },
  { id: 3, nome: "Revisão express", descricao: "Check list mecânico rápido", pontos: 400, disponivel: false },
];

router.get("/", async (_req, res) => {
  try {
    const recompensas = await prisma.recompensa.findMany({ where: { ativo: true } });
    res.json(
      recompensas.map((item) => ({
        id: item.id,
        nome: item.nome,
        descricao: item.descricao,
        pontos: item.pontosNecessarios,
        disponivel: item.ativo,
      })),
    );
  } catch (error) {
    res.json(recompensasMock);
  }
});

export default router;
