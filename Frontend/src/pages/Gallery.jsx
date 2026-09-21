import api from "../api/axios"
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { optimizeCloudinaryUrl } from "../utils/optimizeImage";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const categories = ['All', 'Wedding', 'Portrait', 'Corporate', 'Event', 'Fashion', 'Other'];

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    const [selected, setSelected] = useState(null);


    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await api.get(`/gallery?category=${activeCategory}`);
                setImages(res.data);
            } catch (error) {
                setImages([]);
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, [activeCategory]);


    const placeholders = Array(8).fill(null);

    return (
        <section id="gallery" className="min-h-screen bg-darkBase">
            <Navbar />

            <div className="pt-28 pb-16 px-4 md:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">

                    <div className="text-center mb-10">
                        <p className="text-brandRed text-sm font-serif font-semibold tracking-[0.3em] uppercase mb-3">our work</p>
                        <h1 className="text-5xl font-bold font-serif text-white mb-4">Gallery</h1>
                        <div className="w-16 h-px bg-brandRed mx-auto" />
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20, scale: 0.9 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ delay: i * 0.15 }}
                            viewport={{ once: true }}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded font-serif text-sm font-medium transition-all duration-200 ${activeCategory === cat
                                ? 'bg-brandRed text-white'
                                : 'border border-gray-700 text-gray-400 hover:border-brandRed hover:text-brandRed'
                                }`}
                        >
                            {cat}
                        </motion.div>
                    ))}

                </div>
                {/* images grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {placeholders.map((_, i) => (
                            <div key={i} className="aspect-square bg-gray-800 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : images?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.map((img, i) => (
                            <motion.div
                                key={i}
                                onClick={() => setSelected(img)}
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: i * 0.3 }}
                                viewport={{ once: true, amount: 0.3 }}
                                className="relative aspect-square rounded overflow-hidden group cursor-pointer"
                            >
                                <img src={optimizeCloudinaryUrl(img.imageUrl || img.url, 800)}
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
                        ))}
                    </div>
                ) : (
                    <div className="col-span-3 text-center py-24 text-gray-500">
                        <p className="text-lg">No images in this category yet.</p>
                    </div>
                )}

                {selected && (
                    <div
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelected(null)}
                    >
                        <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                            <img src={optimizeCloudinaryUrl(selected.imageUrl || selected.url, 1600)} alt={selected.title} loading="eager" className="w-full rounded-lg max-h-[80vh] object-contain" />
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <p className="text-white font-medium">{selected.title}</p>
                                    <p className="text-brand-red text-sm">{selected.category}</p>
                                </div>
                                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white text-xl">✕</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </section>
    )
}

export default Gallery