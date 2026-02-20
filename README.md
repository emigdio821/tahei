# tahei

A simple, open-source, self-hosted bookmark manager.

## Tech Stack

- TanStack Start + React 19
- TypeScript
- Tailwind CSS
- Drizzle ORM
- PostgreSQL / Neon Database
- Better Auth
- TanStack Query

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy [.env.example](.env.example) to `.env` and configure:
```bash
cp .env.example .env
```

3. Set up database:
```bash
npm run db:push
npm run db:seed
```

4. Run dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database

Switch between local PostgreSQL and Neon serverless by setting `DB_TYPE` in your `.env` file.
