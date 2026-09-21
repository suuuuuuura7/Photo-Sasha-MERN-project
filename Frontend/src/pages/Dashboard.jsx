import { Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const statusColors = {
    pending: 'text-yellow-400 bg-yellow-900/20 border-yellow-800',
    confirmed: 'text-green-400 bg-green-900/20 border-green-800',
    cancelled: 'text-red-400 bg-red-900/20 border-red-800',
    completed: 'text-blue-400 bg-blue-900/20 border-blue-800',
};

const Dashboard = () => {

    const { user } = useAuth();

    const [bookings, setBooking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchbooking = async () => {
            try {
                const res = await api.get('/bookings/my');
                setBooking(res.data);
            } catch (error) {
                setBooking([]);
            } finally {
                setLoading(false);
            }
        }; fetchbooking();
    }, []);

    const cancelBooking = async (id) => {
        if (!confirm('Cancel this booking?')) return;
        try {
            await api.put(`/bookings/${id}/cancel`);
            setBooking(bookings.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b));
        } catch {
            alert('Failed to cancel booking.');
        }
    };

    return (
        <div className="min-h-screen bg-darkBase">
            <Navbar />

            <div className="pt-28 pb-16 px-4 md:px-8 lg:px-16">
                <div className="max-w-5xl mx-auto">

                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="font-serif text-4xl font-bold text-white">My Dashboard</h1>
                            <p className="text-gray-400 mt-1">Welcome back, <span className='text-brandRed font-medium font-serif'>{user?.name}</span></p>
                        </div>
                    </div>
                    <Link to="/bookings" className="px-6 py-3 bg-brandRed  text-white rounded hover:bg-brandRedHover transition-all duration-200 flex items-center gap-1 w-44">
                        <Plus className='w-5 h-5 text-white' /> New Booking
                    </Link>
                </div>

                <h2 className="text-x font-serif font-semibold text-white mb-4"> My Bookings</h2>

                {loading ? (
                    <div className="space-y-4">
                        {Array(4).fill(null).map((_, i) => (
                            <div className="h-20 bg-gray-800 rounded animate-pulse " />))}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-16 border border-gray-800 rounded-lg">
                        <p className="text-gray-400 mb-4">No bookings yet.</p>
                        <Link to="/bookings" className="text-brandRed font-serif hover:underline">Book your first session →</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className='bg-darkSurface border border-gray-800 rounded p-5 items-center justify-between gap-4'
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-white font-medium">{booking.serviceType} Photography</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded border capitalize ${statusColors[booking.status]}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm">
                                        {new Date(booking.date).toLocaleDateString('en-ET', { dateStyle: 'long' })} at {booking.time} · {booking.location} · {booking.duration}hr
                                    </p>
                                </div>
                                {booking.status === 'pending' && (
                                    <button onClick={() => cancelBooking(booking._id)} className="text-sm font-serif text-brandRed hover:underline transition-transform">
                                        Cancel
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    )
}

export default Dashboard