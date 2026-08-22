# TruckLink — Driver Hiring & Onboarding Portal

Role-based platform connecting drivers, recruiters, and admins. Drivers submit profiles, admins moderate them, recruiters see only approved drivers and match them to job postings.

**Project:** Zeppelin Labs — P3
**Team:** Abdullah (Lead), Hasan, Sidra, Akash, Wajih

---

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Django + Django REST Framework
- **Database:** PostgreSQL (Neon)
- **Auth:** JWT
- **Real-time:** Django Channels
- **File Storage:** Cloudinary

---

## User Roles

- **Driver** — signs up, builds profile, tracks approval status, applies to jobs
- **Recruiter** — signs up, posts jobs, views/shortlists matching approved drivers
- **Admin** — moderates driver profiles, manages recruiters, views analytics, manages master data

---

## Setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:
```
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
DB_HOST=...
DB_PORT=5432
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

```bash
python manage.py migrate
python manage.py runserver
```
Runs at `http://127.0.0.1:8000`

### Create Admin User
```bash
python manage.py createsuperuser
python manage.py shell
```
```python
from users.models import User
u = User.objects.get(username='your_username')
u.role = 'admin'
u.save()
```

### Frontend
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

```bash
npm run dev
```
Runs at `http://localhost:5173`

---

## Key API Endpoints

| Endpoint | Method | Access |
|---|---|---|
| `/api/users/signup/driver/` | POST | Public |
| `/api/users/signup/recruiter/` | POST | Public |
| `/api/token/` | POST | Public (login) |
| `/api/drivers/profile/` | POST | Driver |
| `/api/drivers/moderation/queue/` | GET | Admin |
| `/api/drivers/moderation/<id>/` | POST | Admin |
| `/api/recruiters/profile/` | POST | Recruiter |
| `/api/recruiters/jobs/` | POST | Recruiter |
| `/api/recruiters/admin/list/` | GET | Admin |
| `/api/analytics/` | GET | Admin |

All endpoints (except signup/login) require:
```
Authorization: Bearer <access_token>
```

---

## Team

| Person | Task |
|---|---|
| Abdullah | Django models, JWT auth, moderation & profile endpoints, docs |
| Wajih | Real-time notifications, Cloudinary uploads, matching logic, deployment |
| Hasan | React setup, admin moderation UI, API wiring |
| Sidra | Driver signup/profile/status pages, admin analytics & master-data UI |
| Akash | Recruiter dashboard, job posting, matching results UI |

---
