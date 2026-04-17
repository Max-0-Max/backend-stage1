import express from "express";
import {
  createProfile,
  getProfile,
  getProfiles,
  deleteProfile
} from "../controllers/profileController.js";

const router = express.Router();

router.post("/profiles", createProfile);
router.get("/profiles/:id", getProfile);
router.get("/profiles", getProfiles);
router.delete("/profiles/:id", deleteProfile);

export default router;