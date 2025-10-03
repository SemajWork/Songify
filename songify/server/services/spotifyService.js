import axios from "axios";

export const getTokens = async (code) => {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.REDIRECT_URI);

  const headers = {
    Authorization:
      "Basic " +
      Buffer.from(
        process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
      ).toString("base64"),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const response = await axios.post("https://accounts.spotify.com/api/token", params, { headers });
  return response.data;
};

export const fetchUserPlaylists = async (accessToken) => {
  const response = await axios.get("https://api.spotify.com/v1/me/playlists", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const applyWalChanges = async (accessToken, wal) => {
  const { playlistId, actions } = wal;

  for (const action of actions) {
    if (action.op === "remove") {
      await axios.delete(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          data: { tracks: [{ uri: `spotify:track:${action.trackId}` }] },
        }
      );
    } else if (action.op === "add") {
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: [`spotify:track:${action.trackId}`] },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    }
  }

  return { message: "WAL applied successfully" };
};
