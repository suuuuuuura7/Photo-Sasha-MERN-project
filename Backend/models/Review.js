import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, 'Review comment is required'],
            maxlength: [500, 'Comment cannot exceed 500 characters'],
        },
        isApproved: {
            type: Boolean,
            default: false, 
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    }, 
  { timestamps: true }
);

reviewSchema.index({ user: 1, booking: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;