import express from "express";
import {
    getCommentById,
} from "../controller/Comment.js"
import {
    verifyUser
} from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/comments/:id', verifyUser, getCommentById);

export default router;