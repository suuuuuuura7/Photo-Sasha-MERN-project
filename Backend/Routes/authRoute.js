import express from 'express';
import { register, login, logout, getMe, googleAuth } from "../controllers/authController.js";
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post("/google", googleAuth);

router.post('/logout', isAuth, logout);
router.get('/me', isAuth, getMe);

export default router;