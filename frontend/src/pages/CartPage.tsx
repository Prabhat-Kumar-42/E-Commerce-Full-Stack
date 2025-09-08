import { useCart } from "../context/cart-context/cart-context";

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart } = useCart();

  if (!cart || cart.items.length === 0)
    return <p className="p-6">Your cart is empty.</p>;

  const totalPrice = cart.items.reduce(
    (sum, ci) => sum + ci.quantity * ci.item.price,
    0
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.items.map((ci) => (
          <div
            key={ci.id}
            className="flex items-center justify-between border rounded p-4"
          >
            <div className="flex items-center gap-4">
              {ci.item.imageUrl && (
                <img
                  src={
                    ci.item.imageUrl.startsWith("http")
                      ? ci.item.imageUrl
                      : `http://localhost:4000${ci.item.imageUrl}`
                  }
                  alt={ci.item.title}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div>
                <h2 className="font-semibold">{ci.item.title}</h2>
                <p className="text-gray-600">₹{ci.item.price.toFixed(2)}</p>
              </div>
            </div>

            {/* Quantity controls */}
            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() =>
                  updateCartItem(ci.id, Math.max(0, ci.quantity - 1))
                }
              >
                -
              </button>
              <span>{ci.quantity}</span>
              <button
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => updateCartItem(ci.id, ci.quantity + 1)}
              >
                +
              </button>

              {/* Remove button */}
              <button
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => removeFromCart(ci.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 text-right text-xl font-bold">
        Total: ₹{totalPrice.toFixed(2)}
      </div>
    </div>
  );
}
