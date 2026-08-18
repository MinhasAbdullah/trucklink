# TruckLink Frontend

React + TailwindCSS frontend connected to the supplied Django REST API with Axios and JWT authentication.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

The Vite dev server proxies `/api` to `http://127.0.0.1:8000` by default. Change `VITE_BACKEND_URL` if Django runs elsewhere.

## Public routes

- `/` — new TruckLink landing page
- `/roles` — driver / recruiter / admin role selection
- `/auth?role=driver|recruiter|admin` — role-aware authentication

## Protected routes

- Driver: `/driver`, `/driver/profile`, `/driver/status`
- Recruiter: `/recruiter/dashboard`
- Admin: `/admin/dashboard`, `/admin/moderation`, `/admin/analytics`, `/admin/recruiters`, `/admin/master-data`

## API integration

Axios is configured in `src/api/client.js`. It attaches the JWT access token and attempts token refresh automatically on `401`.

### Authentication

- `POST /api/token/`
- `POST /api/token/refresh/`
- `POST /api/users/signup/driver/`
- `POST /api/users/signup/recruiter/`

The Django backend authenticates with `username` + `password`, so the login form uses username rather than email.

### Driver

- `POST /api/drivers/profile/`
- `GET /api/drivers/profile/me/`
- `PATCH /api/drivers/profile/me/`

### Recruiter

- `POST /api/recruiters/profile/`
- `GET /api/recruiters/profile/me/`
- `GET /api/recruiters/jobs/mine/`
- `POST /api/recruiters/jobs/`

### Admin

- `GET /api/drivers/moderation/queue/`
- `POST /api/drivers/moderation/:id/`
- `GET /api/analytics/`
- `GET /api/recruiters/admin/list/`
- `POST /api/recruiters/admin/:id/status/`

## Admin console

The revised frontend styling has been merged into the final API-connected project. Admin users share a responsive butter/green shell with a persistent desktop sidebar and a mobile drawer:

- `/admin/dashboard` — live overview of moderation, recruiter, and analytics activity
- `/admin/moderation` — pending driver moderation queue with approve/reject/request-changes actions
- `/admin/analytics` — live backend analytics only; mock trends/recent activity removed
- `/admin/recruiters` — real recruiter accounts and active/pending/suspended status controls
- `/admin/master-data` — retained master-data UI shell without fabricated rows because the backend does not expose CRUD endpoints yet

All `/admin/*` pages are nested below `ProtectedRoute` + `AdminRoute` and the shared `AdminShell`. Authentication uses `AuthContext`; moderation and recruiter admin state use `AdminModerationContext` and `AdminRecruitersContext`.

## Backend limitations discovered

The supplied backend currently has this moderation queue queryset:

```py
DriverProfile.objects.filter(DriverProfile.Status.PENDING)
```

It should be:

```py
DriverProfile.objects.filter(status=DriverProfile.Status.PENDING)
```

Until that backend line is corrected, the frontend will show a queue API error instead of inventing moderation data.

The supplied backend also has no API endpoints for driver documents or Region/EndorsementType/EquipmentType lookup/CRUD data. The frontend therefore does not treat mock document/master-data records as real API data.
