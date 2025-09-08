import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context/auth-context";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold">
        E-Shop
      </Link>

      {/* Links - Public (Available to everyone) */}
      <div className="flex gap-4 items-center">
        <Link to="/items" className="hover:underline">
          Items
        </Link>

        {/* Links - Available for authenticated users only */}
        {user && (
          <>
            <Link to="/my-items" className="hover:underline">
              My Items
            </Link>
            <Link to="/cart" className="hover:underline">
              Cart
            </Link>
            <Link to="/profile" className="hover:underline">
              Profile
            </Link>
          </>
        )}
      </div>

      {/* Authentication Links - Login/Signup or Logout */}
      <div className="flex gap-4 items-center">
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
