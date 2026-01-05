import { Router } from "express";
import { z } from "zod";
import { registerKMRRecord } from "../services/kmr";
import { releasePaymentIfEligible } from "../services/payment";

const router = Router();

const locationSchema = z.object({
  contratoId: z.number(),
  quilometros: z.number().min(0),
  areaBonificada: z.boolean().default(false),
  duracaoAtualizada: z.number().min(1),
  localizacao: z.string().optional(),
  timestamp: z.string().optional(),
});

router.post("/", async (req, res) => {
  try {
    const payload = locationSchema.parse(req.body);

    const registro = await registerKMRRecord(
      payload.contratoId,
      payload.quilometros,
      payload.areaBonificada,
      payload.duracaoAtualizada,
      payload.localizacao,
      payload.timestamp ? new Date(payload.timestamp) : undefined,
    );

    await releasePaymentIfEligible(payload.contratoId);

    res.status(201).json(registro);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao cadastrar localização";
    res.status(400).json({ error: message });
  }
});

export default router;
