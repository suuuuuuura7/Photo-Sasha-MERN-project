import Logo from '../components/Logo'
import { Link } from 'react-router-dom';

const Footer = () => {

    const year = new Date().getFullYear();


    return (
        <footer className='bg-footerBg border-t border-gray-800 py-12 px-4 md:px-8 '>
            <div className="max-w-7xl mx-auto">
                {/* brand  */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div>
                                <Logo size={20} />
                            </div>
                            <span className='font-serif text-xl font-bold text-white'>
                                Photo<span className='text-brandRed'>Sasha</span>
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Professional photography studio based in Bahir Dar, Ethiopia.
                            Capturing life's most important moments.
                            Photo means memory.
                        </p>
                    </div>
                    {/* links */}
                    <div>
                        <h4 className='text-white font-serif font-semibold mb-4'>Quick Links</h4>
                        <div className="flex flex-col gap-2">
                            {[
                                { label: 'Gallery', to: '/gallery' },
                                { label: 'Book a Session', to: '/booking' },
                                { label: 'About Us', to: '#about' },
                                { label: 'Contact', to: '#contact' },
                            ].map((link) => (
                                <Link key={link.label} to={link.to} className='text-gray-400 text-sm hover:text-brandRed transition-colors'>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    {/* services */}
                    <div>
                        <h4 className='text-white font-serif font-semibold mb-4'>Services</h4>
                        <div className="flex flex-col gap-2">

                            {['Wedding Photography', 'Portrait Session', 'Corporate Events', 'Fashion Photography'].map((s) => (
                                <span key={s} className='text-gray-400 text-sm'>{s}</span>
                            ))}
                        </div>
                    </div>
                </div>
                {/* copyright */}
                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className='text-gray-400 text-sm'>© {year} PhotoSasha. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer