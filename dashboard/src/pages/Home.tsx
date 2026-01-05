import { Link } from "react-router-dom";

const portals = [
  {
    title: "Motorista",
    description:
      "Agende adesivações, registre rodagem e troque seus pontos por serviços parceiros.",
    path: "/motorista",
    badge: "Plataforma do motorista",
  },
  {
    title: "Anunciante",
    description:
      "Crie campanhas, confirme pagamento via PIX e agende reuniões de kickoff.",
    path: "/anunciante",
    badge: "Painel de anunciantes",
  },
  {
    title: "Parceiro / Adesivador",
    description:
      "Cadastre-se para participar, alinhar agendas e receber instruções pelo WhatsApp.",
    path: "/parceiro",
    badge: "Rede de parceiros",
  },
];

const Home = () => (
  <main className="page-container">
    <header className="page-hero">
      <p className="eyebrow">KMR Marketplace</p>
      <h1>Conectamos motoristas, anunciantes e parceiros em um único fluxo.</h1>
      <p className="intro">
        Escolha sua jornada: agendamento, pagamento ou parceria. Cada área tem um fluxo
        enxuto para dar tração ao plano de adesivação.
      </p>
    </header>

    <section className="portal-grid">
      {portals.map((portal) => (
        <article key={portal.title} className="portal-card">
          <span className="portal-badge">{portal.badge}</span>
          <h2>{portal.title}</h2>
          <p>{portal.description}</p>
          <Link to={portal.path}>Entrar nessa área</Link>
        </article>
      ))}
    </section>
  </main>
);

export default Home;
