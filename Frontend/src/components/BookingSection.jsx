import { motion } from "framer-motion"
import { Check, MapPinIcon, Star } from "lucide-react"
import { Link } from "react-router-dom"


const BookingSection = () => {
    return (
        <section id="section-preview" className="section-padding bg-footerBg border-t border-gray-800">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center"
            >
                <p className="text-brandRed text-sm font-serif font-semibold tracking-[0.3em] uppercase">Reserve Your Slot</p>
                <h2 className="font-serif text-4xl mf:text-5xl font-bold text-white mb-2">
                    Book Your Session
                </h2>
                <div className="w-16 h-px bg-brandRed mx-auto mb-6" />

                <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
                    Ready to create something beautiful? Book a session with our team
                    and we'll bring your vision to life — anywhere in Ethiopia.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    {[
                        { label: 'Same-day confirmation', icon: Check },
                        { label: 'Flexible locations', icon: MapPinIcon },
                        { label: 'Satisfaction guaranteed', icon: Star },
                    ].map((item) => {
                        const Icon = item.icon;
                        return (
                            <div key={item.label} className="flex items-center gap-3 justify-center">
                                <span className="text-brandRed font-bold text-xl">
                                    <Icon className={Icon === Star ? 'fill-brandRed' : ''} />
                                </span>
                                <span className="text-gray-300 text-sm">{item.label}</span>
                            </div>
                        );
                    })}
                </div>

                <Link to="/bookings" className="inline-block px-10 py-4 bg-brandRed text-white font-semibold rounded hover:bg-brandRedHover transition-all duration-300 hover:scale-105 text-lg">
                    Book Now
                </Link>
            </motion.div>
        </section>
    )
}

export default BookingSection