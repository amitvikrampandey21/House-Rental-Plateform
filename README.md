# House Rental Platform

StaySphere is a full-stack house rental platform built with React, Tailwind CSS, Node.js, Express, and MongoDB. It includes renter, owner, and admin flows with JWT auth, wishlist support, booking requests, moderation tools, responsive UI, theming, and AI-inspired recommendations.

## Features

- JWT-based signup and login for renters, owners, and admins
- Property listing, filters, pagination, and real-time search suggestions
- Property detail pages with image gallery, owner contact flow, and map embed
- Wishlist/favorites and personalized recommendations
- Booking request flow for renters
- Owner hub for adding, editing, deleting listings and accepting/rejecting requests
- Admin panel for moderating users and properties
- Tailwind-powered premium UI with dark/light mode, loading skeletons, hover animation, and toast notifications
- Optional Cloudinary support for image upload

## Project Structure

```text
house-rental-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
├── frontend/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── contexts/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       └── utils/
└── package.json
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Environment Variables

Create these files before running the app:

### `backend/.env`

Use [`backend/.env.example`](/c:/Users/Amit%20Pandey/OneDrive/Desktop/House%20rental%20Platform/backend/.env.example) as a template.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/house-rental-platform
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

### `frontend/.env`

Use [`frontend/.env.example`](/c:/Users/Amit%20Pandey/OneDrive/Desktop/House%20rental%20Platform/frontend/.env.example) as a template.

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation

From the project root:

```bash
npm install
npm run install:all
```

## Run Locally

Start backend and frontend together:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Demo Flow

1. Start MongoDB.
2. Start the backend and frontend.
3. Sign up as an owner and use "Add sample data" in Owner Hub to create demo listings.
4. Sign up as a renter in another browser/session and browse, favorite, and request properties.
5. Log in with the seeded admin credentials from `backend/.env` to open the admin panel.

## API Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Properties

- `GET /api/properties`
- `GET /api/properties/stats`
- `GET /api/properties/suggestions`
- `GET /api/properties/:id`
- `POST /api/properties`
- `PUT /api/properties/:id`
- `DELETE /api/properties/:id`
- `POST /api/properties/:id/favorite`
- `POST /api/properties/:id/contact`
- `GET /api/properties/recommendations`

### Bookings

- `GET /api/bookings`
- `POST /api/bookings`
- `PATCH /api/bookings/:id/status`

### Dashboard / Admin / Uploads

- `GET /api/dashboard`
- `POST /api/uploads`
- `GET /api/admin/overview`
- `DELETE /api/admin/users/:id`
- `DELETE /api/admin/properties/:id`

## Notes

- The recommendation engine is lightweight and activity-based, using favorites and viewed property patterns.
- Cloudinary is optional. If not configured, base64/image URLs are kept as-is for fast local demos.
- An admin account is seeded automatically when `ADMIN_EMAIL` and `ADMIN_PASSWORD` are provided.

## Deploy Guide

This project is easiest to deploy by splitting it into:

- `frontend` on Vercel
- `backend` on Render
- MongoDB on MongoDB Atlas

### 1. Deploy MongoDB

Create a MongoDB Atlas cluster and copy the app connection string. Use that value as `MONGO_URI` in your backend service.

### 2. Deploy the backend

Create a new Render Web Service using the `backend` folder.

- Build command: `npm install`
- Start command: `npm start`

Set these environment variables in Render:

```env
PORT=10000
MONGO_URI=<your_mongodb_atlas_connection_string>
JWT_SECRET=<strong_random_secret>
JWT_EXPIRES_IN=7d
CLIENT_URL=<your_vercel_frontend_url>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

Optional Cloudinary variables:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

After deployment, note your backend URL, for example:

```text
https://your-backend.onrender.com/api
```

### 3. Deploy the frontend

Create a new Vercel project using the `frontend` folder.

- Build command: `npm run build`
- Output directory: `dist`

Set this environment variable in Vercel:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

The included `frontend/vercel.json` rewrite makes React Router routes like `/login` and `/properties/:id` work correctly on refresh.

### 4. Update CORS

Once the Vercel frontend URL is available, put that full URL into the backend `CLIENT_URL` variable and redeploy the backend if needed.

### 5. Final test

Check these in production:

1. Open the frontend home page.
2. Register and log in.
3. Create or browse properties.
4. Open a direct route like `/login` or `/properties/123` to confirm SPA routing works.
5. Verify `GET /api/health` on the backend returns success.

## Single Platform Render Deploy

If you want to keep the whole app on Render, this repo now supports a single public web service for the app plus a private MongoDB service inside the same Render Blueprint.

Files added for this flow:

- [`render.yaml`](/c:/Users/Amit%20Pandey/OneDrive/Desktop/House%20rental%20Platform/render.yaml)
- [`mongodb/Dockerfile`](/c:/Users/Amit%20Pandey/OneDrive/Desktop/House%20rental%20Platform/mongodb/Dockerfile)

How it works:

- Render builds the React frontend from `frontend`
- The Express backend serves the built frontend in production
- A private MongoDB service runs inside Render and is wired through `MONGO_HOST` and `MONGO_PORT`

Render setup:

1. Push this repo to GitHub.
2. In Render, choose `New` -> `Blueprint`.
3. Select this repo.
4. Render will detect `render.yaml` and create:
   - one web service for the full app
   - one private service for MongoDB
5. Set `ADMIN_PASSWORD` to your own value before deploy.
6. After deploy, open the app URL from the web service.

The app health endpoint will be:

```text
/api/health
```
