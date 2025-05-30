
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType } from './contexts/AuthContextDefinition';

const AuthStatusChecker: React.FC = () => {
  const { currentUser, loading } = useAuth() as AuthContextType;
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  return null;
};

import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute'; // Import ProtectedRoute
import Login from '@/pages/Login';
import MainLayout from '@/layouts/MainLayout';
import Index from '@/pages/Index';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import PegawaiDetail from '@/pages/PegawaiDetail';
import PegawaiNew from '@/pages/PegawaiNew';
import NotFound from '@/pages/NotFound';
import PegawaiPage from '@/pages/Pegawai';
import EventList from '@/components/events/EventList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthStatusChecker />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Index />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pegawai"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PegawaiPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pegawai/new"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PegawaiNew />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/pegawai/:id"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <PegawaiDetail />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <EventList />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
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
