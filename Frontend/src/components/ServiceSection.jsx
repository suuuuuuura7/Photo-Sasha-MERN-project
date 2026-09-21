import React, { useState, useEffect, useRef } from 'react';
import { Gem, Users, Building2, PartyPopper, Globe, ChevronRight, ChevronLeft, Star, Handbag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const services = [
    {
        icon: Gem,
        title: 'Wedding Photography',
        desc: 'Timeless moments from your special day, captured with elegance and care.',
        image: 'https://res.cloudinary.com/thcjooxp/image/upload/f_auto,q_auto,w_800/v1789972065/wedding.jpg',
        reviews: 128,
        rating: 4.9
    },
    {
        icon: Users,
        title: 'Portrait Sessions',
        desc: 'Professional individual and family portraits that tell your unique story.',
        image: 'https://res.cloudinary.com/thcjooxp/image/upload/f_auto,q_auto,w_800/v1789972009/portrait.webp',
        reviews: 95,
        rating: 4.8
    },
    {
        icon: Building2,
        title: 'Corporate Events',
        desc: 'Brand-elevating photography for conferences, launches, and company events.',
        image: 'https://res.cloudinary.com/thcjooxp/image/upload/f_auto,q_auto,w_800/v1789972009/corporate.jpg',
        reviews: 67,
        rating: 4.7
    },
    {
        icon: PartyPopper,
        title: 'Event Coverage',
        desc: 'Full event documentation from birthday celebrations to cultural festivals.',
        image: 'https://res.cloudinary.com/thcjooxp/image/upload/f_auto,q_auto,w_800/v1789972008/event.jpg',
        reviews: 83,
        rating: 4.8
    },
    {
        icon: Handbag,
        title: 'Fashion Photography',
        desc: 'Editorial and commercial fashion shoots with studio-quality lighting.',
        image: 'https://res.cloudinary.com/thcjooxp/image/upload/f_auto,q_auto,w_800/v1789972008/fashon.png',
        reviews: 72,
        rating: 4.6
    },
    {
        icon: Globe,
        title: 'Travel & Culture',
        desc: "Documenting Ethiopia's breathtaking landscapes and rich cultural heritage.",
        image: 'https://res.cloudinary.com/thcjooxp/image/upload/f_auto,q_auto,w_800/v1789972006/culture.avif',
        reviews: 156,
        rating: 4.9
    },
];

// Helper: get the tiny blurred version URL
const getBlurUrl = (url) =>
    url.replace('/f_auto,q_auto,w_800/', '/f_auto,q_1,w_20,e_blur:1000/');

const ServicesSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [loadedImages, setLoadedImages] = useState({}); // track per-index load state
    const intervalRef = useRef(null);

    const currentService = services[currentSlide];

    // Auto-advance carousel
    useEffect(() => {
        if (isHovered) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }

        intervalRef.current = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % services.length);
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isHovered]);

    // Preload all images once on mount (so switching slides feels instant)
    useEffect(() => {
        services.forEach((service, index) => {
            const img = new Image();
            img.src = service.image;
            img.onload = () => {
                setLoadedImages((prev) => ({ ...prev, [index]: true }));
            };
        });
    }, []);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            if (!isHovered) {
                intervalRef.current = setInterval(() => {
                    setCurrentSlide((prev) => (prev + 1) % services.length);
                }, 5000);
            }
        }
    };

    const nextSlide = () => goToSlide((currentSlide + 1) % services.length);
    const prevSlide = () => goToSlide((currentSlide - 1 + services.length) % services.length);

    const isCurrentLoaded = loadedImages[currentSlide];

    return (
        <section className="py-16 bg-darkBase border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <p className="text-brandRed text-sm font-serif font-semibold tracking-[0.3em] uppercase mb-3">
                        What We Offer
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">
                        Our Services
                    </h2>
                    <div className="w-16 h-px bg-brandRed mx-auto" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <div className="flex flex-col lg:flex-row items-stretch gap-6 min-h-[500px]">

                        {/* Left Sidebar */}
                        <div className="hidden lg:flex lg:flex-col justify-between w-full lg:w-72 shrink-0 gap-2.5">
                            {services.map((service, index) => {
                                const IconComponent = service.icon;
                                const isActive = index === currentSlide;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => goToSlide(index)}
                                        className={`flex items-center gap-3.5 px-4 py-3 rounded-md border font-serif text-left transition-all duration-300 flex-1 ${isActive
                                                ? 'border-brandRed/50 bg-brandRed/10 text-white shadow-lg'
                                                : 'border-gray-800/80 bg-black/30 hover:bg-black/50 hover:border-gray-700 text-gray-400'
                                            }`}
                                    >
                                        <IconComponent
                                            size={20}
                                            className={isActive ? 'text-brandRed' : 'text-gray-400'}
                                            strokeWidth={1.5}
                                        />
                                        <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                                            {service.title.split(' ')[0]}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right Side: Hero Image Card */}
                        <div
                            className="relative flex-1 rounded-md overflow-hidden bg-darkBase flex flex-col justify-between p-6 sm:p-10 shadow-2xl"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {/* === LAYER 1: Blurred tiny placeholder (always visible underneath) === */}
                            <img
                                src={getBlurUrl(currentService.image)}
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl z-0 pointer-events-none"
                            />

                            {/* === LAYER 2: Real image with smooth cross-fade on slide change === */}
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentSlide}
                                    src={currentService.image}
                                    alt={currentService.title}
                                    loading="eager"
                                    decoding="async"
                                    onLoad={() =>
                                        setLoadedImages((prev) => ({ ...prev, [currentSlide]: true }))
                                    }
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: isCurrentLoaded ? 1 : 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    className="absolute inset-0 w-full h-full object-cover z-[1]"
                                />
                            </AnimatePresence>

                            {/* === LAYER 3: Dark gradient overlay === */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 z-[2] pointer-events-none" />

                            {/* === LAYER 4: Content === */}
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="max-w-xl space-y-4">
                                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-wide">
                                        {currentService.title}
                                    </h3>

                                    <p className="text-gray-200 text-base sm:text-lg leading-relaxed font-light">
                                        {currentService.desc}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-white font-semibold text-sm ml-1">
                                                {currentService.rating}
                                            </span>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={
                                                            i < Math.floor(currentService.rating)
                                                                ? 'fill-brandRed text-brandRed'
                                                                : 'fill-gray-600 text-gray-600'
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-gray-300 text-xs ml-1">
                                                ({currentService.reviews} reviews)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Footer */}
                                <div className="flex items-center justify-between pt-80 lg:pt-6">
                                    <div className="w-8"></div>

                                    <div className="flex items-center gap-2">
                                        {services.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToSlide(index)}
                                                className={`transition-all duration-300 rounded-full ${index === currentSlide
                                                        ? 'w-6 h-1.5 bg-brandRed'
                                                        : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                                                    }`}
                                                aria-label={`Go to slide ${index + 1}`}
                                            />
                                        ))}
                                    </div>

                                    <div className="text-gray-300 text-sm font-mono tracking-wider">
                                        {currentSlide + 1} of {services.length}
                                    </div>
                                </div>
                            </div>

                            {/* Prev / Next buttons */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/20 bg-black/40 text-white hover:bg-brandRed/80 transition duration-300 shadow-xl"
                                aria-label="Previous service"
                            >
                                <ChevronLeft className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            </button>

                            <button
                                onClick={nextSlide}
                                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white hover:bg-brandRed hover:border-brandRed transition duration-300 shadow-xl"
                                aria-label="Next service"
                            >
                                <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ServicesSection;