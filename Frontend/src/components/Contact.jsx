import React from 'react'
import api from '../api/axios.js';
import { useState } from 'react';
import Alert from './Alert.jsx';
import { Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Contact = () => {

    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        setLoading(true);

        try {
            await api.post('/contact', form);
            setStatus('success');
            setForm({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-inputBg border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brandRed transition-colors";

    return (
        <section id="contact" className='section-padding bg-darkBase border-t border-gray-800'>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-brandRed text-sm font-serif font-semibold tracking-[0.3em] uppercase mb-3">Get In Touch</p>
                    <h2 className="font-serif text-white text-4xl md-text-5xl font-bold mb-4">Contact Us</h2>
                    <div className='w-16 h-px bg-brandRed mx-auto' />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h3 className="text-white text-xl font-serif font-semibold mb-6">Let's Create Together</h3>
                        {/* I'll be replace the icon to lucide react */}
                        {[
                            { label: 'Email', value: 'hello@photosasha.et', icon: Mail },
                            { label: 'Phone', value: '+251 904 356 355', icon: Phone },
                            { label: 'Location', value: 'Bahir Dar, Ethiopia', icon: MapPin },
                        ].map((items) => {
                            const Icon = items.icon
                            return (
                                <div key={items.label} className="flex items-start gap-4 mb-6">
                                    <span className="text-brandRed text-xl mt-3">
                                        <Icon />
                                    </span>
                                    <div>
                                        <p className='text-gray-400 text-sm '>{items.label}</p>
                                        <p className="text-white ">{items.value}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                            <input name='name' onChange={handleChange} value={form.name} required placeholder='Your Name' className={inputClass} />
                            <input name='email' onChange={handleChange} value={form.email} type='email' required placeholder='Email Address' className={inputClass} />
                        </div>
                        <input name='subject' onChange={handleChange} value={form.subject} required placeholder='Subject' className={inputClass} />
                        <textarea name="message" onChange={handleChange} value={form.message} rows={5} required placeholder='Your message....' className={inputClass + ' resize-none'} />

                        {status === 'success' && <Alert variant='success'>Message sent successfully!</Alert>}
                        {status === 'error' && <Alert variant='error'>Failed to send. Please try again.</Alert>}

                        <button disabled={loading} type='submit' className="bg-brandRed w-full py-4  text-white font-semibold rounded  hover:bg-brandRedHover transition-all duration-300">
                            {loading ? "Sending message..." : "Send Message"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    )
}

export default Contact