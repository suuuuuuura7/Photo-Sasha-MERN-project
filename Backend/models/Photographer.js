import mongoose from "mongoose";

const photographerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters'],
        },
        specialties: [String], 
        photo: {
            type: String, 
            default: '',
        },
        instagram: String,
        experience: {
            type: Number, 
            default: 1,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);


const Photograher = mongoose.model("Photograher", photographerSchema);
export default Photograher;
