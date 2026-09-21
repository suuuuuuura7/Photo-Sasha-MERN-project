import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios.js';
import { motion } from 'framer-motion';

const ManageBooking = () => {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get('/bookings')
        setBookings(res.data);
      } catch (error) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }; fetchBooking();
  }, [])

  const updateStatus = async (id, status) => {
    try {
      const res = await api.put(`/bookings/${id}/status`, { status });
      setBookings(bookings.map(b => b._id === id ? res.data.booking : b));
    } catch {
      alert('Failed to update status.');
    }
  };

  return (
    <div className="min-h-screen bg-darkBase p-8">
      <Link to="/admin/dashboard" className="text-brandRed font-serif text-sm hover:underline flex items-center gap-1">
        <ArrowLeft className='w-4 h-4 ' /> Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold text-white mt-4 mb-8 font-serif">Manage Bookings</h1>

      {loading ? (
        <div className="space-y-3">
          {Array(4).fill(null).map((_, i) => <div key={i} className="h-24 bg-darkSurface rounded animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.length === 0 && <p className='text-gray-500'>No bookings yet.</p>}
          {bookings.map((book, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-darkSurface border border-gray-800 rounded-lg p-5">
              <h3 className='text-white font-medium'>{book.serviceType} — {book.user?.name}</h3>
              <p className="text-gray-400 text-sm">{book.user?.email}</p>
              <p className="text-gray-400 text-sm">
                {new Date(book.date).toLocaleDateString()} at {book.time} · {book.location} · {book.duration}hr
              </p>
              {book.message && <p className='text-gray-400 text-sm mt-1 italic'>{book.message}</p>}
              <select
                onChange={(e) => updateStatus(book._id, e.target.value)}  // Fix: was b._id (undefined)
                value={book.status}
                className='mt-3 bg-darkSurface border border-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-brandRed'>
                {['pending', 'confirmed', 'cancelled', 'completed'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageBooking;