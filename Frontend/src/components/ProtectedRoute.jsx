import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {

    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-darkBase flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-brandRed border-t-transparent rounded-full animate-spin" />
            </div>
        );
    };
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute