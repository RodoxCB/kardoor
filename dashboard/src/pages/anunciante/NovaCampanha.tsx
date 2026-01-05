import { useState } from "react";
import api from "../../services/api";

const NovaCampanha = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    tipoMidia: "envolvente",
    regioes: "",
    veiculos: 1,
    investimento: 0,
    duracao: 7,
  });
  const [status, setStatus] = useState<string | null>(null);

  const setField = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await api.post("/campanhas/solicitacao", form);
      setStatus("Solicitação registrada. Aguardando pagamento PIX para liberar reunião.");
    } catch (error) {
      setStatus("Não foi possível finalizar. Tente novamente em instantes.");
    }
  };

  return (
    <main className="page-container anunciante-page">
      <header className="page-hero">
        <p className="eyebrow">Anunciante</p>
        <h1>Nova campanha de adesivação</h1>
        <p>Preencha o briefing em 3 passos e confirme o pagamento PIX para agendar reunião.</p>
      </header>

      <section className="wizard-step">
        <h2>Etapa {step} de 3</h2>
        {step === 1 && (
          <>
            <label>
              Nome da campanha
              <input value={form.nome} onChange={(e) => setField("nome", e.target.value)} required />
            </label>
            <label>
              Descrição
              <textarea value={form.descricao} onChange={(e) => setField("descricao", e.target.value)} rows={3} />
            </label>
            <label>
              Tipo de mídia
              <select value={form.tipoMidia} onChange={(e) => setField("tipoMidia", e.target.value)}>
                <option value="envolvente">Envolvente</option>
                <option value="estratégico">Estratégico</option>
                <option value="campanha_local">Campanha local</option>
              </select>
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <label>
              Regiões desejadas
              <input value={form.regioes} onChange={(e) => setField("regioes", e.target.value)} placeholder="Ex: Zona Sul, ABC" />
            </label>
            <label>
              Número de veículos
              <input
                type="number"
                value={form.veiculos}
                min={1}
                onChange={(e) => setField("veiculos", Number(e.target.value))}
              />
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <label>
              Investimento previsto
              <input
                type="number"
                min={0}
                value={form.investimento}
                onChange={(e) => setField("investimento", Number(e.target.value))}
              />
            </label>
            <label>
              Duração (dias)
              <input
                type="number"
                min={1}
                value={form.duracao}
                onChange={(e) => setField("duracao", Number(e.target.value))}
              />
            </label>
          </>
        )}

        <div className="wizard-actions">
          {step > 1 && (
            <button type="button" onClick={() => setStep((prev) => prev - 1)}>
              Voltar
            </button>
          )}
          {step < 3 ? (
            <button type="button" onClick={() => setStep((prev) => prev + 1)}>
              Próximo
            </button>
          ) : (
            <button type="button" onClick={handleSubmit}>
              Finalizar e gerar PIX
            </button>
          )}
        </div>

        {status && <p className="status-message">{status}</p>}
      </section>
    </main>
  );
};

export default NovaCampanha;
