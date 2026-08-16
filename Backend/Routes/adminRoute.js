import express from 'express';
import { getStats, getAllUsers, deleteUser, updateUserRole } from '../controllers/adminController.js';
import { isAuth, isAdmin } from '../middleware/Auth.js';
const router = express.Router();

router.use(isAuth, isAdmin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);


export default router;