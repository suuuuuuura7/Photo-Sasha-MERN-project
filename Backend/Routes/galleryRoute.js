import express from 'express';
import { getAllImages, getImagesById, uploadImage, updateImage, deleteImage, getfeaturedImages } from '../controllers/galleryController.js';
import { isAuth, isAdmin } from '../middleware/Auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();

// Public — /featured MUST come before /:id to avoid Express matching "featured" as an id
router.get('/featured', getfeaturedImages);

// Auth-protected user routes
router.get('/', isAuth, getAllImages);
router.get('/:id', isAuth, getImagesById);

// Admin-only routes
router.post('/', isAuth, isAdmin, upload.single('image'), uploadImage);  // multer must run before uploadImage
router.put('/:id', isAuth, isAdmin, updateImage);
router.delete('/:id/delete', isAuth, isAdmin, deleteImage);

export default router;