import express from "express";
import { createBooking, getUserBooking, getUserBookingById, cancelBooking, getAllBookings, updateBookingStatus } from "../controllers/bookingController.js";

const router = express.Router();

router.post('/', createBooking);
router.get('/my', getUserBooking);
router.get('/:id', getUserBookingById);
router.put('/:id/cancel', cancelBooking);

//admin only I will add admin middleware
router.get('/', getAllBookings);
router.put('/:id/status', updateBookingStatus);



export default router;