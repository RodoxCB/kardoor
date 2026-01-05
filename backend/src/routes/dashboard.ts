import { Router } from "express";
import prisma from "../clients/prismaClient";

const router = Router();

// Dados mockados para teste quando o banco não está disponível
const mockData = {
  impactoTotal: 4850.5,
  qtdCampanhas: 3,
  campanhas: [
    {
      campanhaId: 1,
      contratoId: 1,
      motorista: "João Silva",
      statusContrato: "ATIVO",
      totalKm: 2150.5,
      investimento: 1500,
      pagamento: "LIBERADO",
      relatoriosGerados: 12,
    },
    {
      campanhaId: 2,
      contratoId: 2,
      motorista: "Maria Santos",
      statusContrato: "ATIVO",
      totalKm: 1800.0,
      investimento: 1200,
      pagamento: "AGUARDANDO",
      relatoriosGerados: 8,
    },
    {
      campanhaId: 3,
      contratoId: 3,
      motorista: "Carlos Oliveira",
      statusContrato: "CONCLUIDO",
      totalKm: 900.0,
      investimento: 800,
      pagamento: "LIBERADO",
      relatoriosGerados: 5,
    },
  ],
};

router.get("/overview", async (req, res) => {
  try {
    const campanhas = await prisma.campanhaAnunciante.findMany({
      include: {
        contrato: {
          include: {
            motorista: true,
            pagamento: true,
            kmrRegistros: true,
          },
        },
      },
    });

    const resumo = campanhas.map((campanha) => {
      const totalKm = campanha.contrato.kmrRegistros.reduce(
        (sum, registro) => sum + registro.quilometros,
        0,
      );
      return {
        campanhaId: campanha.id,
        contratoId: campanha.contratoId,
        motorista: campanha.contrato.motorista.nome,
        statusContrato: campanha.contrato.status,
        totalKm,
        investimento: campanha.investimento,
        pagamento: campanha.contrato.pagamento?.statusPix ?? "AGUARDANDO",
        relatoriosGerados: campanha.relatoriosGerados,
      };
    });

    const impactoTotal = campanhas.reduce(
      (sum, campanha) => sum + campanha.contrato.kmrRegistros.reduce((sub, registro) => sub + registro.quilometros, 0),
      0,
    );

    res.json({
      impactoTotal,
      qtdCampanhas: campanhas.length,
      campanhas: resumo,
    });
  } catch (error) {
    console.log("Usando dados mockados (banco indisponível)");
    res.json(mockData);
  }
});

export default router;
