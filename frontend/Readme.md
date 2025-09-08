---

# Frontend – LocalShop 🛍️

A **React + Vite** powered frontend for **LocalShop**, an e-commerce platform to discover and shop from local sellers.
Supports browsing items, filtering, cart management, authentication, and seller item management.

---

## 🚀 Tech Stack

* **React 19** with **Vite 7**
* **TypeScript**
* **React Router v7**
* **TailwindCSS 4**
* **Axios** for API requests
* Context API for **Auth** and **Cart**

---

## ✨ Features

* 🔐 **Authentication** – Login & Signup with JWT
* 🛍 **Browse Items** – Paginated, searchable, and filterable by category & price
* 📄 **Item Details Page** – View product details, add to cart
* 🛒 **Cart Management** – Add/remove items, persist cart state
* 👤 **Profile Page** – View user info (future: edit profile, avatar, order history)
* 🛠 **Seller Tools** – Create, edit, delete items from **My Items** page
* 🏠 **Home Page** – Entry point with links to main features
* 🎨 **Responsive UI** – Built with TailwindCSS

---

## 📂 Folder Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # AuthContext & CartContext
│   ├── pages/             # App pages (Login, Signup, Items, Cart, Profile, etc.)
│   ├── types/             # Shared TypeScript types (User, Item, Cart)
│   ├── App.tsx            # Main app with routes
│   ├── main.tsx           # React root entrypoint
│   └── index.css          # Tailwind base styles
├── public/                # Static assets
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Setup & Installation

### 1. Clone the repo

```bash
git clone <repo-url>
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the dev server

```bash
npm run dev
```

Frontend runs on [http://localhost:5173](http://localhost:5173) by default.

### 4. Build for production

```bash
npm run build
npm run preview
```

---

## 🔗 API Integration

The frontend expects a backend API running at:

```
/api/*
```

Examples:

* `POST /api/auth/login` – login
* `POST /api/auth/signup` – signup
* `GET /api/items` – fetch items with filters
* `GET /api/items/:id` – fetch item details
* `POST /api/items` – create item (auth required)

👉 Make sure to start the backend server before running the frontend.

---

## 📝 TODOs & Future Improvements

* [ ] Profile editing (name, password, avatar)
* [ ] Order history page
* [ ] Better error handling & notifications
* [ ] UI/UX polish (navbar, skeleton loaders, responsive tweaks)
* [ ] Deployment configs (Netlify/Vercel)

---