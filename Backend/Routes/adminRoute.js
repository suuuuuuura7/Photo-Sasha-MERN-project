import express from 'express';
import { getStats, getAllUsers, deleteUser, updateUserRole } from '../controllers/adminController.js';

const router = express.Router();

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);


export default router;