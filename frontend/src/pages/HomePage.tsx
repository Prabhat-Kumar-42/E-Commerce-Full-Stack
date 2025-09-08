// src/pages/HomePage.tsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/auth-context/auth-context";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center p-6">
      <h1 className="text-4xl font-bold">Welcome to LocalShop 🛍️</h1>
      <p className="text-lg text-gray-600 max-w-md">
        Discover and shop from local sellers around you. Support small businesses and enjoy unique items.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <Link
          to="/items"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          Browse Items
        </Link>

        {user ? (
          <>
            <Link
              to="/profile"
              className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
            >
              My Profile
            </Link>
            <Link
              to="/cart"
              className="px-6 py-3 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition"
            >
              My Cart
            </Link>
            <Link
              to="/my-items"
              className="px-6 py-3 bg-yellow-600 text-white rounded-xl shadow hover:bg-yellow-700 transition"
            >
              My Items
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="px-6 py-3 bg-gray-600 text-white rounded-xl shadow hover:bg-gray-700 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 bg-gray-800 text-white rounded-xl shadow hover:bg-gray-900 transition"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
