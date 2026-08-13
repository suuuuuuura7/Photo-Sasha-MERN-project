import express from "express";
import { submitMessage, getAllMessage, getMessageById, deleteMessage } from "../controllers/contactcontroller.js";
const router = express.Router();

router.post('/', submitMessage);//user can sumbit message publicly

//admin can do this
router.get('/', getAllMessage);
router.get('/:id', getMessageById);//when an admin access single message it'll set as make as read
router.delete('/:id/delete', deleteMessage);


export default router;