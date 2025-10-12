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
        },
        {
            authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        }
    );
        
    useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;

            fetch('http://192.168.1.100:5000/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            })
            .then(res => res.json())
            .then(tokens => {
                // Store both access and refresh tokens
                SecureStore.setItemAsync('access_token', tokens.access_token);
                SecureStore.setItemAsync('refresh_token', tokens.refresh_token);
                SecureStore.setItemAsync('expires_at', String(Date.now() + (tokens.expires_in*1000)));
            })

            .catch(error => {
                console.error('Token exchange failed:', error);
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
            const response = await fetch('http://192.168.1.100:5000/auth/refresh')
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