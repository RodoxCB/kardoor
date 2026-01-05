type ReuniaoSlot = {
  id: number;
  titulo: string;
  horario: string;
};

const slots: ReuniaoSlot[] = [
  { id: 1, titulo: "Kickoff com o anunciante", horario: "Seg, 09h20" },
  { id: 2, titulo: "Aprimorar briefing", horario: "Qua, 11h10" },
  { id: 3, titulo: "Alinhamento com parceiro", horario: "Sex, 14h00" },
];

type CalendarioProps = {
  onAgendar: (slot: ReuniaoSlot) => void;
};

const CalendarioReuniao = ({ onAgendar }: CalendarioProps) => (
  <section className="card-grid calendario">
    <header>
      <h3>Slots disponíveis</h3>
      <p>Escolha uma data assim que o PIX for confirmado.</p>
    </header>
    {slots.map((slot) => (
      <article key={slot.id} className="slot-card">
        <p>
          <strong>{slot.titulo}</strong>
        </p>
        <span>{slot.horario}</span>
        <button type="button" onClick={() => onAgendar(slot)}>
          Agendar reunião
        </button>
      </article>
    ))}
  </section>
);

export default CalendarioReuniao;
