import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import FloatingShape from "./components/FloatingShape";
import { useAuthStore } from "./store/authStore";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import EmailVerification from "./pages/EmailVerification";
import RedirectAuthenticatedUser from "./components/RedirectAuthenticatedUser";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const { isCheckingAuth, isAuthenticated, checkAuth, user } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex justify-center items-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="h-64 w-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="h-48 w-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="h-32 w-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <Signup />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <Login />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerification />} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
};

export default App;
