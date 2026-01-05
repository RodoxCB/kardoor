import { useEffect, useState } from "react";
import api from "../../services/api";

type Recompensa = {
  id: number;
  nome: string;
  descricao: string;
  pontos: number;
  disponivel: boolean;
};

const fallback: Recompensa[] = [
  { id: 1, nome: "Posto Premium", descricao: "Desconto de R$ 50 na gasolina", pontos: 300, disponivel: true },
  { id: 2, nome: "Lava-Rápido Express", descricao: "Lavagem completa + polimento", pontos: 220, disponivel: true },
  { id: 3, nome: "Mecânica Parceira", descricao: "Revisão básica + check list", pontos: 400, disponivel: false },
];

const Pontos = () => {
  const [recompensas, setRecompensas] = useState<Recompensa[]>(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Recompensa[]>("/recompensas")
      .then((response) => setRecompensas(response.data))
      .catch(() => setRecompensas(fallback))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-container motorista-page">
      <header className="page-hero">
        <p className="eyebrow">Motorista</p>
        <h1>Troque seus pontos</h1>
        <p>Resgates locais para combustível, lava-rápido e serviços rápidos.</p>
      </header>

      {loading && <p>Atualizando catálogo...</p>}

      <section className="card-grid">
        {recompensas.map((item) => (
          <article key={item.id} className={`reward-card ${item.disponivel ? "" : "disabled"}`}>
            <div>
              <strong>{item.nome}</strong>
              <span>{item.descricao}</span>
            </div>
            <footer>
              <span>{item.pontos} pts</span>
              <button disabled={!item.disponivel}>Trocar agora</button>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Pontos;
