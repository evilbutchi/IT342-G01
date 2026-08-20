# Activity01 — React Auth Client

A ReactJS (Vite) frontend for the `Activity01` Spring Boot backend
(`edu.cit.berou.activity01`). Provides user registration, login, and a
protected dashboard, talking to the backend's `/api/register` and
`/api/login` endpoints.

## Stack

- React 19 + Vite
- React Router (client-side routing, protected dashboard route)
- Native `fetch` (API requests) — no HTTP client library

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if needed
npm run dev
```

The app expects the Spring Boot backend running at `http://localhost:8080`
(see `.env.example`). The backend needs the CORS configuration added in
`WebConfig.java` so requests from `http://localhost:5173` are accepted —
see `API_DOCUMENTATION.md` for the full contract.

## Structure

```
src/
  api/            axios client + register/login calls
  context/        AuthContext (holds only id/username/email, never password)
  components/     FormField, Alert, ProtectedRoute
  pages/          Register, Login, Dashboard
  utils/          client-side validation rules
```

## Notes on password handling

- Password fields are `type="password"` and never logged or rendered back.
- Only `id`, `username`, and `email` are kept in memory/sessionStorage after
  login — the password is discarded immediately after the request is sent.
