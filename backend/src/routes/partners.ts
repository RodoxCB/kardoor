import { Router } from "express";
import { z } from "zod";
import prisma from "../clients/prismaClient";

const router = Router();

const verifySchema = z.object({
  contratoId: z.number(),
  parceiroId: z.string(),
  fotos: z.string().optional(),
});

router.post("/check-in", async (req, res) => {
  try {
    const payload = verifySchema.parse(req.body);

    const parceiro = await prisma.parceiroVerificacao.create({
      data: {
        contratoId: payload.contratoId,
        parceiroId: payload.parceiroId,
        checkinInicio: new Date(),
        fotos: payload.fotos,
        integridade: "validando",
      },
    });

    res.status(201).json(parceiro);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao iniciar verificação";
    res.status(400).json({ error: message });
  }
});

router.post("/check-out", async (req, res) => {
  const contratoId = Number(req.body.contratoId);
  if (Number.isNaN(contratoId)) {
    return res.status(400).json({ error: "Contrato inválido" });
  }

  const parceiro = await prisma.parceiroVerificacao.update({
    where: { contratoId },
    data: {
      checkinFim: new Date(),
      integridade: "confirmado",
    },
  });

  res.json(parceiro);
});

router.get("/", async (req, res) => {
  const registros = await prisma.parceiroVerificacao.findMany({
    include: {
      contrato: {
        include: { motorista: true, pagamento: true },
      },
    },
    orderBy: { criadoEm: "desc" },
  });

  res.json(registros);
});

export default router;
