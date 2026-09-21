import { lazy, Suspense } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Outlet, ScrollRestoration } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';

// — Lazy-loaded pages —
const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Booking = lazy(() => import('./pages/Booking'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Gallery = lazy(() => import('./pages/Gallery'));
const LeaveReview = lazy(() => import('./pages/LeaveReview'));

// — Admin pages —
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ManageBooking = lazy(() => import('./pages/admin/ManageBooking'));
const ManageGallery = lazy(() => import('./pages/admin/ManageGallery'));
const ManageReviews = lazy(() => import('./pages/admin/ManageReviews'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'));

// — Page loader spinner —
const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#0a0a0a',
  }}>
    <div style={{
      width: 44,
      height: 44,
      borderRadius: '50%',
      border: '3px solid #e53e3e',
      borderTopColor: 'transparent',
      animation: 'spin 0.75s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const RootLayout = () => (
  <AuthProvider>
    <ScrollRestoration />
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  </AuthProvider>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      {/* Public */}
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />

      {/* Authenticated user */}
      <Route path='/bookings' element={<ProtectedRoute><Booking /></ProtectedRoute>} />
      <Route path='/gallery' element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path='/reviews' element={<ProtectedRoute><LeaveReview /></ProtectedRoute>} />

      {/* Admin — nested under AdminLayout so all share the sidebar */}
      <Route
        path='/admin'
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path='dashboard' element={<AdminDashboard />} />
        <Route path='users' element={<ManageUsers />} />
        <Route path='bookings' element={<ManageBooking />} />
        <Route path='gallery' element={<ManageGallery />} />
        <Route path='reviews' element={<ManageReviews />} />
      </Route>
    </Route>
  )
);

export default router;