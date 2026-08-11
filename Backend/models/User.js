import mongoose from "mongoose";

const Userschema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [60, "Name can't exceed 60 characters"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "please enter a valid email"],
        },
        password: {
            type: String,
            minlength: [8, "password must be at least 8 charachters long"],
        },
        googleId: {
            type: String,
            spare: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
        },
        phone: {
            type: String,
            trim: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        booking: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Booking',
            }
        ],
    },
    { timestamps: true },
);

const User = mongoose.model("User", Userschema);
export default User;