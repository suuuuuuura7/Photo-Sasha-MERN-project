import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

export const submitReview = async (req, res) => {
    try {
        const { rating, comment, bookingId } = req.body;
        const { status } = req.query;

        // Verify if the user has any booking first
        let booking;
        if (bookingId) {
            booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
        } else {
            booking = await Booking.findOne({ user: req.user._id }).sort({ createdAt: -1 });
        }

        if (!booking) {
            return res.status(403).json({ message: "You must book a session first before leaving a review." });
        }

        // if (!(status === 'completed')) {
        //     return res.status(403).json({ message: "Your session must be completed to leaving a review." })
        // }

        // Prevent duplicate reviews for the same booking
        const existingReview = await Review.findOne({ user: req.user._id, booking: booking._id });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this session." });
        }

        await Review.create({
            user: req.user._id,
            booking: booking._id,
            rating,
            comment,
        });

        res.status(201).json({ message: "review Submited. Awaiting approval." });
    } catch (error) {
        console.error("Error to submit review: ", error)
        res.status(500).json({ message: "Something Went wrong to submit review: " }, error.message);
    }
};
//admin only
export const approvePreview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            {
                isApproved: true,
                new: true
            }
        );
        res.json({ message: "Review approved" });
    } catch (error) {
        console.error("Error to approve review: ", error)
        res.status(500).json({ message: "Something Went wrong to approve review: " }, error.message);
    }
};

export const getApprovedPreview = async (req, res) => {
    try {
        const review = await Review.find({ isApproved: true }).populate('user', 'name avatar').sort({ createdAt: -1 });;

        res.json(review);
    } catch (error) {
        console.error("Error to get approved reviews: ", error)
        res.status(500).json({ message: "Something Went wrong to get approve reviews: " }, error.message);
    }
};
// admin only
export const getAllRreview = async (req, res) => {
    try {
        const review = await Review.find().populate('user', 'name avatar').sort({ createdAt: -1 });

        res.json(review);
    } catch (error) {
        console.error("Error to get all reviews: ", error)
        res.status(500).json({ message: "Something Went wrong to get all reviews: " }, error.message);
    }
};
//admin only
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) return res.status(404).json({ message: "Review not found" });
        res.status(201).json({ message: "deleted Review" });
    } catch (error) {
        console.error("Error to delete reviews: ", error)
        res.status(500).json({ message: "Something Went wrong to delete review: " }, error.message);
    }
};