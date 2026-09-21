import { useRef, useEffect } from "react";
import React from "react";
import { motion, useInView, animate } from "framer-motion";

// Cloudinary helpers
const optimize = (url, w = 900) =>
    url.replace('/upload/', `/upload/f_auto,q_auto,w_${w}/`);

const blurify = (url) =>
    url.replace('/upload/', '/upload/f_auto,q_1,w_20,e_blur:1000/');

// Reusable image card with blur placeholder + load-aware fade
const BlurImage = ({ src, alt, width = 800, delay = 0.3, motionProps = {} }) => {
    const [loaded, setLoaded] = React.useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, ...motionProps.from }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.5, delay }}
            viewport={{ once: true }}
            className="relative w-full h-full overflow-hidden rounded-sm"
        >
            {/* Blur placeholder */}
            <img
                src={blurify(src)}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    filter: 'blur(20px)',
                    transform: 'scale(1.1)',
                    opacity: loaded ? 0 : 1,
                    transition: 'opacity 0.5s ease-out',
                }}
            />
            {/* Real image */}
            <img
                src={optimize(src, width)}
                alt={alt}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 0.5s ease-out',
                }}
            />
        </motion.div>
    );
};

const Counter = ({ value, isInView }) => {
    const nodeRef = useRef(null);

    useEffect(() => {
        const num = parseInt(value);
        const suffix = value.replace(/[0-9]/g, '');

        if (isInView) {
            const controls = animate(0, num, {
                duration: 3,
                ease: "easeOut",
                onUpdate(val) {
                    if (nodeRef.current) {
                        nodeRef.current.textContent = Math.round(val) + suffix;
                    }
                }
            });
            return () => controls.stop();
        } else {
            if (nodeRef.current) {
                nodeRef.current.textContent = "0" + suffix;
            }
        }
    }, [value, isInView]);

    return <span ref={nodeRef}>0{value.replace(/[0-9]/g, '')}</span>;
};

const AboutUs = () => {

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <section ref={ref} id='about' className="section-padding bg-footerBg border-t border-gray-800">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    <div>
                        <p className="text-brandRed font-semibold font-serif tracking-[0.36em] uppercase mb-2">Our Story</p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            About <span className="text-brandRed">PhotoSasha</span>
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            PhotoSasha was born out of a passion for visual storytelling in Bahir Dar, Ethiopia.
                            We believe every moment has a story worth telling — from the grandeur of Lalibela
                            to the warmth of an Addis family portrait.
                        </p>
                        <p className="text-gray-400 leading-relaxed mb-8">
                            Our experienced team combines technical mastery with cultural
                            sensitivity, ensuring every shoot authentically represents who you are.
                        </p>
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { value: '200+', label: 'Sessions Completed' },
                                { value: '3+', label: 'Years Experience' },
                                { value: '160+', label: 'Client Satisfaction' },
                            ].map((stat, i) => (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={isInView ? { opacity: 1 } : {}}
                                    key={i}
                                    className="text-center">
                                    <p className="text-brandRed text-3xl font-bold font-serif">
                                        <Counter value={stat.value} isInView={isInView} />
                                    </p>
                                    <p className="text-gray-400 font-serif text-sm mt-1">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="relative grid grid-cols-2 grid-rows-2 gap-3 h-80 md:h-96">
                            {/* Image 1 - Top Left */}
                            <div className="col-start-1 col-end-2 row-start-1 row-end-2">
                                <BlurImage
                                    src="https://res.cloudinary.com/thcjooxp/image/upload/v1789972005/birthday.jpg"
                                    alt="Birthday"
                                    width={600}
                                    delay={0.2}
                                    motionProps={{ from: { y: -30 } }}
                                />
                            </div>

                            {/* Image 2 - Top Right (overlaps) */}
                            <div
                                className="col-start-2 col-end-3 row-start-1 row-end-2 z-10"
                                style={{ transform: 'translate(8px, 8px)' }}
                            >
                                <BlurImage
                                    src="https://res.cloudinary.com/thcjooxp/image/upload/v1789972064/wedding2.jpg"
                                    alt="Wedding"
                                    width={600}
                                    delay={0.3}
                                    motionProps={{ from: { x: 30 } }}
                                />
                            </div>

                            {/* Image 3 - Bottom Left (overlaps) */}
                            <div
                                className="col-start-1 col-end-2 row-start-2 row-end-3 z-10"
                                style={{ transform: 'translate(-8px, -8px)' }}
                            >
                                <BlurImage
                                    src="https://res.cloudinary.com/thcjooxp/image/upload/v1789972014/img2.png"
                                    alt="Nature"
                                    width={600}
                                    delay={0.4}
                                    motionProps={{ from: { x: -30 } }}
                                />
                            </div>

                            {/* Image 4 - Bottom Right */}
                            <div className="col-start-2 col-end-3 row-start-2 row-end-3">
                                <BlurImage
                                    src="https://res.cloudinary.com/thcjooxp/image/upload/v1789972080/portrait2.jpg"
                                    alt="Portrait"
                                    width={600}
                                    delay={0.5}
                                    motionProps={{ from: { y: 30 } }}
                                />
                            </div>

                            {/* Decorative border — no glow, just an outline */}
                            <div className="absolute -top-4 -right-4 w-full h-full border border-brandRed rounded-lg -z-10 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;