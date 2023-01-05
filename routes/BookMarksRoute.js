import express from "express";
import {
    createBookmarks,
    deleteBookmarks
} from "../controller/Bookmarks.js"
import {

    designerOnly,
    verifyUser
} from "../middleware/AuthUser.js";
const router = express.Router();

router.post('/keyword', createBookmarks);
router.delete('/keyword', verifyUser, designerOnly, deleteBookmarks);

export default router;