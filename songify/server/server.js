import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:8081', process.env.BACKENDHOST,process.env.BACKENDHOST2, process.env.REDIRECT_URI],
    credentials: true,
})); //allow for cross origin requests


app.post('/auth/token', async (req,res) => {
    try{
        const {code, code_verifier, redirect_uri} = req.body;
        if (!code){
            return res.status(400).json({error: 'No code provided'})
        }
        // Use redirect_uri from request body (must match authorization request) or fallback to env
        const redirectUri = redirect_uri || process.env.REDIRECT_URI;
        const response = await fetch('https://accounts.spotify.com/api/token',{
            method: 'POST',
            headers:{
                Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                code_verifier: code_verifier,
                redirect_uri: redirectUri
            }).toString()
        });
        
        if(!response.ok){
            return res.status(response.status).json({error: 'Token exchange failed'});
        }

        const tokens = await response.json();
        res.json(tokens);
    }catch(error){
        console.error('Token exchange failed', error);
        res.status(500).json({error:'Token exchange failed'});
    }
});
app.post('/auth/refresh', async(req,res)=>{
    try{
        const { refresh_token } = req.body;
        if (!refresh_token) {
            return res.status(400).json({error: 'No refresh token provided'});
        }

        const response = await fetch('https://accounts.spotify.com/api/token',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
            },
            body: `grant_type=refresh_token&refresh_token=${refresh_token}`
        });
        
        if(!response.ok){
            return res.status(response.status).json({error: 'Token refresh failed'});
        }
        
        const tokens = await response.json();
        res.json(tokens);
    }catch(error){
        console.error('Token refresh failed',error);
    }
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is being ran on http://localhost:${PORT}`);
    console.log(`Network access: http://10.0.0.9:${PORT}`);
}); //testing purposes will relay where server is being ran on