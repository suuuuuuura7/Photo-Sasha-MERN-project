import express from "express";
import { submitMessage, getAllMessage, getMessageById, deleteMessage } from "../controllers/contactcontroller.js";
const router = express.Router();
import { isAuth, isAdmin } from "../middleware/Auth.js";
router.post('/', submitMessage);//user can sumbit message publicly

//admin can do this
router.get('/', isAuth, isAdmin, getAllMessage);
router.get('/:id', isAuth, isAdmin, getMessageById);//when an admin access single message it'll set as make as read
router.delete('/:id/delete', isAuth, isAdmin, deleteMessage);


export default router;