import Booking from "../models/Booking.js";
import User from "../models/User.js";

export const createBooking = async (req, res) => {
    try {
        const { serviceType, data, time, location, duration, message } = req.body;

        const booking = await Booking.create({
            user: req.user._id,
            serviceType,
            date,
            time,
            location,
            duration,
            message,
        });

        await User.findByIdAndUpdate(req.user._id, {
            $push: { booking: booking._id },
        });

        res.status(201).json({ message: "successfuly created booking" })
    } catch (error) {
        console.error("Create booking error", error);
        res.status(500).json({ message: "Something went wrong to create booking" });
    }
};

export const getUserBooking = async (req, res) => {
    try {
        const allbooking = await Booking.find({ user: req.user._id }).populate('photographer', 'name photo').sort({ createdAt: -1 });
        res.json(allbooking);
    } catch (error) {
        console.error("error to getall booking.", error);
        res.status(500).json({ message: "Something went wrong load all bookings" });
    }
};

export const getUserBookingById = async (req, res) => {
    try {
        const bookingById = await Booking.findById(req.parms.id).populate('user', 'name email').populate('photographer', 'name photo');

        if (!bookingById) return res.status(404).json({ message: 'Booking not found.' });

        if (bookingById.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized.' });
        }

        res.json(bookingById);
    } catch (error) {
        console.error("error to getById booking.", error);
        res.status(500).json({ message: "Something went wrong booking based on id." });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ message: 'Booking not found.' });

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized.' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.json({ message: 'Booking cancelled.', booking });
    } catch (error) {
        console.error("error to cancel booking", error);
        res.status(500).json({ message: "Something went wrong to delete booking." });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate('photographer', 'name')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status, adminNotes },
            { new: true, runValidators: true }
        );

        if (!booking) return res.status(404).json({ message: 'Booking not found.' });
        res.json({ message: 'Booking status updated.', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};