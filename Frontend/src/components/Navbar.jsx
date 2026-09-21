import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Menu, X, CalendarCog, LayoutIcon, LayoutDashboard, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../components/Logo'

const Navbar = () => {

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Booking', path: '/bookings' },
  ]

  return (
    <motion.nav
      initial={{ y: -100, }}
      animate={{ y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transparent transition-all duration-300 ${isScrolled ? ' py-4 border-b backdrop-blur-md  border-[#4A0E0E]' : 'bg-transparent py-5 border-b border-transparent mb-20'
        }`}
    >

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between ">

        <Link to="/" className="flex items-center gap-3">
          <div>
            <Logo size={20} />
          </div>
          <span className="font-serif text-xl font-bold text-inputText tracking-wide">
            Photo<span className="text-brandRed">Sasha</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-medium text-gray-300 hover:text-brandRed transition-colors duration-200 font-serif"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className='relative'>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-2 rounded-full bg-brandRed hover:bg-brandRedHover transition-colors"
              >
                <div className="w-6 h-6 rounded-full  flex items-center justify-center ">
                  <User className="w-5 h-5 text-white" />
                </div>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 border border-gray-800 bg-footerBg rounded-md  shadow-xl py-2"
                  >
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="font-serif text-white  font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                    <Link to="/bookings" className="flex items-center text-white text-sm gap-3 px-4 py-2.5 hover:bg-gray-800 transition-colors">
                      <CalendarCog className="w-4 h-4" /> Bookings
                    </Link>
                    <Link to="/reviews" className="flex items-center text-white text-sm gap-3 px-4 py-2.5 hover:bg-gray-800 transition-colors">
                      <Star className="w-4 h-4" /> Reviews
                    </Link>
                    <Link to="/dashboard" className="flex text-white items-center text-sm gap-3 px-4 py-2.5 hover:bg-gray-800 transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin/dashboard" className="flex  items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors text-gray-400">
                        <LayoutIcon className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className='hidden md:flex gap-4'>

              <Link to="/login"
                className='text-sm px-2 py-1.5 text-gray-300 hover:text-white transition-colors'
              >
                Login
              </Link>

              <Link to="/register"
                className='px-4 py-2 text-sm bg-brandRed rounded text-white hover:bg-brandRedHover transition-all duration-200'
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 text-white rounded-xl hover:bg-darkSurface transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-transparent border-t border-gray-800"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className='block px-4 py-3 text-gray-400 rounded hover:bg-gray-800  hover:text-white text-lg transition-colors font-serif '
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>)}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar