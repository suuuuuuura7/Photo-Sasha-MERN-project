import { useState } from "react";
import api from "../api/axios";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import Footer from '../components/Footer';
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const serviceTypes = ['Portrait', 'Wedding', 'Corporate', 'Event', 'Fashion', 'Commercial', 'Family', 'Other'];


const Booking = () => {
    const { user } = useAuth();

    const [form, setForm] = useState({ serviceType: 'Portrait', date: '', time: '', location: '', duration: '2', message: '' });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');

        setLoading(true);
        try {
            await api.post("/bookings", form);
            setForm({ serviceType: 'Portrait', date: '', time: '', location: '', duration: 2, message: '' });
            setStatus('success')
        } catch (error) {
            setStatus(error.response?.data?.message || 'error')
        } finally {
            setLoading(false);
        }
    }


    const inputClass = "w-full bg-inputBg border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brandRed transition-colors";



    return (
        <div className="min-h-screen bg-darkBase">
            <Navbar />
            <div className="pt-28 pb-16 px-4 md:px-8 lg:px-16 flex ">
                <div className="w-full max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <p className="text-brandRed text-sm font-serif font-semibold tracking-[0.3em] uppercase mb-3">
                            Reserve Your Session
                        </p>
                        <h1 className="font-serif text-5xl font-bold text-white mb-4">Book a Session</h1>
                        <div className="w-16 h-px bg-brandRed mx-auto" />
                    </div>

                    <motion.div
                        key='booking'
                        initial={{ opacity: 0, y: 30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="w-full  px-4 relative z-10"

                    >
                        <div className="bg-darkSurface border border-gray-800 rounded-lg p-8">
                            <p className="text-gray-400 text-sm block mb-4">Booking as: <span className="text-white">{user?.name}</span></p>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="text-gray-400 text-sm block mb-1">Service Type</label>
                                    <select onChange={handleChange} value={form.serviceType} name="serviceType" className={inputClass}>
                                        {serviceTypes.map((service) => <option key={service} value={service}>{service}</option>
                                        )}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-gray-400 text-sm block mb-1">Preferred Date</label>
                                        <input type="date" onChange={handleChange} value={form.date} name="date" required min={new Date().toISOString().split('T')[0]} className={inputClass} />
                                    </div>

                                    <div>
                                        <label className="text-gray-400 text-sm block mb-1">Preferred Time</label>
                                        <input type="time" onChange={handleChange} value={form.time} name="time" required className={inputClass} />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-400 text-sm block mb-1">Location</label>
                                    <input type="text" onChange={handleChange} value={form.location} name="location" placeholder="e.g. Kebele 15, Bahir Dar" required className={inputClass} />
                                </div>

                                <div>
                                    <label className="text-gray-400 text-sm block mb-1">Duration (Hours): {form.duration} </label>
                                    <input type="range" onChange={handleChange} value={form.duration} name="duration" min="1" max="12" className="w-full accent-brandRedHover" />
                                    <div className="flex justify-between text-gray-500 text-xs mt-1"><span>1 hr</span><span>12 hrs</span></div>
                                </div>

                                <div>
                                    <label className="text-gray-400 text-sm block mb-1">Additional Notes (optional)</label>
                                    <textarea onChange={handleChange} value={form.message} name="message" placeholder="Tell us about your vision..." rows={4} className={inputClass + ' resize-none'} />
                                </div>

                                {status === 'success' && <Alert variant="success">Booking submitted! We'll confirm within 24 hours.</Alert>}
                                {status === 'error' && <Alert variant="error">Failed to submit booking. Please try again.</Alert>}

                                <button type="submit" disabled={loading} className="w-full text-white  font-semibold bg-brandRed py-4 rounded hover:bg-brandRedHover transition-all disabled:opacity-50 text-lg ">
                                    {loading ? 'Submitting....' : 'Submit Booking Request'}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                </div>
            </div>

            <Footer />
        </div >
    )
}

export default Booking