# Forma | Sistema Integrado de Gestão

Base inicial para a Prova de Aptidão Profissional, com frontend React/Vite, API Express e PostgreSQL.

## Estrutura

```text
pap/
├── index.html                  # Entrada do frontend Vite/React
├── package.json                # Frontend, build e publicação gh-pages
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── pages/Dashboard.jsx
│   └── styles.css
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── db.js
│       ├── server.js
│       ├── middleware/async-handler.js
│       └── routes/auth.js
└── database/schema.sql
```

## Frontend e GitHub Pages

Na raiz, execute `npm install` e `npm run dev`. Para desenvolvimento, a aplicação usa `http://localhost:4000` por omissão; para publicar, defina `VITE_API_URL` com o endereço público da API no ambiente de compilação. Em **Settings → Pages → Build and deployment**, selecione **GitHub Actions** como origem. O workflow `.github/workflows/deploy.yml` compila e publica `dist/` automaticamente quando há alterações na branch padrão; `base` em `vite.config.js` deve corresponder ao nome do repositório (atualmente `/pap/`). O frontend é estático; segredos e operações de autenticação permanecem na API.

## API e PostgreSQL

1. Crie uma base PostgreSQL e execute `database/schema.sql`.
2. Copie `backend/.env.example` para `backend/.env`, defina `DATABASE_URL`, um `JWT_SECRET` aleatório com pelo menos 32 bytes e os domínios em `CLIENT_ORIGINS`.
3. Em `backend/`, execute `npm install` e `npm run dev`.

Rotas iniciais: `GET /api/health`, `POST /api/auth/login` e `POST /api/auth/users`. A última exige token de um administrador e permite criar apenas gestores (`manager`) ou funcionários (`employee`); não existe registo público. Crie o primeiro administrador por um processo controlado diretamente na base de dados antes de disponibilizar a aplicação. Configure o domínio exato do GitHub Pages em `CLIENT_ORIGINS`. Em alojamento gerido, ative TLS para PostgreSQL conforme as opções do fornecedor.

O token JWT deve ser enviado pela aplicação em `Authorization: Bearer <token>`. Antes de produção, acrescente limitação de tentativas de login, recuperação de conta, política de retenção/apagamento RGPD e um processo seguro de criação do primeiro administrador. Não guarde dados pessoais nos logs.