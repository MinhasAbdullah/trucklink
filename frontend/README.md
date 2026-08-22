# TruckLink Frontend

Production-oriented React + TailwindCSS frontend aligned to the supplied `backend(2).zip` API surface. The backend is not modified by this package.

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

By default Vite proxies `/api` and `/ws` to `VITE_BACKEND_URL`.

## Production environment

When frontend and backend are deployed on different domains, set:

```env
VITE_API_BASE_URL=https://YOUR-BACKEND-DOMAIN/api
VITE_BACKEND_URL=https://YOUR-BACKEND-DOMAIN
VITE_WS_URL=wss://YOUR-BACKEND-DOMAIN/ws/realtime/
```

`VITE_WS_URL` is optional when it can be derived from `VITE_BACKEND_URL`.

## Routes

### Public
- `/` — landing page
- `/roles` — role selection
- `/auth?role=driver|recruiter|admin` — authentication

### Driver
- `/driver` — profile/status redirect
- `/driver/profile` — create or edit driver profile
- `/driver/status` — moderation status and profile summary
- `/driver/trucks` — truck management, image/license upload, matching
- `/driver/matches` — freight matches

### Recruiter
- `/recruiter/dashboard` — recruiter profile and job postings
- `/recruiter/loads` — load management, image/document upload, matching
- `/recruiter/matches` — freight matches

### Admin
- `/admin/dashboard` — platform overview
- `/admin/moderation` — driver moderation
- `/admin/analytics` — platform analytics
- `/admin/recruiters` — recruiter account management
- `/admin/operations` — loads, trucks, matches, statistics, and live activity

## Uploads

The supplied backend's shared upload service is used by the freight forms. Uploaded URLs are persisted in fields already exposed by the backend:

- Load image
- Load document
- Truck image
- Truck license document

## Compatibility notes

The frontend only calls routes present in `backend(2).zip`. It does not require master-data CRUD routes or separate DriverDocument CRUD routes.

The backend's driver profile serializer accepts endorsement, equipment, and region relationships but does not provide lookup endpoints for their display values. The production UI therefore does not ask users to enter raw database IDs.

The moderation queue route exists in the supplied backend. If that route returns a server error, the frontend presents a normal retry state rather than exposing implementation details.
