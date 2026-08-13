import express from 'express';
import { getAllImages, getImagesById, uploadImage , updateImage, deleteImage} from '../controllers/galleryController.js';
import { isauth } from '../middleware/isAuth.js';

const router = express.Router();


router.get('/', isauth, getAllImages);
router.get('/:id/', isauth, getImagesById);

router.post('/:id', uploadImage);
router.put(':/id', updateImage);
router.delete('/:id/delete', deleteImage);







export default router;