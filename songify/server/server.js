import express from "express";
import dotenv from "dotenv";

import authRoutes from './routes/auth.js';
import playlistRoutes from './routes/playlists.js'
import walRoutes from './routes/wal.js';

dotenv.config()

const app = express();
app.use(express.json());

app.use('./auth',authRoutes);
app.use('./playlist',playlistRoutes);
app.use('./wal',walRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server is being ran on http://localhost:${PORT}`)) //testing purposes will relay where server is being ran on