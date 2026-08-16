import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const { user, isAuthenticated, loading } = useAuth();

const AdminRoute = ({ children }) => {

    if (loading) {
        return (
            <div className="min-h-screen bg-darkBase flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brandRed border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
};

export default AdminRoute