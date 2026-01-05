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
  <article className="impact-card" aria-label={`Status da campanha ${data.campanhaId}`}>
    <header>
      <h3>Campanha #{data.campanhaId}</h3>
      <p>Contrato #{data.contratoId}</p>
    </header>
    <div className="impact-metadata">
      <p>
        Motorista: <strong>{data.motorista}</strong>
      </p>
      <p>
        Status: <strong>{data.statusContrato}</strong>
      </p>
    </div>
    <dl>
      <div>
        <dt>Km percorridos</dt>
        <dd>{data.totalKm.toFixed(1)} km</dd>
      </div>
      <div>
        <dt>Investimento</dt>
        <dd>R${data.investimento.toFixed(2)}</dd>
      </div>
      <div>
        <dt>Pagamento</dt>
        <dd>{data.pagamento}</dd>
      </div>
      <div>
        <dt>Relatórios enviados</dt>
        <dd>{data.relatoriosGerados}</dd>
      </div>
    </dl>
  </article>
);

export default ImpactReport;
