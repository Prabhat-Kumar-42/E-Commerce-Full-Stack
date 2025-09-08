---

# 🛒 E-Commerce Full Stack Assignment

A full-stack **E-Commerce Application** with:

* **Backend**: Express + TypeScript + Prisma
* **Frontend**: React + Vite + TypeScript

📍 **Live Demo:** [E-Commerce App on Render](https://e-commerce-full-stack-2omp.onrender.com/)

---

## ⚙️ Tech Stack

### Backend

* **Framework:** Express (TypeScript)
* **ORM:** Prisma
* **Database:** PostgreSQL (or any Prisma-supported DB)
* **Authentication:** JWT + bcrypt password hashing
* **Validation:** Zod
* **Utilities:** Multer (file upload), Axios (API calls), Faker (seed data), Helmet (security headers)

### Frontend

* **React 19** with **Vite 7**
* **TypeScript**
* **React Router v7**
* **TailwindCSS 4**
* **Axios** for API requests
* Context API for **Auth** and **Cart**

---

## ✨ Features

✅ **Authentication**

* User registration & login with JWT authentication
* Secure password hashing with bcrypt

✅ **Items**

* CRUD for items (title, description, category, price, image)
* Unsplash integration for seeding item images

✅ **Cart**

* Add, remove, and update items in cart
* Pre-filled carts during seeding

✅ **Frontend**

* Browse items (paginated, searchable, filterable by category/price)
* Item details page
* Cart management
* Seller tools (create/edit/delete items via **My Items** page)
* Profile page (basic, future enhancements planned)
* Responsive UI with Tailwind

---

## 📂 Project Structure

```
e-commerce-app/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Authentication & validation
│   │   ├── routes/         # Express route definitions
│   │   ├── scripts/        # Database seed script
│   │   ├── utils/          # Helpers
│   │   ├── index.ts        # App entry point
│   │   └── prisma/         # Prisma schema & migrations
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── contexts/       # AuthContext & CartContext
    │   ├── pages/          # App pages
    │   ├── types/          # Shared TypeScript types
    │   ├── App.tsx         # Main app with routes
    │   ├── main.tsx        # React root entry
    │   └── index.css       # Tailwind base styles
    ├── public/             # Static assets
    └── package.json
```

---

## 🔑 Environment Variables (Backend)

Create a `.env` file in the project root with the following:

```env
NODE_ENV=local                      # For Local Development, setter for upload image destination, 
                                    # if NODE_ENV === local: 
                                    #   - destination is local "/upload" dir
                                    # else
                                    #   - destination is supabase s3 bucket (requires supabase configs below) 

# JWT SECRET KEY
JWT_SECRET=example-strong-sercret

##### SUPABASE CONFIGS #####

SUPABASE_POSTGRES_PASS=

# Connect to Supabase via connection pooling
DATABASE_URL=

# Direct connection to the database. Used for migrations
DATABASE_DIRECT_URL=

SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_BUCKET=

##### Unsplash API configuration #####
UNSPLASH_API_ACCESS_KEY=
UNSPLASH_API_URL=

```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone <repo-url>
cd e-commerce-app
```

### 2. Setup Backend

```bash
cd backend
npm install

# Run migrations
npm run prisma:migrate

# Seed database
npm run seed

# Start server
npm run build
npm start
```

Backend runs on [http://localhost:4000](http://localhost:4000)

---

### 3. Setup Frontend

```bash
cd frontend
npm install

# Run dev server
npm run dev
```

Frontend runs on [http://localhost:5173](http://localhost:5173)

---

## 🔗 API Endpoints

### Auth

* `POST /api/auth/signup` – Create account
* `POST /api/auth/login` – Login

### Items

* `GET /api/items` – List items
* `GET /api/items/:id` – Item details
* `POST /api/items` – Create item (auth required)

### Cart

* `GET /api/cart` – View cart
* `POST /api/cart` – Add item
* `PUT /api/cart/:itemId` – Update quantity
* `DELETE /api/cart/:itemId` – Remove item

---

## 📝 TODOs & Future Improvements

* [ ] Profile editing (name, password, avatar)
* [ ] Order history page
* [ ] Better error handling & notifications
* [ ] UI/UX polish (navbar, skeleton loaders, responsive tweaks)
* [ ] Deployment configs (Netlify/Vercel + Render backend)

---