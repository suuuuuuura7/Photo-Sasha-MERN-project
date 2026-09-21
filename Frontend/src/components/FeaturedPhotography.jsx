import { useState, useEffect } from 'react';
import api from '../api/axios.js';
import { motion } from 'framer-motion';
import { optimizeCloudinaryUrl } from '../utils/optimizeImage';

const FeaturedPhotography = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await api.get('/gallery/featured');
                setImages(res.data);
            } catch (error) {
                setImages([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    // Placeholder cards shown when no images are loaded yet
    const placeholders = Array(6).fill(null);

    return (
        <section id="featured" className="section-padding bg-darkSurface border-t  border-gray-800">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-10">
                    <p className="text-brandRed text-sm font-serif font-semibold tracking-[0.3em] uppercase mb-3">Portfolio</p>
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
                        Featured Work
                    </h2>
                    <div className="w-16 h-px bg-brandRed mx-auto" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading
                        ? placeholders.map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-800 rounded-lg animate-pulse" />
                        ))
                        : images?.length > 0
                            ? images.map((img, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.66, delay: i * 0.4 }}
                                    viewport={{ once: true }}
                                    className="relative  aspect-square rounded overflow-hidden group cursor-pointer"
                                >
                                    <img
                                        src={optimizeCloudinaryUrl(img.imageUrl || img.url, 800)}
                                        alt={img.title}
                                        loading="eager"
                                        fetchpriority="high"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                        <div>
                                            <p className="text-white font-semibold">{img.title}</p>
                                            <p className="text-brandRed text-sm">{img.category}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                            : (
                                <div className="col-span-3 text-center py-16 text-gray-500">
                                    <p>Gallery coming soon. Upload images from the admin dashboard.</p>
                                </div>
                            )
                    }
                </div>
            </div>
        </section>
    );
};

export default FeaturedPhotography;