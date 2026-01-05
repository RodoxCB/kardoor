import { useState } from "react";

type Registro = {
  data: string;
  km: number;
  local: string;
};

const initial: Registro[] = [
  { data: "2026-01-01", km: 320, local: "Zona Norte" },
  { data: "2026-01-04", km: 280, local: "Zona Leste" },
  { data: "2026-01-07", km: 310, local: "Zona Sul" },
];

const Rodagem = () => {
  const [registros, setRegistros] = useState(initial);

  const meta = 1500;
  const alcançado = registros.reduce((sum, current) => sum + current.km, 0);
  const progresso = Math.min((alcançado / meta) * 100, 100);

  const adicionarRegistro = () => {
    const novo: Registro = {
      data: new Date().toISOString().slice(0, 10),
      km: 110,
      local: "Zona Central",
    };
    setRegistros((prev) => [novo, ...prev]);
  };

  return (
    <main className="page-container motorista-page">
      <header className="page-hero">
        <p className="eyebrow">Motorista</p>
        <h1>Minha rodagem</h1>
        <p>Veja como anda sua evolução e registre novos trechos com um clique.</p>
      </header>

      <section className="progress-card">
        <div>
          <strong>{alcançado} km</strong>
          <span>{meta} km da meta semanal</span>
        </div>
        <div className="progress-bar">
          <div style={{ width: `${progresso}%` }} />
        </div>
      </section>

      <button className="primary" onClick={adicionarRegistro}>
        Simular novo registro
      </button>

      <section className="list-stack">
        <h2>Registros recentes</h2>
        {registros.map((registro) => (
          <article key={`${registro.data}-${registro.km}`}>
            <p>
              <strong>{registro.km} km</strong> · {registro.local}
            </p>
            <span>{registro.data}</span>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Rodagem;
