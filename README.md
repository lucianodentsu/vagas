# Sistema - Painel Administrativo

Full-stack admin panel com React, Node.js, PostgreSQL e Docker.

## Stack

| Camada       | Tecnologia                                  |
|--------------|---------------------------------------------|
| Frontend     | React 18, TypeScript, Vite, Tailwind CSS    |
| Backend      | Node.js, Express, Prisma ORM, Zod           |
| Banco        | PostgreSQL 16                               |
| Auth         | JWT (bcrypt + jsonwebtoken)                 |
| Infra        | Docker Compose, Nginx reverse proxy         |

## Quick Start

```bash
# 1. Clone
git clone https://github.com/lucianodentsu/vagas.git
cd vagas

# 2. Configure env
cp .env.example .env

# 3. Suba tudo
docker compose up -d --build

# 4. Acesse
open http://localhost:3000
```

## Credenciais de teste

```
Email: admin@sistema.com
Senha: admin123
```

## Portas

| Servico   | Porta |
|-----------|-------|
| Frontend  | 3000  |
| Backend   | 3001  |
| Nginx     | 9090  |
| Postgres  | 5432  |

## Scripts uteis

```bash
# Backend
cd backend
npm run dev           # Dev server com hot reload
npm run lint          # ESLint
npm run format        # Prettier
npm run db:migrate    # Rodar migrations
npm run db:seed       # Popular banco com dados de teste
npm run db:studio     # Abrir Prisma Studio

# Frontend
cd frontend
npm run dev           # Vite dev server
npm run lint          # ESLint
npm run format        # Prettier
npm run build         # Build de producao
```

## Estrutura

```
├── backend/
│   ├── prisma/          # Schema + seed
│   └── src/
│       ├── controllers/ # Logica dos endpoints
│       ├── middleware/   # Auth JWT
│       ├── routes/       # Definicao de rotas
│       └── index.ts     # Entry point
├── frontend/
│   └── src/
│       ├── components/  # Layout, Sidebar, PrivateRoute
│       ├── contexts/    # AuthContext
│       ├── pages/       # Dashboard, Users, Products, Reports, Login
│       ├── api/         # Axios client
│       └── styles/      # Tailwind + design system
├── nginx/               # Reverse proxy config
└── docker-compose.yml
```
