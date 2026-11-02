import express from "express";
import { register, login, logout, updateProfile } from '../controllers/user.controller.js';
import { singleUpload } from "../middlewares/multer.js";



import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();
router.route("/register").post(singleUpload, register);  
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(singleUpload, isAuthenticated, updateProfile);

export default router;