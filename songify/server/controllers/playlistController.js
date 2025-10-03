import { fetchUserPlaylists } from "../services/spotifyService.js";

export const getUserPlaylists = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    const playlists = await fetchUserPlaylists(token);
    res.json(playlists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch playlists" });
  }
};
