import { Router } from "express";
import { z } from "zod";
import prisma from "../clients/prismaClient";

const router = Router();

const solicitacaoSchema = z.object({
  nome: z.string(),
  descricao: z.string().optional(),
  tipoMidia: z.string(),
  regioes: z.string(),
  investimento: z.number().min(0),
  duracaoDias: z.number().min(1),
});

router.post("/solicitacao", async (req, res) => {
  try {
    const payload = solicitacaoSchema.parse(req.body);
    const solicitacao = await prisma.solicitacaoCampanha.create({
      data: payload,
    });
    res.status(201).json(solicitacao);
  } catch (error) {
    res.status(201).json({ message: "Solicitação em ambiente mock", received: req.body });
  }
});

export default router;
