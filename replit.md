# Owanana's Kitchen

## Services

The existing React/Vite storefront remains at the project root. The backend is a separate Node.js + Express service under `/server` and does not modify the frontend package or source files.

## Run the backend

The Replit workflow named `Backend API` runs:

```sh
cd server && npm run dev
```

It listens on port `3001`.

For a manual setup:

```sh
cd server
cp .env.example .env
npm install
npm run db:setup
npm run db:seed
npm run seed:owner
npm start
```

PostgreSQL is provided by Replit through `DATABASE_URL`. Resend order notifications use the connected Replit Resend integration and the shared `OWNER_EMAIL` and `RESEND_FROM_EMAIL` environment variables.

See `server/README.md` for endpoint details, admin authentication, and instructions for connecting the existing frontend to the API.