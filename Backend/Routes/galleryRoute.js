import express from 'express';
import { getAllImages, getImagesById, uploadImage } from '../controllers/galleryController';

const router = express.Router();


router.get('/', getAllImages);
router.get('/:id/', getImagesById);

router.post('/:id', uploadImage);
router.put(':/id', updateImage);
router.delete('/:id/delete', deleteImage);







export default router;