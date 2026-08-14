import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PatientProvider } from './context/PatientContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NewDiagnosis from './pages/NewDiagnosis';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminFacilitySettings from './pages/AdminFacilitySettings';

function RootRedirect() {
  const { clinician, loading } = useAuth();
  if (loading) return null;
  if (!clinician) return <Navigate to="/" replace />;
  return <Navigate to={clinician.accountType === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PatientProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/diagnosis/new" element={<NewDiagnosis />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id" element={<PatientDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/settings" element={<AdminFacilitySettings />} />
              <Route path="/admin/profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </PatientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
