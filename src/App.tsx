// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ErrorBoundary from '@/components/layout/ErrorBoundary';
import Login from '@/pages/Login';
import MainLayout from '@/layouts/MainLayout';
import Index from '@/pages/Index';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import ThankYou from '@/pages/ThankYou';
import PegawaiDetail from '@/pages/PegawaiDetail';
import PegawaiNew from '@/pages/PegawaiNew';
import PegawaiEdit from '@/pages/PegawaiEdit';
import NotFound from '@/pages/NotFound';
import PegawaiPage from '@/pages/Pegawai';
import Events from '@/pages/Events';
import EventDetail from '@/pages/EventDetail';
import Absensi from '@/pages/Absensi';

function App() {

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/absensi/validate" element={<Absensi />} />
              <Route path="/thank-you" element={<ThankYou />} />
              
              <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/" element={<Index />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/pegawai" element={<PegawaiPage />} />
                <Route path="/pegawai/new" element={<PegawaiNew />} />
                <Route path="/pegawai/edit/:id" element={<PegawaiEdit />} />
                <Route path="/pegawai/:id" element={<PegawaiDetail />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;