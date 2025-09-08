import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  createdAt?: string; 
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <p>No user data found. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* User Info Card */}
      <div className="border rounded-lg shadow p-4 bg-white mb-6">
        <p>
          <span className="font-semibold">User ID:</span> {user.id}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        {user.createdAt && (
          <p>
            <span className="font-semibold">Joined:</span>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>

      {/* TODO Section */}
      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
        <h2 className="font-bold text-lg mb-2">🚧 TODO for Profile</h2>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Add editable fields (name, password update).</li>
          <li>Add avatar/profile picture support (needs schema + backend).</li>
          <li>Fetch profile info from backend instead of localStorage only.</li>
          <li>Support updating email (if allowed in backend).</li>
          <li>Add order history once order system is implemented.</li>
        </ul>
      </div>
    </div>
  );
}
