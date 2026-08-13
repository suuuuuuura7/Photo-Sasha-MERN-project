import express from "express";
import { createBooking, getUserBooking, getUserBookingById, cancelBooking, getAllBookings, updateBookingStatus } from "../controllers/bookingController.js";
import { isauth } from "../middleware/isAuth.js";

const router = express.Router();

router.post('/', isauth, createBooking);
router.get('/my', isauth, getUserBooking);
router.get('/:id', isauth,  getUserBookingById);
router.put('/:id/cancel', isauth, cancelBooking);

//admin only I will add admin middleware
router.get('/', getAllBookings);
router.put('/:id/status', updateBookingStatus);



export default router;