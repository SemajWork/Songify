import express from "express";
import {getUserPlaylists} from '../controllers/playlistController.js';

const router = express.Router();

// GET /playlist/ - Get user's playlists
router.get('/', getUserPlaylists);

export default router;