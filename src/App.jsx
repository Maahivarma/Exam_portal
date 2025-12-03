import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./components/NavBar";
import AuthProvider, { useAuth } from "./context/AuthContext";

// Public pages
import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Roadmaps from "./pages/Roadmaps";
import InterviewPractice from "./pages/InterviewPractice";
import Payment from "./pages/Payment";
import HRDashboard from "./pages/HRDashboard";

// Protected pages
import Dashboard from "./pages/HomePage";
import ExamPage from "./pages/ExamPage";

// Context provider for exam
import ExamProvider from "./context/ExamContext";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// App Content (needs to be inside AuthProvider to use useAuth)
function AppContent() {
  return (
    <>
      <NavBar />
      <div className="max-w-7xl mx-auto p-6">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/interview-practice" element={<InterviewPractice />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/hr-dashboard" element={<HRDashboard />} />
          
          {/* Payment route - requires authentication */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          {/* Protected routes - require authentication */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <ExamProvider>
                  <Dashboard />
                  <ExamPage />
                </ExamProvider>
              </ProtectedRoute>
            }
          />

          {/* Fallback - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
