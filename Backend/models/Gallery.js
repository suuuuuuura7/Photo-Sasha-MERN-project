import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Image title is required'],
            trim: true,
        },
        description: {
            type: String,
            maxlength: [300, 'Description cannot exceed 300 characters'],
        },
        imageUrl: {
            type: String,
            required: [true, 'image URL is required'],
        },
        category: {
            type: String,
            enum: ['Wedding', 'Portrait', 'Corporate', 'Event', 'Fashion', 'Other'],
            default: 'Other',
        },
        photographer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Photographer',
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        tags: [String],
        likes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

gallerySchema.index({ category: 1, isFeatured: 1 });

const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;