import { useEffect, useState } from "react";
import { CartContext } from "./cart-context";
import axios from "axios";
import { useAuth } from "../auth-context/auth-context";
import type { Cart, CartItem } from "../../types/cart.type";
import type { Item } from "../../types/item.type";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch cart from the backend
  async function fetchCart() {
    setLoading(true);
    try {
      const res = await axios.get("/api/cart", axiosConfig);
      const sortedItems = res.data.items.sort((a: CartItem, b: CartItem) =>
        a.id.localeCompare(b.id)
      );
      setCart({ ...res.data, items: sortedItems });
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  }

  // Optimistic update for adding an item to the cart
  async function addToCart(itemId: string, quantity = 1) {
  const optimisticCart = cart ? { ...cart } : null;
  const itemAlreadyInCart = optimisticCart?.items.find((item) => item.item.id === itemId);

  // Optimistically update the cart
  if (optimisticCart) {
    if (itemAlreadyInCart) {
      optimisticCart.items = optimisticCart.items.map((ci) =>
        ci.item.id === itemId
          ? { ...ci, quantity: ci.quantity + quantity }
          : ci
      );
    } else {
      optimisticCart.items = [
        ...optimisticCart.items,
        { id: itemId, item: { id: itemId } as Item, quantity } // Set `id` from `itemId`
      ];
    }
    setCart(optimisticCart); // Optimistic UI update
  }

  try {
    // Make API call
    await axios.post("/api/cart", { itemId, quantity }, axiosConfig);
    await fetchCart(); // Refresh after successful request
  } catch (err) {
    console.error("Failed to add to cart:", err);
    // Optionally, rollback if the update fails
    if (optimisticCart) setCart(optimisticCart); // Rollback state if necessary
  }
}
  // Optimistic update for updating a cart item's quantity
  async function updateCartItem(cartItemId: string, quantity: number) {
    const optimisticCart = cart ? { ...cart } : null;
    if (optimisticCart) {
      optimisticCart.items = optimisticCart.items.map((item) =>
        item.id === cartItemId ? { ...item, quantity } : item
      );
      setCart(optimisticCart); // Optimistic UI update
    }

    try {
      // Make API call
      await axios.put(`/api/cart/item/${cartItemId}`, { quantity }, axiosConfig);
      await fetchCart(); // Refresh after successful request
    } catch (err) {
      console.error("Failed to update cart item:", err);
      // Optionally, rollback if the update fails
      if (optimisticCart) setCart(optimisticCart); // Rollback state if necessary
    }
  }

  // Optimistic update for removing a cart item
  async function removeFromCart(cartItemId: string) {
    const optimisticCart = cart ? { ...cart } : null;
    if (optimisticCart) {
      optimisticCart.items = optimisticCart.items.filter((item) => item.id !== cartItemId);
      setCart(optimisticCart); // Optimistic UI update
    }

    try {
      // Make API call
      await axios.delete(`/api/cart/item/${cartItemId}`, axiosConfig);
      await fetchCart(); // Refresh after successful request
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      // Optionally, rollback if the update fails
      if (optimisticCart) setCart(optimisticCart); // Rollback state if necessary
    }
  }

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <CartContext.Provider
      value={{ cart, loading, fetchCart, addToCart, updateCartItem, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
