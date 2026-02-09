import express from "express";
import {
  getSongs,
  getPlayListByTag,
  toggleFavourite,
} from "../controllers/songController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSongs);
router.get("/playlistByTag/:tag", getPlayListByTag);
router.post("/favourites", protect, toggleFavourite);

export default router;
