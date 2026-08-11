import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        photographer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Photograher'
        },
        serviceType: {
            type: String,
            required: [true, 'service type is required'],
            enum: ['Portait', 'wedding', 'Corporate', 'Event', 'Fashion', 'Commercial', 'family', 'Other'],
        },
        date: {
            type: Date,
            required: [true, "nokking date is required"],
        },
        time: {
            type: String,
            required: [true, 'time is required'],
        },
        location: {
            type: String,
            required: [true, 'location is required'],
            trim: true,
        },
        duration: {
            type: Number,
            required: [true.valueOf, "time is required"],
            min: 1,
            max: 12,
        },
        message: {
            type: String,
            maxlength: [400, "message can't exceed 400 characters"],
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
        totalprice: {
            type: Number,
            default: o,
        },
        adminNotes: {
            type: String,
        },
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;