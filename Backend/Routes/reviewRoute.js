import express from 'express';
import { isauth } from '../middleware/isAuth.js';
import { submitReview, getApprovedPreview, approvePreview, getAllRreview, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', isauth, submitReview);
router.get('/', getApprovedPreview);

//admin only
router.put('/:id/approve', approvePreview);
router.get('/all', getAllRreview);
router.delete('/:id', deleteReview);



export default router;