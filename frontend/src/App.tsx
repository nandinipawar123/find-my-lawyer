import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Layouts
import OnboardingLayout from "./layouts/OnboardingLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientDashboard from "./pages/ClientDashboard";
import LawyerDashboard from "./pages/LawyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LawyerUpload from "./pages/LawyerUpload";

// Onboarding
import OnboardingProfile from "./pages/OnboardingProfile";
import OnboardingPhoto from "./pages/OnboardingPhoto";
import OnboardingLegal from "./pages/OnboardingLegal";
import OnboardingAvailability from "./pages/OnboardingAvailability";

// Route Guards
import AdminRoute from "./routes/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/:type" element={<Register />} />

          {/* Dashboards */}
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/lawyer/dashboard" element={<LawyerDashboard />} />

          {/* ✅ Admin Protected Route */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Lawyer Upload */}
          <Route path="/lawyer/upload" element={<LawyerUpload />} />

          {/* Onboarding */}
          <Route path="/onboarding" element={<OnboardingLayout />}>
            <Route path="profile" element={<OnboardingProfile />} />
            <Route path="photo" element={<OnboardingPhoto />} />
            <Route path="legal" element={<OnboardingLegal />} />
            <Route path="availability" element={<OnboardingAvailability />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
