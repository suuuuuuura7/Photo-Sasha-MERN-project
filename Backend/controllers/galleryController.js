import Gallery from "../models/Gallery.js";

export const getAllImages = async (req, res) => {
    try {

        const { category } = req.query;

        const filter = category && category !== 'All' ? { category } : {};

        const images = await Gallery.find(filter).populate('photographer', 'name photo').sort({ created: -1 });

        res.json(images);
    } catch (error) {
        console.error("Error to get images: ", error);
        res.status(500).json({ message: "Something went wrong to get images: " }, error.message);
    }
};

export const getImagesById = async (req, res) => {
    try {
        const image = await Gallery.findById(req.parms.id).populate('photographer', 'name photo');

        if (!image) return res.json({ message: "Image not found" });

        res.json(image);
    } catch (error) {
        console.error("Error to get image by id", error);
        res.status(500).json({ message: "Something went wront to get image" }, error.message);
    }
};

