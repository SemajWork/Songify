import { getTokens } from "../services/spotifyService.js";

export const login = (req, res) => {
  const scopes = "playlist-modify-private playlist-read-private";
  const redirectUri = encodeURIComponent(process.env.REDIRECT_URI);
  const clientId = process.env.CLIENT_ID;

  res.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`
  );
};

export const callback = async (req, res) => {
  try {
    const code = req.query.code;
    const tokens = await getTokens(code);
    res.json(tokens); // in a real app, store securely
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Auth failed" });
  }
};
