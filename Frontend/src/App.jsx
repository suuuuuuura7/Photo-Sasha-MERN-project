import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, Outlet, ScrollRestoration } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import Booking from './pages/Booking';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import LeaveReview from './pages/LeaveReview';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageBooking from './pages/admin/ManageBooking';
import ManageGallery from './pages/admin/ManageGallery';
import ManageReviews from './pages/admin/ManageReviews';
import ManageUsers from './pages/admin/ManageUsers';

const RootLayout = () => {
  return (
    <AuthProvider>
      <ScrollRestoration />
      <Outlet />
    </AuthProvider>
  )
}

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