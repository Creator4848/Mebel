# 🪵 MebelAkademiya

O'zbekistondagi #1 Mebel Ishlab Chiqarish Akademiyasining rasmiy veb-platformasi.

## Texnologiyalar

| Qatlam | Texnologiya |
|--------|-------------|
| Frontend | Next.js 14 (App Router, TypeScript) |
| Backend | Python FastAPI |
| Database | PostgreSQL + SQLAlchemy + Alembic |
| To'lov | Payme + Click API |
| Hosting | Vercel (front) + Railway (back) |
| Auth | JWT (Bearer token) |

## Loyiha Tuzilmasi

```
Mebel/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   └── routers/
│   ├── seed.py
│   ├── railway.toml
│   └── requirements.txt
├── frontend/         # Next.js frontend
│   ├── src/
│   │   ├── app/      # Pages (App Router)
│   │   ├── components/
│   │   └── lib/      # api.ts, types.ts, auth-context.tsx
│   └── vercel.json
└── index.html        # Asl statik versiya
```

## Lokal Ishlatish

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt

# .env faylini yarating
copy .env.example .env
# .env faylini tahrirlang (DATABASE_URL, SECRET_KEY)

# Ma'lumotlar bazasini to'ldiring
python seed.py

# Serverni ishga tushiring
uvicorn app.main:app --reload
```

Backend: http://localhost:8000  
Swagger UI: http://localhost:8000/docs

### Frontend

```bash
cd frontend
copy .env.local.example .env.local
# .env.local ni tahrirlang: NEXT_PUBLIC_API_URL=http://localhost:8000

npm install
npm run dev
```

Frontend: http://localhost:3000

## Admin Panel

1. `python seed.py` ishga tushirganingizdan so'ng admin yaratiladi:
   - Telefon: `+998901234567`
   - Parol: `admin123`
2. `http://localhost:3000/login` dan kiring
3. `http://localhost:3000/admin` ga o'ting

## Deployment

### Railway (Backend)
1. Railway.app ga kiring → New Project → Deploy from GitHub
2. `backend/` papkasini tanlang
3. Environment variables qo'shing (`.env.example` ga qarang)
4. PostgreSQL plugin qo'shing (DATABASE_URL avtomatik sozlanadi)

### Vercel (Frontend)
1. Vercel.com → New Project → GitHub repo
2. Root Directory: `frontend`
3. Environment variable: `NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app`
4. `frontend/vercel.json` dagi Railway URL ni yangilang

## API Endpointlar

| Method | Path | Tavsif |
|--------|------|--------|
| GET | `/courses` | Kurslar ro'yxati |
| POST | `/auth/register` | Ro'yxatdan o'tish |
| POST | `/auth/login` | Kirish |
| GET | `/auth/me` | Joriy foydalanuvchi |
| POST | `/enrollments` | Kursga yozilish |
| POST | `/payments/payme/create` | Payme to'lov URL |
| POST | `/payments/payme/webhook` | Payme webhook |
| GET | `/admin/courses` | Admin: kurslar |
| POST | `/admin/courses` | Admin: kurs qo'shish |
| ... | ... | ... |
