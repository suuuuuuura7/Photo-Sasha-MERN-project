import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios.js";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext.jsx";
import { StarIcon } from "lucide-react";
import { motion } from "framer-motion";

const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'];

// Cloudinary helpers
const optimize = (url, w = 900) =>
    url.replace('/upload/', `/upload/f_auto,q_auto,w_${w}/`);

const blurify = (url) =>
    url.replace('/upload/', '/upload/f_auto,q_1,w_20,e_blur:1000/');

const LeaveReview = () => {

    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ rating: 0, comment: '' });
    const [status, setStatus] = useState('');
    const [hover, setHover] = useState(0);

    // Load states for the two images
    const [img1Loaded, setImg1Loaded] = useState(false);
    const [img2Loaded, setImg2Loaded] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('');
        setLoading(true);
        try {
            await api.post('/reviews', form);
            setForm({ rating: 0, comment: '' });
            setStatus('success');
        } catch (error) {
            setStatus(error.response?.data?.message || 'error');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-inputBg border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brandRed transition-colors";
    const activeRating = hover || form.rating;

    return (
        <div className="min-h-screen bg-darkBase">
            <Navbar />

            <div className="pt-28 pb-20 px-4 md:px-8 lg:px-16">

                <div className="text-center mb-16">
                    <p className="text-brandRed font-serif font-semibold text-sm mb-3 tracking-[0.36rem] uppercase">
                        Share Your Feedback
                    </p>
                    <h1 className="font-bold font-serif text-white text-4xl md:text-6xl mb-4">
                        Leave a Review
                    </h1>
                    <div className="w-16 h-px bg-brandRed mx-auto" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        {/* Collage container — overflow-hidden kills blur bleed / glow */}
                        <div
                            className="relative w-full hidden lg:block overflow-hidden"
                            style={{ minHeight: '580px' }}
                        >

                            {/* ===== IMAGE 1 GROUP (blur + real, fade together) ===== */}
                            <motion.div
                                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="absolute bottom-0 left-0"
                                style={{
                                    aspectRatio: '16/9',
                                    width: '88%',
                                    zIndex: 1,
                                }}
                            >
                                {/* Blur placeholder — fades OUT when real loads */}
                                <img
                                    src={blurify("https://res.cloudinary.com/thcjooxp/image/upload/v1789972011/img1.png")}
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute inset-0 w-full h-full object-cover rounded-sm"
                                    style={{
                                        filter: 'blur(24px)',
                                        transform: 'scale(1.1)',
                                        opacity: img1Loaded ? 0 : 1,
                                        transition: 'opacity 0.5s ease-out',
                                    }}
                                />
                                {/* Real image — fades IN when loaded */}
                                <img
                                    src={optimize("https://res.cloudinary.com/thcjooxp/image/upload/v1789972011/img1.png", 1000)}
                                    alt="Wedding Photography"
                                    loading="lazy"
                                    decoding="async"
                                    onLoad={() => setImg1Loaded(true)}
                                    className="absolute inset-0 w-full h-full object-cover rounded-sm"
                                    style={{
                                        opacity: img1Loaded ? 1 : 0,
                                        transition: 'opacity 0.5s ease-out',
                                    }}
                                />
                            </motion.div>

                            {/* ===== IMAGE 2 GROUP (blur + real, fade together + fade on hover) ===== */}
                            <motion.div
                                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                whileHover={{ opacity: 0.1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="absolute top-0 right-0 cursor-pointer"
                                style={{
                                    aspectRatio: '9/16',
                                    width: '55%',
                                    height: '80%',
                                    zIndex: 2,
                                }}
                            >
                                {/* Blur placeholder */}
                                <img
                                    src={blurify("https://res.cloudinary.com/thcjooxp/image/upload/v1789972081/wedding3.jpg")}
                                    alt=""
                                    aria-hidden="true"
                                    className="absolute inset-0 w-full h-full object-cover rounded-sm"
                                    style={{
                                        filter: 'blur(24px)',
                                        transform: 'scale(1.1)',
                                        opacity: img2Loaded ? 0 : 1,
                                        transition: 'opacity 0.5s ease-out',
                                    }}
                                />
                                {/* Real image */}
                                <img
                                    src={optimize("https://res.cloudinary.com/thcjooxp/image/upload/v1789972081/wedding3.jpg", 700)}
                                    alt="Studio Photography"
                                    loading="lazy"
                                    decoding="async"
                                    onLoad={() => setImg2Loaded(true)}
                                    className="absolute inset-0 w-full h-full object-cover rounded-sm"
                                    style={{
                                        opacity: img2Loaded ? 1 : 0,
                                        transition: 'opacity 0.5s ease-out',
                                    }}
                                />
                            </motion.div>

                        </div>
                    </div>
                    <div className="flex flex-col gap-3 lg:hidden" />

                    {/* ===== REVIEW FORM CARD ===== */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="max-w-lg bg-darkSurface rounded-sm border border-gray-800 p-6 ml-16">
                        <p className="text-gray-500 text-sm mb-5">
                            Reviewing as: <span className="text-white font-serif font-medium">{user?.name}</span>
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-gray-400 text-sm block mb-3 text-left">
                                    Overall Rating
                                </label>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setForm(prev => ({ ...prev, rating: star }))}
                                            onMouseEnter={() => setHover(star)}
                                            onMouseLeave={() => setHover(0)}
                                        >
                                            <StarIcon
                                                size={44}
                                                className={`${star <= activeRating ? 'text-brandRed fill-brandRed' : 'text-gray-600'} transition-colors duration-150`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <p className="text-sm text-brandRed mt-2 text-center h-5">
                                    {activeRating === 0 ? 'Tap a star to rate' : RATING_LABELS[activeRating]}
                                </p>
                            </div>

                            <div>
                                <label className="text-gray-400 text-sm block mb-2">Your Comment</label>
                                <textarea
                                    name="comment"
                                    rows={5}
                                    value={form.comment}
                                    onChange={handleChange}
                                    required
                                    placeholder="Share your experience here..."
                                    className={inputClass + ' resize-none'}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 text-sm font-semibold text-white rounded transition-all duration-200 ${loading ? 'bg-brandRedHover cursor-not-allowed' : 'bg-brandRed hover:bg-brandRedHover'}`}
                            >
                                {loading ? 'Submitting…' : 'Submit Review'}
                            </button>

                            {status === 'success' && (<Alert variant="success">Review submitted. Awaiting approval.</Alert>)}
                            {status !== '' && status !== 'success' && (<Alert variant="error">{status === 'error' ? 'Failed to submit review.' : status} </Alert>)}
                        </form>
                    </motion.div>

                </div>
            </div>

            <Footer />
        </div>
    );
};

export default LeaveReview;