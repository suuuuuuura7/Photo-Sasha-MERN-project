import express from "express";
import { createBooking, getUserBooking, getUserBookingById, cancelBooking, getAllBookings, updateBookingStatus } from "../controllers/bookingController.js";
import { isAuth, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.use(isAuth);

router.post('/', createBooking);
router.get('/my', getUserBooking);
router.get('/:id', getUserBookingById);
router.put('/:id/cancel', cancelBooking);

//admin only I will add admin middleware
router.get('/', isAdmin, getAllBookings);
router.put('/:id/status', isAdmin, updateBookingStatus);



export default router;