import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ItemsPage from "./pages/ItemsPage";
import type { JSX } from "react";
import ItemDetailPage from "./pages/ItemDetailPage";
import { AuthProvider } from "./context/auth-context/AuthProvider";
import CartPage from "./pages/CartPage";
import Layout from "./components/Layout";
import { useAuth } from "./context/auth-context/auth-context";
import { CartProvider } from "./context/cart-context/CartProvider";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  console.log(`user: ${user}`);
  console.log(user);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/items/:id" element={<ItemDetailPage />} />
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <CartPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
