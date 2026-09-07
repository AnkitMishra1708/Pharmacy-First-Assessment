import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/Authcontext.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import { Login } from "./pages/Login.jsx";
import { Register } from "./pages/Register.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Prescription } from "./pages/Prescription.jsx";
import { Patient } from "./pages/Patient.jsx";
import { SymptomSelection } from "./pages/SymptomSelection.jsx";

function ProtectedLayout() {
  const { user, loading, logout } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <AppLayout role={user.role} userName={user.name} onLogout={logout} />;
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patient" element={<Patient />} />
            <Route path="/prescription" element={<Prescription />} />
            <Route path="/prescription/:protocolId" element={<SymptomSelection />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
