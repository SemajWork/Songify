Remove songs with the swipe of a finger

## Tech Stack

- **React Native** with Expo
- **Expo Router** for navigation
- **TypeScript** for type safety
- **React Native Gesture Handler** for swipe gestures
- **Node.js** with Express
- **Spotify Web API** integration
- **CORS** enabled for cross-origin requests

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Spotify Developer Account (for API credentials)
- Expo GO App

## Installation

### 1. Clone the Repository
```bash
git clone <your-repo-url>
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd server
npm install
```

### 4. Set Up Environment Variables

Create a `.env` file in `songify/server/`:
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=your_redirect_uri
```

Get these credentials from [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
-- Afterwards add SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET to your .env file
##Configuring Scheme/Callback URI
For your own sake, after cloning this repository:
- Go to app.json
- Locate -> scheme: ""

- Put whatever name you want your link/application to be called by, i.e "myapp"
- Then go to server.js in ../server
- Locate the app.post('/auth/token) end point, and scroll down until you see fetch request
- Within the fetch request, locate the body, and update the redirect_uri accordingly to instructions:
- should be the scheme you put + :// + whatever uri you want (Example: Scheme: boop => redirect_uri: boop://asdf ; where asdf is custom uri)
- Lastly add this call back to your spotify developer dashboard as one of the Redirect URIs

## Running the App

### Start the Backend Server
```bash or terminal works
cd songify/server
npm start
```
Server runs on `http://localhost:5000 or http:{your-ip-address}:5000`
When running on phone, you should do:
Mac/Linux:
Do ifconfig in terminal, look for an inet that isn't 127.0.0.1 or any default value
Windows:
In command line, type ipconfig then scroll down in terminal until you see IPv4 Address

After you have these values, add to your .env file
BACKENDHOST and update with your ip address such that http://{ipaddress}:port -- where port is whatever port you're hosting on
and exp://{ipaddress}:port, but this is not neccessary

### Start the Frontend
```bash
cd songify
npm start
```

Then choose your platform:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web (limited support)

## Project Structure

```
songify/                    # Frontend (React Native)
├── app/                    # App screens
│   ├── index.tsx          # Login/Home screen
│   └── home/              # Main app screens
│       ├── index.tsx      # Playlist list
│       └── playlist/      # Playlist detail
├── components/            # Reusable components
│   ├── SwipeableSongCard.tsx
│   ├── PlaylistCard.tsx
│   └── authService.tsx
├── services/              # API services
├── assets/                # Images and fonts
└── server/                # Backend server
├── server.js          # Express server
├── controllers/       # Route controllers
├── services/          # Spotify API service
│       └── routes/            # API routes
└── README.md
```

## Usage

1. **Login** - Authenticate with your Spotify account
2. **Select Playlist** - Choose a playlist to clean up
3. **Swipe** - Review each song:
   - Swipe **left** or tap **✕** to remove
   - Swipe **right** or tap **✓** to keep
4. **Save** - Tap the "Save" button to apply changes to your Spotify playlist

## API Endpoints

### Backend Routes
- `GET /api/playlists` - Fetch user playlists
- `DELETE /api/playlists/:id/tracks` - Remove tracks from playlist
- `GET /api/wal` - Write-Ahead Log operations -- I didnt have a database set up but if you do, feel free to add to this
 -- similar to the array storing operations I have in my playlist folder, it will do the same

## Development

### Frontend Development
```bash
cd songify
npm start
```

### Backend Development (with auto-reload)
```bash
cd songify/server
npm run dev
```

### Linting
```bash
cd songify
npm run lint
```

## Troubleshooting

**Issue: "Cannot connect to backend"**
- Ensure the backend server is correctly added to the .env file
- Check your network configuration

**Issue: "Spotify authentication failed"**
- Verify your Spotify API credentials in `.env`
- Check redirect URI matches your Spotify app settings

**Issue: "Songs not loading"**
- Check your access token hasn't expired

## License

This project is for educational purposes.

---

Made with ❤️ for music lovers who need cleaner playlists
