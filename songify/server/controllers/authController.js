import querystring from "querystring";

export const login = (req, res) => {
  const redirectUri = process.env.REDIRECT_URI;
  const clientId = process.env.AUTH0_CLIENT_ID;
  const state = Math.random().toString(36).substring(2, 15);
  const authDomain = process.env.AUTH0_DOMAIN;

  res.redirect(
    `https://${authDomain}/authorize?` +
    querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: 'openid profile email',
      redirect_uri: redirectUri,
      state: state,
      connection: 'spotify'  // Use your Spotify social connection
    })
  );
};

export const callback = async (req, res) => {
  try {
    const code = req.query.code;
    
    // Exchange Auth0 code for Auth0 tokens
    const tokens = await getAuth0Tokens(code);
    
    req.session.tokens = tokens;
    req.session.userId = tokens.sub;
    // Auth0 now manages all Spotify tokens behind the scenes
    res.redirect('exp://10.0.0.9:8081?auth=success')
  } catch (err) {
    res.redirect('exp://10.0.0.9:8081?auth=error');
  }
};

// New function to exchange Auth0 code for Auth0 tokens
const getAuth0Tokens = async (code) => {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", process.env.REDIRECT_URI);

  const response = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(
        process.env.AUTH0_CLIENT_ID + ':' + process.env.AUTH0_CLIENT_SECRET
      ).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params
  });

  return response.json();
};
