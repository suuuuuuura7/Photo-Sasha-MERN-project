import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from 'react-icons/fc';
import { motion } from "framer-motion";
import Logo from '../components/Logo';

// Cloudinary helpers
const optimize = (url, w = 1600) =>
    url.replace('/upload/', `/upload/f_auto,q_auto,w_${w}/`);

const blurify = (url) =>
    url.replace('/upload/', '/upload/f_auto,q_1,w_20,e_blur:1000/');

const Register = () => {
    const { register, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState({ name: '', email: '', phone: '', password: '' });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [bgLoaded, setBgLoaded] = useState(false);

    // Background image URLs
    const bgRaw = "https://res.cloudinary.com/thcjooxp/image/upload/v1789972009/lalibela2.jpg";
    const bgOptimized = optimize(bgRaw, 1600);
    const bgBlur = blurify(bgRaw);

    // Clear error on unmount
    useEffect(() => {
        return () => setError('');
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (user.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);
        try {
            await register(user.name, user.email, user.phone, user.password);
            navigate("/dashboard");
        } catch (error) {
            setError(error.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setGoogleLoading(true);
        try {
            const userData = await loginWithGoogle(credentialResponse);
            navigate(userData.role === 'admin' ? '/admin/dashboard' : '/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || "Google Authentication Error");
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleGoogleError = () => {
        console.error('Google login error details:', error);
        setGoogleLoading(false);
        setError("Google Sign-Up was unsuccessful.");
    };

    // Google Login Hook with correct configuration
    const login = useGoogleLogin({
        onSuccess: async (response) => {
            await handleGoogleSuccess({ credential: response.code });
        },
        onError: () => {
            handleGoogleError();
        },
        flow: 'auth-code',
    });

    const inputClass = "w-full bg-inputBg border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brandRed transition-colors";

    return (
        <div className='relative min-h-screen bg-darkBase flex items-center justify-center px-4 py-12 overflow-hidden'>

            {/*  Layer 1: Blur placeholder (instant, ~1KB)  */}
            <img
                src={bgBlur}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-center z-0"
                style={{
                    filter: 'blur(24px)',
                    transform: 'scale(1.1)',
                    opacity: bgLoaded ? 0 : 1,
                    transition: 'opacity 0.6s ease-out',
                }}
            />

            {/*  Layer 2: Optimized background image (fades in when loaded)  */}
            <img
                src={bgOptimized}
                alt=""
                aria-hidden="true"
                onLoad={() => setBgLoaded(true)}
                className="absolute inset-0 w-full h-full object-cover object-center z-0"
                style={{
                    opacity: bgLoaded ? 1 : 0,
                    transition: 'opacity 0.6s ease-out',
                }}
            />

            {/*  Layer 3: Dark overlay + backdrop blur  */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md z-10" />

            {/*  Layer 4: Register card  */}
            <motion.div
                key="register"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md px-4 relative z-20"
            >
                <div className="relative w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <div>
                                <Logo size={20} />
                            </div>
                            <span className="font-serif text-2xl font-bold text-white">
                                Photo<span className="text-brandRed">Sasha</span>
                            </span>
                        </Link>
                    </div>
                    <div className="bg-darkSurface border-gray-800 rounded-xl p-8">
                        <h2 className="text-white text-2xl font-bold mb-2">Create account</h2>
                        <p className="text-gray-400 text-sm mb-8">Join PhotoSasha today</p>

                        {error && <Alert variant="error">{error}</Alert>}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-gray-400 text-sm block mb-1 mt-2">Full Name</label>
                                <input
                                    onChange={handleChange}
                                    value={user.name}
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Your name"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm block mb-1">Email</label>
                                <input
                                    onChange={handleChange}
                                    value={user.email}
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="you@example.com"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm block mb-1">Phone</label>
                                <input
                                    onChange={handleChange}
                                    value={user.phone}
                                    type="phone"
                                    name="phone"
                                    required
                                    placeholder="0** *** ****"
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="text-gray-400 text-sm block mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        onChange={handleChange}
                                        value={user.password}
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        placeholder="Min 8 characters"
                                        className={inputClass}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <button
                                disabled={loading}
                                className="w-full py-3 bg-brandRed text-white font-semibold rounded hover:bg-brandRedHover transition-all disabled:opacity-50"
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-gray-700" />
                            <span className="text-gray-500 text-sm">or</span>
                            <div className="flex-1 h-px bg-gray-700" />
                        </div>

                        <div className="flex justify-center w-full">
                            <button
                                onClick={() => login()}
                                disabled={googleLoading}
                                className="w-full py-3 border border-gray-600 text-gray-300 rounded hover:border-brandRed hover:text-white transition-all flex items-center justify-center gap-3 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {googleLoading ? (
                                    <div className="w-5 h-5 border-2 border-brandRed border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <FcGoogle className="w-5 h-5" />
                                )}
                                <span>{googleLoading ? 'Signing up...' : 'Sign up with Google'}</span>
                            </button>
                        </div>
                        <p className="text-center text-gray-400 text-sm mt-6">
                            Already have an account?{' '}
                            <Link to="/login" className="text-brandRed hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;