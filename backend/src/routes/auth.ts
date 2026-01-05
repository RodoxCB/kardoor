import { Router } from "express";
import { z } from "zod";
import crypto from "node:crypto";
import prisma from "../clients/prismaClient";

const router = Router();

const areaEnum = z.enum(["motorista", "anunciante", "parceiro"]);

const loginSchema = z.object({
  area: areaEnum,
  identifier: z.string().min(1),
});

const motoristaRegisterSchema = z.object({
  area: z.literal("motorista"),
  nome: z.string().min(1),
  documento: z.string().min(1),
  veiculo: z.string().min(1),
});

const anuncianteRegisterSchema = z.object({
  area: z.literal("anunciante"),
  nome: z.string().min(1),
  email: z.string().email(),
});

const parceiroRegisterSchema = z.object({
  area: z.literal("parceiro"),
  nome: z.string().min(1),
  documento: z.string().min(1),
  telefone: z.string().min(8),
  tipoServico: z.string().optional(),
});

const registerSchema = z.discriminatedUnion("area", [
  motoristaRegisterSchema,
  anuncianteRegisterSchema,
  parceiroRegisterSchema,
]);

type RegisterPayload = z.infer<typeof registerSchema>;

type Area = z.infer<typeof areaEnum>;

type SessionPayload = {
  area: Area;
  profile: Record<string, unknown>;
  token: string;
  expiresIn: number;
};

const createSessionPayload = (area: Area, profile: Record<string, unknown>): SessionPayload => ({
  area,
  profile,
  token: crypto.randomUUID(),
  expiresIn: 60 * 60,
});

const buildProfile = (area: Area, record: Record<string, unknown>) => {
  if (area === "motorista") {
    const motorista = record as {
      id: number;
      nome: string;
      documento: string;
      veiculo: string;
      status: string;
    };
    return {
      id: motorista.id,
      nome: motorista.nome,
      documento: motorista.documento,
      veiculo: motorista.veiculo,
      status: motorista.status,
    };
  }

  if (area === "anunciante") {
    const anunciante = record as {
      id: number;
      nome: string;
      email: string;
    };
    return {
      id: anunciante.id,
      nome: anunciante.nome,
      email: anunciante.email,
    };
  }

  const parceiro = record as {
    id: number;
    nome: string;
    documento: string;
    telefone: string;
    tipoServico: string | null;
    status: string;
  };
  return {
    id: parceiro.id,
    nome: parceiro.nome,
    documento: parceiro.documento,
    telefone: parceiro.telefone,
    tipoServico: parceiro.tipoServico,
    status: parceiro.status,
  };
};

const mockAuthFlag = (process.env.USE_MOCK_AUTH ?? "").toLowerCase() === "true";
const nodeEnvironment = process.env.NODE_ENV ?? "development";
const databaseUrl = process.env.DATABASE_URL ?? "";
const hasDatabaseUrl = databaseUrl.trim().length > 0;
const fallbackToMockForMissingDb = !hasDatabaseUrl && nodeEnvironment !== "production";
if (fallbackToMockForMissingDb && !mockAuthFlag) {
  console.info(
    "Nenhum DATABASE_URL configurado; mock auth foi ativado automaticamente para não travar o login local.",
  );
}
const shouldUseMockAuth = () => mockAuthFlag || fallbackToMockForMissingDb;

const buildMockBaseProfile = (area: Area) => {
  if (area === "motorista") {
    return {
      id: -1,
      nome: "Motorista Dev",
      documento: "00000000000",
      veiculo: "Furgão Mock",
      status: "ativo",
    };
  }

  if (area === "anunciante") {
    return {
      id: -2,
      nome: "Anunciante Dev",
      email: "dev@anunciante.local",
    };
  }

  return {
    id: -3,
    nome: "Parceiro Dev",
    documento: "00000000000",
    telefone: "+55 11 99999-0000",
    tipoServico: "adesivação",
    status: "aprovado",
  };
};

const mockProfileForLogin = (area: Area, identifier: string) => {
  const base = buildMockBaseProfile(area);
  if (area === "anunciante") {
    return { ...base, email: identifier };
  }
  if (area === "parceiro" || area === "motorista") {
    return { ...base, documento: identifier };
  }
  return base;
};

const mockProfileFromRegisterPayload = (payload: RegisterPayload) => {
  if (payload.area === "motorista") {
    return {
      id: -10,
      nome: payload.nome,
      documento: payload.documento,
      veiculo: payload.veiculo,
      status: "ativo",
    };
  }

  if (payload.area === "anunciante") {
    return {
      id: -11,
      nome: payload.nome,
      email: payload.email,
    };
  }

  return {
    id: -12,
    nome: payload.nome,
    documento: payload.documento,
    telefone: payload.telefone,
    tipoServico: payload.tipoServico ?? "serviço dev",
    status: "aprovado",
  };
};

router.post("/login", async (req, res) => {
  try {
    const { area, identifier } = loginSchema.parse(req.body);
    if (shouldUseMockAuth()) {
      return res.json(createSessionPayload(area, mockProfileForLogin(area, identifier)));
    }
    // #region agent log
    fetch(
      "http://127.0.0.1:7243/ingest/a4e83150-2f20-48f6-9956-2bf528162f24",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "debug1",
          hypothesisId: "H1",
          location: "src/routes/auth.ts:100",
          message: "login attempt",
          timestamp: Date.now(),
          data: {
            area,
            identifier,
            databaseUrl: process.env.DATABASE_URL,
          },
        }),
      },
    ).catch(() => {});
    // #endregion
    let profile;

    if (area === "motorista") {
      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/a4e83150-2f20-48f6-9956-2bf528162f24",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "debug1",
            hypothesisId: "H2",
            location: "src/routes/auth.ts:115",
            message: "motorista query about to run",
            timestamp: Date.now(),
            data: {
              delegate: "prisma.motorista",
              databaseUrl: process.env.DATABASE_URL,
            },
          }),
        },
      ).catch(() => {});
      // #endregion
      const motorista = await prisma.motorista.findUnique({
        where: { documento: identifier },
      });
      if (!motorista) {
        return res.status(404).json({ error: "Motorista não encontrado" });
      }
      profile = buildProfile(area, motorista);
    } else if (area === "anunciante") {
      const anunciante = await prisma.anunciante.findUnique({
        where: { email: identifier },
      });
      if (!anunciante) {
        return res.status(404).json({ error: "Anunciante não encontrado" });
      }
      profile = buildProfile(area, anunciante);
    } else {
      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/a4e83150-2f20-48f6-9956-2bf528162f24",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "debug1",
            hypothesisId: "H3",
            location: "src/routes/auth.ts:131",
            message: "parceiro delegate check",
            timestamp: Date.now(),
            data: {
              inscricaoParceiroExists: typeof prisma.inscricaoParceiro !== "undefined",
              delegateType: typeof prisma.inscricaoParceiro,
            },
          }),
        },
      ).catch(() => {});
      // #endregion
      const parceiro = await prisma.inscricaoParceiro.findFirst({
        where: { documento: identifier },
      });
      if (!parceiro) {
        return res.status(404).json({ error: "Parceiro não encontrado" });
      }
      profile = {
        ...buildProfile(area, parceiro),
        status: parceiro.status,
      };
    }

    return res.json(createSessionPayload(area, profile));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao autenticar";
    return res.status(400).json({ error: message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const payload = registerSchema.parse(req.body);
    if (shouldUseMockAuth()) {
      return res
        .status(201)
        .json(createSessionPayload(payload.area, mockProfileFromRegisterPayload(payload)));
    }
    // #region agent log
    fetch(
      "http://127.0.0.1:7243/ingest/a4e83150-2f20-48f6-9956-2bf528162f24",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "debug1",
          hypothesisId: "H1",
          location: "src/routes/auth.ts:152",
          message: "register attempt",
          timestamp: Date.now(),
          data: {
            area: payload.area,
            fields: payload,
            databaseUrl: process.env.DATABASE_URL,
          },
        }),
      },
    ).catch(() => {});
    // #endregion
    let profile;

    if (payload.area === "motorista") {
      const existing = await prisma.motorista.findUnique({
        where: { documento: payload.documento },
      });
      if (existing) {
        return res.status(409).json({ error: "Motorista já cadastrado" });
      }
      profile = await prisma.motorista.create({
        data: {
          nome: payload.nome,
          documento: payload.documento,
          veiculo: payload.veiculo,
        },
      });
    } else if (payload.area === "anunciante") {
      const existing = await prisma.anunciante.findUnique({
        where: { email: payload.email },
      });
      if (existing) {
        return res.status(409).json({ error: "Email já cadastrado" });
      }
      profile = await prisma.anunciante.create({
        data: {
          nome: payload.nome,
          email: payload.email,
        },
      });
    } else {
      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/a4e83150-2f20-48f6-9956-2bf528162f24",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "debug1",
            hypothesisId: "H3",
            location: "src/routes/auth.ts:180",
            message: "register parceiro delegate check",
            timestamp: Date.now(),
            data: {
              inscricaoParceiroExists: typeof prisma.inscricaoParceiro !== "undefined",
            },
          }),
        },
      ).catch(() => {});
      // #endregion
      const existing = await prisma.inscricaoParceiro.findFirst({
        where: { documento: payload.documento },
      });
      if (existing) {
        return res.status(409).json({ error: "Parceiro já cadastrado" });
      }
      profile = await prisma.inscricaoParceiro.create({
        data: {
          nome: payload.nome,
          documento: payload.documento,
          telefone: payload.telefone,
          tipoServico: payload.tipoServico ?? "não especificado",
        },
      });
    }

    return res.status(201).json(createSessionPayload(payload.area, buildProfile(payload.area, profile)));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao registrar";
    return res.status(400).json({ error: message });
  }
});

export default router;
