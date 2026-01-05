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
  - `POST /auth/login`: autentica Motoristas (documento), Anunciantes (email) ou Parceiros (documento) e retorna `{ area, profile, token, expiresIn }`.
  - `POST /auth/register`: registra novo Motorista/Anunciante/Parceiro e retorna a mesma sessão.

- **Execução**:
  1. Copie `env.example` para `.env`.
  2. Configure `DATABASE_URL`.
  3. Rode `npm install`, `npx prisma db push`.
  4. Inicie com `npm run dev`.

### Modo de desenvolvimento (mock)

- Para testar login/cadastro sem banco, defina `USE_MOCK_AUTH=true` antes de iniciar o servidor (ex.: `USE_MOCK_AUTH=true npm run dev`).
- Esse modo responde imediatamente com perfis falsos para Motoristas, Anunciantes e Parceiros, sem tocar no Prisma.
- No dashboard local, use os seguintes identificadores para acessar cada área:
  - Motorista: `identifier` = `00000000000`
  - Anunciante: `identifier` = `dev@anunciante.local`
  - Parceiro: `identifier` = `00000000000`
- Basta não definir `USE_MOCK_AUTH` na produção para que o fluxo real com banco seja usado novamente.

Este serviço mantém o pagamento travado até que o KMR supere as metas e atualiza os status para motoristas, parceiros e anunciantes.

### Autenticação rápida

1. Login de um motorista (documento):  
   `curl http://localhost:4000/auth/login -H "Content-Type: application/json" -d '{"area":"motorista","identifier":"12345678900"}'`
2. Login de um anunciante (email):  
   `curl http://localhost:4000/auth/login -H "Content-Type: application/json" -d '{"area":"anunciante","identifier":"anuncio@empresa.com"}'`
3. Cadastro de parceiro:  
   `curl http://localhost:4000/auth/register -H "Content-Type: application/json" -d '{"area":"parceiro","nome":"Nova Base","documento":"8877665544","telefone":"11999990000"}'`

As respostas incluem o token simulado e `expiresIn` para persistir no frontend.
