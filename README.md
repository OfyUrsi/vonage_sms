# vonage_sms

# Secure Contact Verification App

A minimal full‑stack demo that shows how to integrate **Vonage Verify** with a **React → Node/Express → PostgreSQL** stack. A user enters their mobile number, receives a verification code by SMS/voice, submits the code, and—if correct—is marked **verified** in the database.

---

## ✨ Features

| Layer    | Tech                       | Highlights                                                   |
| -------- | -------------------------- | ------------------------------------------------------------ |
| Frontend | React 18 + Vite + Tailwind | Two‑step flow (enter phone → enter code), Axios API calls    |
| Backend  | Node 18, Express 5         | REST API, Vonage Verify v4 SDK, CORS configured              |
| Database | PostgreSQL 14              | `users` table stores phone, status, timestamps, `request_id` |
| Dev Ops  | Nodemon, .env              | Hot reload, secrets outside code                             |

---

## 💾 Prerequisites

- **Node >=18** (check with `node -v`)
- **PostgreSQL >=14** running locally on port 5432
- A free **Vonage** account – grab `VONAGE_API_KEY` and `VONAGE_API_SECRET`
- macOS ❯ install Postgres via _Homebrew_:

  ```bash
  brew install postgresql@14
  brew services start postgresql@14
  ```

---

## 🔧 Local Setup (dev)

```bash
# 1. Clone & install root deps
 git clone https://github.com/<your‑user>/vonage-verification-app.git
 cd vonage-verification-app

# 2. Backend
 cd backend
 cp .env.example .env           # fill in values
 npm i                          # installs express, @vonage/verify, pg, …
 npm run dev                    # starts nodemon on http://localhost:5050

# 3. Postgres bootstrap (once)
 psql postgres < db/init.sql    # creates DB + user + table

# 4. Frontend (new terminal)
 cd ../frontend
 npm i
 npm run dev                    # http://localhost:3000
```

### `.env` (backend)

```env
VONAGE_API_KEY=xxxxxxxx
VONAGE_API_SECRET=xxxxxxxx
PG_CONNECTION_STRING=postgres://vonage_user:test123@localhost:5432/verification
PORT=5050
```

---

## 🚀 API Endpoints

| Method | Endpoint                  | Body                       | Notes                                |
| ------ | ------------------------- | -------------------------- | ------------------------------------ |
| `POST` | `/api/start-verification` | `{ phone: "+346xxxxxxx" }` | Sends SMS/voice; stores `request_id` |
| `POST` | `/api/check-verification` | `{ phone, code }`          | Checks code, marks `verified`        |
| `GET`  | `/api/users`              | —                          | Returns all users + status           |

---

## 🖥️ Database Schema

```sql
CREATE TABLE users (
  id           SERIAL PRIMARY KEY,
  phone        VARCHAR(20) UNIQUE NOT NULL,
  status       VARCHAR(20) NOT NULL,
  requested_at TIMESTAMP,
  verified_at  TIMESTAMP,
  request_id   VARCHAR(50)
);
```

The **`request_id`** column is critical—it ties an outbound verification request to its corresponding code check.

---

## 🐳 Docker (optional)

A tiny `docker-compose.yml` is provided so you can spin up:

- `db` – Postgres 14 container with volume
- `backend` – Node service
- `frontend` – React static build served by Nginx

```bash
docker compose up --build -d
```

---

## 🤝 Acknowledgements

- [Vonage Verify](https://developer.vonage.com/en/verify) – SMS/voice 2FA
- [Tailwind CSS](https://tailwindcss.com/) – utility‑first styling

---

## 📜 License

MIT © 2025 Rafa Romero
