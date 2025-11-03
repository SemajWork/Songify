import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { useAuthRequest, makeRedirectUri } from 'expo-auth-session';
import { useEffect } from 'react';
import { Platform } from 'react-native';

var state = Math.random().toString(16);

export const useSpotifyAuth = () => {
    const clientId = 'd40f65657f8a46e6a9c0b02dfa184ea7';
    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: clientId,
            scopes: ['user-read-email', 'user-read-private', 'playlist-modify-public', 'playlist-modify-private', 'playlist-read-private', 'playlist-read-collaborative'],
            redirectUri: Platform.OS === 'web' ? `${process.env.EXPO_PUBLIC_FRONTEND_URL}` : 'songify://auth',
            usePKCE: true,
        },
        {
            authorizationEndpoint: 'https://accounts.spotify.com/authorize',
        }
    );
    const fetchUser = async () =>{
        try{
            const accessToken = Platform.OS === 'web' 
                ? localStorage.getItem('access_token')
                : await SecureStore.getItemAsync('access_token');

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
                if (Platform.OS === 'web') {
                    localStorage.setItem('user_id', user.id);
                    localStorage.setItem('user_name', user.display_name);
                    localStorage.setItem('subscription_type', user.product);
                } else {
                    await SecureStore.setItemAsync('user_id',user.id);
                    await SecureStore.setItemAsync('user_name',user.display_name);
                    await SecureStore.setItemAsync('subscription_type',user.product);
                }
                console.log('User data stored successfully:', user.display_name);
            }else{
                throw new Error('Invalid user data');
            }
        }catch(error){
            console.error('Error fetching user',error);
        }
    };
    useEffect(() => {
        // Check if we're in a popup with a code in the URL (web fallback)
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            
            if (code && window.opener) {
                // We're in a popup with a code, process it manually
                console.log('Manual code extraction from popup');
                const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://10.0.0.9:5000';
                
                // Get code_verifier from parent window's sessionStorage or request
                let codeVerifier = request?.codeVerifier;
                if (!codeVerifier && window.opener) {
                    // Try to get from parent window's sessionStorage
                    try {
                        const parentState = sessionStorage.getItem(`expo-auth-session-${state}`);
                        if (parentState) {
                            const parsed = JSON.parse(parentState);
                            codeVerifier = parsed.codeVerifier;
                        }
                    } catch (e) {
                        console.log('Could not get code_verifier from parent');
                    }
                }
                
                fetch(`${BACKEND_URL}/auth/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, code_verifier: codeVerifier })
                })
                .then(async res => {
                    if (!res.ok) {
                        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
                        console.error('Backend response error:', res.status, errorData);
                        throw new Error(`Backend error: ${errorData.error || 'Unknown error'}`);
                    }
                    return res.json();
                })
                .then(async tokens => {
                    console.log('Tokens received, storing...');
                    if (!tokens.access_token) {
                        throw new Error('No access token in response');
                    }
                    
                    // Store tokens in parent window's localStorage
                    if (window.opener) {
                        window.opener.localStorage.setItem('access_token', tokens.access_token);
                        window.opener.localStorage.setItem('refresh_token', tokens.refresh_token || '');
                        window.opener.localStorage.setItem('expires_at', String(Date.now() + ((tokens.expires_in || 3600) * 1000)));
                        console.log('Tokens stored in parent window');
                        
                        // Signal parent window that auth succeeded
                        window.opener.postMessage({ type: 'AUTH_SUCCESS' }, '*');
                    }
                    // Also store in current window
                    localStorage.setItem('access_token', tokens.access_token);
                    localStorage.setItem('refresh_token', tokens.refresh_token || '');
                    localStorage.setItem('expires_at', String(Date.now() + ((tokens.expires_in || 3600) * 1000)));
                    console.log('Tokens stored in popup window');
                    
                    // Clean up old ExpoWebBrowser redirect URLs
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith('ExpoWebBrowser_RedirectUrl_')) {
                            localStorage.removeItem(key);
                        }
                    });
                    if (window.opener) {
                        Object.keys(window.opener.localStorage).forEach(key => {
                            if (key.startsWith('ExpoWebBrowser_RedirectUrl_')) {
                                window.opener.localStorage.removeItem(key);
                            }
                        });
                    }
                    
                    // Close popup after a brief delay
                    setTimeout(() => {
                        window.close();
                    }, 200);
                })
                .catch(error => {
                    console.error('Token exchange failed:', error);
                    console.error('Error details:', error.message);
                    if (window.opener) {
                        window.opener.postMessage({ type: 'AUTH_ERROR', error: error.message }, '*');
                    }
                    setTimeout(() => {
                        window.close();
                    }, 1000);
                });
                return;
            }
        }
        
        if (response?.type === 'success') {
            const { code} = response.params;

            console.log('Sending code to backend...');
            const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://10.0.0.9:5000';
            fetch(`${BACKEND_URL}/auth/token`, {
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
                if (Platform.OS === 'web') {
                    localStorage.setItem('access_token', tokens.access_token);
                    localStorage.setItem('refresh_token', tokens.refresh_token);
                    localStorage.setItem('expires_at', String(Date.now() + (tokens.expires_in*1000)));
                } else {
                    await Promise.all([
                        SecureStore.setItemAsync('access_token', tokens.access_token),
                        SecureStore.setItemAsync('refresh_token', tokens.refresh_token),
                        SecureStore.setItemAsync('expires_at', String(Date.now() + (tokens.expires_in*1000)))  
                    ]);
                }
            })
            .then(async ()=>{
                console.log('Fetching user');
                await fetchUser();
                if (Platform.OS === 'web') {
                    window.close();
                }
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

    const expiresAt = Platform.OS === 'web' 
        ? localStorage.getItem('expires_at')
        : await SecureStore.getItemAsync('expires_at');
    if (!expiresAt) return true; // access token is not set

    const expired =  Date.now() > parseInt(expiresAt); //returns true if date is past expiry date

    if (expired){
        try{
            const refreshToken = Platform.OS === 'web' 
                ? localStorage.getItem('refresh_token')
                : await SecureStore.getItemAsync('refresh_token');
            if (!refreshToken) return true;

            const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://10.0.0.9:5000';
            const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken })
            });
            
            if (response.ok){
                const tokens = await response.json();

                if (Platform.OS === 'web') {
                    localStorage.setItem('access_token', tokens.access_token);
                    if (tokens.refresh_token){
                        localStorage.setItem('refresh_token', tokens.refresh_token);
                    }
                    localStorage.setItem('expires_at', String(Date.now()+(tokens.expires_in*1000)));
                } else {
                    await SecureStore.setItemAsync('access_token', tokens.access_token);
                    if (tokens.refresh_token){
                        await SecureStore.setItemAsync('refresh_token', tokens.refresh_token);
                    }
                    await SecureStore.setItemAsync('expires_at',String(Date.now()+(tokens.expires_in*1000)));
                }

                return false;
            }
        }catch(error){
            console.error('Token refresh failed',error);
        }
    }
    return false;
}