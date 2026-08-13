import express from "express";
import { submitMessage, getAllMessage, getMessageById, deleteMessage } from "../controllers/contactcontroller.js";
const router = express.Router();
import { isAdmin } from "../middleware/auth.js";

router.post('/', submitMessage);//user can sumbit message publicly

//admin can do this
router.get('/', isAdmin, getAllMessage);
router.get('/:id', isAdmin, getMessageById);//when an admin access single message it'll set as make as read
router.delete('/:id/delete', isAdmin, deleteMessage);


export default router;