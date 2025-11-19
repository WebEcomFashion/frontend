"use client";

import type React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";

// Pages
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import ChangePassword from "./pages/ChangePassword";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentPage from "./pages/PaymentPage";
import PaymentResult from "./pages/PaymentResult";

// Protected Route Component
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string;
}) => {
  const { authenticated, userRole } = useSelector(
    (state: RootState) => state.authR
  );

  if (!authenticated) return <Navigate to="/login" replace />;
  if (requiredRole && userRole !== requiredRole)
    return <Navigate to="/" replace />;

  return <>{children}</>;
};

function App() {
  const { authenticated } = useSelector((state: RootState) => state.authR);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={!authenticated ? <Login /> : <Navigate to="/" replace />}
          />
          <Route
            path="/register"
            element={
              !authenticated ? <Register /> : <Navigate to="/" replace />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/:orderId"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:orderId"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Admin Route */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute requiredRole="Admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-result"
            element={
              <ProtectedRoute>
                <PaymentResult />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-result/:orderId"
            element={
              <ProtectedRoute>
                <PaymentResult />
              </ProtectedRoute>
            }
          />
          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
