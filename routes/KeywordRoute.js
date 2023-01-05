import express from "express";
import {
    createKeyword,
    deleteKeyword
} from "../controller/Keyword.js";
import {

    designerOnly,
    verifyUser
} from "../middleware/AuthUser.js";
const router = express.Router();

router.post('/keyword', createKeyword);
router.delete('/keyword', verifyUser, designerOnly, deleteKeyword);

export default router;