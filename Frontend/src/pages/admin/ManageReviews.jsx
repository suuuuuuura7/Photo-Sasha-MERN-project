import { ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios.js'
import { motion } from 'framer-motion'

const ManageReviews = () => {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await api.get('/reviews/all')
                setReviews(res.data);
            } catch (error) {
                setReviews([]);
            } finally {
                setLoading(false);
            }
        }; fetchReview();
    }, []);

    const approve = async (id) => {
        try {
            await api.put(`/reviews/${id}/approve`);
            setReviews(reviews.map(r => r._id === id ? { ...r, isApproved: true } : r));
        } catch {
            alert('Failed to approve review.');
        }
    };

    const deleteReview = async (id) => {
        if (!confirm('Delete this review?')) return;
        try {
            await api.delete(`/reviews/${id}`);
            setReviews(reviews.filter(r => r._id !== id));
        } catch {
            alert('Failed to delete review.');
        }
    };

    return (
        <div className='min-h-screen bg-darkBase p-8'>
            <Link to="/admin/dashboard" className='flex items-center gap-1 font-serif text-brandRed text-sm hover:underline'>
                <ArrowLeft className='w-4 h-4' /> Back to Dashboard
            </Link>
            <h1 className="text-3xl text-white font-bold mt-4 mb-8 font-serif">Manage Reviews</h1>

            {loading ? (
                <div className="space-y-3">{Array(4).fill(null).map((_, i) => <div key={i} className="h-20 bg-darkSurface rounded animate-pulse" />)}</div>
            ) : reviews.length === 0 ? (
                <p className='text-gray-500'>No reviews submitted yet.</p>
            ) : (
                <div className="space-y-3">
                    {reviews.map((r, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-darkSurface border border-gray-800 rounded-lg p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-white font-medium">{r.user?.name}</span>
                                        <span className="text-brandRed">{'★'.repeat(r.rating)}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${r.isApproved ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'}`}>
                                            {r.isApproved ? 'Approved' : 'Pending'}
                                        </span>
                                    </div>
                                    <p className="text-gray-300 text-sm italic">"{r.comment}"</p>
                                    <p className="text-gray-500 text-xs mt-1">{r.user?.email}</p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    {!r.isApproved && (
                                        <button
                                            onClick={() => approve(r._id)}
                                            className="px-4 py-2 bg-brandRed text-white text-sm rounded hover:opacity-90">
                                            Approve
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteReview(r._id)}
                                        className="px-4 py-2 bg-gray-700 text-gray-300 text-sm rounded hover:bg-gray-600">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageReviews;