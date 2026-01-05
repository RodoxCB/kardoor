import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import ImpactReport from "../../components/ImpactReport";

type Campaign = {
  campanhaId: number;
  contratoId: number;
  motorista: string;
  statusContrato: string;
  totalKm: number;
  investimento: number;
  pagamento: string;
  relatoriosGerados: number;
};

type OverviewResponse = {
  impactoTotal: number;
  qtdCampanhas: number;
  campanhas: Campaign[];
};

const fallback: OverviewResponse = {
  impactoTotal: 4200,
  qtdCampanhas: 3,
  campanhas: [
    {
      campanhaId: 1,
      contratoId: 1,
      motorista: "João Silva",
      statusContrato: "ATIVO",
      totalKm: 2150,
      investimento: 1500,
      pagamento: "LIBERADO",
      relatoriosGerados: 12,
    },
    {
      campanhaId: 2,
      contratoId: 2,
      motorista: "Maria Santos",
      statusContrato: "ATIVO",
      totalKm: 1800,
      investimento: 1200,
      pagamento: "AGUARDANDO",
      relatoriosGerados: 8,
    },
    {
      campanhaId: 3,
      contratoId: 3,
      motorista: "Carlos Oliveira",
      statusContrato: "CONCLUIDO",
      totalKm: 900,
      investimento: 800,
      pagamento: "LIBERADO",
      relatoriosGerados: 5,
    },
  ],
};

const Dashboard = () => {
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<OverviewResponse>("/dashboard/overview")
      .then((res) => setOverview(res.data))
      .catch(() => setOverview(fallback))
      .finally(() => setLoading(false));
  }, []);

  const stats = overview ?? fallback;

  return (
    <main className="page-container anunciante-page">
      <header className="page-hero">
        <p className="eyebrow">Anunciante</p>
        <h1>Impacto e cobertura da sua campanha</h1>
        <p>Visão rápida do desempenho, orçamento e próximos passos.</p>
      </header>

      <section className="summary">
        <article>
          <strong>{stats.qtdCampanhas}</strong>
          <span>Campanhas ativas</span>
        </article>
        <article>
          <strong>{stats.impactoTotal.toFixed(1)} km</strong>
          <span>Km cobertos</span>
        </article>
        <article>
          <Link to="/anunciante/campanha">Criar nova campanha</Link>
        </article>
        <article>
          <Link to="/anunciante/pagamento">Confirmar pagamento PIX</Link>
        </article>
      </section>

      {loading && <p>Carregando campanhas...</p>}

      <section className="card-grid" aria-label="Campanhas recentes">
        {(overview ?? fallback).campanhas.map((campanha) => (
          <ImpactReport key={campanha.campanhaId} data={campanha} />
        ))}
      </section>
    </main>
  );
};

export default Dashboard;
