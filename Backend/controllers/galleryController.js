import Gallery from "../models/Gallery.js";
import multer from "multer";
import path from "path";


// Multer config — store uploaded images in /uploads folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

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

// admin route
export const uploadImage = async (req, res) => {
    try {
        const { title, description, category, isFeatured, photographerId } = req.body;
        const imageUrl = `/uploads/${req.file.filename}`;

        const image = await Gallery.create({
            title,
            description,
            category: category || 'Other',
            imageUrl,
            isFeatured: isFeatured === 'true',
            photographer: photographerId || undefined,
        });

        res.status(201).json({ message: "Successfuly created an image" });
    } catch (error) {
        console.error("Error to upload image: ", error);
        res.status(500).json({ message: "Something went wrong to upload image" }, error.message);
    }
};

export const updateImage = async (req, res) => {
    try {
        const { title, description, category, isFeatured } = req.body;

        const image = await Gallery.findByIdAndUpdate(
            req.parms.id,
            { title, description, category, isFeatured },
            { new: true, runValidators: true }
        );

        if(!image) return res.status(404).json({message: "Image not found. "});

        res.status(201).json({ message: "Successfuly updated" });
    } catch (error) {
        console.error("Error to update image: ", error);
        res.status(500).json({ message: "Something went wrong to update image" }, error.message);
    }
};

export const deleteImage = async (req, res) => {
    try {
        const image = await Gallery.findById(req.parms.id);

        if(!image) return res.status(404).json({message: "Image not found. "});
        // Delete the actual file from the uploads folder
        const filePath = path.join(__dirname, '..', image.imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        };

          await Gallery.findByIdAndDelete(req.parms.id);

        res.status(201).json({messge: "Image deleted"});
    } catch (error) {
         console.error("Error to delete image: ", error);
        res.status(500).json({ message: "Something went wrong to delete image" }, error.message);
    }
};