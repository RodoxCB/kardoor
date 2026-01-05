## Dashboard de anunciantes

Frontend React + Vite para mostrar impacto, cobertura e histórico de contratos.

- Puxa `/dashboard/overview` para exibir métricas agregadas.
- Componentes fornecem visualização rápida de campanhas e pagamentos liberados.

### Execução

1. Instale dependências: `npm install`.
2. Garanta que o backend esteja rodando (porta 4000).
3. Rode `npm run dev` dentro de `dashboard/`.
4. Acesse em `http://localhost:5173`.

O layout pode crescer para gráficos com Chart.js ou mapas, mas a versão inicial prioriza rapidez e custos baixos.

### Testes manuais

1. Acesse `/auth?area=motorista`, faça login com documento existente e verifique que redireciona para `/motorista`.
2. Realize o cadastro de um anunciante via `/auth?area=anunciante`, confirme que recebe token e é redirecionado para `/anunciante`.
3. Troque para o modo de Cadastro no painel de Parceiros, preencha os campos e valide a mensagem de sucesso.
4. Tente acessar `/motorista` sem autenticar e confirme que é redirecionado para `/auth?area=motorista`.
5. Após login, faça logout (limpeza de `localStorage`), recarregue a página e confira que o acesso é bloqueado novamente.

### Critérios de aceitação

- Cada área exige autenticação antes de mostrar o painel correspondente (Motorista, Anunciante, Parceiro).
- Feedbacks exibem erros claros (ex: registro duplicado ou campo obrigatório vazio).
- Sessão é persistida em `localStorage` e expira quando o token simulado ultrapassa `expiresIn`.
- Logout limpa `localStorage` e força novo login para acessar qualquer rota protegida.

### Guia de estilo escuro

- Os tokens de `dashboard/src/styles.css` controlam paleta escura, espaçamentos padronizados e estados de foco acessíveis. Basta atualizar as variáveis `--color-*` para ajustar o tema.
- Cards, formulários e botões reutilizam classes como `form-stack`, `portal-card`, `auth-card` e `impact-card` para preservar contraste 4.5:1 e foco visível (`:focus-visible`) sem adicionar lógica em cada página.
- Ao adicionar novas páginas/formulários mantenha a hierarquia `main > section > article` e reutilize mensagens com a classe `status-message` para garantir consistência nos feedbacks.
