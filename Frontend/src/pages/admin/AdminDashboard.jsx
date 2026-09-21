import { useState, useEffect } from 'react';
import api from '../../api/axios.js';
import { motion } from 'framer-motion';

const AdminDashboard = () => {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Failed to load stats:', err);
                setStats(null);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-1 font-serif">Dashboard</h1>
            <p className="text-gray-400 mb-8 font-serif">PhotoSasha admin overview</p>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {loading
                    ? Array(4).fill(null).map((_, i) => (
                        <div key={i} className="h-24 bg-darkSurface rounded-lg animate-pulse" />
                    ))
                    : [
                        { label: 'Total Users', value: stats?.totalUsers ?? '—', color: 'text-blue-400' },
                        { label: 'Total Bookings', value: stats?.totalBookings ?? '—', color: 'text-brandRed' },
                        { label: 'Gallery Images', value: stats?.totalGallery ?? '—', color: 'text-green-400' },
                        { label: 'Unread Messages', value: stats?.unreadMessages ?? '—', color: 'text-yellow-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-darkSurface border border-gray-800 rounded-lg p-5">
                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                        </motion.div>
                    ))
                }
            </div>

            {/* Recent Bookings */}
            <h2 className="text-xl font-semibold text-white mb-4 font-serif">Recent Bookings</h2>
            {!loading && stats?.recentBookings?.length > 0 ? (
                <div className="bg-darkSurface border border-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-800">
                            <tr>
                                {['Client', 'Service', 'Date', 'Status'].map((h) => (
                                    <th key={h} className="text-left text-gray-400 px-4 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentBookings.map((b, i) => (
                                <motion.tr
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.12 }}
                                    viewport={{ once: true }}
                                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                    <td className="px-4 py-3 text-white">{b.user?.name ?? 'Unknown'}</td>
                                    <td className="px-4 py-3 text-gray-400">{b.serviceType}</td>
                                    <td className="px-4 py-3 text-gray-400">{new Date(b.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`capitalize text-xs px-2 py-1 rounded ${b.status === 'confirmed' ? 'bg-green-900/30 text-green-400' :
                                            b.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                                                'bg-red-900/30 text-red-400'
                                            }`}>
                                            {b.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : !loading && (
                <p className="text-gray-500">No bookings yet.</p>
            )}
        </div>
    );
};

export default AdminDashboard;