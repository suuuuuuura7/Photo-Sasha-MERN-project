import express from 'express';
import { getAllImages, getImagesById, uploadImage, updateImage, deleteImage } from '../controllers/galleryController.js';
import { isAuth , isAdmin } from '../middleware/auth.js';

const router = express.Router();


router.get('/', isAuth, getAllImages);
router.get('/:id/', isAuth, getImagesById);

//admin only
router.post('/:id', isAdmin, uploadImage);
router.put(':/id', isAdmin, updateImage);
router.delete('/:id/delete', isAdmin, deleteImage);







export default router;