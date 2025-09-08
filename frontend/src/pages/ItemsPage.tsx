import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { Item } from "../types/item.type";

// /src/pages/ItemsPage.tsx
export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // fetch categories once
  useEffect(() => {
    axios
      .get("/api/items/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // fetch items
  async function fetchItems() {
    setLoading(true);
    try {
      const res = await axios.get("/api/items", {
        params: { q, category, min, max, page, limit },
      });
      const totalRoundedPages = Math.ceil((res.data.total || 1) / limit);
      setItems(res.data.items);
      setTotalPages(totalRoundedPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // run on mount + page change
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleApplyFilters = () => {
    setPage(1);
    fetchItems();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Shop Items</h1>

      {/* 🔍 Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          placeholder="Search..."
          className="p-2 border rounded w-1/4 min-w-[150px]"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <select
          className="p-2 border rounded w-1/4 min-w-[150px]"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          className="p-2 border rounded w-1/6 min-w-[100px]"
          value={min}
          onChange={(e) => setMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="p-2 border rounded w-1/6 min-w-[100px]"
          value={max}
          onChange={(e) => setMax(e.target.value)}
        />

        <button
          onClick={handleApplyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>

      {/* 🛍 Items Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p>No items found</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/items/${item.id}`)}
                className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition cursor-pointer"
              >
                {item.imageUrl && (
                  <img src={
                      item.imageUrl.startsWith("http")
                      ? item.imageUrl
                      : `${item.imageUrl}`
                    }
                    alt={item.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-gray-600">{item.description}</p>
                <p className="text-green-600 font-bold">
                  ₹{item.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  Category: {item.category}
                </p>
              </div>
            ))}
          </div>

          {/* 📄 Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className={`px-3 py-1 rounded border ${
                page === 1
                  ? "text-gray-400 border-gray-300"
                  : "bg-blue-600 text-white border-blue-600"
              }`}
            >
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={`px-3 py-1 rounded border ${
                page === totalPages
                  ? "text-gray-400 border-gray-300"
                  : "bg-blue-600 text-white border-blue-600"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
