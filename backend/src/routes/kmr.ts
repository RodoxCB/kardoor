import { Router } from "express";
import { calculateKMR } from "../services/kmr";

const router = Router();

router.get("/:id", async (req, res) => {
  const contratoId = Number(req.params.id);
  if (Number.isNaN(contratoId)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const resultado = await calculateKMR(contratoId);
  res.json(resultado);
});

export default router;
