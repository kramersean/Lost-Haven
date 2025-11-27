# Street Syndicate

Skeleton monorepo for a crime/mafia themed RPG/strategy browser game. The project contains a TypeScript/Express API powered by Prisma/PostgreSQL and a React + Tailwind SPA front-end.

## Getting started

```bash
# backend
cd backend
npm install
npm run prisma:generate
# optional: npm run prisma:migrate -- --name init
npm run dev

# frontend
cd ../frontend
npm install
npm run dev
```

Configure environment variables in `backend/.env` (see `.env.example`). Seed starter data with `npm run prisma:seed`.
