import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

export default function AdminRoute() {
  const { clinician, loading } = useAuth();

  if (loading) return null;
  if (!clinician) return <Navigate to="/login" replace />;
  if (clinician.accountType !== 'admin') return <Navigate to="/dashboard" replace />;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-shell__content">
        <Outlet />
      </main>
    </div>
  );
}
