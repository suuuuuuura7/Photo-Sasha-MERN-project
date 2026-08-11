import mongoose, { mongo } from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
        },
        email: {
            type: String,
            required: [true, " email is required"],
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
            lowercase: true,
        },
        subject: {
            type: String,
            required: [true, " subject is required"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, 'message is required'],
            maxlength: [1000, "message can't exceed 1000 charachters"],
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        repliedAt: Date,
    },
    { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;

