import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

import express from 'express';
import 'dotenv/config';
import cors from "cors";
import cookieParser from 'cookie-parser';
import { connectDB } from './config/db.js';
import authRoute from './Routes/authRoute.js';
import bookingRoute from './Routes/bookingRoute.js';
import contactRoute from './Routes/contactRoute.js';
import galleryRoute from './Routes/galleryRoute.js';
import reviewRoute from './Routes/reviewRoute.js';
import adminRoute from './Routes/adminRoute.js';

const app = express();
const PORT = process.env.PORT || 5002;
app.set("trust proxy", 1);

// To connect backend to frontend
const allowedOrigins = [
    'http://localhost:5173',
    process.env.CLIENT_URL, // https://photosasha.vercel.app
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (like Postman, mobile apps, or server-to-server calls)
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            } else {
                return callback(null, new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/gallery", galleryRoute);
app.use("/api/contact", contactRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/admin", adminRoute);


// Centralized error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error: ', err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

//It will run the server after connect to database
connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`PhotoSasha Server is running on port ${PORT}`);
    })
});
