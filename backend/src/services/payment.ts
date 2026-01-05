import prisma from "../clients/prismaClient";
import { calculateKMR } from "./kmr";

export async function releasePaymentIfEligible(contractId: number) {
  const contrato = await prisma.contratoAdesivacao.findUnique({
    where: { id: contractId },
    include: { pagamento: true },
  });

  if (!contrato) {
    return { released: false, reason: "Contrato não encontrado" };
  }

  if (contrato.status === "CONCLUIDO") {
    return { released: false, reason: "Contrato já finalizado" };
  }

  const kmr = await calculateKMR(contractId);

  const veioKm = kmr.quilometrosTotais >= contrato.kmsMeta;
  const duracaoCumprida = kmr.duracaoDias >= contrato.duracaoDias;

  if (!veioKm || !duracaoCumprida) {
    return {
      released: false,
      reason: "Ainda não atingiu quilometragem ou duração mínima",
      kmr,
    };
  }

  const pontos = Math.floor(kmr.areaBonificada * 10);
  const valorLiberado = contrato.valor;

  await prisma.pagamento.upsert({
    where: { contratoId },
    create: {
      contratoId,
      statusPix: "LIBERADO",
      pontosAcumulados: pontos,
      valorLiberado,
      dataPagamento: new Date(),
    },
    update: {
      statusPix: "LIBERADO",
      pontosAcumulados: { increment: pontos },
      valorLiberado,
      dataPagamento: new Date(),
    },
  });

  await prisma.contratoAdesivacao.update({
    where: { id: contractId },
    data: {
      status: "CONCLUIDO",
      atualizadoEm: new Date(),
    },
  });

  return {
    released: true,
    kmr,
    pontos,
    valorLiberado,
  };
}
