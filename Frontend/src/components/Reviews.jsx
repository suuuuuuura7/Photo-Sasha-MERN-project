import { useState, useEffect } from 'react';
import api from '../api/axios.js';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const StarRating = ({ rating }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={star <= rating ? 'text-brandRed fill-brandRed' : 'text-gray-600'} />
        ))}
    </div>
);

const Reviews = () => {

    const { isAuthenticated } = useAuth();

    const [reviews, setReviews] = useState([]);


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get('/reviews');
                setReviews(res.data);
            } catch {
                setReviews([]);
            }
        };
        fetchReviews();
    }, []);

    return (
        <section id='reviews' className='section-padding bg-darkBase border-t border-gray-800'>
            <div className="max-w-7xl mx-auto text-center">

                <div className="text-center mb-12">
                    <p className="text-brandRed text-sm font-semibold font-serif tracking-[0.3em] uppercase">Client Stories</p>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">What Our Clients Say</h2>
                    <div className="w-16 h-px bg-brandRed mx-auto" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.length > 0
                        ? reviews.map((review, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="p-6 rounded  hover:border-brandRed transition-colors">

                                <StarRating rating={review.rating} />
                                <p className="text-gray-300 mt-4 mb-6 leading-relaxed italic">"{review.comment}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-brandRed flex items-center justify-center text-white font-bold">
                                        {review.user?.name ? review.user.name[0] : 'A'}
                                    </div>
                                    <span className="text-white font-medium">{review.user?.name || 'Anonymous'}</span>
                                </div>
                            </motion.div>
                        ))
                        : (
                            <div className="col-span-3 text-center py-16 text-gray-500">
                                <p>No reviews available yet. Leave a review after your photo shoot to feature here.</p>
                            </div>
                        )
                    }
                </div>
                {isAuthenticated &&
                    <Link to="/reviews" className="inline-block px-10 py-4 mt-5 text-white  font-semibold rounded border border-gray-800 hover:border-brandRed hover:text-brandRed transition-colors duration-300 " >
                        Leave Review
                    </Link>
                }
            </div>
        </section>
    )
}

export default Reviews