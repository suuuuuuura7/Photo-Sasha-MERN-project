import Gallery from "../models/Gallery.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { processAndUpload } from "../utils/processAndUpload.js";
import cloudinary from "../config/cloudinary.js";


export const getAllImages = async (req, res) => {
    try {
        const { category, isFeatured } = req.query;

        const filter = {};
        if (category && category !== 'All') filter.category = category;
        if (isFeatured === 'true') filter.isFeatured = true;

        const images = await Gallery.find(filter).sort({ createdAt: -1 });

        res.json(images);
    } catch (error) {
        console.error("Error to get images: ", error);
        res.status(500).json({ message: "Something went wrong to get images" });
    }
};

export const getImagesById = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);

        if (!image) return res.status(404).json({ message: "Image not found" });

        res.json(image);
    } catch (error) {
        console.error("Error to get image by id", error);
        res.status(500).json({ message: "Something went wrong to get image" });
    }
};

// admin route
export const uploadImage = async (req, res) => {
    try {
        const { title, description, category, isFeatured } = req.body;

        if (!req.file) return res.status(400).json({ message: "No image file provided" });

        const result = await processAndUpload(req.file.buffer, "photoSasha");

        const image = await Gallery.create({
            title,
            description,
            category: category || 'Other',
            isFeatured: isFeatured === 'true',
            imageUrl: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
        });

        res.status(201).json({ message: "Successfully created an image", image });
    } catch (error) {
        console.error("Error to upload image: ", error);
        res.status(500).json({ message: "Something went wrong to upload image", error: error.message });
    }
};

export const updateImage = async (req, res) => {
    try {
        const { title, description, category, isFeatured } = req.body;

        const image = await Gallery.findByIdAndUpdate(
            req.params.id,
            { title, description, category, isFeatured },
            { new: true, runValidators: true }
        );

        if (!image) return res.status(404).json({ message: "Image not found." });

        res.json({ message: "Successfully updated", image });
    } catch (error) {
        console.error("Error to update image: ", error);
        res.status(500).json({ message: "Something went wrong to update image" });
    }
};

export const deleteImage = async (req, res) => {
    try {
        const image = await Gallery.findById(req.params.id);

        if (!image) return res.status(404).json({ message: "Image not found." });

        if (image.publicId) {
            try {
                await cloudinary.uploader.destroy(image.publicId);
            } catch (cloudError) {
                console.error("Cloudinary deletion failed, but proceeding to remove from DB:", cloudError);
            }
        }
        await image.deleteOne();

        res.json({ message: "Image deleted" });
    } catch (error) {
        console.error("Error to delete image: ", error);
        res.status(500).json({ message: "Something went wrong to delete image" });
    }
};

export const getfeaturedImages = async (req, res) => {
    try {
        const images = await Gallery.find({ isFeatured: true }).limit(6).sort({ createdAt: -1 });

        res.json(images);
    } catch (error) {
        console.error("Error to get featured images: ", error);
        res.status(500).json({ message: "Something went wrong to get featured images" });
    }
};