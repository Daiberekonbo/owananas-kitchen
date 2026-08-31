# Owanana's Kitchen API

This is the backend for the existing React/Vite storefront. It is intentionally isolated in `/server`; the frontend and root `package.json` are not part of this service.

## Local/Replit setup

1. Copy `.env.example` to `.env`.
2. Set `JWT_SECRET` to a long random value. The existing Replit `SESSION_SECRET` can be used as a local fallback.
3. Set `CLIENT_ORIGIN` to the frontend origin. Multiple origins can be comma-separated.
4. Run `npm install` from this directory.
5. Run `npm run db:setup`.
6. Run `npm run db:seed`.
7. Create the first owner account with `npm run seed:owner`. It will prompt for credentials unless `INITIAL_OWNER_USERNAME` and `INITIAL_OWNER_PASSWORD` are set for that command.
8. Start the API with `npm run dev` or `npm start`.

The API defaults to `http://localhost:3001`.

## Resend notifications

Resend is connected through Replit's managed `resend` connector; no API key is stored in this repository. Set:

- `OWNER_EMAIL`: the business email that receives new-order alerts.
- `RESEND_FROM_EMAIL`: a verified Resend sender, for example `Owanana's Kitchen <orders@your-verified-domain.com>`.

If either value is missing, orders are still saved and the response explicitly reports that notifications are not configured. If Resend rejects a configured message, the order remains saved and the response reports that delivery failed.

## API

### Public

- `GET /api/health`
- `GET /api/foods`
- `GET /api/packages`
- `POST /api/orders`

`POST /api/orders` accepts:

```json
{
  "customer": {
    "name": "Ada Lovelace",
    "phone": "+2348000000000",
    "email": "ada@example.com",
    "address": "12 Example Street",
    "notes": "Please call on arrival"
  },
  "items": [
    { "id": 1, "quantity": 2 },
    { "id": "pkg-1", "type": "package", "quantity": 1 }
  ],
  "total": 12000
}
```

The submitted `total`, item names, and item prices are not trusted. The API resolves every item from PostgreSQL and calculates the total itself. A successful response contains an `OWK-123456` reference and timestamp.

### Admin

Authenticate with:

```http
POST /api/admin/login
Content-Type: application/json

{"username":"owner","password":"your-password"}
```

Send the returned token on every other admin request:

```http
Authorization: Bearer <token>
```

Available authenticated routes:

- `GET /api/admin/orders`
- `POST`, `PUT`, `DELETE /api/admin/foods`
- `POST`, `PUT`, `DELETE /api/admin/packages`
- `POST /api/admin/staff` (owner role required)

Passwords are stored as bcrypt hashes. Staff accounts have the `staff` role and currently share the requested catalog/order permissions; the role is available for later restrictions.

## Connecting the existing frontend

The existing `src/services/api.js` already defines the three integration points:

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

fetch(`${API_BASE_URL}/api/foods`);
fetch(`${API_BASE_URL}/api/packages`);
fetch(`${API_BASE_URL}/api/orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});
```

For a deployed frontend and backend on different domains:

1. Set the frontend's `VITE_API_BASE_URL` to the backend's public URL.
2. Set the backend's `CLIENT_ORIGIN` to the exact frontend URL, such as `https://www.example.com`.
3. Redeploy/restart both services.

The frontend was not changed as part of this backend build, per the project requirements.