import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LawyerUpload from './pages/LawyerUpload';
import ClientDashboard from './pages/ClientDashboard';
import LawyerDashboard from './pages/LawyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css'; // Ensure Tailwind directives are here or in index.css

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/:type" element={<Register />} />

          {/* Protected Routes Handling should be here but logic is inside pages for MVP simplicity */}
          <Route path="/lawyer/upload" element={<LawyerUpload />} />
          <Route path="/dashboard" element={<ClientDashboard />} />
          <Route path="/lawyer/dashboard" element={<LawyerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
