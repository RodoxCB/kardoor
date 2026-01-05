import { Prisma } from "@prisma/client";
import prisma from "../clients/prismaClient";

export interface KMRResult {
  quilometrosTotais: number;
  areaBonificada: number;
  duracaoDias: number;
  registros: {
    id: number;
    quilometros: number;
    areaBonificada: boolean;
    duracaoAtualizada: number;
    localizacao?: string | null;
    timestamp: Date;
  }[];
}

export async function calculateKMR(contratoId: number): Promise<KMRResult> {
  const registros = await prisma.kMRRegistro.findMany({
    where: { contratoId },
    orderBy: { timestamp: "asc" },
  });

  if (registros.length === 0) {
    return {
      quilometrosTotais: 0,
      areaBonificada: 0,
      duracaoDias: 0,
      registros: [],
    };
  }

  const quilometrosTotais = registros.reduce(
    (acc, registro) => acc + registro.quilometros,
    0,
  );

  const areaBonificada = registros.filter((r) => r.areaBonificada).length;

  const inicio = registros[0].timestamp;
  const fim = registros[registros.length - 1].timestamp;
  const duracaoDias = Math.max(
    1,
    Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)),
  );

  return {
    quilometrosTotais,
    areaBonificada,
    duracaoDias,
    registros,
  };
}

export async function registerKMRRecord(
  contratoId: number,
  quilometros: number,
  areaBonificada: boolean,
  duracaoAtualizada: number,
  localizacao?: string,
  timestamp?: Date,
) {
  const registro = await prisma.kMRRegistro.create({
    data: {
      contratoId,
      quilometros,
      areaBonificada,
      duracaoAtualizada,
      localizacao,
      timestamp: timestamp ?? new Date(),
    },
  });

  await prisma.contratoAdesivacao.update({
    where: { id: contratoId },
    data: {
      atualizadoEm: new Date(),
    },
  });

  return registro;
}
