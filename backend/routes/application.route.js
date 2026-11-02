import express from "express";
import { applyJob, getApplicationsForJob, getApplicationsForJobByRecruiter, updateApplicationStatus } from '../controllers/application.controller.js';
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();
router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getApplicationsForJob);
router.route("/:id/applicants").get(isAuthenticated, getApplicationsForJobByRecruiter);
router.route("/status/:id/update").post(isAuthenticated,singleUpload, updateApplicationStatus);


export default router;