import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/cart-context/cart-context";
import type { Item } from "../types/item.type";

// /src/pages/ItemDetailPage.tsx
export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>(); // Fetch item ID from URL
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // Get addToCart from context

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await axios.get(`/api/items/${id}`);
        setItem(res.data); // Set the item data to state
      } catch (err) {
        console.error("Error fetching item:", err);
      } finally {
        setLoading(false); // End loading state
      }
    }
    if (id) fetchItem(); // Only fetch item if ID exists
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!item) return <p className="p-6">Item not found</p>;

  // Handle adding to cart
  const handleAddToCart = () => {
    if (item) {
      const quantity = 1; // Default quantity to 1
      addToCart(item.id, quantity); // Call addToCart with item ID and quantity
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {item.imageUrl && (
          <img
            src={item.imageUrl.startsWith("http") ? item.imageUrl : `/${item.imageUrl}`}
            alt={item.title}
            className="w-full h-80 object-cover"
          />
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <p className="text-green-600 font-bold text-lg mb-2">
            ₹{item.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">Category: {item.category}</p>

          <button
            onClick={handleAddToCart}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
