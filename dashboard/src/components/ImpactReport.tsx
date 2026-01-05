type ImpactReportProps = {
  data: {
    campanhaId: number;
    contratoId: number;
    motorista: string;
    statusContrato: string;
    totalKm: number;
    investimento: number;
    pagamento: string;
    relatoriosGerados: number;
  };
};

const ImpactReport = ({ data }: ImpactReportProps) => (
  <article className="card">
    <header>
      <h3>Campanha #{data.campanhaId}</h3>
      <p>Contrato #{data.contratoId}</p>
    </header>
    <p>Motorista: {data.motorista}</p>
    <p>Status: {data.statusContrato}</p>
    <p>Km percorridos: {data.totalKm.toFixed(1)}</p>
    <p>Investimento: R${data.investimento.toFixed(2)}</p>
    <p>Pagamento: {data.pagamento}</p>
    <p>Relatórios enviados: {data.relatoriosGerados}</p>
  </article>
);

export default ImpactReport;
