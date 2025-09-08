import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/auth-context/auth-context";

// /src/pages/EditItemPage.tsx
export default function EditItemPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch item data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get(`/api/items/${id}`)
      .then((res) => {
        const item = res.data;
        setTitle(item.title);
        setDescription(item.description || "");
        setPrice(String(item.price));
        setCategory(item.category);
        setExistingImageUrl(
          item.imageUrl?.startsWith("http")
            ? item.imageUrl
            : `http://localhost:4000${item.imageUrl}`
        );
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .catch((_err) => setError("Failed to fetch item data"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title || !price || !category) {
      setError("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    if (imageFile) formData.append("image", imageFile);

    try {
      setSaving(true);
      await axios.put(`/api/items/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Item updated successfully!");
      navigate("/items");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update item");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading item...</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Edit Item</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price *"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border p-2 rounded"
          min={0}
          step="0.01"
          required
        />
        <input
          type="text"
          placeholder="Category *"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <div>
          <label className="block mb-1 font-semibold">Current Image:</label>
          {existingImageUrl ? (
            <img
              src={existingImageUrl}
              alt="Current"
              className="w-full h-40 object-cover rounded mb-2"
            />
          ) : (
            <p>No image</p>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {saving ? "Saving..." : "Update Item"}
        </button>
      </form>
    </div>
  );
}
