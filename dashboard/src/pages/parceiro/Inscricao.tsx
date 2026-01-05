import { FormEvent, useState } from "react";
import api from "../../services/api";

const Inscricao = () => {
  const [form, setForm] = useState({
    nome: "",
    documento: "",
    tipo: "",
    endereco: "",
    telefone: "",
  });
  const [status, setStatus] = useState<string | null>(null);

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await api.post("/parceiros/inscricao", form);
      setStatus("Inscrição recebida! Em breve entraremos em contato via WhatsApp.");
    } catch (error) {
      setStatus("Não foi possível enviar. Tente novamente.");
    }
  };

  const whatsappLink = `https://wa.me/5511999999999?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20sobre%20a%20parceria%20KMR`;

  return (
    <main className="page-container parceiro-page">
      <header className="page-hero">
        <p className="eyebrow">Parceiros e adesivadores</p>
        <h1>Cadastre-se e alinhe as próximas etapas</h1>
        <p>Compartilhe seus dados e recebimentos serão encaminhados pela plataforma.</p>
      </header>

      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Nome completo
          <input value={form.nome} onChange={(event) => setField("nome", event.target.value)} required />
        </label>
        <label>
          CPF ou CNPJ
          <input value={form.documento} onChange={(event) => setField("documento", event.target.value)} required />
        </label>
        <label>
          Tipo de serviço
          <input value={form.tipo} onChange={(event) => setField("tipo", event.target.value)} placeholder="Adesivador, posto, lava-rápido..." />
        </label>
        <label>
          Endereço
          <input value={form.endereco} onChange={(event) => setField("endereco", event.target.value)} />
        </label>
        <label>
          Telefone / WhatsApp
          <input value={form.telefone} onChange={(event) => setField("telefone", event.target.value)} required />
        </label>

        <button type="submit">Enviar inscrição</button>
        {status && <p className="status-message">{status}</p>}
      </form>

      <section className="information">
        <p>Caso prefira conversar agora, clique no botão abaixo.</p>
        <a className="whatsapp-link" href={whatsappLink} target="_blank" rel="noreferrer">
          Falar no WhatsApp
        </a>
      </section>
    </main>
  );
};

export default Inscricao;
