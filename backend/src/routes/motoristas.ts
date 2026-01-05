import { Router } from "express";
import { z } from "zod";
import prisma from "../clients/prismaClient";

const router = Router();

const novoMotoristaSchema = z.object({
  nome: z.string(),
  documento: z.string(),
  veiculo: z.string(),
});

const resumoFallback = {
  pontos: 520,
  contratosAtivos: 2,
  kmRodados: 1340,
  proximosPassos: [
    "Registrar KMR diário",
    "Atualizar disponibilidade para o parceiro",
    "Agendar troca de pontos",
  ],
};

const recompensasMock = [
  { id: 1, nome: "Posto premium", descricao: "Desconto de R$50", pontos: 300, disponivel: true },
  { id: 2, nome: "Lava-rápido", descricao: "Lavagem completa", pontos: 220, disponivel: true },
  { id: 3, nome: "Revisão rápida", descricao: "Checagem mecânica", pontos: 400, disponivel: false },
];

router.post("/", async (req, res) => {
  try {
    const payload = novoMotoristaSchema.parse(req.body);
    const motorista = await prisma.motorista.create({
      data: {
        nome: payload.nome,
        documento: payload.documento,
        veiculo: payload.veiculo,
      },
    });
    res.status(201).json(motorista);
  } catch (error) {
    res.status(201).json(req.body);
  }
});

router.post("/:id/agendar", async (req, res) => {
  const data = { ...req.body };
  try {
    const solicitacao = await prisma.solicitacaoCampanha.create({
      data: {
        anuncianteId: 0,
        nome: `Solicitação motorista ${req.params.id}`,
        descricao: data.observacoes ?? "",
        tipoMidia: "adesivacao",
        regioes: data.regiao ?? "não informado",
        investimento: 0,
        duracaoDias: 0,
      },
    });
    res.status(201).json(solicitacao);
  } catch (error) {
    res.status(201).json({
      ...data,
      mensagem: "Agendamento simulado em mock.",
    });
  }
});

router.get("/summary", async (_req, res) => {
  try {
    const contratos = await prisma.contratoAdesivacao.findMany({
      include: { kmrRegistros: true },
      where: { status: "ATIVO" },
    });
    const kmRodados = contratos.reduce(
      (sum, contrato) => sum + contrato.kmrRegistros.reduce((inner, registro) => inner + registro.quilometros, 0),
      0,
    );
    res.json({
      pontos: 600,
      contratosAtivos: contratos.length,
      kmRodados,
      proximosPassos: [
        "Enviar novo registro KMR",
        "Trocar pontos por serviços",
        "Agendar adesivação com parceiro",
      ],
    });
  } catch (error) {
    res.json(resumoFallback);
  }
});

router.get("/:id/pontos", async (req, res) => {
  try {
    const recompensas = await prisma.recompensa.findMany({
      where: { ativo: true },
    });
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
