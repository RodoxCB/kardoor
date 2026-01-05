import { useState } from "react";
import api from "../../services/api";
import CalendarioReuniao from "../../components/CalendarioReuniao";

const Pagamento = () => {
  const [pixKey, setPixKey] = useState("kmr@pagamentos");
  const [loading, setLoading] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const confirmPix = async () => {
    setLoading(true);
    setMensagem(null);
    try {
      await api.post("/pagamentos/pix/confirmar", { chave: pixKey });
      setConfirmado(true);
      setMensagem("PIX confirmado! Escolha uma reunião para alinhar a campanha.");
    } catch (error) {
      setMensagem("Erro ao confirmar. Verifique a chave e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleAgendar = (slot: { titulo: string; horario: string }) => {
    setMensagem(`Reunião agendada para ${slot.horario} (${slot.titulo}).`);
  };

  return (
    <main className="page-container anunciante-page">
      <header className="page-hero">
        <p className="eyebrow">Anunciante</p>
        <h1>Pagamento via PIX</h1>
        <p>
          Envie o valor da campanha usando o QR Code abaixo. Ao confirmar, liberamos o
          agendamento de reunião.
        </p>
      </header>

      <section className="pix-card">
        <div className="qr-code" aria-label="QR Code PIX fake" />
        <div>
          <p className="subtitle">Chave PIX</p>
          <strong>{pixKey}</strong>
          <input value={pixKey} onChange={(event) => setPixKey(event.target.value)} />
          <button onClick={confirmPix} disabled={loading}>
            {loading ? "Confirmando..." : "Confirmar pagamento"}
          </button>
          {mensagem && <p className="status-message">{mensagem}</p>}
        </div>
      </section>

      {confirmado && <CalendarioReuniao onAgendar={handleAgendar} />}
    </main>
  );
};

export default Pagamento;
