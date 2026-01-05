## Backend KMR

API Node + Express projetada para cumprir os requisitos do plano de adesivação de veículos.

- **Modelos**: Prisma registra motoristas, contratos, registros KMR, verificações e pagamentos.
- **Endpoints**:
  - `GET /contracts`: lista contratos com dados de pagamento.
  - `POST /contracts`: cria novo contrato.
  - `POST /locations`: registra novo KMR e dispara validação de pagamento.
  - `GET /kmr/:id`: retorna métricas agregadas de KMR.
  - `GET /dashboard/overview`: mostra cobertura e impacto para anunciantes.
  - `POST /partners/check-in`: parceiro inicia verificação.
  - `POST /partners/check-out`: confirma fechamento e integridade.

- **Execução**:
  1. Copie `env.example` para `.env`.
  2. Configure `DATABASE_URL`.
  3. Rode `npm install`, `npx prisma db push`.
  4. Inicie com `npm run dev`.

Este serviço mantém o pagamento travado até que o KMR supere as metas e atualiza os status para motoristas, parceiros e anunciantes.
