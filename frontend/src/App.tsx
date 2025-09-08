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
import MyItemsPage from "./pages/MyItemsPage";
import CreateItemPage from "./pages/CreateItemPage";
import EditItemPage from "./pages/EditItemPage";

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
              {/* Auth */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Items */}
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/items/:id" element={<ItemDetailPage />} />

              {/* User Items */}
              <Route
                path="/my-items"
                element={
                  <PrivateRoute>
                    <MyItemsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/items/create"
                element={
                  <PrivateRoute>
                    <CreateItemPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/items/edit/:id"
                element={
                  <PrivateRoute>
                    <EditItemPage />
                  </PrivateRoute>
                }
              />

              {/* Cart */}
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <CartPage />
                  </PrivateRoute>
                }
              />

              {/* Redirect unknown routes */}
              <Route path="*" element={<Navigate to="/items" />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}