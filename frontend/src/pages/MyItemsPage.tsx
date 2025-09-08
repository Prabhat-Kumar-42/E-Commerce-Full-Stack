import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context/auth-context";
import type { Item } from "../types/item.type";

export default function MyItemsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserItems = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/items/my-items", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/items/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      await axios.delete(`/api/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete item");
    }
  };

  if (loading) return <p>Loading your items...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  
  // Check if items is an empty array
  if (items.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Items</h1>
        <button
          onClick={() => navigate("/items/create")}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create New Item
        </button>
        <p>You have not created any items yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Items</h1>

      <button
        onClick={() => navigate("/items/create")}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Create New Item
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white"
          >
            {item.imageUrl && (
              <img
                src={
                  item.imageUrl.startsWith("http")
                    ? item.imageUrl
                    : `http://localhost:4000${item.imageUrl}`
                }
                alt={item.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p className="text-gray-600">{item.category}</p>
            <p className="text-green-600 font-semibold">₹{item.price}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(item.id)}
                className="flex-1 bg-blue-600 text-white py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="flex-1 bg-red-600 text-white py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
