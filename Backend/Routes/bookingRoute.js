import express from "express";

const router = express.Router();

router.post('/', createBooking);
router.get('/my', getUserBooking);
router.get('/:id', getUserBookingById);
router.put('/:id', updateBooking);
router.put('/:id/cancel', cancelBooking);



export default router;