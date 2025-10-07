import express from "express";
import {applyWal} from "../controllers/walController.js";

const router = express.Router();

// POST /wal/apply - Apply WAL changes to playlist
router.post('/apply', applyWal);

export default router;