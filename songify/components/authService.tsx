import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { useEffect } from 'react';

var state = Math.random().toString(16);

export const useSpotifyAuth = () => {
    const clientId = 'd40f65657f8a46e6a9c0b02dfa184ea7';
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: clientId,
            scopes: ['user-read-email', 'user-read-private', 'playlist-modify-public', 'playlist-modify-private', 'playlist-read-private', 'playlist-read-collaborative'],
            redirectUri: 'songify://auth',
            usePKCE: true,
        },
        {
            authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        }
    );
    const fetchUser = async () =>{
        try{
            const accessToken = await SecureStore.getItemAsync('access_token');

            if (!accessToken) throw new Error('No access token found');

            const response = await fetch('https://api.spotify.com/v1/me',{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            if (!response.ok) throw new Error('Failed to fetch user');

            const user = await response.json();

            if (user.id && user.display_name){
                await SecureStore.setItemAsync('user_id',user.id);
                await SecureStore.setItemAsync('user_name',user.display_name);
                console.log('User data stored successfully:', user.display_name);
            }else{
                throw new Error('Invalid user data');
            }
        }catch(error){
            console.error('Error fetching user',error);
        }
    };
    useEffect(() => {
        if (response?.type === 'success') {
            const { code} = response.params;

            console.log('Sending code to backend...');
            fetch('http://10.0.0.9:5000/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, code_verifier: request?.codeVerifier })
            })
            .then(async res => {
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(`Backend error: ${errorData.error || 'Unknown error'}`);
                }
                return res.json();
            })
            .then(async tokens => {
                // Store both access and refresh tokens
                await Promise.all([
                    SecureStore.setItemAsync('access_token', tokens.access_token),
                    SecureStore.setItemAsync('refresh_token', tokens.refresh_token),
                    SecureStore.setItemAsync('expires_at', String(Date.now() + (tokens.expires_in*1000)))  
                ]);
            })
            .then(async ()=>{
                console.log('Fetching user');
                await fetchUser();
            })
            .catch(error => {
                console.error('Token exchange failed:', error);
                console.error('Error details:', error.message);
            });
        }
    }, [response]);

    return { request, response, promptAsync };
};

export const isExpired = async () => {

    const expiresAt = await SecureStore.getItemAsync('expires_at');
    if (!expiresAt) return true; // access token is not set

    const expired =  Date.now() > parseInt(expiresAt); //returns true if date is past expiry date

    if (expired){
        try{
            const refreshToken = await SecureStore.getItemAsync('refresh_token');
            if (!refreshToken) return true;

            const response = await fetch('http://10.0.0.9:5000/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken })
            });
            
            if (response.ok){
                const tokens = await response.json();

                await SecureStore.setItemAsync('access_token', tokens.access_token);
                if (tokens.refresh_token){
                    await SecureStore.setItemAsync('refresh_token', tokens.refresh_token);
                }
                await SecureStore.setItemAsync('expires_at',String(Date.now()+(tokens.expires_in*1000)));

                return false;
            }
        }catch(error){
            console.error('Token refresh failed',error);
        }
    }
    return false;
}