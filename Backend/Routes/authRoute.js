import express from 'express';
import { register, login, logout, getMe, googleAuth } from "../controllers/authController.js";
import { isauth } from '../middleware/isAuth.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post("/google", googleAuth);

router.post('/logout', isauth, logout);
router.post('/me', isauth, getMe);

export default router;