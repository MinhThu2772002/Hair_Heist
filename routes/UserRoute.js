import express from "express";
import {
    getUserById,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    updateVerified,
    UpdateProfileImg,
    UpdateLicenseImg
} from "../controller/Users.js"
import {

    designerOnly,
    verifyUser
} from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/users', verifyUser, getUsers);
router.get('/users/:id', verifyUser, getUserById);
router.post('/users', createUser);
router.patch('/users/:id', verifyUser, updateUser);
router.patch('/users/ver/:id', verifyUser, designerOnly, updateVerified);
router.patch('/users/up/:id', verifyUser, UpdateProfileImg);
router.patch('/users/upli/:id', verifyUser, designerOnly, UpdateLicenseImg);
router.delete('/users/:id', verifyUser, deleteUser);

export default router;