import express from "express";
import { register, login, logout, getMe } from "../controllers/authCintroller";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/me', getMe);

export default router;