
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType } from '@/contexts/AuthContextDefinition';

// const AuthStatusChecker: React.FC = () => {
//   const { currentUser, loading } = useAuth() as AuthContextType;
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!loading && !currentUser) {
//       navigate('/login');
//     }
//   }, [currentUser, loading, navigate]);

//   return null;
// };

import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute'; // Import ProtectedRoute
import Login from '@/pages/Login';
import MainLayout from '@/layouts/MainLayout';
import Index from '@/pages/Index';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import PegawaiDetail from '@/pages/PegawaiDetail';
import PegawaiNew from './pages/PegawaiNew';
import PegawaiEdit from './pages/PegawaiEdit';
import ValidateQR from './pages/ValidateQR';
import NotFound from '@/pages/NotFound';
import PegawaiPage from '@/pages/Pegawai';
import Events from '@/pages/Events';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* <AuthStatusChecker /> */}
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/validate-qr/:eventId/:token" element={<ValidateQR />} />
            {/* Protected Routes */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route path="/" element={<Index />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/pegawai" element={<PegawaiPage />} />
              <Route path="/pegawai/new" element={<PegawaiNew />} />
              <Route path="/pegawai/edit/:id" element={<PegawaiEdit />} />
              <Route path="/pegawai/:id" element={<PegawaiDetail />} />
              <Route path="/events" element={<Events />} />
            </Route>
            {/* End Protected Routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
