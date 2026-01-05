import { Router } from "express";
import { z } from "zod";
import prisma from "../clients/prismaClient";

const router = Router();

const inscricaoSchema = z.object({
  nome: z.string(),
  documento: z.string(),
  tipo: z.string(),
  endereco: z.string(),
  telefone: z.string(),
});

router.post("/", async (req, res) => {
  try {
    const payload = inscricaoSchema.parse(req.body);
    const inscricao = await prisma.inscricaoParceiro.create({
      data: {
        nome: payload.nome,
        documento: payload.documento,
        tipoServico: payload.tipo,
        endereco: payload.endereco,
        telefone: payload.telefone,
      },
    });
    res.status(201).json(inscricao);
  } catch (error) {
    res.status(201).json({ message: "Inscricao mock registrada", received: req.body });
  }
});

export default router;
