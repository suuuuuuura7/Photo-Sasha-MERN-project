import express from 'express';
import { isAuth , isAdmin} from '../middleware/auth.js';
import { submitReview, getApprovedPreview, approvePreview, getAllRreview, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', isAuth, submitReview);
router.get('/', getApprovedPreview);

//admin only
router.put('/:id/approve', isAdmin, approvePreview);
router.get('/all', isAdmin, getAllRreview);
router.delete('/:id', isAdmin, deleteReview);



export default router;