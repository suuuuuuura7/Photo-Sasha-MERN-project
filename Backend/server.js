import express from 'express';
import 'dotenv/config';
import { connectDB } from './config/db.js';

import authRoute from './Routes/authRoute.js';
import bookingRoute from './Routes/bookingRoute.js';


const app = express();
const PORT = process.env.PORT || 5002;

app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/booking", bookingRoute);
app.use("/api/gallery", galleryRoute);
app.use("/api/contact", contactRoute);
app.use("/api/review", reviewRoute);
app.use("/api/admin", adminRoute);


connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
});
