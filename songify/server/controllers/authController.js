import querystring from "querystring";

export const login = (req, res) => {
  const redirectUri = process.env.REDIRECT_URI;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const state = Math.random().toString(36).substring(2, 15);

  if(!redirectUri || !clientId){
    console.error("Missing Spotify configuration");
    const frontendUrl = process.env.FRONTEND_URL || 'exp://10.0.0.9:8081';
    return res.redirect(`${frontendUrl}/auth?auth=error&message=Server%20configuration%20error`);
  }

  // Store state in session for validation
  req.session.authState = state;

  res.redirect(
    `https://accounts.spotify.com/authorize?` +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: 'playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative user-read-email user-read-private',
      redirect_uri: redirectUri,
      state: state,
      show_dialog: true
    })
  );
};

export const callback = async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;
    const error = req.query.error;
    const frontendUrl = process.env.FRONTEND_URL || 'exp://10.0.0.9:8081';
    
    // Check for Spotify errors
    if (error) {
      console.error('Spotify error:', error);
      return res.redirect(`${frontendUrl}/auth?auth=error&message=${encodeURIComponent(error)}`);
    }
    
    // Validate state parameter
    if (!state || state !== req.session.authState) {
      console.error('Invalid state parameter');
      return res.redirect(`${frontendUrl}/auth?auth=error&message=Invalid%20state%20parameter`);
    }
    
    if (!code) {
      console.error('No authorization code received');
      return res.redirect(`${frontendUrl}/auth?auth=error&message=No%20authorization%20code%20received`);
    }
    
    // Exchange code for Spotify tokens
    const tokens = await getSpotifyTokens(code);
    
    // Check if token exchange failed
    if (tokens.error) {
      console.error('Token exchange error:', tokens.error);
      return res.redirect(`${frontendUrl}/auth?auth=error&message=${encodeURIComponent(tokens.error_description || tokens.error)}`);
    }
    
    req.session.tokens = tokens;
    req.session.userId = tokens.user_id;
    // Clear the state from session
    delete req.session.authState;
    
    res.redirect(`${frontendUrl}/auth?auth=success`)
  } catch (err) {
    console.error('Auth callback error:', err);
    const frontendUrl = process.env.FRONTEND_URL || 'exp://10.0.0.9:8081';
    res.redirect(`${frontendUrl}/auth?auth=error&message=${encodeURIComponent(err.message)}`);
  }
};

// Exchange Spotify code for Spotify tokens
const getSpotifyTokens = async (code) => {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.REDIRECT_URI);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(
        process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('Token exchange failed:', data);
    throw new Error(`Token exchange failed: ${data.error_description || data.error}`);
  }
  
  return data;
};
