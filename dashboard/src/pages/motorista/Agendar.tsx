import { ChangeEvent, FormEvent, useState } from "react";
import api from "../../services/api";

const Agendar = () => {
  const [form, setForm] = useState({
    modelo: "",
    placa: "",
    regiao: "",
    disponibilidade: "",
    observacoes: "",
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleChange =
    (field: keyof typeof form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    try {
      await api.post("/motoristas/1/agendar", form);
      setStatusMessage("Agendamento solicitado com sucesso! Aguarde confirmação.");
    } catch (error) {
      setStatusMessage("Não foi possível enviar o pedido. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container motorista-page">
      <header className="page-hero">
        <p className="eyebrow">Motorista</p>
        <h1>Agendar adesivação</h1>
        <p>Conte-nos sobre seu veículo, região de atuação e disponibilidade.</p>
      </header>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Modelo do veículo
          <input value={form.modelo} onChange={handleChange("modelo")} required />
        </label>
        <label>
          Placa
          <input value={form.placa} onChange={handleChange("placa")} required />
        </label>
        <label>
          Região de atuação
          <input value={form.regiao} onChange={handleChange("regiao")} placeholder="Ex: Zona Norte, SP" />
        </label>
        <label>
          Disponibilidade
          <input
            value={form.disponibilidade}
            onChange={handleChange("disponibilidade")}
            placeholder="Seg, Qua e Sex das 9h às 12h"
          />
        </label>
        <label>
          Observações extras
          <textarea value={form.observacoes} onChange={handleChange("observacoes")} rows={3} />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar agendamento"}
        </button>
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </form>
    </main>
  );
};

export default Agendar;
