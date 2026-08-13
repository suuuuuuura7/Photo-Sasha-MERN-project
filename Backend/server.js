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

//To connect backend to frontend  
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/gallery", galleryRoute);
app.use("/api/contact", contactRoute);
app.use("/api/review", reviewRoute);
app.use("/api/admin", adminRoute);


// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error: ', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

//It will run the server after connect to database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`PhotoSasha Server is running on port ${PORT}`);
    })
});
