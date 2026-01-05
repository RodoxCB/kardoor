import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

type MotoristaSummary = {
  pontos: number;
  contratosAtivos: number;
  kmRodados: number;
  proximosPassos: string[];
};

const fallback: MotoristaSummary = {
  pontos: 430,
  contratosAtivos: 2,
  kmRodados: 1280,
  proximosPassos: [
    "Registrar o próximo KMR",
    "Agendar adesivação com o parceiro local",
    "Trocar pontos por gasolina ou mecânica",
  ],
};

const Dashboard = () => {
  const [summary, setSummary] = useState<MotoristaSummary>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<MotoristaSummary>("/motoristas/summary")
      .then((response) => setSummary(response.data))
      .catch(() => setSummary(fallback))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-container motorista-page">
      <header className="page-hero">
        <p className="eyebrow">Motorista</p>
        <h1>Seu painel KMR</h1>
        <p>
          Revise contratos ativos, avance nas metas de rodagem e troque pontos por serviços.
        </p>
      </header>

      <section className="motorista-summary">
        {[
          { label: "Pontos acumulados", value: summary.pontos, suffix: "pts" },
          { label: "Contratos ativos", value: summary.contratosAtivos },
          { label: "Km rodados este mês", value: summary.kmRodados, suffix: "km" },
        ].map((card) => (
          <article key={card.label}>
            <strong>{card.value}</strong>
            <span>
              {card.label} {card.suffix && `(${card.suffix})`}
            </span>
          </article>
        ))}
      </section>

      {loading && <p>Carregando resumo...</p>}

      <section className="motorista-actions">
        <Link to="/motorista/agendar" className="action-link">
          Agendar adesivação
        </Link>
        <Link to="/motorista/rodagem" className="action-link">
          Registrar rodagem
        </Link>
        <Link to="/motorista/pontos" className="action-link">
          Trocar pontos por serviços
        </Link>
      </section>

      <section className="motorista-list">
        <h2>Próximos passos</h2>
        <ul>
          {summary.proximosPassos.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Dashboard;
