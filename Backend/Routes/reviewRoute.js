import express from 'express';
import { isAuth, isAdmin } from '../middleware/auth.js';
import { submitReview, getApprovedPreview, approvePreview, getAllRreview, deleteReview } from '../controllers/reviewController.js';
import apicache from 'apicache';
const cache = apicache.middleware;

const router = express.Router();

router.post('/', isAuth, submitReview);
router.get('/', cache('2 minutes'), getApprovedPreview);

//admin only
router.put('/:id/approve', isAuth, isAdmin, approvePreview);
router.get('/all', isAuth, isAdmin, getAllRreview);
router.delete('/:id', isAuth, isAdmin, deleteReview);



export default router;