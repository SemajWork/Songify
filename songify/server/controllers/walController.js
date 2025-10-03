import { applyWalChanges } from "../services/spotifyService.js";

export const applyWal = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const wal = req.body; // { playlistId, actions: [...] }
    const result = await applyWalChanges(token, wal);
    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to apply WAL" });
  }
};
