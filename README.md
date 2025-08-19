# BookStore: Frontend (React)

## 1. Project Structure

This project structure follows the file route conventions of [React Router](https://reactrouter.com/how-to/file-route-conventions). Components are organized by page for maintainability. You can look at frontend code base: https://github.com/nhinbm573/bookstore-backend

> **Note:**
> Files and folders not listed below are generated automatically when setting up and running the project.

```
bookstore_frontend/
├── app/                    # Main folder
│   ├── components/
│   │   ├── common/
│   │   ├── icons/          # Custom icons to svg
│   │   ├── layout/
│   │   └── ui/             # ShadCN components
│   ├── features/           # Manage zustand (sync state) and tanstack-query (async state)
│   ├── routes/             # File-convention based route config
│   ├── app.css
│   ├── root.tsx
│   └── routes.ts
├── public/
├── utils/
├── hooks/
├── .husky/                 # Pre-commit
├── .prettierignore         # Formatting
├── .prettierrc
├── eslint.config.js         # Linting
└── package.json
```

## 2. Getting Started

1. **Install packages**

   ```bash
   npm i
   ```

2. **Add environment variables**

   ```commandline
   VITE_API_URL=
   VITE_SITE_KEY=
   VITE_SECRET_KEY=
   VITE_GOOGLE_CLIENT_ID=
   ```

3. **Run service**

   ```bash
   npm run dev
   ```

## 3. Features

#### Functional requirements

- [x] **Register**
- [x] **Activation**
- [x] **Forgot password**
- [x] **Login**
  - [x] Trigger reCaptcha v2 after failing 3 times.
  - [x] Google SSO
- [x] **Edit personal information**
- [x] **Browse for books**
- [x] **Search for books** : `django-filter` which uses SQL queries internally for searching/filtering.
- [x] **Pagination supports browsing & search features**
- [ ] **View book details**
- [ ] **Add rating and comment**
- [ ] **Add books to shopping cart and View shopping cart**
- [ ] **Checkout & confirm an order**
- [ ] **View past orders**
- [ ] **Admin interface**

Although I haven’t completed all the functional requirements yet, this project has helped me learn:

- How to configure linting, formatting, and pre-commit hooks.
- How to separate configurations for different environments.
- How to set up CI workflows for continuous integration.

## 4. Technology Stack

- **React 19** (using Typescript)
- **React Router v7**
- **Axios**
- **React Query (TanStack Query)**
- **Zustand**
- **ShadCN Component** (only supporting TailwindCSS)
