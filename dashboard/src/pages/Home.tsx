import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const portals = [
  {
    title: "Motorista",
    description:
      "Agende adesivações, registre rodagem e troque seus pontos por serviços parceiros.",
    area: "motorista",
    badge: "Plataforma do motorista",
  },
  {
    title: "Anunciante",
    description:
      "Crie campanhas, confirme pagamento via PIX e agende reuniões de kickoff.",
    area: "anunciante",
    badge: "Painel de anunciantes",
  },
  {
    title: "Parceiro / Adesivador",
    description:
      "Cadastre-se para participar, alinhar agendas e receber instruções pelo WhatsApp.",
    area: "parceiro",
    badge: "Rede de parceiros",
  },
];

const highlights = [
  { title: "3 áreas", description: "Motorista, anunciante e parceiro trabalhando juntos." },
  { title: "40+ campanhas", description: "Impacto medido em quilometragem e visibilidade." },
  { title: "Pagamentos em tempo real", description: "Confirmamos PIX e liberamos reuniões em minutos." },
];

const Home = () => {
  const { isAuthenticated, area } = useAuth();

  return (
    <main className="page-container">
      <header className="page-hero">
        <p className="eyebrow">KMR Marketplace</p>
        <h1>Conectamos motoristas, anunciantes e parceiros em um único fluxo.</h1>
        <p className="intro">
          Escolha sua jornada: agendamento, pagamento ou parceria. Cada área tem um fluxo
          enxuto para dar tração ao plano de adesivação.
          {isAuthenticated
            ? ` Você está logado como ${area}.`
            : " Faça login para acessar cada painel."}
        </p>
      </header>

      <section className="summary" aria-label="Resumo rápido">
        {highlights.map((item) => (
          <article key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </article>
        ))}
      </section>

      <section className="portal-grid" aria-label="Portais de acesso">
        {portals.map((portal) => (
          <article key={portal.title} className="portal-card">
            <span className="portal-badge">{portal.badge}</span>
            <h2>{portal.title}</h2>
            <p>{portal.description}</p>
            <Link to={`/auth?area=${portal.area}`} aria-label={`Entrar na área ${portal.title}`}>
              Entrar nessa área
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Home;
