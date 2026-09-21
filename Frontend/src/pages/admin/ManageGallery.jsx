import { useState, useEffect, useRef } from 'react';
import Alert from '../../components/Alert.jsx';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import api from '../../api/axios.js';
import { motion } from 'framer-motion';
import { useUploadProgress } from '../../hooks/useUploadProgress.js';
import { optimizeCloudinaryUrl } from '../../utils/optimizeImage.js';

const formatBytes = (b) => {
    if (b < 1024) return b + " B";
    if (b < 1024 ** 2) return (b / 1024).toFixed(1) + " KB";
    return (b / 1024 ** 2).toFixed(2) + " MB";
};

const formatTime = (s) => {
    if (!s || s === Infinity) return "—";
    if (s < 60) return `${Math.ceil(s)}s`;
    return `${Math.floor(s / 60)}m ${Math.ceil(s % 60)}s`;
};

const categories = ['Wedding', 'Portrait', 'Corporate', 'Event', 'Fashion', 'Other'];

const ManageGallery = () => {
    const [images, setImages] = useState([]);
    const [form, setForm] = useState({ title: '', category: 'Portrait', isFeatured: false });
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileRef = useRef();

    const [stage, setStage] = useState("idle"); // idle | uploading | processing | done | error
    const { progress, speed, eta, loadedBytes, onUploadProgress, reset } = useUploadProgress();

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const res = await api.get('/gallery');
                setImages(res.data);
            } catch (error) {
                setImages([]);
            }
        }; fetchGallery();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select an image.');
        const data = new FormData();
        data.append('image', file);
        data.append('title', form.title);
        data.append('category', form.category);
        data.append('isFeatured', form.isFeatured);

        setStage("uploading");
        reset();
        try {
            const res = await api.post('/gallery', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (e) => {
                    onUploadProgress(e);
                    if (e.loaded === e.total) {
                        setStage("processing");
                    }
                }
            });
            setImages([res.data.image, ...images]);
            setForm({ title: '', category: 'Portrait', isFeatured: false });
            setFile(null);
            if (fileRef.current) fileRef.current.value = '';
            setStage("done");

            setTimeout(() => setStage("idle"), 3000);
        } catch {
            setStage("error");
            setTimeout(() => setStage("idle"), 5000);
        }
    };

    const deleteImage = async (id) => {
        if (!confirm('Delete this image?')) return;
        try {
            await api.delete(`/gallery/${id}/delete`);
            setImages(images.filter(img => img._id !== id));
        } catch {
            alert('Failed to delete image.');
        }
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const inputClass = "w-full bg-inputBg border border-gray-700 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-brandRed transition-colors";

    return (
        <div className="min-h-screen bg-darkBase p-8">
            <Link to="/admin/dashboard" className="flex items-center gap-1 text-brandRed font-serif text-sm hover:underline mb-4">
                <ArrowLeft className='w-4 h-4' /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white mt-4 mb-8 font-serif">Manage Gallery</h1>

            {/* Upload form */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-darkSurface border border-gray-800 rounded-lg p-6 mb-8">
                <h2 className="text-white font-serif font-semibold mb-4">Upload New Image</h2>
                <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="md:col-span-2 mb-4">
                        <div
                            onDragEnter={handleDragEnter}
                            onDragOver={(e) => e.preventDefault()}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-12 text-center flex flex-col items-center justify-center transition-colors cursor-pointer ${isDragging ? 'border-brandRed bg-brandRed/10' : 'border-[#3f4a9b] bg-darkBase hover:bg-darkBase/80'
                                }`}
                            onClick={() => fileRef.current && fileRef.current.click()}
                        >
                            <input ref={fileRef} type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="hidden" />
                            {file ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center mb-4 text-green-500">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-white font-medium text-lg">{file.name}</p>
                                    <p className="text-gray-400 text-sm mt-1">{formatBytes(file.size)}</p>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                        className="mt-4 text-sm text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-brandRed/10 flex items-center border border-brandRed justify-center mb-4 transition-transform hover:scale-110">
                                        <Upload className="w-8 h-8 text-brandRed" />
                                    </div>
                                    <h3 className="text-xl font-medium text-white mb-2">Upload your own image</h3>
                                    <p className="text-gray-400 text-sm max-w-sm mx-auto">JPG, PNG, or WebP.</p>
                                </>
                            )}
                        </div>
                    </div>

                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputClass}>
                        {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Image title" required className={inputClass} />

                    <label className="md:col-span-2 flex items-center gap-2 text-gray-300 text-sm mt-2">
                        <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="accent-brandRed w-4 h-4 cursor-pointer" />
                        Feature on homepage
                    </label>

                    {stage === "done" && <div className="md:col-span-2"><Alert variant='success'> Uploaded successfully!</Alert></div>}
                    {stage === "error" && <div className="md:col-span-2"><Alert variant='error'>Upload failed. Try again.</Alert></div>}

                    <button type="submit"
                        disabled={!file || stage === "uploading" || stage === "processing"}
                        className="md:col-span-2 py-3 mt-2 bg-brandRed text-white rounded font-medium text-lg hover:bg-brandRed/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {stage === "uploading" || stage === "processing" ? "Uploading to Gallery..." : "Upload Image to Gallery"}
                    </button>
                    {(stage === "uploading" || stage === "processing") && (
                        <div className="md:col-span-2 mt-4 space-y-2 pb-4">
                            <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className="h-full bg-brandRed transition-all duration-300 ease-out"
                                    style={{ width: `${stage === "processing" ? 100 : progress}%` }}
                                />
                            </div>

                            <div className="flex justify-between text-sm text-gray-400">
                                <span>
                                    {stage === "processing"
                                        ? "Optimizing & uploading to Cloudinary…"
                                        : `${progress}% — ${formatBytes(loadedBytes)} sent`}
                                </span>
                                <span>
                                    {stage === "uploading" &&
                                        `${(speed / 1024 ** 2).toFixed(2)} MB/s • ETA ${formatTime(eta)}`}
                                </span>
                            </div>
                        </div>
                    )}

                </form>
            </motion.div>

            {/* Image grid */}
            {images.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No images yet. Upload one above.</p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="relative group rounded-lg overflow-hidden shadow-lg border border-gray-800">
                            <img src={optimizeCloudinaryUrl(img.imageUrl || img.url, 600)} alt={img.title} loading="lazy" className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                                <p className="text-white text-sm font-medium text-center px-4 truncate w-full">{img.title}</p>
                                <button onClick={() => deleteImage(img._id)} className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm rounded shadow-sm transition-colors">Delete</button>
                            </div>
                            {img.isFeatured && <span className="absolute top-2 left-2 text-xs font-semibold bg-brandRed text-white px-2 py-1 rounded shadow-md">Featured</span>}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageGallery;