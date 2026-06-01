# CLAUDE.md

## Projeto

Painel administrativo full-stack. Nome do repo: `vagas`. Roda via Docker Compose.

## Como rodar

```bash
docker compose up -d --build
```

Frontend em http://localhost:3000, backend em http://localhost:3001, Nginx em http://localhost:9090.

## Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS 3
- **Backend**: Node.js + Express + Prisma ORM + PostgreSQL 16
- **Auth**: JWT com bcrypt. Middleware em `backend/src/middleware/auth.ts`
- **Infra**: Docker Compose (4 containers: db, backend, frontend, nginx)

## Design System

Visual inspirado na Tesla: minimalista, monocromatico, tipografia Inter.
- Tokens de cor: paleta `surface` (0-950) no Tailwind config
- Classes utilitarias: `btn-primary`, `btn-secondary`, `btn-ghost`, `input`, `card`, `badge-*`, `table-header`, `overlay`, `modal`
- Definidas em `frontend/src/styles/index.css` como `@layer components`

## Convencoes

- ESLint + Prettier configurados na raiz e em cada pacote
- Prettier: single quotes, trailing commas, 100 chars, 2 spaces
- Labels e textos da UI em portugues
- Rotas da API prefixadas com `/api/`
- Nomes de tabelas no Prisma mapeados para snake_case

## Estrutura de pastas

- `backend/src/controllers/` - logica dos endpoints
- `backend/src/routes/` - definicao de rotas Express
- `backend/src/middleware/` - auth JWT
- `backend/prisma/` - schema e seed
- `frontend/src/pages/` - paginas (Dashboard, Login, Users, Products, Reports)
- `frontend/src/components/` - Layout, Sidebar, PrivateRoute
- `frontend/src/contexts/` - AuthContext (login/logout/token)
- `frontend/src/api/client.ts` - instancia Axios com interceptor JWT

## Credenciais de teste

```
admin@sistema.com / admin123
```

## Comandos uteis

```bash
# Rebuild frontend apos mudancas visuais
docker compose up -d --build frontend

# Migrations
cd backend && npm run db:migrate

# Lint
cd frontend && npm run lint
cd backend && npm run lint
```
