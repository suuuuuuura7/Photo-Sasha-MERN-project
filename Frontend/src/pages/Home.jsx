import React from 'react'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import BookingSection from '../components/BookingSection'
import AboutUs from '../components/AboutUs'
import Reviews from '../components/Reviews'
import ServicesSection from '../components/ServiceSection'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import FeaturedPhotography from '../components/FeaturedPhotography'

const Home = () => {
    return (
        <div className='bg-darkBase min-h-screen'>
            <Navbar />
            <HeroSection />
            <FeaturedPhotography />
            <ServicesSection />
            <BookingSection />
            <Reviews />
            <AboutUs />
            <Contact />
            <Footer />
        </div>
    )
}

export default Home