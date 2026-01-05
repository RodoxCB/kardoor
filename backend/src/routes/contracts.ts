import { Router } from "express";
import { z } from "zod";
import prisma from "../clients/prismaClient";

const router = Router();

const contractSchema = z.object({
  motoristaId: z.number(),
  anuncianteId: z.number(),
  areaBonificada: z.number().min(0),
  valor: z.number().min(0),
  kmsMeta: z.number().min(0),
  duracaoDias: z.number().min(1),
  inicio: z.string().transform((value) => new Date(value)),
  fimPrevisto: z.string().transform((value) => new Date(value)),
});

router.post("/", async (req, res) => {
  try {
    const payload = contractSchema.parse(req.body);

    const contrato = await prisma.contratoAdesivacao.create({
      data: {
        motoristaId: payload.motoristaId,
        anuncianteId: payload.anuncianteId,
        areaBonificada: payload.areaBonificada,
        valor: payload.valor,
        kmsMeta: payload.kmsMeta,
        duracaoDias: payload.duracaoDias,
        inicio: payload.inicio,
        fimPrevisto: payload.fimPrevisto,
        status: "ATIVO",
      },
    });

    res.status(201).json(contrato);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido ao criar contrato";
    res.status(400).json({ error: message });
  }
});

router.get("/", async (req, res) => {
  const contratos = await prisma.contratoAdesivacao.findMany({
    orderBy: { criadoEm: "desc" },
    include: { motorista: true, anunciante: true, pagamento: true },
  });

  res.json(contratos);
});

router.get("/:id", async (req, res) => {
  const contratoId = Number(req.params.id);
  if (Number.isNaN(contratoId)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const contrato = await prisma.contratoAdesivacao.findUnique({
    where: { id: contratoId },
    include: { motorista: true, pagamento: true },
  });

  if (!contrato) {
    return res.status(404).json({ error: "Contrato não encontrado" });
  }

  res.json(contrato);
});

router.patch("/:id/status", async (req, res) => {
  const contratoId = Number(req.params.id);
  const { status } = req.body;
  if (!["ATIVO", "CONCLUIDO", "CANCELADO"].includes(status)) {
    return res.status(400).json({ error: "Status inválido" });
  }

  const contrato = await prisma.contratoAdesivacao.update({
    where: { id: contratoId },
    data: { status, atualizadoEm: new Date() },
  });

  res.json(contrato);
});

export default router;
