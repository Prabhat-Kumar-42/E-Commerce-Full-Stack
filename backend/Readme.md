# 🛒 E-Commerce Assignment

A simple **E-Commerce backend** built with **Express + TypeScript + Prisma**.
This project provides APIs for **user authentication, items, cart management, and orders**.
It also includes a **database seeding script** that generates users, items, and pre-filled carts with product images fetched dynamically from **Unsplash API**.

---

## ⚙️ Tech Stack

* **Backend Framework:** Express (TypeScript)
* **ORM:** Prisma
* **Database:** PostgreSQL (or any Prisma-supported DB)
* **Authentication:** JWT + bcrypt password hashing
* **Validation:** Zod
* **Utilities:** Multer (file upload), Axios (API calls), Faker (seed data), Helmet (security headers)

---

## ✨ Features

* User registration & login with JWT authentication
* Secure password hashing with bcrypt
* CRUD for Items (with categories, price, and image URL)
* Cart management (add/remove/update items in cart)
* Prisma-based database layer
* Seed script to generate:

  * 100 fake users
  * 10 items per user (fetched from Unsplash API by category)
  * Carts pre-filled with items

---

## 📂 Project Structure

```
src/
 ├── controllers/    # Request handlers
 ├── middlewares/    # Authentication & validation middlewares
 ├── routes/         # Express route definitions
 ├── scripts/        # Database seed script
 ├── utils/          # Helper functions
 ├── index.ts        # App entry point
 └── prisma/         # Prisma schema & migrations
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root with the following:

```env
# Database connection
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

### 1. Clone the Repository

```bash
git clone <repo-url>
cd e-commerce-assignment
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Setup Database

```bash
# Generate & run migrations
npm run prisma:migrate
```

### 4. Seed the Database

```bash
npm run seed
```

This will:

* Wipe existing data
* Create 100 users
* Generate 1000 items with images from Unsplash
* Create carts and pre-fill them with items

### 5. Start the Server

```bash
npm run build
npm start
```

Server will start at `http://localhost:4000`

---

## 📦 Available Scripts

* `npm run build` → Compile TypeScript to JavaScript
* `npm start` → Start server from compiled code (`dist/index.js`)
* `npm run prisma:migrate` → Run Prisma migrations
* `npm run seed` → Seed database with users, items, and carts

---

## 📌 Deployment Notes

* Ensure `DATABASE_URL` points to your production DB.
* Always set a strong `JWT_SECRET`.
* Unsplash API key is required for seeding — for production, you may want to replace with your own image storage.

---