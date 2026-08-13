import Review from "../models/Review.js";

export const submitReview = async (req, res) => {
    try {
        const { ratting, comment, bookingId } = req.body;

        const review = await Review.create({
            user: req.user_.id,
            booking: bookingId,
            ratting,
            comment,
        });

        res.status(201).json({ message: "review Submited. Awaiting approval." });
    } catch (error) {
        console.error("Error to submit review: ", error)
        res.status(500).json({ message: "Something Went wrong to submit review: " }, error.message);
    }
};

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

export const getAllRreview = async (req, res) => {
    try {
        const review = await Review.find().populate('user', 'name avatar').sort({ createdAt: -1 });

        res.json(review);
    } catch (error) {
        console.error("Error to get all reviews: ", error)
        res.status(500).json({ message: "Something Went wrong to get all reviews: " }, error.message);
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.parms.id);

        if(!review) return res.status(404).json({message: "Review not found"});
        res.status(201).json({message: "deleted Review"});
    } catch (error) {
        console.error("Error to delete reviews: ", error)
        res.status(500).json({ message: "Something Went wrong to delete review: " }, error.message);
    }
};