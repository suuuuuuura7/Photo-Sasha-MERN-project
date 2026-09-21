import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { motion } from "framer-motion";

// Cloudinary helpers
const optimizeVideo = (url, w = 1280) =>
    url.replace('/upload/', `/upload/q_auto,f_auto,w_${w}/`);

const posterFromVideo = (url, w = 1600) =>
    url.replace('/upload/', `/upload/so_auto,w_${w},q_auto,f_auto/`)
        .replace(/\.(mp4|webm|mov|avi)$/i, '.jpg');

const HeroSection = () => {
    const [videoReady, setVideoReady] = useState(false);

    // Your original Cloudinary video URLs
    const webmUrl = "https://res.cloudinary.com/thcjooxp/video/upload/v1789973851/wedding2.webm";
    const mp4Url = "https://res.cloudinary.com/thcjooxp/video/upload/v1789973766/Wedding.2.mp4";

    // Auto-generated poster from the video itself
    const posterUrl = posterFromVideo(mp4Url, 1600);

    return (
        <section
            id='hero'
            className='relative min-h-screen flex items-center justify-center bg-darkBase pt-8 overflow-hidden'
        >
            <img
                src={posterUrl}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover z-0"
                style={{
                    filter: videoReady ? 'none' : 'blur(8px)',
                    transform: videoReady ? 'scale(1)' : 'scale(1.08)',
                    opacity: videoReady ? 0 : 1,
                    transition: 'opacity 0.8s ease-out, filter 0.8s ease-out, transform 0.8s ease-out',
                    pointerEvents: 'none',
                }}
            />

            <video
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={posterUrl}
                onCanPlay={() => setVideoReady(true)}
                className='absolute inset-0 w-full h-full object-cover z-0'
                style={{
                    opacity: videoReady ? 1 : 0,
                    transition: 'opacity 0.8s ease-out',
                }}
            >
                <source src={optimizeVideo(webmUrl, 1280)} type='video/webm' />
                <source src={optimizeVideo(mp4Url, 1280)} type='video/mp4' />
            </video>

            <div className="absolute inset-0 bg-black/50 z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="z-20 flex items-center justify-center relative"
            >
                <div className='text-center px-4 max-w-4xl'>
                    <div className="justify-center">
                        <div className="flex justify-center mb-8">
                            <Logo size={90} />
                        </div>
                        <p className="text-brandRed font-serif font-semibold tracking-[0.3em] uppercase mb-5">
                            Ethiopian Photography Studio
                        </p>
                        <h1 className="font-serif text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6">
                            Capturing Your <br />
                            <span className="text-brandRed">Story</span> in Every Frame
                        </h1>

                        <p className="text-gray-400 text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed font-bold">
                            Professional photography services. Weddings, portraits,
                            corporate events — we preserve your moments with artistry and precision.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                            <Link
                                to="/bookings"
                                className="px-8 py-4 bg-brandRed text-white font-semibold rounded hover:bg-brandRed-light transition-all duration-300 hover:scale-105"
                            >
                                Book a Session
                            </Link>
                            <Link
                                to="/gallery"
                                className="px-8 py-4 border border-gray-600 text-gray-300 font-semibold rounded hover:border-brandRed hover:text-brandRed transition-all duration-300"
                            >
                                View Gallery
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/*Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
                <div className="w-px h-12 bg-gradient-to-b from-brandRed to-transparent mx-auto" />
            </div>
        </section>
    );
};

export default HeroSection;