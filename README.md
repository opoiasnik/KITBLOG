# KITBLOG

Modern blog platform built with **Next.js 15** (App Router) + **React 19**, powered by **Firebase** and **Redux Toolkit**.

---

## Features

* ✨  **Next.js** App Router, React Server Components ready
* ⚛️  **React 19** with client–only islands where needed
* 🔥  **Firebase** 11
  * Authentication (Google / GitHub / Guest)
  * Cloud Firestore for posts & comments
* 📦  **Redux Toolkit** – global state for posts, filters, pagination
* 🎨  **Tailwind CSS 4** styling
* 📝  **React-Hook-Form** + **Zod** validation
* 🖼️  Image optimisation via `next/image`
* 🏷️  Tags, authors, filters, search, pagination
* 📱  Fully responsive (mobile-first)
* 🛠️  Unit tests with **Jest** + **Testing Library**

---

## Quick start

```bash
# 1. Clone
$ git clone https://github.com/<your-username>/KITBLOG.git && cd KITBLOG

# 2. Install deps
$ npm install

# 3. Environment variables (see .env.example)
$ cp .env.example .env.local
#   → fill Firebase keys

# 4. Dev server
$ npm run dev              # http://localhost:3000
```

### Available scripts

| Command               | Description                      |
| --------------------- | -------------------------------- |
| `npm run dev`         | Run dev server with hot reload   |
| `npm run build`       | Production build                 |
| `npm run start`       | Start built app (`PORT` aware)   |
| `npm run lint`        | ESLint check                     |
| `npm run test`        | Jest unit tests                  |

---

## Firebase configuration

Create a Firebase project → Web App → copy config keys and paste into `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

> No service-account keys are required – the app uses the client SDK only.

---

## Deployment

### Vercel (recommended)

1. Push the repo to GitHub.  
2. Import in Vercel → **Next.js** preset is detected automatically.  
3. Add the same environment variables in *Project → Settings → Environment Variables*.  
4. Click **Deploy** – done.

### Heroku

```bash
# Buildpack & Procfile are autodetected
web: npm run start
```
Ensure env vars are added via **heroku config:set**.

---

## Folder structure (key parts)

```
src/
  app/            # Next.js App Router pages
  components/     # Reusable UI/components
  store/          # Redux slices
  contexts/       # Auth context
  lib/            # firebase.ts client sdk
  schemas/        # Zod schemas
```

---

## Contributing

PRs are welcome! Please lint & test before opening a pull-request:

```bash
npm run lint && npm run test
```

