import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, isAuthenticated, loading } = useAuth();

    // Wait for auth check to complete before making any decisions
    if (loading) {
        return (
            <div className="min-h-screen bg-darkBase flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brandRed border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // Fix: was redirecting to /admin/stats (doesn't exist) — now goes to /dashboard
    if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

    // Fix: was missing this return — so admin users saw a black screen (undefined rendered)
    return children;
};

export default AdminRoute;
