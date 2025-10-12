import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from './routes/auth.js';
import playlistRoutes from '../server/routes/playlists.js'
import walRoutes from '../server/routes/wal.js';

dotenv.config()

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:8081', 'exp://192.168.1.100:8081', 'exp://localhost:8081'],
    credentials: true,
})); //allow for cross origin requests

app.use('/playlist', playlistRoutes);
app.use('/wal', walRoutes);

app.post('/auth/token', async (req,res) => {
    try{
        const {code} = req.body;
        if (!code){
            return res.status(400).json({error: 'No code provided'})
        }
        const response = await fetch('https://accounts.spotify.com/api/token',{
            method: 'POST',
            headers:{
                Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `grant_type=authorization_code&code=${code}&redirect_uri=songify://auth`
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
app.get('/auth/refresh', async(req,res)=>{
    try{
        const authOptions = await fetch('https://accounts.spotify.com/api/token',{
            method: 'POST',
            headers:{
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
            },
            form: {
                grant_type: 'refresh_token',
                refresh_token: SecureStore.getItemAsync('refresh_token'),
            },
            json: true
        })
        if(!authOptions.ok){
            return res.status(authOptions.status).json({error: 'Token refresh failed'});
        }
        const tokens = await authOptions.json();
        res.send(tokens);
    }catch(error){
        console.error('Token refresh failed',error);
    }
})
const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Server is being ran on http://localhost:${PORT}`)) //testing purposes will relay where server is being ran on