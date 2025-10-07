import express from "express";
import { login, callback } from '../controllers/authController.js';

const router = express.Router();

// GET /auth/login - Initiate Spotify OAuth flow
router.get('/login', login);

// GET /auth/callback - Handle Spotify OAuth callback
router.get('/callback', callback);

export default router;