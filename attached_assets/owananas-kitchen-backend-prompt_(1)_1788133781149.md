# Owanana's Kitchen — Backend Build Prompt (for Replit Agent)

## ⚠️ IMPORTANT — READ FIRST

This repo currently contains a **working, already-deployed React/Vite frontend** at the root of the project (`src/`, `App.jsx`, `package.json`, `vite.config.js`, etc.). It is live in production on Vercel.

**Do NOT modify, move, rename, or delete any existing frontend files or folders.** Do not touch the root `package.json`. Do not restructure the project layout.

Build the entire backend inside a **new folder called `/server`**, with its own `package.json` and its own dependencies, completely separate from the frontend. Treat the frontend as read-only reference material only.

---

## Context

I've built the complete frontend for **Owanana's Kitchen**, a food catering / delivery / food-supply business (not a sit-down restaurant). It's a React + Vite app and it's fully functional on the frontend: menu browsing, search, category filtering, cart, checkout form, and order confirmation.

I now need a **backend** that this frontend can talk to. Please build it as a REST API (or a small set of serverless functions — your call on what's cleanest in this environment) that the existing frontend will call.

Do **not** rebuild the frontend. Treat it as fixed. Your job is the server, database, and API only — built inside `/server`.

---

## Tech Preferences

- Node.js + Express (or a framework you think is a better fit for Replit — explain why if you deviate)
- A simple, reliable database — PostgreSQL if Replit supports it easily, otherwise SQLite/other lightweight option is fine for now
- Plain REST endpoints returning JSON (no GraphQL needed)
- Keep it as simple as possible while being correct. This is a small business app, not an enterprise system.

---

## Data Models Needed

### Food Item
```json
{
  "id": 1,
  "name": "Jollof Rice",
  "price": 3500,
  "description": "Delicious Nigerian jollof rice cooked with rich tomato sauce.",
  "image": "/jollof.jpg",
  "category": "Rice"
}
```
Categories currently in use: Rice, Protein, Soup, Drinks (but should be flexible — not hardcoded, since I want to add categories later).

### Food Package
```json
{
  "id": "pkg-1",
  "name": "Individual Package",
  "description": "A satisfying meal package for one person, perfect for everyday meals.",
  "price": 5000,
  "image": "/jollof.jpg"
}
```

### Order (submitted from checkout)
```json
{
  "customer": {
    "name": "string",
    "phone": "string",
    "email": "string",
    "address": "string",
    "notes": "string (optional)"
  },
  "items": [
    { "id": 1, "name": "Jollof Rice", "price": 3500, "quantity": 2 }
  ],
  "total": 9500
}
```
On successful order creation, return a unique order reference like `OWK-123456` and a timestamp.

### Admin User
```json
{
  "id": 1,
  "username": "string",
  "passwordHash": "string",
  "role": "owner" | "staff"
}
```

---

## Required Endpoints

### Public (used by the storefront)
- `GET /api/foods` — list all food items
- `GET /api/packages` — list all food packages
- `POST /api/orders` — submit a new order (body = Order shape above), returns order reference + confirmation

### Admin-only (requires authentication — see below)
- `POST /api/admin/login` — accepts username + password, returns a session token (JWT is fine)
- `GET /api/admin/orders` — list all submitted orders (for the owner to review)
- `POST /api/admin/foods` — create a new food item
- `PUT /api/admin/foods/:id` — update a food item (price, description, etc.)
- `DELETE /api/admin/foods/:id` — remove a food item
- `POST /api/admin/packages` — create a new package
- `PUT /api/admin/packages/:id` — update a package
- `DELETE /api/admin/packages/:id` — remove a package

All `/api/admin/*` routes (except login) must reject requests without a valid token — return 401.

---

## Authentication Requirements

This is important: **admin access must be genuinely private** — only the business owner and any staff accounts they create should be able to log in.

- Passwords must be hashed (bcrypt or equivalent), never stored in plain text
- Login issues a token (JWT recommended) that the frontend stores and sends on admin requests
- Support at minimum two roles: `owner` and `staff` — for now they can have the same permissions, but the role field should exist so I can restrict staff permissions later (e.g., staff can edit prices but not delete items)
- Provide a way for me (as owner) to create staff accounts — either an endpoint or a simple seed script, your call

---

## Order Notifications

When a new order comes in, I want to be notified. For now:

- **Priority 1: Email notification** to the business owner's email when an order is placed (use whatever email-sending approach is simplest to wire up in Replit — Resend, SendGrid, Nodemailer with a Gmail app password, etc. Pick one and explain the setup steps I need to do, like creating an API key).
- **Priority 2 (later, not urgent): WhatsApp notification.** I know Meta's official WhatsApp Business API requires business verification that can take days to weeks, so this is NOT something to attempt to fully wire up right now. If there's a faster interim option (e.g., a WhatsApp Cloud API sandbox for testing, or a third-party SMS provider like Termii or Africa's Talking that's fast to set up for Nigerian numbers), mention it as an option but don't block the rest of the build on it.

---

## Deployment / Environment

- Please use environment variables for anything sensitive (database URL, JWT secret, email API key) — don't hardcode them
- Give me a `.env.example` file (inside `/server`) listing what variables are needed
- Tell me clearly, at the end, exactly what I need to do to connect my existing React frontend to this backend (the base API URL, any CORS setup needed since frontend and backend may be on different domains)

---

## What NOT to build right now

- No payment gateway integration
- No user accounts/login for customers (guest checkout only, for now)
- No order tracking/delivery status system
- No advanced inventory management
- No full WhatsApp Business API integration (see notifications section — interim options only)

Keep this scoped to: **a working API the existing frontend can talk to, with real admin authentication and email order notifications.** Everything else can come later.

---

## Final Ask

Please confirm the plan (models, endpoints, auth approach, and confirm you understand the frontend must not be touched) before writing a large amount of code, so I can catch anything off before you build. Once confirmed, build it in stages I can test along the way rather than all at once.
